import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Part from "@/models/part.model";
import Category from "@/models/category.model";
import Brand from "@/models/brand.model";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = searchParams.get("minPrice") || 0;
    const maxPrice = searchParams.get("maxPrice") || 10000;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Build search filter
    const filter = { isActive: true };

    // Text search
    if (query.trim()) {
      filter.$text = { $search: query };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Brand filter
    if (brand) {
      filter.brand = brand;
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 10000) {
      filter.price = {};
      if (minPrice > 0) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice < 10000) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute search with population
    const parts = await Part.find(filter)
      .populate("category", "name")
      .populate("brand", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Part.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        parts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          query,
          category,
          brand,
          minPrice: parseFloat(minPrice),
          maxPrice: parseFloat(maxPrice),
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search parts" },
      { status: 500 }
    );
  }
}
