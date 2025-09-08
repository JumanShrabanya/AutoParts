import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Part from '@/models/part.model';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const parts = await Part.find({ category: categoryId })
      .populate('brand', 'name logo')
      .populate('category', 'name')
      .lean();

    return NextResponse.json({ data: parts });
  } catch (error) {
    console.error('Error fetching parts by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    );
  }
}
