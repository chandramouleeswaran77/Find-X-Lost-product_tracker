import React from 'react';
import './Profile.css';

const AdminProfile = ({ user }) => {
  if (!user) return null;
  return (
    <div className='profile-page'>
      <div className='profile-hero'>
        <div className='profile-hero-content'>
          {user.pictureUrl && (
            <img className='profile-avatar' src={user.pictureUrl} alt='profile' />
          )}
          <div className='profile-meta'>
            <h1 style={{ margin: 0 }}>{user.name}</h1>
            <p>{user.email}</p>
            <span className='profile-role'>ADMIN</span>
            <div className='profile-actions'>
              <button className='btn btn-primary' onClick={() => window.location.href='/admin'}>
                Admin Dashboard
              </button>
              <button className='btn btn-ghost' onClick={() => window.location.href='/lost'}>
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='profile-grid'>
        <div className='profile-card'>
          <h2>Overview</h2>
          <div className='stats'>
            <div className='stat'><div className='value'>42</div><div className='label'>Open Reports</div></div>
            <div className='stat'><div className='value'>18</div><div className='label'>Pending Claims</div></div>
            <div className='stat'><div className='value'>5</div><div className='label'>Staff Online</div></div>
          </div>
        </div>
        <div className='profile-card'>
          <h2>Quick Actions</h2>
          <div className='list'>
            <div className='list-item'><span className='title'>Manage Users</span><span className='meta'>Roles & Access</span></div>
            <div className='list-item'><span className='title'>Review Reports</span><span className='meta'>Lost & Found</span></div>
            <div className='list-item'><span className='title'>Contact Requests</span><span className='meta'>Messages</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
