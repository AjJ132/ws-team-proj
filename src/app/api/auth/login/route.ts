// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Configure your C# API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-url.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the C# backend
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // Return the response from the C# backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        errors: ['Failed to connect to authentication service']
      },
      { status: 500 }
    );
  }
}