import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ books: 0, users: 0, reviews: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [booksRes, usersRes, reviewsRes] = await Promise.all([
          fetch("http://localhost:5050/record"),
          fetch("http://localhost:5050/users"),
          fetch("http://localhost:5050/review/all"),
        ]);

        const books = await booksRes.json();
        const users = await usersRes.json();
        const reviews = await reviewsRes.json();

        setStats({
          books: books.length,
          users: users.length,
          reviews: reviews.length,
        });

        setRecentUsers(users.slice(-5).reverse());
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5050/auth/logout", { method: "POST" });
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        <button
            onClick={() => navigate("/admin-users")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
            Manage Admins
        </button>

      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Books</h3>
          <p className="text-2xl font-bold">{stats.books}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Registered Users</h3>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-500">Total Reviews</h3>
          <p className="text-2xl font-bold">{stats.reviews}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Recently Registered Users</h3>
        {recentUsers.length === 0 ? (
          <p>No users yet.</p>
        ) : (
          <ul>
            {recentUsers.map((u) => (
              <li key={u._id} className="border-b py-2">
                {u.username} {u.isAdmin && <span className="text-red-500">(Admin)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
