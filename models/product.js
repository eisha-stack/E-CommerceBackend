const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product; 