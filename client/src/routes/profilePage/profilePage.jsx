import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData(); // Ensure this contains the response
  console.log("Loader Data:", data); // Debugging line to check if loader data is available

  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null); // Clear user context after logout
      navigate("/"); // Redirect to home page
    } catch (err) {
      console.log(err); // Error handling
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
              Username: <b>{currentUser?.username || "N/A"}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email || "N/A"}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* User's Posts List */}
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data?.postResponse} // Ensure data contains postResponse
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => {
                console.log("Post Response:", postResponse); // Debugging line
                return (
                  <List
                    posts={postResponse?.userPosts || []} // Use proper posts structure
                  />
                );
              }}
            </Await>
          </Suspense>

          {/* Saved Posts List */}
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data?.postResponse} // Again make sure postResponse contains savedPosts
              errorElement={<p>Error loading saved posts!</p>}
            >
              {(postResponse) => (
                <List posts={postResponse?.savedPosts || []} />
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Section (if any) */}
      <div className="chatContainer">
        <div className="wrapper">
          {/* Include the Chat component here */}
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
