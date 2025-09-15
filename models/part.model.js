import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    // Array of image URLs
    images: [
      {
        type: String,
        required: true,
      },
    ],
    // Key-value pairs for part specifications
    specifications: [
      {
        label: { type: String, trim: true, required: true },
        value: { type: String, trim: true, required: true },
        _id: false,
      },
    ],
    // Simple array of compatibility strings
    compatibility: [{ type: String, trim: true }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
partSchema.index({ name: "text", description: "text" });
partSchema.index({ category: 1 });
partSchema.index({ brand: 1 });
partSchema.index({ seller: 1 });
partSchema.index({ price: 1 });
partSchema.index({ rating: -1 });

const Part = mongoose.models.Part || mongoose.model("Part", partSchema);

export default Part;
