const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  total: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order; 