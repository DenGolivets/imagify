import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge.
 * Standard utility for shadcn/ui and custom components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
