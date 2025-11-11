import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    address: "",
  });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user profile
  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }
    fetch(`http://localhost:5050/profile/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, [username, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5050/profile/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          address: profile.address,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      setMessage("Profile updated successfully!");
      setPassword("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
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
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {message && (
          <p
            className={`text-sm mb-3 ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={profile.username}
              disabled
              className="border rounded w-full p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              className="border rounded w-full p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              New Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep existing"
              className="border rounded w-full p-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
