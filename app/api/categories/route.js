import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Category from "@/models/category.model";

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select("name description icon color")
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
