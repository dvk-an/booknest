// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Auth = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     isAdmin: false,
//   });
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const username = localStorage.getItem("username");
//     const isAdmin = localStorage.getItem("isAdmin") === "true";

//     if (username) {
//       navigate(isAdmin ? "/record" : "/shop");
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const endpoint = isLogin
//         ? "http://localhost:5050/auth/login"
//         : "http://localhost:5050/auth/signup";

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         throw new Error(data.error || "Request failed");
//       }

//       if (isLogin) {
//         localStorage.setItem("username", data.username);
//         localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");

//         setMessage("Login successful! Redirecting...");
//         setTimeout(() => {
//           navigate(data.isAdmin ? "/record" : "/shop");
//         }, 500);
//       } else {
//         setMessage("Signup successful! You can now log in.");
//         setIsLogin(true);
//       }
//     } catch (error) {
//       console.error("Auth error:", error);
//       setMessage(`Server error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-2xl shadow-md w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           {isLogin ? "Login" : "Sign Up"}
//         </h2>

//         {message && (
//           <p
//             className={`text-center text-sm mb-3 ${
//               message.toLowerCase().includes("error")
//                 ? "text-red-500"
//                 : "text-green-600"
//             }`}
//           >
//             {message}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             className="border p-2 rounded-md"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="border p-2 rounded-md"
//           />

//           {!isLogin && (
//             <label className="flex items-center text-sm gap-2">
//               <input
//                 type="checkbox"
//                 name="isAdmin"
//                 checked={formData.isAdmin}
//                 onChange={handleChange}
//               />
//               Register as Admin
//             </label>
//           )}

//           <button
//             type="submit"
//             className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
//           >
//             {isLogin ? "Login" : "Sign Up"}
//           </button>
//         </form>

//         <div className="mt-4 text-center text-sm">
//           {isLogin ? (
//             <p>
//               Don’t have an account?{" "}
//               <button
//                 onClick={() => setIsLogin(false)}
//                 className="text-blue-600 hover:underline"
//               >
//                 Sign up
//               </button>
//             </p>
//           ) : (
//             <p>
//               Already have an account?{" "}
//               <button
//                 onClick={() => setIsLogin(true)}
//                 className="text-blue-600 hover:underline"
//               >
//                 Login
//               </button>
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (username) {
      navigate(isAdmin ? "/record" : "/shop");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint = isLogin
        ? "http://localhost:5050/auth/login"
        : "http://localhost:5050/auth/signup";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      if (isLogin) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");

        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(data.isAdmin ? "/record" : "/shop");
        }, 500);
      } else {
        setMessage("Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(`Server error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {message && (
          <p
            className={`text-center text-sm mb-3 ${
              message.toLowerCase().includes("error")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border p-2 rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;