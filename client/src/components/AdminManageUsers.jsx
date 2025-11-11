import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminManageUsers = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [users, setUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/shop"); // prevent normal users from accessing
      return;
    }
    fetchUsers();
  }, [navigate, isAdmin]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5050/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Create a new admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5050/auth/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester: username, // the currently logged-in admin
          username: newAdmin.username,
          password: newAdmin.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setMessage("New admin created successfully!");
      setNewAdmin({ username: "", password: "" });
      fetchUsers();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Create admin error:", err);
      setMessage(`Error: ${err.message}`);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("http://localhost:5050/auth/logout", { method: "POST" });
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/record")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Create Admin Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2">Create New Admin</h2>
        <form onSubmit={handleCreateAdmin} className="space-y-3">
          <input
            type="text"
            placeholder="Admin Username"
            value={newAdmin.username}
            onChange={(e) =>
              setNewAdmin((prev) => ({ ...prev, username: e.target.value }))
            }
            required
            className="border rounded w-full p-2"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="border rounded w-full p-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
          >
            Create Admin
          </button>
        </form>
      </div>

      {/* User Table */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">All Users</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email || "—"}</td>
                <td className="p-2">{user.address || "—"}</td>
                <td className="p-2 font-semibold">
                  {user.isAdmin ? (
                    <span className="text-red-600">Admin</span>
                  ) : (
                    <span className="text-gray-600">User</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageUsers;