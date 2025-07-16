const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true ,trim: true},
    email: { type: String, required: true, unique: true,trim: true,validate: {
        validator: function(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address"
    }},
    password: { type: String, required: true,trim: true,validate: {
        validator: function(v) {
            return v.length >= 8;
        },
        message: "Password must be at least 8 characters long"
    }},
    address: { type: String, default: "",trim: true},
    type:{
        type: String,
        default: "user",
    }
    //cart
});

const User = mongoose.model("User", userSchema);

module.exports = User;