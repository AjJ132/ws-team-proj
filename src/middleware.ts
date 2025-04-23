// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Define public routes that don't require authentication
  const isPublicRoute = 
    path === '/' || 
    path === '/login' || 
    path === '/register' || 
    path.startsWith('/api/auth');
  
  // Get the token from localStorage (client-side storage)
  const token = request.cookies.get('auth_token')?.value;
  
  // If a protected route is accessed without a token, redirect to login
  if (!isPublicRoute && !token) {
    // Store the original URL to redirect after login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // If an auth page is accessed with a token, redirect to dashboard
  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Allow the request to proceed normally
  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes that don't need auth, etc.
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};