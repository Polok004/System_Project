import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
//import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  // const fetch = useNotificationStore((state) => state.fetch);
  // const number = useNotificationStore((state) => state.number);

  if(currentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>LamaEstate</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/agents">Agents</a>
      </div>
      <div className="right">
      <a href="/be_an_agent"><h4>Be an Agent!</h4></a>
      {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/default-avatar.png"} alt="Avatar" />
            <span>{currentUser.username}</span>
            {currentUser.role === "admin" && (
              <Link to="/adminProfile" className="profile">Admin Profile</Link>
            )}
            {currentUser.role === "agent" && (
              <Link to="/agentProfile" className="profile">Agent Profile</Link>
            )}
            {currentUser.role === "user" && (
              <Link to="/profile" className="profile">Profile</Link>
            )}
          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
          <a href="/">Sign in</a>
          <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;