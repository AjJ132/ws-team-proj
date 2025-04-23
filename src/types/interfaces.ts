/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/interfaces.ts

// API Response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface ErrorDetails {
  statusCode: number;
  message: string;
  stackTrace: string;
  timestamp: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// User related interfaces
export interface UserLoginDto {
  username: string;
  password: string;
}

export interface UserRegisterDto {
  username: string;
  password: string;
}

export interface UserTokenResponseDto {
  token: string;
  userId: string;
  username: string;
  role: string;
  expiresAt: string;
}

export interface UserDto {
  userId: string;
  username: string;
  role: string;
}

// Uploader
export interface UploaderDto {
  userId: string;
  validate: boolean;
  user: UserDto;
}

// Extension related interfaces
export interface ExtensionDto {
  id: string;
  uploaderId: string;
  name: string;
  description: string;
  versions?: any;
  tags: TagDto[];
  versionDetails: ExtensionVersionDto[];
  uploader: UploaderDto;
}

export interface ExtensionCreateDto {
  uploaderId: string;
  name: string;
  description?: string;
  tagIds?: string[];
}

export interface ExtensionUpdateDto {
  name?: string;
  description?: string;
  tagIds?: string[];
}

export interface ExtensionFilterDto {
  searchTerm?: string;
  uploaderId?: string;
  tagIds?: string[];
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface ExtensionPaginatedResponse extends PaginatedResponse<ExtensionDto> {}

// Tag related interfaces
export interface TagDto {
  id: string;
  name: string;
}

export interface TagWithCountDto extends TagDto {
  extensionCount: number;
}

// Extension Version related interfaces
export interface ExtensionVersionDto {
  id: string;
  extensionId: string;
  versionName: string;
  status: string;
  description: string;
  versionDescriptor: string;
  history: string;
  dependencies: string;
  files: ExtensionFileDto[];
}

export interface ExtensionVersionCreateDto {
  extensionId: string;
  versionName: string;
  versionDescriptor?: string;
  description?: string;
  history?: string;
  dependencies?: string;
}

export interface ExtensionVersionUpdateDto {
  versionName?: string;
  status?: string;
  versionDescriptor?: string;
  description?: string;
  history?: string;
  dependencies?: string;
}

// Extension File
export interface ExtensionFileDto {
  id: string;
  extensionId: string;
  versionId: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

// Flag related interfaces
export interface FlagCreateDto {
  extensionId: string;
  userId: string;
  reason: string;
}