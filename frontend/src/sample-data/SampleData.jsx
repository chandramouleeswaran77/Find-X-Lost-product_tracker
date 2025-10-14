import React from 'react';
import api from '../apiClient';
import '../components/lostpage/LostPage.css';
import profileLogo from '../assets/profileLogo.png';

const SampleData = ({ name = "Item name", date = "Date", title = "Title", location = "Location", description = "No description provided.", image = "/src/assets/profilelogo.png" }) => {
  const handleContact = async () => {
    try {
      await api.post('/api/contact', { itemName: name });
      alert(`Contact request sent for item: ${name}`);
    } catch (err) {
      console.error('Contact error:', err.message);
      console.error('Error details:', err.response?.data || err);
      alert(`Failed to send contact request for item: ${name}`);
    }
  };

  return (
    <div className='lost-items-section'>
      <div className='lost-items'>
        <div className='lost-item-header'>
          <div className='lost-item-user-profile'>
            <img src={profileLogo} alt="profile" />
          </div>
          <div className='lost-item-details'>
            <p><strong>{name}</strong> <br /> {date}</p>
          </div>
        </div>
        <div className='lost-item-image'>
          <img src={image} alt={name} />
        </div>
        <div className='titloca'>
          <p><strong>{title}</strong> <br /> {location}</p>
        </div>
        <div className='lost-item-desc'>
          <p>{description}</p>
        </div>
      </div>
      <button onClick={handleContact}>Contact</button>
    </div>
  );
};

export default SampleData;