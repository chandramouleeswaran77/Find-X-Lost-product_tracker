import React from 'react';
import './Profile.css';

const StaffProfile = ({ user }) => {
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
            <span className='profile-role'>STAFF</span>
            <div className='profile-actions'>
              {/* <button className='btn btn-primary'>Verify Reports</button>
              <button className='btn btn-ghost'>Contact Requests</button> */}
            </div>
          </div>
        </div>
      </div>

      <div className='profile-grid'>
        <div className='profile-card'>
          <h2>Overview</h2>
          <div className='stats'>
            <div className='stat'><div className='value'>12</div><div className='label'>Pending Verifications</div></div>
            <div className='stat'><div className='value'>7</div><div className='label'>Claims Today</div></div>
            <div className='stat'><div className='value'>3</div><div className='label'>Escalations</div></div>
          </div>
        </div>
        <div className='profile-card'>
          <h2>Tasks</h2>
          <div className='list'>
            <div className='list-item'><span className='title'>New Report Review</span><span className='meta'>2 mins ago</span></div>
            <div className='list-item'><span className='title'>Claim Follow-up</span><span className='meta'>Today</span></div>
            <div className='list-item'><span className='title'>Resolve Escalation</span><span className='meta'>Due soon</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
