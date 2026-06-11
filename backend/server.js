import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/zomato.routes.js";
import authRouter from "./routes/auth.routes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",   // Vite frontend
  credentials: true,
}));
app.use(express.json());

app.use("/zomato", router);
app.use("/auth", authRouter);

app.get("/", (_req, res) => {
  res.send("Backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
