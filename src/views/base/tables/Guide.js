import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CModalBody,
  CForm,
  CFormInput,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';


// Import necessary Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

// import CIcon from '@coreui/icons-react'
// import { cilTrash, cilPencil } from '@coreui/icons'

const GuideManagement = () => {
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/guide/');
      setGuides(response.data.data);
    } catch (error) {
      setError('Error fetching guides');
      console.error('Error fetching guides:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/guide/${id}`);
      setGuides(guides.filter(guide => guide._id !== id));
    } catch (error) {
      setError('Error deleting guide');
      console.error('Error deleting guide:', error);
    }
  };

  const handleAddGuide = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/guide/register', formData);
      const newGuide = response.data.data;
      setGuides([...guides, newGuide]);
      setFormVisible(false);
      resetFormData();
    } catch (error) {
      setError('Error adding guide');
      console.error('Error adding guide:', error);
    }
  };

  const handleEdit = (guide) => {
    setSelectedGuide(guide);
    setFormData({
      name: guide.name || '',
      email: guide.email || '',
      mobileNumber: guide.mobileNumber || '',
      password: '', // Password field will not be pre-filled for security reasons
    });
    setEditVisible(true);
  };

  const handleEditGuide = async (event) => {
    event.preventDefault();
    const { _id } = selectedGuide;
    try {
      await axios.put(`http://localhost:3002/api/guide/${_id}`, formData);
      setEditVisible(false);
      resetFormData();
      await fetchGuides(); // Fetch the latest data after updating
    } catch (error) {
      setError('Error updating guide');
      console.error('Error updating guide:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'mobileNumber') {
      // Ensure mobile number contains only digits and is prefixed with +1
      const cleanedValue = value.replace(/\D/g, ''); // Remove all non-digit characters
      const prefixedValue = cleanedValue.startsWith('1') ? `+${cleanedValue}` : `+1${cleanedValue}`;
      setFormData({ ...formData, [id]: prefixedValue });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      password: '',
    });
  };

  return (
    <>
      {error && <CAlert color="danger">{error}</CAlert>}
      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <div style={{ fontSize: '1rem' }}>
                Guide Management
              </div>
            </CCol>
            <CCol xs="auto" className="px-4">
              <CButton color="primary" className="px-4" onClick={() => setFormVisible(true)}>Add Guide</CButton>
            </CCol>
          </CRow>
        </CCardHeader>

        <CTable responsive striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" >#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
            </CTableRow>

          </CTableHead>
          <CTableBody>
            {guides.map((guide, index) => (
              <CTableRow key={guide._id}>
                <CTableHeaderCell scope="row" >{index + 1}</CTableHeaderCell>
                <CTableDataCell style={{ fontSize: '0.870rem' }}>{guide.name || 'null'}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.870rem' }}>{guide.email || 'null'}</CTableDataCell>
                <CTableDataCell  style={{ fontSize: '0.870rem' }}>{guide.mobileNumber || 'null'}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButton className="me-1 p-1" onClick={() => handleEdit(guide)}> <FontAwesomeIcon icon={faEdit} /></CButton>
                  <CButton className="me-1 p-1" onClick={() => handleDelete(guide._id)}><FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "#fd2b2b" }}
                    /></CButton>
                  <CButton className="p-1" onClick={() => { setSelectedGuide(guide); setVisible(true); }}><FontAwesomeIcon icon={faEye} /></CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>

        </CTable>
      </CCard>

      <CModal visible={formVisible} onClose={() => { setFormVisible(false); resetFormData(); }}>
        <CModalHeader closeButton>
          <CModalTitle>Add Guide</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleAddGuide}>
            <CCol md={6}>
              <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
            </CCol>
            <CCol xs={12}>
              <CButton color="primary" type="submit">Submit</CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setFormVisible(false); resetFormData(); }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editVisible} onClose={() => { setEditVisible(false); resetFormData(); }}>
        <CModalHeader closeButton>
          <CModalTitle>Edit Guide</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={handleEditGuide}>
            <CCol md={6}>
              <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
            </CCol>
            <CCol md={6}>
              <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
            </CCol>
            <CCol xs={12}>
              <CButton color="primary" type="submit">Submit</CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => { setEditVisible(false); resetFormData(); }}>Close</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Guide Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedGuide && (
            <CListGroup flush>
              <CListGroupItem><strong>Name:</strong> {selectedGuide.name || 'null'}</CListGroupItem>
              <CListGroupItem><strong>Email:</strong> {selectedGuide.email || 'null'}</CListGroupItem>
              <CListGroupItem><strong>Mobile Number:</strong> {selectedGuide.mobileNumber || 'null'}</CListGroupItem>
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default GuideManagement;
