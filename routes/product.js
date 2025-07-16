const express = require("express");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const productRouter = express.Router();

// Middleware to verify JWT and attach user to req
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware to check admin role
async function isAdmin(req, res, next) {
  const user = await User.findById(req.user.id);
  if (user && user.type === "admin") return next();
  return res.status(403).json({ message: "Admin access required" });
}

// GET /products - list products with pagination and search
productRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "" } = req.query;
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Product.countDocuments(query);
  res.json({ products, total });
});

// GET /products/:id - get single product
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /products - add product (admin only)
productRouter.post("/", auth, isAdmin, async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const product = new Product({ name, description, price, category, stock });
  await product.save();
  res.status(201).json(product);
});

// PUT /products/:id - update product (admin only)
productRouter.put("/:id", auth, isAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// DELETE /products/:id - delete product (admin only)
productRouter.delete("/:id", auth, isAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = productRouter; 