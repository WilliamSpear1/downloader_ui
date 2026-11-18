import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines conditional class values and resolves conflicting Tailwind classes.
 * @param inputs Class strings, arrays, or conditional class maps to combine.
 * @returns A normalized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
