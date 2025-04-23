// src/lib/auth-api.ts

/**
 * Helper function to get the authentication token
 */
export function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
  
  /**
   * Helper function to set the authentication token
   */
  export function setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }
  
  /**
   * Helper function to clear the authentication token
   */
  export function clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
  
  /**
   * Add authorization header to fetch options
   */
  export function withAuth(options: RequestInit = {}): RequestInit {
    const token = getAuthToken();
    
    if (!token) {
      return options;
    }
    
    return {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
  }
  
  /**
   * API request with authentication
   */
  export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, withAuth(options));
  }