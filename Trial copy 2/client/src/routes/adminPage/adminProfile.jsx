import React, { useContext, useEffect, useState } from "react";
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
  const [stats, setStats] = useState({
    users: 0,
    agents: 0,
    posts: 0,
    transactions: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [revenue, setRevenue] = useState({
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
  });
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest.get("/users/admin/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiRequest.get("/users/admin/transactions", {
          params: { page, limit: 5 },
        });
        console.log(response.data); // Log the response data to check if it's correct
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
  
    fetchTransactions();
  }, [page]);

  // New useEffect for fetching the featured revenue data
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await apiRequest.get("/users/revenue/featured");
        setRevenue(response.data); // Store the revenue data in the state
      } catch (err) {
        console.error("Failed to fetch revenue data:", err);
      }
    };

    fetchRevenue();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null); // Clears the user from the context
      navigate("/"); // Redirects to the homepage after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="adminProfile">
      <Sidebar />
      <div className="profileContainer">
        <div className="dashboard">
          <div className="widgets">
            <Widget type="user" count={stats.users} />
            <Widget type="agent" count={stats.agents} />
            <Widget type="post" count={stats.posts} />
            <Widget type="transaction" count={stats.transactions} />
          </div>
          <div className="charts">
            <Featured revenue={revenue} /> {/* Pass revenue data to Featured component */}
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="transactions">
            <div className="transactionTitle">Latest Transactions</div>
            <Table
              transactions={transactions}
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
