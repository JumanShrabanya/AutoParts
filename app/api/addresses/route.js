import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import User from "@/models/user.model";

// GET - Fetch all addresses for the authenticated user
export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("apsession")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await User.findById(payload.user.id).select("addresses");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new address for the authenticated user
export async function POST(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("apsession")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, street, city, state, zip, country, type } = body;

    // Validation
    if (!fullName || !phone || !street || !city || !state || !zip || !country) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["home", "work", "other"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid address type" },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new address object
    const newAddress = {
      fullName,
      phone,
      street,
      city,
      state,
      zip,
      country,
      type: type || "home",
      isDefault: user.addresses.length === 0, // First address becomes default
    };

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    // Add address to user
    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({
      success: true,
      address: newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
