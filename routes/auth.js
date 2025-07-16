const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    // Get the data from the request body -- client side
    const { name, email, password } = req.body;

    // Validate the data
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
 
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //post the data to the database
    let user = await new User({ name, email, password: hashedPassword });
    user = await user.save();
    res.json({ user });

    //send the response to the client
    // res.status(201).json({ message: "User created successfully", user });
    
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, type: user.type, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );
    res.json({ token, user });
});


module.exports = authRouter;