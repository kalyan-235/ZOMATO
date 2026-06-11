import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import zomatoRouter from "./routes/zomato.routes.js";
import authRouter   from "./routes/auth.routes.js";
import adminRouter  from "./routes/admin.routes.js";

connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/zomato", zomatoRouter);
app.use("/auth",   authRouter);
app.use("/admin",  adminRouter);

app.get("/", (_req, res) => res.send("Backend is running ✅"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
