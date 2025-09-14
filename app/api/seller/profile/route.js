import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Seller from '@/models/seller.model';
import User from '@/models/user.model';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request) {
  try {
    // Try to get the token from the Authorization header first
    let token = null;
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // If no token in header, try to get it from cookies
    if (!token) {
      const cookies = request.headers.get('cookie') || '';
      const match = cookies.match(/apsession=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No authentication token provided',
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    const decoded = verifySessionToken(token);
    
    // Get the user ID from the normalized token
    const userId = decoded?.user?.id;
    
    if (!decoded || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired authentication token',
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const seller = await Seller.findOne({ user: userId })
      .select('-__v -updatedAt')
      .populate('businessAddress', 'street city state country postalCode')
      .lean();

    if (!seller) {
      // Create a new seller profile
      const newSeller = new Seller({
        user: userId,
        storeName: 'My Store', // Default store name
        email: decoded.user?.email || '',
        status: 'active'
      });
      
      const savedSeller = await newSeller.save();
      
      // Update user's sellerId if not set
      if (!decoded.user.sellerId) {
        await User.findByIdAndUpdate(userId, { sellerId: savedSeller._id });
      }
      
      return NextResponse.json({
        success: true,
        data: savedSeller.toObject()
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...seller,
        // Ensure these fields are always present
        storeName: seller.storeName || 'My Store',
        _id: seller._id.toString()
      }
    });
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error fetching seller profile',
      },
      { status: 500 }
    );
  }
}
