// import React, { useEffect, useState } from "react";

// const Cart = () => {
//   const username = localStorage.getItem("username");
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:5050/cart/${username}`)
//       .then((res) => res.json())
//       .then((data) => setCartItems(data))
//       .catch((err) => console.error("Error fetching cart:", err));
//   }, [username]);

//   const removeItem = async (id) => {
//     await fetch(`http://localhost:5050/cart/${id}`, { method: "DELETE" });
//     setCartItems((prev) => prev.filter((item) => item._id !== id));
//   };

//   const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//       {cartItems.length === 0 ? (
//         <p>No items in your cart.</p>
//       ) : (
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div
//               key={item._id}
//               className="flex justify-between bg-white p-4 rounded-lg shadow-md"
//             >
//               <div>
//                 <h3 className="text-lg font-semibold">{item.name}</h3>
//                 <p>₹{item.price}</p>
//               </div>
//               <button
//                 onClick={() => removeItem(item._id)}
//                 className="text-red-600 hover:underline"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <div className="text-right font-bold text-lg mt-4">
//             Total: ₹{total.toFixed(2)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const username = localStorage.getItem("username");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5050/cart/${username}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error(err));
  }, [username]);

  const removeItem = async (id) => {
    await fetch(`http://localhost:5050/cart/${id}`, { method: "DELETE" });
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5050/auth/logout", { method: "POST" });
    localStorage.clear();
    navigate("/");
  };

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Cart ({username})</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>₹{item.price}</p>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <h2 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default Cart;