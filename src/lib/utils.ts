import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 * This is used by shadcn components for class name management
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}