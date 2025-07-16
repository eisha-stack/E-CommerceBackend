const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");

const cartRouter = express.Router();

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

// GET /cart - get current user's cart
cartRouter.get("/", auth, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  res.json(cart);
});

// POST /cart/add - add item to cart
cartRouter.post("/add", auth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.json(cart);
});

// PUT /cart/update - update item quantity
cartRouter.put("/update", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: "Item not found in cart" });
  item.quantity = quantity;
  await cart.save();
  res.json(cart);
});

// DELETE /cart/remove - remove item from cart
cartRouter.delete("/remove", auth, async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
});

module.exports = cartRouter; 