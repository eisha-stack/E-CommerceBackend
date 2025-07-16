// Importing dependencies
console.log("Hello World");

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

// Importing routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

// Setting up the port
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});