import React from 'react';
import './Profile.css';

const StudentProfile = ({ user }) => {
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
            <span className='profile-role'>STUDENT</span>
            <div className='profile-actions'>
              {/* <button className='btn btn-primary' onClick={() => window.location.href='/report-lost'}>Report Lost</button>
              <button className='btn btn-ghost' onClick={() => window.location.href='/report-found'}>Report Found</button> */}
            </div>
          </div>
        </div>
      </div>

      <div className='profile-grid'>
        <div className='profile-card'>
          <h2>Overview</h2>
          <div className='stats'>
            <div className='stat'><div className='value'>3</div><div className='label'>My Reports</div></div>
            <div className='stat'><div className='value'>1</div><div className='label'>In Review</div></div>
            <div className='stat'><div className='value'>0</div><div className='label'>Resolved</div></div>
          </div>
        </div>
        <div className='profile-card'>
          <h2>Recent Activity</h2>
          <div className='list'>
            <div className='list-item'><span className='title'>Submitted Lost: Wallet</span><span className='meta'>Yesterday</span></div>
            <div className='list-item'><span className='title'>Commented on Found: Phone</span><span className='meta'>2 days ago</span></div>
            <div className='list-item'><span className='title'>Updated Report: Bottle</span><span className='meta'>This week</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
