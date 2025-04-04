import React from "react";
import { Link } from "react-router-dom";
import "./agentCard.scss";

const AgentCard = ({ agent }) => {
  return (
    <div className="agentCard">
      <Link to={`/agents/${agent.id}`} className="agentLink">
        <div className="avatar-container">
          <img
            src={agent.avatar || "/default-avatar.png"}
            alt={`${agent.username}'s avatar`}
            className="agent-avatar"
          />
        </div>
        <div className="agent-details">
          <h3 className="agent-name">{agent.username}</h3>
          <p className="agent-email">{agent.email}</p>
        </div>
      </Link>
    </div>
  );
};

export default AgentCard;
