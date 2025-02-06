require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./routes/models/User"); // Ensure this path is correct

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API to Store User Data (Without Hashing)
app.post("/api/user", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Save new user
    const newUser = new User({ name, password });
    await newUser.save();

    res.json({ success: true, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving user" });
  }
});

// API to View All Users (Excluding Passwords)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving users" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

