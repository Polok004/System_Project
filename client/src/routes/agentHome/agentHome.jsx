import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./agentHome.scss";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";


const AgentHome = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
        try {
            const response = await apiRequest.get(`/agents/${id}`);
            setAgent(response.data);
          } catch (err) {
            if (err.response && err.response.status === 401) {
              setError("Unauthorized access. Please log in again.");
            } else {
              setError("Failed to load agent details. Please try again later.");
            }
          } finally {
            setLoading(false);
          }
          
    };
    fetchAgentData();
  }, [id]);


  apiRequest.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Retrieve the token from storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request headers
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  const token = localStorage.getItem("token");
console.log("Retrieved Token:", token);
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}


  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p>{error}</p>;
  if (!agent) return <p>Agent not found.</p>;

  return (
    <div className="agent-profile-page">
      <div className="agent-info">
        <div className="avatar-container">
          <img
            src={agent.user.avatar || "/default-avatar.png"}
            alt={`${agent.user.username}'s avatar`}
          />
        </div>
        <div className="details">
          <h1>{agent.user.username}</h1>
          <p>Email: {agent.user.email}</p>
          <p>📍 Service Area: {agent.Service_Area}</p>
          <p>💼 Experience: {agent.experience} years</p>
          <p>📞 Phone: {agent.phone}</p>
          {agent.website && (
            <p>
              🌐 Website:{" "}
              <a href={agent.website} target="_blank" rel="noopener noreferrer">
                {agent.website}
              </a>
            </p>
          )}
          <p>🏠 Address: {agent.address}</p>
          <p>📝 Bio: {agent.bio}</p>
        </div>
      </div>

      <div className="agent-properties">
  <h2>Properties Listed by {agent.user.username}</h2>
  <div className="properties-grid">
    {agent.user.posts?.length > 0 ? (
      agent.user.posts.map((property) => (
        <div key={property.id} className="property-card">
          <img
            src={property.images[0]}
            alt={property.title}
            className="property-image"
          />
          <h3>{property.title}</h3>
          <p className="price">💲 {property.price}</p>

          <p>
            {property.bedroom} 🛏 • {property.bathroom} 🛁
          </p>
          <p>
            📍 {property.address}, {property.city}
          </p>
          <button className="viewDetailsButton">
            <Link to={`/${property.id}`} className="viewDetailsLink">
              View Details
            </Link>
          </button>
        </div>
      ))
    ) : (
      <p>No properties listed by this agent yet.</p>
    )}
  </div>
</div>

    </div>
  );
};

export default AgentHome;
