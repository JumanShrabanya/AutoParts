import { NextResponse } from "next/server";
import dbConnect, { connectDB } from "@/lib/mongoose";
import Brand from "@/models/brand.model";

export async function GET() {
  try {
    await dbConnect();

    const brands = await Brand.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select("name description logo country")
      .lean();

    return NextResponse.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("Brands fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
