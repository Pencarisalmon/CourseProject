import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

import userRoutes from "./routes/userRoutes.js";

app.use("/api/v1/users", userRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
