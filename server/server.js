import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
import cart from "./routes/cart.js";
import review from "./routes/review.js";
import profile from "./routes/profile.js";
import wishlist from "./routes/wishlist.js";
import users from "./routes/users.js";
dotenv.config();  // load .env variables into process.env

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/auth", auth);
app.use("/cart", cart);
app.use("/review", review);
app.use("/profile", profile);
app.use("/wishlist", wishlist);
app.use("/users", users);
// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
 