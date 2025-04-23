/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/token-helper.ts

/**
 * Get the JWT payload without validation
 * Note: This does not verify the token signature
 */
export function parseJwt(token: string): any {
    try {
      // Extract the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return null;
    }
  }
  
  /**
   * Check if token is expired
   */
  export function isTokenExpired(token: string): boolean {
    try {
      const payload = parseJwt(token);
      if (!payload || !payload.exp) {
        return true;
      }
      
      // Expiration time is in seconds, Date.now() is in milliseconds
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
  
  /**
   * Syncs token between localStorage and cookie
   * Useful for middleware which can't access localStorage directly
   */
  export function syncTokenToCookie(token: string | null): void {
    if (typeof document === 'undefined') return;
    
    if (token) {
      // Set cookie for middleware access
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict;`;
    } else {
      // Clear cookie
      document.cookie = `token=; path=/; max-age=0;`;
    }
  }
  
  /**
   * Setup event listener for token changes between tabs
   */
  export function setupTokenSync(callback: (token: string | null) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        callback(event.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }