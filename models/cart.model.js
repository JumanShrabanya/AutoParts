import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    part: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },

    // Snapshots for resilient UX if product updates later
    priceAtAdd: { type: Number, required: true, min: 0 },
    nameSnapshot: { type: String, trim: true },
    imageSnapshot: { type: String, trim: true },
    brandSnapshot: { type: String, trim: true },

    isSelected: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [cartItemSchema], default: [] },
    currency: { type: String, default: "USD" },
    // Optional server-side computed totals; do not rely on client values
    totals: {
      itemsCount: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure one active cart per user; historical carts can be stored with isActive=false
cartSchema.index({ user: 1, isActive: 1 });
cartSchema.index({ "items.part": 1 });

// Keep totals roughly accurate on save
cartSchema.pre("save", function recomputeTotals(next) {
  const cart = this;
  const items = Array.isArray(cart.items) ? cart.items : [];
  cart.totals.itemsCount = items.reduce(
    (sum, it) => sum + (it.quantity || 0),
    0
  );
  cart.totals.subtotal = items.reduce(
    (sum, it) =>
      sum + Math.max(0, it.priceAtAdd || 0) * Math.max(1, it.quantity || 0),
    0
  );
  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
