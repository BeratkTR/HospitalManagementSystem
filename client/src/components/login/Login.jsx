// src/components/Login.js
import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import PatientLogin from './PatientLogin';
import DoctorLogin from './DoctorLogin';

const Login = () => {
  const [activeTab, setActiveTab] = useState('admin');  // Default active tab is 'admin'

  // Function to switch tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button
          style={activeTab === 'admin' ? styles.activeTab : styles.tab}
          onClick={() => handleTabChange('admin')}
        >
          Admin 
        </button>
        <button
          style={activeTab === 'doctor' ? styles.activeTab : styles.tab}
          onClick={() => handleTabChange('doctor')}
        >
          Doktor 
        </button>
        <button
          style={activeTab === 'patient' ? styles.activeTab : styles.tab}
          onClick={() => handleTabChange('patient')}
        >
          Hasta
        </button>
      </div>

      <div style={styles.tabContent}>
        {activeTab === 'admin' && <AdminLogin />}
        {activeTab === 'patient' && <PatientLogin />}
        {activeTab === 'doctor' && <DoctorLogin />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    position: 'relative',
    top: '-20px'
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 40px',
    margin: '0 5px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  activeTab: {
    padding: '10px 35px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    backgroundColor: '#333',
    color: 'white',
    border: '1px solid #333',
  },
  tabContent: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
};

export default Login;
