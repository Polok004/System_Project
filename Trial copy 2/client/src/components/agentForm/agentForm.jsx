import React, { useState } from "react";
import "./agentForm.scss";
import apiRequest from "../../lib/apiRequest";
//import { useNavigate } from "react-router-dom";


const AgentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bio: "",
    National_ID: "",
    experience: "",
    phone: "",
    website: "",
    Service_Area: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (formData) => {
    console.log("Form data submitted:", formData);
    try {
      const response = await apiRequest.post("/agents", formData);
      console.log("Server response:", response.data);
      setSuccess(true);
      setError("");
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Submission failed");
    }
  };
  

  return (
    <div className="agentForm">
      <h2>Become an Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
          />
        </div>
        <div className="formGroup">
          <label>National ID</label>
          <input
            type="text"
            name="National_ID"
            value={formData.National_ID}
            onChange={handleChange}
            placeholder="Enter your National ID"
          />
        </div>
        <div className="formGroup">
          <label>Experience</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Years of experience"
          />
        </div>
        <div className="formGroup">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>
        <div className="formGroup">
          <label>Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Your website (optional)"
          />
        </div>
        <div className="formGroup">
          <label>Service Area</label>
          <input
            type="text"
            name="Service_Area"
            value={formData.Service_Area}
            onChange={handleChange}
            placeholder="Your service area"
          />
        </div>
        <div className="formGroup">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
          />
        </div>
        <button type="submit" className="submitButton">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AgentForm;
