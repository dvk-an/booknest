import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 *  POST /review/
 *  Add a review for a specific book
 */
router.post("/", async (req, res) => {
  try {
    const { bookId, username, rating, comment } = req.body;

    if (!bookId || !username || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const collection = await db.collection("reviews");

    const newReview = {
      bookId: new ObjectId(bookId),
      username,
      rating: parseInt(rating),
      comment,
      createdAt: new Date(),
    };

    await collection.insertOne(newReview);
    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Error adding review" });
  }
});

/**
 *  GET /review/:bookId
 *  Get all reviews for a given book
 */
router.get("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const collection = await db.collection("reviews");
    const reviews = await collection
      .find({ bookId: new ObjectId(bookId) })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});


router.get("/all", async (req, res) => {
  const reviews = await db.collection("reviews").find({}).toArray();
  res.status(200).json(reviews);
});


/**
 *  DELETE /review/:id
 *  (Optional — for admin moderation)
 */
router.delete("/:id", async (req, res) => {
  try {
    const collection = await db.collection("reviews");
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Error deleting review" });
  }
});
export default router;