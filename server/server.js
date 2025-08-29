import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import rec from "./routes/records2.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/rec",rec)

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
