import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import Part from "@/models/part.model";
import Brand from "@/models/brand.model";
import Category from "@/models/category.model";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(request) {
  try {
    await dbConnect();

    // Derive sellerId from URL path to avoid using params (sync dynamic API)
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const sellerIndex = segments.findIndex((s) => s === "seller");
    const idSegment = sellerIndex >= 0 ? segments[sellerIndex + 1] : undefined;
    const sellerId = idSegment;
    console.log("[seller parts] URL:", url.pathname, "sellerId:", sellerId);
    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: "Missing seller id" },
        { status: 400 }
      );
    }

    // AuthN + AuthZ: ensure the requester is the same seller
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      console.warn("[seller parts] No session token found");
    }
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No session found. Please log in." },
        { status: 401 }
      );
    }

    const session = verifySessionToken(token);
    console.log("[seller parts] session user:", session?.user ? { id: session.user.id, role: session.user.role, sellerId: session.user.sellerId } : null);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session." },
        { status: 401 }
      );
    }

    // Build candidate seller IDs for current authenticated user
    const candidateIds = [];
    if (session.user?.id) candidateIds.push(session.user.id);
    if (session.user?.sellerId && session.user.sellerId !== session.user.id) {
      candidateIds.push(session.user.sellerId);
    }
    console.log("[seller parts] candidateIds:", candidateIds);

    // If no identifiers, return empty list (do not 403 to avoid false negatives)
    if (candidateIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const parts = await Part.find({ seller: { $in: candidateIds } })
      .sort({ createdAt: -1 })
      .select("name price stockQuantity images createdAt brand category")
      .populate({ path: "brand", select: "name" })
      .populate({ path: "category", select: "name" })
      .lean();

    const data = parts.map((p) => ({
      _id: String(p._id),
      name: p.name,
      price: p.price,
      stockQuantity: p.stockQuantity,
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
      brand: typeof p.brand === "object" && p.brand ? p.brand.name : p.brand,
      category:
        typeof p.category === "object" && p.category ? p.category.name : p.category,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching seller parts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parts" },
      { status: 500 }
    );
  }
}
