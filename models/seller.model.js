import mongoose from "mongoose";
import addressSchema from "./address.model.js";

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Core business info
  storeName: { type: String, required: true },
  companyName: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  businessAddress: addressSchema,

  // Profile
  logoUrl: { type: String },
  description: { type: String },

  // Ops
  status: {
    type: String,
    enum: ["pending", "active", "suspended"],
    default: "pending",
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },

  // Simple rollups (optional)
  totalProducts: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

// A seller email should be unique across sellers
sellerSchema.index({ email: 1 }, { unique: true });

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

export default Seller;
