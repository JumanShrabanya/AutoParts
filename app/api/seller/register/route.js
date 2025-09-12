import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import Seller from "@/models/seller.model";
import User from "@/models/user.model";

function validatePayload(body) {
  const errors = {};
  if (!body?.userId) errors.userId = "userId is required";
  if (!body?.storeName) errors.storeName = "storeName is required";
  if (!body?.email) errors.email = "email is required";
  return errors;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validatePayload(body);
    if (Object.keys(errors).length) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const {
      userId,
      storeName,
      companyName,
      email,
      phone,
      logoUrl = "",
      description,
      address,
    } = body;

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "seller" && user.sellerId) {
      const existing = await Seller.findById(user.sellerId).lean();
      return NextResponse.json(
        { success: true, alreadySeller: true, seller: existing },
        { status: 200 }
      );
    }

    const seller = await Seller.create({
      user: user._id,
      storeName,
      companyName,
      email,
      phone,
      businessAddress: address,
      logoUrl,
      description,
      status: "pending",
    });

    user.role = "seller";
    user.sellerId = seller._id;
    await user.save();

    return NextResponse.json({ success: true, sellerId: seller._id });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Register seller error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Seller registration failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
