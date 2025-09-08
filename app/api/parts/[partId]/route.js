import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Part from "@/models/part.model";

export async function GET(_request, { params }) {
  try {
    await dbConnect();

    const { partId } = params || {};
    if (!partId || !mongoose.Types.ObjectId.isValid(partId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing partId" },
        { status: 400 }
      );
    }

    // Include parts without explicit isActive for backwards compatibility
    const isActiveFilter = {
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };

    const part = await Part.findOne({ _id: partId, ...isActiveFilter })
      .populate("brand", "name logo country website")
      .populate("category", "name icon color")
      .lean();

    if (!part) {
      return NextResponse.json(
        { success: false, error: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: part });
  } catch (error) {
    console.error("Get part details error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch part details" },
      { status: 500 }
    );
  }
}
