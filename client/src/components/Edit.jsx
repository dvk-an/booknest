import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBook() {
  const { id } = useParams(); // book ID from URL
  const navigate = useNavigate();

  const [book, setBook] = useState({ name: "", genre: "", price: "" });

  // Fetch the existing book details
  useEffect(() => {
    fetch(`http://localhost:5050/record/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error("Error loading book:", err));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5050/record/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });

    navigate("/"); // go back to list after editing
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Edit Book</h2>

      <input
        type="text"
        name="name"
        value={book.name}
        onChange={handleChange}
        placeholder="Book Name"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        name="genre"
        value={book.genre}
        onChange={handleChange}
        placeholder="Genre"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        name="price"
        value={book.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Update Book
      </button>
    </form>
  );
}
