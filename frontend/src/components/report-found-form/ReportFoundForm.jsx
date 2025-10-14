import React from 'react';
import { Navigate } from 'react-router-dom';
import ReportForm from '../report-lost-form/ReportForm';
import './ReportFoundForm.css';
import Footer from '../footer/Footer';

const ReportFoundForm = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    console.error('Invalid user data in localStorage:', err);
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className='report-form-page'>
      <h1>Report Found Item</h1>
      <ReportForm type="found" />
      <br /><br />
      {/* <Footer /> */}
    </div>
  );
};

export default ReportFoundForm;