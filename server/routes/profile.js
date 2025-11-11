import express from "express";
import bcrypt from "bcryptjs";
import db from "../db/connection.js";

const router = express.Router();

/**
 * GET /profile/:username
 * Get a user's profile data
 */
router.get("/:username", async (req, res) => {
  try {
    const collection = await db.collection("users");
    const user = await collection.findOne(
      { username: req.params.username },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

/**
 * PATCH /profile/:username
 * Update a user's profile details
 */
router.patch("/:username", async (req, res) => {
  try {
    const { email, address, password } = req.body;
    const updates = {};

    if (email) updates.email = email;
    if (address) updates.address = address;

    // Hash new password if provided
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    const collection = await db.collection("users");
    const result = await collection.updateOne(
      { username: req.params.username },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Error updating profile" });
  }
});

export default router;