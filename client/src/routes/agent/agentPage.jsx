import "./agentPage.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


function AgentPage() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
  
    console.log("Current User in AuthContext:", currentUser); // Debug currentUser
    if (!currentUser || !currentUser.id) {
      setError("User not logged in. Please log in to continue.");
      setIsLoading(false);
      return;
    }
  
    const formData = new FormData(e.target);
  
    const data = {
      userId: currentUser.id,
      bio: formData.get("bio"),
      National_ID: formData.get("National_ID"),
      experience: parseInt(formData.get("experience"), 10),
      phone: formData.get("phone"),
      website: formData.get("website") || null,
      Service_Area: formData.get("Service_Area"),
      address: formData.get("address"),
    };
  
    try {
      const res = await apiRequest.post("/agents/be_an_agent", data);
      console.log("API Response:", res); // Debug response
      if (res.status === 201) {
        setSuccessMessage("Application submitted successfully! Pending admin approval.");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (err) {
      console.error("API Error:", err.response); // Debug error
      setError(err.response?.data?.message || "Submission failed!");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <div className="agentPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Become an Agent</h1>

          <textarea name="bio" placeholder="Tell us about yourself" required />
          <input name="National_ID" type="text" placeholder="National ID" required />
          <input name="experience" type="number" placeholder="Years of Experience" required />
          <input name="phone" type="text" placeholder="Phone Number" required />
          <input name="website" type="url" placeholder="Website (Optional)" />
          <input name="Service_Area" type="text" placeholder="Service Area" required />
          <textarea name="address" placeholder="Address" required />

          <button disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          {error && <span className="error">{error}</span>}
          {successMessage && <span className="success">{successMessage}</span>}
        </form>
      </div>
    </div>
  );
}

export default AgentPage;
