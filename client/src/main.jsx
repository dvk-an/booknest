// import * as React from "react";
// import * as ReactDOM from "react-dom/client";
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import App from "./App";
// import Record from "./components/Record2";
// import RecordList from "./components/RecordList2";
// import Edit from "./components/Edit";
// import Auth from "./components/Auth";
// import Shop from "./components/Shop";
// import Cart from "./components/Cart";
// import "./index.css";

// const router = createBrowserRouter([
//   { path: "/", element: <Auth /> },
//   {
//     path: "/record",
//     element: <App />,
//     children: [{ path: "/record", element: <RecordList /> }],
//   },
//   {
//     path: "/create",
//     element: <App />,
//     children: [{ path: "/create", element: <Record /> }],
//   },
//   {
//     path: "/edit/:id",
//     element: <App />,
//     children: [{ path: "/edit/:id", element: <Edit /> }],
//   },
//   { path: "/shop", element: <Shop /> },
//   { path: "/cart", element: <Cart /> },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );



import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from "./components/Auth";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import App from "./App";
import Record from "./components/Record2";
import RecordList from "./components/RecordList2";
import Edit from "./components/Edit";
import "./index.css";
import BookDetails from "./components/BookDetails"; 
import Profile from "./components/Profile";
import Wishlist from "./components/Wishlist";
import AdminManageUsers from "./components/AdminManageUsers";

const router = createBrowserRouter([
  { path: "/", element: <Auth /> }, // Login page
  { path: "/shop", element: <Shop /> },
  { path: "/book/:id", element: <BookDetails /> }, 
  { path: "/cart", element: <Cart /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/profile", element: <Profile /> },
  { path: "/record", element: <RecordList /> },
  { path: "/admin-users", element: <AdminManageUsers /> },
  {
    path: "/record",
    element: <App />,
    children: [{ path: "/record", element: <RecordList /> }],
  },
  {
    path: "/create",
    element: <App />,
    children: [{ path: "/create", element: <Record /> }],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [{ path: "/edit/:id", element: <Edit /> }],
  },
]);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);