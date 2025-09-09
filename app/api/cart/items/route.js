import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Cart from "@/models/cart.model";
import Part from "@/models/part.model";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const payload = await verifySessionToken(token);
    const userId = payload?.user?.id || payload?._id || payload?.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { partId, quantity = 1 } = body || {};
    if (!partId || !mongoose.Types.ObjectId.isValid(partId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing partId" },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Number(quantity) || 1);

    // Fetch part to snapshot pricing/name/brand/logo
    const part = await Part.findById(partId)
      .populate("brand", "name")
      .select("name price images brand")
      .lean();
    if (!part) {
      return NextResponse.json(
        { success: false, error: "Part not found" },
        { status: 404 }
      );
    }

    const primaryImage =
      Array.isArray(part.images) && part.images.length > 0
        ? part.images[0]
        : "";
    const brandName =
      typeof part.brand === "object" && part.brand?.name ? part.brand.name : "";

    // Get or create active cart
    let cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists
    const existing = cart.items.find(
      (it) => String(it.part) === String(partId)
    );
    if (existing) {
      existing.quantity = Math.max(1, (existing.quantity || 0) + qty);
    } else {
      cart.items.push({
        part: partId,
        quantity: qty,
        priceAtAdd: Number(part.price) || 0,
        nameSnapshot: part.name,
        imageSnapshot: primaryImage,
        brandSnapshot: brandName,
        isSelected: true,
      });
    }

    await cart.save();
    const hydrated = await cart.populate({
      path: "items.part",
      select: "name price images",
    });

    return NextResponse.json({ success: true, data: hydrated });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
