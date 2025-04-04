import React, { useContext } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import "./agentProfile.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext"; // If using context

import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";

const AgentProfile = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const data = useLoaderData();
  const navigate = useNavigate();
   
  const searchParams = new URLSearchParams(window.location.search);
  const chatWithUserId = searchParams.get("chatWith")?.trim() || null;
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDelete = async (postId) => {
    console.log("Deleting post:", postId); // Debug

    try {
      const confirmation = window.confirm("Are you sure you want to delete this post?");
      if (!confirmation) return;

      await apiRequest.delete(`/posts/${postId}`);
      alert("Post deleted successfully.");
      window.location.reload(); // Reload to reflect changes
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Error deleting the post. Please try again.");
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          {/* User Information Section */}
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser?.avatar || "noavatar.jpg"} alt="Avatar" />
            </span>
            
            <span>
              AgentID: <b>{currentUser?.id || "N/A"}</b>
            </span>
            <span>
              Username: <b>{currentUser?.username || "N/A"}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email || "N/A"}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* User's Posts Section */}
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <List
            posts={data?.postResponse?.userPosts || []}
            currentUser={currentUser}
            onDelete={handleDelete}
          />

          {/* Saved Posts Section */}
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List
            posts={data?.postResponse?.savedPosts || []}
            currentUser={currentUser}
            
          />

           <div className="title">
            <h1>Transaction Posts</h1>
          </div>
          <List
            posts={data?.postResponse?.transactionPosts || []} // Assuming the response includes a 'transactionPosts' array
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Chat Section */}
      <div className="chatContainer">
        <div className="wrapper">
        <Chat chats={data.chatResponse || []} chatWithUserId={chatWithUserId} />
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
