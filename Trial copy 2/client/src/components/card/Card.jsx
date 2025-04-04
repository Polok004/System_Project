import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./card.scss";

function Card({ item, currentUser, onDelete }) {
  const [saved, setSaved] = useState(false); // Manage save state
  const isOwner = currentUser?.id === item.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (currentUser) {
        try {
          const response = await apiRequest.get(`/users/saved-status?postId=${item.id}`);
          setSaved(response.data.saved);
        } catch (err) {
          console.error("Error fetching save status:", err);
        }
      }
    };

    fetchSavedStatus();
  }, [currentUser, item.id]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id);
    }
  };

  const handleSave = async () => {
    try {
      if (!currentUser) {
        alert("Please log in to save posts.");
        navigate("/login");
        return;
      }

      const url = saved
        ? "http://localhost:8800/api/users/unsave"
        : "http://localhost:8800/api/users/save";

      const response = await apiRequest({
        method: saved ? "DELETE" : "POST",
        url,
        data: { postId: item.id },
      });

      console.log(`${saved ? "Unsave" : "Save"} response:`, response.data);
      setSaved(!saved); // Toggle saved status
    } catch (err) {
      console.error("Error toggling save status:", err.response || err.message);
      alert("There was an error processing your request.");
    }
  };

  const handleChat = () => {
    if (!currentUser) {
      alert("Please log in to chat with other users."); // Notify user instead of redirecting
      return; // Exit the function
    }

    navigate(`/profile?chatWith=${item.userId}`);
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt={item.title} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="Location" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="Bedrooms" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="Bathrooms" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            {isOwner && onDelete && (
              <div className="icon" onClick={handleDelete}>
                <img src="/delete.png" alt="Delete" />
              </div>
            )}
            <div
              className="icon"
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="Save" />
            </div>
            <div className="icon" onClick={handleChat}>
              <img src="/chat.png" alt="Chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
