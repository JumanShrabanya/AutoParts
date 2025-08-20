import dbConnect from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import PendingUser from "@/models/pendingUser.model";
import User from "@/models/user.model";
import { sendVerificationEmail } from "@/lib/email";
import { NextResponse } from "next/server";

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!re.test(email)) return "Invalid email";
  if (email.length > 100) return "Email is too long";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 128) return "Password is too long";
  if (!/(?=.*[a-z])/.test(password)) return "Need 1 lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "Need 1 uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "Need 1 number";
  if (!/(?=.*[@$!%*?&])/.test(password)) return "Need 1 special char (@$!%*?&)";
  return "";
}

function validateName(name) {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name is too long";
  if (!/^[a-zA-Z\s]+$/.test(name))
    return "Name can only contain letters and spaces";
  return "";
}

function generateCode() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body || {};

    // Validate
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (nameError || emailError || passwordError) {
      return NextResponse.json(
        {
          success: false,
          errors: {
            name: nameError,
            email: emailError,
            password: passwordError,
          },
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Build pending entry
    const code = generateCode();
    const now = new Date();
    const codeExpiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    const resendAvailableAt = new Date(now.getTime() + 60 * 1000); // 60 seconds

    await PendingUser.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name,
        email: email.toLowerCase(),
        passwordHash,
        verificationCode: code,
        codeExpiresAt,
        resendAvailableAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendVerificationEmail({ to: email, name, code });

    return NextResponse.json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}
