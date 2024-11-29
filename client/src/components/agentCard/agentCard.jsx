// AgentCard.js
import React from "react";
import "./agentCard.scss";

const AgentCard = ({ agent }) => {
  return (
    <div className="agentCard">
      <img src={agent.avatar} alt="Agent Avatar" className="avatar" />
      <div className="agentInfo">
        <span className="agentName">{agent.username}</span>
        <span className="agentEmail">{agent.email}</span>
        <span className="agentExperience">{agent.experience} years of experience</span>
      </div>
      <div className="icon">
        <img src="/chat.png" alt="Chat" />
      </div>
    </div>
  );
};

export default AgentCard;
