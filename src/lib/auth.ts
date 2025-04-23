// src/lib/auth.ts

import { NextResponse } from "next/server";

// Secret key for JWT tokens (in production, use environment variables)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters'
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  organizationId?: string;
}

export interface JWTPayload {
  sub: string; // user id
  name: string;
  email: string;
  role: string;
  organizationId?: string;
  iat: number;
  exp: number;
}

// Token expiration times
const ACCESS_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days

/**
 * Generate an access token for the user
 */
export async function generateAccessToken(user: User): Promise<string> {
  return new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Generate a refresh token for the user
 */
export async function generateRefreshToken(user: User): Promise<string> {
  return new SignJWT({
    sub: user.id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Set authentication cookies
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  response.cookies.set({
    name: 'access_token',
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ACCESS_TOKEN_EXPIRES_IN,
  });

  response.cookies.set({
    name: 'refresh_token',
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRES_IN,
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: 'refresh_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get the current user from the request
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const accessToken = request.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    return null;
  }

  const payload = await verifyToken(accessToken);
  
  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role as 'USER' | 'ADMIN',
    organizationId: payload.organizationId,
  };
}

/**
 * Refresh the access token using the refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const payload = await verifyToken(refreshToken);
    
    if (!payload || !payload.sub) {
      return null;
    }

    // In a real app, you would fetch the user from the database
    // For this example, we'll create a simple user object
    const user: User = {
      id: payload.sub,
      name: 'User',
      email: 'user@example.com',
      role: 'USER',
    };

    return generateAccessToken(user);
  } catch (error) {
    return null;
  }
}

