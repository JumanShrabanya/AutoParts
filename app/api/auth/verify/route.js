import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import PendingUser from "@/models/pendingUser.model";
import User from "@/models/user.model";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code } = body || {};

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending) {
      return NextResponse.json(
        { success: false, message: "No pending registration found" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (pending.codeExpiresAt <= now) {
      await PendingUser.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { success: false, message: "Verification code expired" },
        { status: 410 }
      );
    }

    if (pending.verificationCode !== code) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    // If user already exists, clean up pending and return conflict
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      await PendingUser.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Create real user with hashed password from pending
    await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.passwordHash,
      role: "customer",
    });

    // Delete pending entry
    await PendingUser.deleteOne({ _id: pending._id });

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
