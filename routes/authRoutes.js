const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST route to register a user
router.post("/register", async (req, res) => {
    try {
        const { name, password } = req.body;

        // Simple validation
        if (!name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save user to database
        const newUser = new User({ name, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
