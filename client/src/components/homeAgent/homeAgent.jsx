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
  

  return (
    <div className="agent-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="avatar-container">
        <img
          src={agent.user.avatar || '/default-avatar.png'} // Default avatar fallback
          alt={`${agent.user.username}'s avatar`}
          className="avatar"
        />
      </div>
      <div className="agent-details">
        <h3 className="agent-name">{agent.user.username}</h3>
        <p className="agent-email">{agent.user.email}</p>
        <p className="agent-area">📍 {agent.Service_Area}</p>
        <p className="agent-experience">💼 {agent.experience} years of experience</p>
        <p className="agent-phone">📞 {agent.phone}</p>
      </div>
    </div>
  );
};

export default HomeAgent;
