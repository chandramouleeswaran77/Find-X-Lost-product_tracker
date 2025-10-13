import React from 'react';
import { Navigate } from 'react-router-dom';
import ReportForm from './ReportForm';
import './ReportLostForm.css';

const ReportLostPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className='report-form-page'>
      <h1>Report Lost Item</h1>
      <ReportForm />
    </div>
  );
};

export default ReportLostPage;