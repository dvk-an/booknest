// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Record = (props) => (
//   <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
//     <td className="p-4 align-middle">{props.record.name}</td>
//     <td className="p-4 align-middle">{props.record.genre}</td>
//     <td className="p-4 align-middle">₹{props.record.price}</td>
//     <td className="p-4 align-middle">
//       <div className="flex gap-2">
//         <Link
//           className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
//           to={`/edit/${props.record._id}`}
//         >
//           Edit
//         </Link>
//         <button
//           className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 hover:text-red-600 h-9 rounded-md px-3"
//           type="button"
//           onClick={() => {
//             props.deleteRecord(props.record._id);
//           }}
//         >
//           Delete
//         </button>
//       </div>
//     </td>
//   </tr>
// );

// export default function RecordList() {
//   const [records, setRecords] = useState([]);
//   const navigate = useNavigate();
//   const username = localStorage.getItem("username");

//   // Fetch records
//   useEffect(() => {
//     async function getRecords() {
//       const response = await fetch(`http://localhost:5050/record/`);
//       if (!response.ok) {
//         const message = `An error occurred: ${response.statusText}`;
//         console.error(message);
//         return;
//       }
//       const records = await response.json();
//       setRecords(records);
//     }
//     getRecords();
//   }, []);

//   // Delete record
//   async function deleteRecord(id) {
//     await fetch(`http://localhost:5050/record/${id}`, {
//       method: "DELETE",
//     });
//     setRecords(records.filter((el) => el._id !== id));
//   }

//   // Logout handler
//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:5050/auth/logout", { method: "POST" });
//       localStorage.clear();
//       navigate("/"); // redirect to login page
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   // Render records
//   function recordList() {
//     return records.map((record) => (
//       <Record record={record} deleteRecord={deleteRecord} key={record._id} />
//     ));
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold">
//           Book Records (Admin: {username})
//         </h3>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="border rounded-lg overflow-hidden">
//         <div className="relative w-full overflow-auto">
//           <table className="w-full caption-bottom text-sm">
//             <thead>
//               <tr className="border-b">
//                 <th className="h-12 px-4 text-left font-medium">Name</th>
//                 <th className="h-12 px-4 text-left font-medium">Genre</th>
//                 <th className="h-12 px-4 text-left font-medium">Price</th>
//                 <th className="h-12 px-4 text-left font-medium">Action</th>
//               </tr>
//             </thead>
//             <tbody>{recordList()}</tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RecordRow = ({ record, deleteRecord }) => (
  <tr className="border-b transition-colors hover:bg-muted/50">
    <td className="p-4 align-middle">{record.name}</td>
    <td className="p-4 align-middle">{record.genre}</td>
    <td className="p-4 align-middle">₹{record.price}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center text-sm font-medium border bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center text-sm font-medium border bg-background hover:bg-slate-100 hover:text-red-600 h-9 rounded-md px-3"
          type="button"
          onClick={() => deleteRecord(record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList2() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ books: 0, users: 0, reviews: 0 });
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Fetch book records
  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch("http://localhost:5050/record/");
      const data = await response.json();
      setRecords(data);
      setStats((prev) => ({ ...prev, books: data.length }));
    }
    fetchBooks();

    // Fetch users and reviews for stats
    async function fetchStats() {
      try {
        const [usersRes, reviewsRes] = await Promise.all([
          fetch("http://localhost:5050/users"),
          fetch("http://localhost:5050/review/all"),
        ]);
        const users = await usersRes.json();
        const reviews = await reviewsRes.json();
        setStats({
          books: records.length,
          users: users.length,
          reviews: reviews.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    fetchStats();
  }, []);

  // Delete a book
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, { method: "DELETE" });
    setRecords(records.filter((el) => el._id !== id));
    setStats((prev) => ({ ...prev, books: prev.books - 1 }));
  }

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
        <h2 className="text-2xl font-bold">
          Admin Dashboard — Welcome, {username}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin-users")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Manage Admins
          </button>
          <Link
            to="/create"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Book
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

      {/* Book Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Genre</th>
                <th className="p-4 text-left font-semibold">Price</th>
                <th className="p-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No books available.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <RecordRow
                    key={record._id}
                    record={record}
                    deleteRecord={deleteRecord}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
