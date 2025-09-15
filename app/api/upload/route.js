import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v2 as cloudinary } from 'cloudinary';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Get the session token from cookies
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
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Invalid or expired session. Please log in again.' },
        { status: 401 }
      );
    }
    
    // Check if user is a seller
    if (session.user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Only sellers can upload images' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process each file sequentially to avoid rate limiting
    const results = [];
    
    for (const file of files) {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert buffer to base64
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            base64String,
            {
              folder: 'auto-parts',
              resource_type: 'auto',
              transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                  format: result.format,
                  bytes: result.bytes,
                  width: result.width,
                  height: result.height
                });
              }
            }
          );
        });
        
        results.push(result);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }

    if (results.length === 0) {
      throw new Error('Failed to upload any files');
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: results
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files', details: error.message },
      { status: 500 }
    );
  }
}
