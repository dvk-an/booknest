// import express from "express";
// import bcrypt from "bcryptjs";
// import db from "../db/connection.js";

// const router = express.Router();

// // SIGNUP
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, password, isAdmin } = req.body;
//     const collection = await db.collection("users");

//     const existingUser = await collection.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ error: "Username already taken" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = {
//       username,
//       password: hashedPassword,
//       isAdmin: isAdmin || false,
//     };

//     await collection.insertOne(newUser);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Error registering user" });
//   }
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const collection = await db.collection("users");

//     const user = await collection.findOne({ username });
//     if (!user) return res.status(400).json({ error: "User not found" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) return res.status(400).json({ error: "Invalid password" });

//     //  Return JSON with user info
//     res.status(200).json({
//       message: "Login successful",
//       username: user.username,
//       isAdmin: user.isAdmin,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Error logging in" });
//   }
// });

// // LOGOUT
// router.post("/logout", async (req, res) => {
//   try {
//     // Currently stateless; frontend will clear localStorage
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     console.error("Logout error:", err);
//     res.status(500).json({ error: "Error logging out" });
//   }
// });

// export default router;


import express from "express";
import bcrypt from "bcryptjs";
import db from "../db/connection.js";

const router = express.Router();

// SIGNUP (regular users only)
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const collection = await db.collection("users");

    const existingUser = await collection.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      isAdmin: false, //  force non-admin
      email: "",
      address: "",
      createdAt: new Date(),
    };

    await collection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Error registering user" });
  }
});

// CREATE ADMIN (only an existing admin can call this)
router.post("/create-admin", async (req, res) => {
  try {
    const { requester, username, password } = req.body;

    const users = await db.collection("users");
    const adminUser = await users.findOne({ username: requester });

    if (!adminUser || !adminUser.isAdmin)
      return res.status(403).json({ error: "Unauthorized" });

    const existing = await users.findOne({ username });
    if (existing)
      return res.status(400).json({ error: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = {
      username,
      password: hashed,
      isAdmin: true,
      email: "",
      address: "",
      createdAt: new Date(),
    };

    await users.insertOne(newAdmin);
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ error: "Error creating admin" });
  }
});

// LOGIN (unchanged except returning role)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const collection = await db.collection("users");

    const user = await collection.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Error logging in" });
  }
});

// LOGOUT
router.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;