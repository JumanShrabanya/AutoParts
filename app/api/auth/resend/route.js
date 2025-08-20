import dbConnect from "@/lib/mongoose";
import PendingUser from "@/models/pendingUser.model";
import { sendVerificationEmail } from "@/lib/email";
import { NextResponse } from "next/server";

function generateCode() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const pending = await PendingUser.findOne({ email: email.toLowerCase() });
    if (!pending) {
      return NextResponse.json(
        { success: false, message: "No pending registration for this email" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (pending.resendAvailableAt && pending.resendAvailableAt > now) {
      const seconds = Math.ceil(
        (pending.resendAvailableAt.getTime() - now.getTime()) / 1000
      );
      return NextResponse.json(
        { success: false, message: `Please wait ${seconds}s before resending` },
        { status: 429 }
      );
    }

    const code = generateCode();
    pending.verificationCode = code;
    pending.codeExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    pending.resendAvailableAt = new Date(now.getTime() + 60 * 1000);
    await pending.save();

    await sendVerificationEmail({
      to: pending.email,
      name: pending.name,
      code,
    });

    return NextResponse.json({
      success: true,
      message: "Verification email resent",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Resend error:", error);
    return NextResponse.json(
      { success: false, message: "Resend failed" },
      { status: 500 }
    );
  }
}
