// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Une classes condicionalmente (clsx) e resolve conflitos do Tailwind (twMerge).
 * Ex.: cn("p-2 p-4", cond && "bg-red-500") -> "p-4 bg-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
