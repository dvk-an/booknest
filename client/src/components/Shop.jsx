// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Shop = () => {
//   const [books, setBooks] = useState([]);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const username = localStorage.getItem("username");

//   useEffect(() => {
//     fetch("http://localhost:5050/record")
//       .then((res) => res.json())
//       .then((data) => setBooks(data))
//       .catch((err) => console.error("Error fetching books:", err));
//   }, []);

//   const addToCart = async (book) => {
//     try {
//       const response = await fetch("http://localhost:5050/cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username,
//           bookId: book._id,
//           name: book.name,
//           price: book.price,
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to add to cart");

//       setMessage(`${book.name} added to cart!`);
//       setTimeout(() => setMessage(""), 2000);
//     } catch (err) {
//       console.error(err);
//       setMessage("Error adding to cart");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:5050/auth/logout", { method: "POST" });
//       localStorage.clear();
//       navigate("/"); // navigate to login
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   const goToCart = () => {
//     navigate("/cart");
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
//         <div className="flex gap-4">
//           <button
//             onClick={goToCart}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Cart
//           </button>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {message && <p className="text-green-600 mb-4">{message}</p>}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {books.map((book) => (
//           <div key={book._id} className="bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold">{book.name}</h3>
//             <p className="text-gray-600">{book.genre}</p>
//             <p className="font-medium mt-2">Price: ₹{book.price}</p>
//             <button
//               onClick={() => addToCart(book)}
//               className="bg-green-600 text-white mt-3 px-4 py-2 rounded-md hover:bg-green-700"
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default Shop;

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Fetch all books from backend
  useEffect(() => {
    fetch("http://localhost:5050/record")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Add selected book to user's cart
  const addToCart = async (book) => {
    try {
      const response = await fetch("http://localhost:5050/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bookId: book._id,
          name: book.name,
          price: book.price,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");
      setMessage(`${book.name} added to cart!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error adding to cart");
    }
  };

// Add this function in Shop.jsx
const addToWishlist = async (book) => {
  try {
    const response = await fetch("http://localhost:5050/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        bookId: book._id,
        name: book.name,
        genre: book.genre,
        price: book.price,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error adding to wishlist");

    setMessage(`${book.name} added to wishlist!`);
    setTimeout(() => setMessage(""), 2000);
  } catch (err) {
    console.error(err);
    setMessage("Error adding to wishlist");
  }
};


  // Navigate to cart page
  const goToCart = () => navigate("/cart");

  // Logout and redirect to login
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5050/auth/logout", { method: "POST" });
      localStorage.clear();
      navigate("/"); // back to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, <span className="text-blue-700">{username}</span>
        </h1>
        <div className="flex gap-4">
           <button
              onClick={() => navigate("/wishlist")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Wishlist
          </button>
          <button
            onClick={goToCart}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cart
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message */}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <Link
                to={`/book/${book._id}`}
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {book.name}
              </Link>
              <p className="text-gray-600">{book.genre}</p>
              <p className="font-medium mt-2">Price: ₹{book.price}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => addToCart(book)}
                className="bg-green-600 text-white flex-1 py-2 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(book)}
                className="bg-blue-500 text-white flex-1 py-2 rounded hover:bg-blue-600"
              >
                Wishlist
              </button>
              <Link
                to={`/book/${book._id}`}
                className="bg-gray-200 text-gray-800 flex-1 py-2 rounded text-center hover:bg-gray-300"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
