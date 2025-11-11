import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // Fetch wishlist on mount
  useEffect(() => {
    if (!username) navigate("/");
    fetch(`http://localhost:5050/wishlist/${username}`)
      .then((res) => res.json())
      .then((data) => setWishlist(data))
      .catch((err) => console.error("Error fetching wishlist:", err));
  }, [username, navigate]);

  // Remove item
  const removeFromWishlist = async (bookId) => {
    try {
      const res = await fetch(
        `http://localhost:5050/wishlist/${username}/${bookId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove item");
      setWishlist(wishlist.filter((item) => item.bookId !== bookId));
      setMessage("Book removed from wishlist");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error removing item");
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("http://localhost:5050/auth/logout", { method: "POST" });
    localStorage.clear();
    navigate("/");
  };

  // Navigate back to shop
  const goToShop = () => navigate("/shop");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <div className="flex gap-3">
          <button
            onClick={goToShop}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Shop
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {wishlist.length === 0 ? (
        <p>No books in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((book) => (
            <div
              key={book.bookId}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{book.name}</h3>
                <p className="text-gray-600">{book.genre}</p>
                <p className="font-medium mt-2">₹{book.price}</p>
              </div>
              <button
                onClick={() => removeFromWishlist(book.bookId)}
                className="mt-4 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Wishlist;