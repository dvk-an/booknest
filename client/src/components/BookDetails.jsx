import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  // Fetch book info + reviews
  useEffect(() => {
    fetch(`http://localhost:5050/record/${id}`)
      .then((res) => res.json())
      .then(setBook)
      .catch((err) => console.error(err));

    fetch(`http://localhost:5050/review/${id}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          username,
          rating,
          comment,
        }),
      });
      if (!response.ok) throw new Error("Failed to add review");

      setMessage("Review added!");
      setComment("");
      setRating(5);
      // Refresh reviews
      const updated = await fetch(`http://localhost:5050/review/${id}`).then((r) => r.json());
      setReviews(updated);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error adding review");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5050/auth/logout", { method: "POST" });
    localStorage.clear();
    navigate("/");
  };

  if (!book) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">{book.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-2">Genre: {book.genre}</p>
      <p className="text-lg font-semibold mb-4">Price: ₹{book.price}</p>

      <hr className="my-4" />

      {/* Reviews Section */}
      <h2 className="text-xl font-bold mb-2">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white p-3 rounded shadow">
              <div className="flex justify-between">
                <span className="font-semibold">{rev.username}</span>
                <span className="text-yellow-500">⭐ {rev.rating}</span>
              </div>
              <p>{rev.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(rev.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review */}
      {username ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Add a Review</h3>
          {message && <p className="text-green-600 mb-2">{message}</p>}
          <label className="block mb-2">
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="ml-2 border rounded p-1"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="border rounded w-full p-2 mb-3"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-600 mt-4">
          Please log in to add a review.
        </p>
      )}
    </div>
  );
};

export default BookDetails;
