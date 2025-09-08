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
    images: [
      {
        type: String,
        required: true,
      },
    ],
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    compatibility: [
      {
        make: String,
        model: String,
        yearFrom: Number,
        yearTo: Number,
      },
    ],
    specifications: [
      {
        label: { type: String, trim: true, required: true },
        value: { type: String, trim: true, required: true },
        _id: false,
      },
    ],
    compatibility: [{ type: String, trim: true }], // e.g., "Toyota Camry (2016-2022)"
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
partSchema.index({ price: 1 });
partSchema.index({ rating: -1 });

const Part = mongoose.models.Part || mongoose.model("Part", partSchema);

export default Part;
