import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './homeAgent.scss'; // Add styling here
import apiRequest from '../../lib/apiRequest';


const HomeAgent = ({ agent }) => {
  const navigate = useNavigate(); // Initialize navigation

  // Handle card click
  const handleCardClick = () => {
    navigate(`/agents/${agent.user.id}`);
  };
  
  // Add error handling for image loading
  const handleImageError = (e) => {
    e.target.src = '/default-avatar.png';
  };

  // Format phone number if available
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Contact number not available';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  // Format experience text
  const formatExperience = (years) => {
    if (!years) return 'New Agent';
    return `${years} ${years === 1 ? 'year' : 'years'} experience`;
  };

  return (
    <div className="agent-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="avatar-container">
        <img
          src={agent.user.avatar || '/default-avatar.png'} // Default avatar fallback
          alt={`${agent.user.username}`}
          className="avatar"
          onError={handleImageError}
        />
      </div>
      <div className="agent-details">
        <h3 className="agent-name">{agent.user.username}</h3>
        <p className="agent-email" title={agent.user.email}>
          {agent.user.email}
        </p>
        <p className="agent-area">
          <span className="icon">📍</span> {agent.Service_Area || 'Area not specified'}
        </p>
        <p className="agent-experience">
          <span className="icon">💼</span> {formatExperience(agent.experience)}
        </p>
        <p className="agent-phone">
          <span className="icon">📞</span> {formatPhoneNumber(agent.phone)}
        </p>
      </div>
    </div>
  );
};

export default HomeAgent;
