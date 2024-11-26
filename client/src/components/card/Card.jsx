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
    onDelete(item.id);
  };

  const handleSave = async () => {
    if (!currentUser) {
      return navigate("/login");
    }

    setSaved((prev) => !prev); 
    try {
      if (saved) {
        await apiRequest.delete(`/users/unsave`, { data: { postId: item.id } });
        
      } else {
        await apiRequest.post(`/users/save`, { postId: item.id });
      }
    } catch (err) {
      console.error(err);
      setSaved((prev) => !prev); 

    }
    navigate(0);
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
            <div className="icon">
              <img src="/chat.png" alt="Chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
