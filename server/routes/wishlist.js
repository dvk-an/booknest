import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /wishlist/:username
 * Get all wishlist items for a user
 */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const collection = await db.collection("wishlist");
    const wishlist = await collection.find({ username }).toArray();
    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

/**
 * POST /wishlist
 * Add a book to the user's wishlist
 */
router.post("/", async (req, res) => {
  try {
    const { username, bookId, name, price, genre } = req.body;

    if (!username || !bookId || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const collection = await db.collection("wishlist");

    // prevent duplicates
    const existing = await collection.findOne({ username, bookId });
    if (existing) {
      return res.status(400).json({ error: "Book already in wishlist" });
    }

    const newItem = {
      username,
      bookId: new ObjectId(bookId),
      name,
      genre,
      price,
      addedAt: new Date(),
    };

    await collection.insertOne(newItem);
    res.status(201).json({ message: "Book added to wishlist" });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

/**
 * DELETE /wishlist/:username/:bookId
 * Remove a book from wishlist
 */
router.delete("/:username/:bookId", async (req, res) => {
  try {
    const { username, bookId } = req.params;
    const collection = await db.collection("wishlist");

    const result = await collection.deleteOne({
      username,
      bookId: new ObjectId(bookId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Book not found in wishlist" });
    }

    res.status(200).json({ message: "Book removed from wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ error: "Error removing from wishlist" });
  }
});

export default router;
