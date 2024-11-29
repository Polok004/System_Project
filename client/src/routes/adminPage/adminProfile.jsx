import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./adminProfile.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null); // Clears the user from the context
      navigate("/"); // Redirects to the homepage after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="adminProfile">
      <Sidebar />
      <div className="profileContainer">
      
        <div className="dashboard">
          <div className="widgets">
            <Widget type="user" />
            <Widget type="order" />
            <Widget type="earning" />
            <Widget type="balance" />
          </div>
          <div className="charts">
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="transactions">
            <div className="transactionTitle">Latest Transactions</div>
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
