import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminProfile from './AdminProfile';
import StaffProfile from './StaffProfile';
import StudentProfile from './StudentProfile';

const ProfileRouter = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}
  if (!user) return <Navigate to="/" />;

  if (user.role === 'ADMIN' || user.email === 'findxadmin@bitsathy.ac.in') {
    return <AdminProfile user={user} />;
  }
  if (user.role === 'STAFF' || user.email?.endsWith('@bitsathy.ac.in') && !user.email?.includes('.cs')) {
    return <StaffProfile user={user} />;
  }
  return <StudentProfile user={user} />;
};

export default ProfileRouter;

