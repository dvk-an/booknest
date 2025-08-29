import { useState } from "react";

export default function BookForm() {
  const [form, setForm] = useState({
    name: "",
    genre: "",
    price: "",
  });

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Book saved successfully!");
      setForm({ name: "", genre: "", price: "" });
    } catch (err) {
      console.error("Error saving book:", err);
    }
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Book</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Book Name */}
        <div>
          <label className="block text-sm font-medium text-slate-900">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Book name"
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-slate-900">
            Genre
          </label>
          <input
            type="text"
            value={form.genre}
            onChange={(e) => updateForm({ genre: e.target.value })}
            placeholder="e.g. Fiction, Non-fiction"
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-900">
            Price
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateForm({ price: e.target.value })}
            placeholder="Enter price"
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Save Book
        </button>
      </form>
    </div>
  );
}
