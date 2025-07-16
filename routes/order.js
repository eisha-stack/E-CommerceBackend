const express = require("express");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const orderRouter = express.Router();

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

// POST /orders - create order from cart
orderRouter.post("/", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });
  const items = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price
  }));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = new Order({ user: req.user.id, items, total });
  await order.save();
  cart.items = [];
  await cart.save();
  res.status(201).json(order);
});

// GET /orders - get current user's orders
orderRouter.get("/", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.product");
  res.json(orders);
});

// GET /orders/all - admin: get all orders
orderRouter.get("/all", auth, isAdmin, async (req, res) => {
  const orders = await Order.find().populate("items.product user");
  res.json(orders);
});

module.exports = orderRouter; 