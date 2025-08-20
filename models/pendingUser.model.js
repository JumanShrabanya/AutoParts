import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    verificationCode: { type: String, required: true }, // 6-digit string
    codeExpiresAt: { type: Date, required: true },
    resendAvailableAt: { type: Date, required: true },
  },
  { timestamps: true }
);

pendingUserSchema.index({ email: 1 }, { unique: true });
// Auto-delete the pending user when the code expires
pendingUserSchema.index({ codeExpiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingUser =
  mongoose.models.PendingUser ||
  mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
