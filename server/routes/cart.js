import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get cart for a user
router.get("/:username", async (req, res) => {
  try {
    const collection = await db.collection("cart");
    const items = await collection.find({ username: req.params.username }).toArray();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/", async (req, res) => {
  try {
    const { username, bookId, name, price } = req.body;
    const collection = await db.collection("cart");

    const item = { username, bookId: new ObjectId(bookId), name, price };
    await collection.insertOne(item);
    res.status(201).json({ message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// Remove item from cart
router.delete("/:id", async (req, res) => {
  try {
    const collection = await db.collection("cart");
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing from cart" });
  }
});

export default router;
