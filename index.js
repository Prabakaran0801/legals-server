import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendOtp, register, login } from "./controllers/auth.js";
import connectDB from "./config/ConnectDB.js";

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.post("/api/sendotp", sendOtp);
app.post("/api/register", register);
app.get("/api/login", login);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
