import React, { useEffect, useState } from "react";
import AgentCard from "../../components/agentCard/agentCard";
import apiRequest from "../../lib/apiRequest"; // Your API request utility
import "./agentList.scss";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await apiRequest.get("/users"); // Adjust API if needed
        setAgents(response.data.filter((user) => user.role === "agent"));
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setError("Failed to load agents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="agentPage">
        <div className="loadingMessage">Loading agents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agentPage">
        <div className="errorMessage">{error}</div>
      </div>
    );
  }

  return (
    <div className="agentPage">
      <div className="pageTitle">Our Agents</div>
      <div className="agentList">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default AgentList;
