import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongoose';
import Part from '@/models/part.model';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get the session token from cookies - must be awaited
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No session found. Please log in.' },
        { status: 401 }
      );
    }
    
    // Verify the session token
    const session = verifySessionToken(token);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Invalid or expired session. Please log in again.' },
        { status: 401 }
      );
    }
    
    // Check if user is a seller
    if (session.user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Only sellers can list parts' },
        { status: 403 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.description || !data.category || !data.brand || !data.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare images array - according to model, it should be an array of strings (URLs)
    let images = [];
    if (Array.isArray(data.images)) {
      images = data.images
        .map(img => (typeof img === 'string' ? img : img.url))
        .filter(Boolean);
    } else if (typeof data.images === 'string') {
      try {
        // Handle case where images is a stringified array
        const parsedImages = JSON.parse(data.images);
        if (Array.isArray(parsedImages)) {
          images = parsedImages
            .map(img => (typeof img === 'string' ? img : img.url))
            .filter(Boolean);
        }
      } catch (e) {
        console.error('Error parsing images:', e);
        // If parsing fails, try to extract URL from the string
        const urlMatch = data.images.match(/https?:\/\/[^\s\]]+/);
        if (urlMatch) {
          images = [urlMatch[0]];
        }
      }
    }

    // Prepare specifications array
    let specifications = [];
    if (data.specifications) {
      try {
        let specs = data.specifications;
        
        // If it's a string, try to parse it
        if (typeof specs === 'string') {
          specs = JSON.parse(specs);
        }
        
        // If it's an array, filter out invalid entries
        if (Array.isArray(specs)) {
          specifications = specs
            .filter(spec => spec && spec.label && spec.value)
            .map(({ label, value }) => ({
              label: String(label).trim(),
              value: String(value).trim()
            }));
        } 
        // If it's an object, convert to array of {label, value} pairs
        else if (typeof specs === 'object' && specs !== null) {
          specifications = Object.entries(specs)
            .map(([label, value]) => ({
              label: String(label).trim(),
              value: String(value).trim()
            }));
        }
      } catch (e) {
        console.error('Error parsing specifications:', e);
      }
    }

    // Create new part with validated data
    const part = new Part({
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category,
      brand: data.brand,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity || '1', 10),
      images,
      specifications,
      seller: session.user.id
    });

    await part.save();

    return NextResponse.json(
      { message: 'Part created successfully', part },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating part:', error);
    return NextResponse.json(
      { error: 'Failed to create part', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const parts = await Part.find({})
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('seller', 'name');
    
    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    );
  }
}
