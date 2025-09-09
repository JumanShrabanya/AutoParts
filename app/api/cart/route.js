import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import Cart from "@/models/cart.model";
import "@/models/part.model"; // ensure Part model is registered for populate
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function GET() {
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
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    let cart = await Cart.findOne({ user: userId, isActive: true })
      .populate({ path: "items.part", select: "name price images brand" })
      .lean();

    if (!cart) {
      cart = {
        user: userId,
        items: [],
        totals: { itemsCount: 0, subtotal: 0 },
        currency: "USD",
      };
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error("Fetch cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
