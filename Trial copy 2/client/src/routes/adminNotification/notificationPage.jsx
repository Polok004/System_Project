import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import apiRequest from "../../lib/apiRequest";
import "./notificationPage.scss";

const NotificationsPage = () => {
  const [pendingApplications, setPendingApplications] = useState([]);

  // Fetch pending applications on component mount
  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await apiRequest.get("/agents/pending", { withCredentials: true });
        setPendingApplications(response.data);
      } catch (err) {
        console.error("Error fetching pending applications:", err);
      }
    };

    fetchPendingApplications();
  }, []);

  // Handle approve/reject actions
  const handleAction = async (agentId, action) => {
    try {
      await apiRequest.post("/agents/approve", { agentId, action }, { withCredentials: true });
      setPendingApplications((prev) =>
        prev.filter((application) => application.id !== agentId)
      );
      alert(`Agent application ${action === "approve" ? "approved" : "rejected"}.`);
    } catch (err) {
      console.error("Error handling action:", err);
      alert("Failed to process action.");
    }
  };

  return (
    <div className="notificationsPage">
      <Sidebar />
      <div className="notificationsContainer">
        <h2>Pending Agent Applications</h2>
        {pendingApplications.length > 0 ? (
          pendingApplications.map((application) => (
            <div key={application.id} className="notificationCard">
              <h3>Application from {application.user?.username || "Unknown User"}</h3>
              <p><strong>Email:</strong> {application.user?.email || "N/A"}</p>
              <p><strong>Bio:</strong> {application.bio}</p>
              <p><strong>National ID:</strong> {application.National_ID}</p>
              <p><strong>Experience:</strong> {application.experience} years</p>
              <p><strong>Service Area:</strong> {application.Service_Area}</p>
              <p><strong>Address:</strong> {application.address}</p>
              <div className="actionButtons">
                <button onClick={() => handleAction(application.id, "approve")}>Approve</button>
                <button onClick={() => handleAction(application.id, "reject")}>Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending applications at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
