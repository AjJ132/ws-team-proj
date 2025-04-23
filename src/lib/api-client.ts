/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api-client.ts
import { ApiResponse, ExtensionDto, ExtensionFilterDto, ExtensionPaginatedResponse, TagDto, ExtensionCreateDto, ExtensionUpdateDto, ExtensionVersionCreateDto, UserLoginDto, UserRegisterDto, UserTokenResponseDto, FlagCreateDto, ExtensionVersionDto } from '@/types/interfaces';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_API_URL || 'http://ws-project-server-env.eba-pikcxp3b.us-east-1.elasticbeanstalk.com'
  : '/api';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables');
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    // Try to get error details from response body
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error('Failed to parse error response:', error);
      // If we can't parse response as JSON, create a generic error
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }
  return response.json();
}

// Get the authentication token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Add authorization headers if token exists
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Authentication
export async function loginUser(credentials: UserLoginDto): Promise<ApiResponse<UserTokenResponseDto>> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await handleResponse<UserTokenResponseDto>(response);
  
  // Store the token in localStorage
  if (data.success && data.data && data.data.token) {
    localStorage.setItem('auth_token', data.data.token);
    localStorage.setItem('user_role', data.data.role || 'USER');
    localStorage.setItem('user_id', data.data.userId);
  }
  
  return data;
}

export async function registerUser(userData: UserRegisterDto): Promise<ApiResponse<UserTokenResponseDto>> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await handleResponse<UserTokenResponseDto>(response);
  
  // Store the token and user information in localStorage
  if (data.success && data.data && data.data.token) {
    localStorage.setItem('auth_token', data.data.token);
    localStorage.setItem('user_role', data.data.role || 'USER');
    localStorage.setItem('user_id', data.data.userId);
    localStorage.setItem('username', data.data.username || '');
    localStorage.setItem('expires_at', data.data.expiresAt || '');
  }
  
  return data;
}

export function logoutUser(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('expires_at');
}

// Get paginated extensions
export async function getExtensions(
  filters: ExtensionFilterDto = { pageNumber: 1, pageSize: 12 }
): Promise<ApiResponse<ExtensionPaginatedResponse>> {
  const queryParams = new URLSearchParams();
  
  if (filters.searchTerm) queryParams.append('SearchTerm', filters.searchTerm);
  if (filters.uploaderId) queryParams.append('UploaderId', filters.uploaderId);
  if (filters.sortBy) queryParams.append('SortBy', filters.sortBy);
  if (filters.sortDescending !== undefined) queryParams.append('SortDescending', filters.sortDescending.toString());
  if (filters.pageNumber) queryParams.append('PageNumber', filters.pageNumber.toString());
  if (filters.pageSize) queryParams.append('PageSize', filters.pageSize.toString());
  
  // Handle TagIds array properly
  if (filters.tagIds && Array.isArray(filters.tagIds) && filters.tagIds.length > 0) {
    filters.tagIds.forEach(tagId => {
      queryParams.append('TagIds', tagId);
    });
  }
  
  const url = `${API_BASE_URL}/extensions?${queryParams.toString()}`;
  console.log('Fetching extensions from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  return handleResponse<ExtensionPaginatedResponse>(response);
}

// Get a single extension by ID
export async function getExtension(id: string): Promise<ApiResponse<ExtensionDto>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse<ExtensionDto>(response);
}

// Create a new extension
export async function createExtension(data: ExtensionCreateDto): Promise<ApiResponse<ExtensionDto>> {
  const response = await fetch(`${API_BASE_URL}/extensions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ExtensionDto>(response);
}

// Update an extension
export async function updateExtension(id: string, data: ExtensionUpdateDto): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<any>(response);
}

// Delete an extension
export async function deleteExtension(id: string): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<any>(response);
}

// Flag an extension
export async function flagExtension(id: string, data: FlagCreateDto): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${id}/flags`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<any>(response);
}

// Extension versions
export async function getExtensionVersions(extensionId: string): Promise<ApiResponse<ExtensionVersionDto[]>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${extensionId}/versions`, {
    headers: getHeaders(),
  });
  return handleResponse<ExtensionVersionDto[]>(response);
}

export async function getExtensionVersion(extensionId: string, versionId: string): Promise<ApiResponse<ExtensionVersionDto>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${extensionId}/versions/${versionId}`, {
    headers: getHeaders(),
  });
  return handleResponse<ExtensionVersionDto>(response);
}

export async function createExtensionVersion(extensionId: string, data: ExtensionVersionCreateDto): Promise<ApiResponse<ExtensionVersionDto>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${extensionId}/versions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ExtensionVersionDto>(response);
}

// Tags
export async function getTags(): Promise<ApiResponse<TagDto[]>> {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    headers: getHeaders(),
  });
  return handleResponse<TagDto[]>(response);
}

export async function getTagsWithCount(): Promise<ApiResponse<TagDto[]>> {
  const response = await fetch(`${API_BASE_URL}/tags/withCount`, {
    headers: getHeaders(),
  });
  return handleResponse<TagDto[]>(response);
}

export async function getExtensionTags(extensionId: string): Promise<ApiResponse<TagDto[]>> {
  const response = await fetch(`${API_BASE_URL}/extensions/${extensionId}/tags`, {
    headers: getHeaders(),
  });
  return handleResponse<TagDto[]>(response);
}