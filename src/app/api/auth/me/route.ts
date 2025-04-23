// src/app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Configure your C# API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-url.com';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          errors: ['Missing or invalid token']
        },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' from the header value
    
    // You'll need to implement or get this endpoint from the C# backend
    // This could be a /api/user/me or similar endpoint that returns the current user
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json({
      success: true,
      user: data.data // Adjust according to your C# API response format
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        errors: ['Failed to connect to user service']
      },
      { status: 500 }
    );
  }
}