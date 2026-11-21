import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import connectDB from "./config/db.js";
import Restaurant from "./model/restaurant.model.js";
import zomatoRouter from "./routes/zomato.routes.js";
import authRouter   from "./routes/auth.routes.js";
import adminRouter  from "./routes/admin.routes.js";
import orderRouter  from "./routes/order.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import adminRestaurantRouter from "./routes/admin.restaurant.routes.js";

connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "https://zomato-frontend-rose.vercel.app",
  "https://zomato-frontend-li9uaiofd-kalyan-235s-projects.vercel.app",
  /\.vercel\.app$/,
];

app.use(cors({ origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: allowedOrigins, credentials: true },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Not authorized."));

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET || "foodexpress_secret_2026");
  } catch {
    return next(new Error("Invalid or expired token."));
  }
  if (user.role !== "restaurant_owner" || !user.restaurantId) {
    return next(new Error("Restaurant owner access required."));
  }

  try {
    const restaurant = await Restaurant.findOne({
      _id: user.restaurantId,
      owner: user.id,
      approvalStatus: "approved",
    }).select("_id");
    if (!restaurant) return next(new Error("Approved restaurant access required."));

    socket.data.restaurantId = restaurant._id.toString();
    return next();
  } catch (error) {
    console.error("Restaurant socket authentication failed:", error);
    return next(new Error("Unable to authenticate restaurant connection."));
  }
});

io.on("connection", (socket) => {
  socket.join(`restaurant:${socket.data.restaurantId}`);
});

app.set("io", io);

app.use("/zomato",  zomatoRouter);
app.use("/auth",    authRouter);
app.use("/admin",   adminRouter);
app.use("/orders",  orderRouter);
app.use("/upload",  uploadRouter);
app.use("/restaurant", restaurantRouter);
app.use("/admin/restaurant-applications", adminRestaurantRouter);

app.get("/", (_req, res) => res.send("Backend is running ✅"));

httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
