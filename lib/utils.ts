import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan className dengan aman (tailwind-merge + clsx). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
