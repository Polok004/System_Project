import React, { useContext, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import "./profilePage.scss";
import { AuthContext } from "../../context/AuthContext";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import apiRequest from "../../lib/apiRequest";

function ProfilePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const data = useLoaderData();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const chatWithUserId = searchParams.get("chatWith")?.trim() || null;

  useEffect(() => {
    if (!currentUser) {
      alert("Please log in to access your profile.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
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
              UserID: <b>{currentUser?.id || "N/A"}</b>
            </span>
            <span>
              Username: <b>{currentUser?.username || "N/A"}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email || "N/A"}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="title">
            <h1>My List</h1>
            {/* <Link to="/add">
              <button>Create New Post</button>
            </Link> */}
          </div>
          <List
            posts={data.postResponse.userPosts || []}
            currentUser={currentUser}
          />

          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List posts={data.postResponse.savedPosts || []} currentUser={currentUser} />
          <div className="title">
            <h1>Transaction Posts</h1>
          </div>
          <List
            posts={data?.postResponse?.transactionPosts || []} // Assuming the response includes a 'transactionPosts' array
            currentUser={currentUser}
          />
           

        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          <Chat chats={data.chatResponse || []} chatWithUserId={chatWithUserId} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
