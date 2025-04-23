// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Configure your C# API base URL
const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_API_URL || 'http://ws-project-server-env.eba-pikcxp3b.us-east-1.elasticbeanstalk.com'
  : '/api';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the C# backend
    const url = new URL('/auth/register', API_BASE_URL);
    console.log('Forwarding request to:', url.toString());
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle non-2xx responses from the C# backend
      const errorData = await response.json();
      console.error('Registration error:', errorData);
      return NextResponse.json(
        {
          success: false,
          message: 'Registration failed',
          errors: errorData.errors || ['Unknown error occurred'],
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the response from the C# backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        errors: ['Failed to connect to registration service']
      },
      { status: 500 }
    );
  }
}