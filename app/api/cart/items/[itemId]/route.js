import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Cart from "@/models/cart.model";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function PUT(request, context) {
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

    const { itemId } = (await context.params) || {};
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json(
        { success: false, error: "Invalid itemId" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const nextQty = Math.max(1, Number(body?.quantity) || 1);

    const cart = await Cart.findOne({ user: userId, isActive: true });
    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    item.quantity = nextQty;
    await cart.save();
    const hydrated = await cart.populate({
      path: "items.part",
      select: "name price images brand",
    });

    return NextResponse.json({ success: true, data: hydrated });
  } catch (error) {
    console.error("Update cart item error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, context) {
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

    const { itemId } = (await context.params) || {};
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json(
        { success: false, error: "Invalid itemId" },
        { status: 400 }
      );
    }

    // Use findOneAndUpdate with $pull for an atomic and reliable delete
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId, isActive: true },
      { $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } } },
      { new: true } // This option returns the document after the update
    );

    if (!updatedCart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    // The pre-save hook on your model will automatically recalculate totals
    // when findOneAndUpdate runs, so we just need to save it to trigger the hook.
    await updatedCart.save();

    // Populate the part details for the remaining items to send back to the client
    const hydrated = await updatedCart.populate({
      path: "items.part",
      select: "name price images brand",
    });

    return NextResponse.json({ success: true, data: hydrated });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
