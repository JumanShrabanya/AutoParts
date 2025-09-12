import mongoose from "mongoose";
import addressSchema from "./address.model.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "admin", "seller"],
    default: "customer",
  },

  // Customer-specific fields
  addresses: [addressSchema],
  //   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // Seller-specific fields (optional)
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  storeName: { type: String },

  createdAt: { type: Date, default: Date.now },
});

// Ensures unique email
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
