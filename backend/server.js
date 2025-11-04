import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/events", eventsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
