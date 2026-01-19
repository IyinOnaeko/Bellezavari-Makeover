/**
 * Utility Functions
 * 
 * This file contains general-purpose utility functions used throughout the application.
 * These functions handle common tasks like:
 * - CSS class name merging (for Tailwind)
 * - Price and time formatting
 * - Date formatting
 * - Validation (email, phone)
 * - Booking date calculations
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// TAILWIND CSS UTILITIES
// ============================================================================

/**
 * Merges CSS class names intelligently using clsx and tailwind-merge.
 * This allows for conditional classes and proper Tailwind class deduplication.
 * 
 * Example:
 *   cn('px-4 py-2', isActive && 'bg-primary', 'px-6') // px-6 overrides px-4
 * 
 * @param inputs - Class values (strings, objects, arrays, or conditionals)
 * @returns Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// PRICE FORMATTING
// ============================================================================

/**
 * Formats a number as a price string with currency symbol.
 * 
 * @param amount - The price amount in dollars
 * @param currencySymbol - Currency symbol to use (defaults to $ for CAD)
 * @returns Formatted price string (e.g., "$350")
 */
export function formatPrice(amount: number, currencySymbol: string = '$'): string {
  return `${currencySymbol}${amount.toFixed(0)}`;
}

// ============================================================================
// TIME FORMATTING
// ============================================================================

/**
 * Formats a duration in minutes to a human-readable string.
 * 
 * Examples:
 *   formatDuration(90)  -> "1h 30m"
 *   formatDuration(60)  -> "1 hour"
 *   formatDuration(30)  -> "30 mins"
 *   formatDuration(480) -> "8 hours"
 * 
 * @param minutes - Duration in minutes
 * @returns Human-readable duration string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return `${hours}h ${mins}m`;
}

/**
 * Converts a 24-hour time string to 12-hour format with AM/PM.
 * 
 * Examples:
 *   formatTime("09:00") -> "9:00 AM"
 *   formatTime("14:30") -> "2:30 PM"
 *   formatTime("00:00") -> "12:00 AM"
 * 
 * @param time - Time string in 24h format (HH:MM)
 * @returns Time string in 12h format with AM/PM
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Formats a date for display using Canadian locale.
 * 
 * Example: formatDate(new Date('2024-03-15')) -> "Friday, March 15, 2024"
 * 
 * @param date - Date object to format
 * @returns Full formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a date in a shorter format for compact displays.
 * 
 * Example: formatDateShort(new Date('2024-03-15')) -> "15 Mar"
 * 
 * @param date - Date object to format
 * @returns Short formatted date string
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    day: 'numeric',
    month: 'short',
  });
}

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generates a unique ID string using timestamp and random characters.
 * Used for creating references and temporary IDs.
 * 
 * Example output: "1710518400000-x7k2m9p3q"
 * 
 * @returns Unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates an email address format.
 * Uses a basic regex that catches most common errors.
 * 
 * @param email - Email string to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a Canadian/North American phone number.
 * 
 * Accepts formats:
 * - 10 digits: 4165551234
 * - With country code: +14165551234 or 14165551234
 * - With formatting: (416) 555-1234, 416-555-1234, 416.555.1234
 * 
 * @param phone - Phone string to validate
 * @returns True if phone format is valid for Canada/US
 */
export function isValidPhone(phone: string): boolean {
  // Remove all formatting characters (spaces, dashes, parentheses, dots)
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Pattern explanation:
  // ^(\+?1)?  - Optional +1 or 1 country code
  // [2-9]     - Area code first digit (2-9, not 0 or 1)
  // \d{2}     - Area code remaining 2 digits
  // [2-9]     - Exchange first digit (2-9)
  // \d{6}$    - Remaining 6 digits
  const phoneRegex = /^(\+?1)?[2-9]\d{2}[2-9]\d{6}$/;
  return phoneRegex.test(cleaned);
}

// ============================================================================
// SERVICE DISPLAY HELPERS
// ============================================================================

/**
 * Generates a human-readable description of allowed start times.
 * Used on service cards to inform clients about scheduling restrictions.
 * 
 * Examples:
 *   ["09:00"]                    -> "Must start at 9:00 AM"
 *   ["09:00", "11:00"]           -> "Available: 9:00 AM or 11:00 AM"
 *   ["09:00", "11:00", "13:00"]  -> "Available: 9:00 AM or 11:00 AM or 1:00 PM"
 *   ["09:00", "11:00", "13:00", "14:00", "15:00"] -> "Flexible start times"
 * 
 * @param allowedStartTimes - Array of allowed start times in 24h format
 * @returns Human-readable description
 */
export function getStartTimeDescription(allowedStartTimes: string[]): string {
  if (allowedStartTimes.length === 1) {
    return `Must start at ${formatTime(allowedStartTimes[0])}`;
  }
  if (allowedStartTimes.length <= 3) {
    return `Available: ${allowedStartTimes.map(formatTime).join(' or ')}`;
  }
  return 'Flexible start times';
}

// ============================================================================
// DATE COMPARISON HELPERS
// ============================================================================

/**
 * Checks if a date is today.
 * 
 * @param date - Date to check
 * @returns True if the date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the past (before today).
 * 
 * @param date - Date to check
 * @returns True if the date is before today
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// ============================================================================
// BOOKING DATE BOUNDARIES
// ============================================================================

/**
 * Gets the minimum allowed booking date (tomorrow).
 * Clients cannot book same-day appointments through the website.
 * 
 * @returns Date object set to tomorrow at midnight
 */
export function getMinBookingDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

/**
 * Gets the maximum allowed booking date (3 months from now).
 * Prevents booking too far in advance.
 * 
 * @returns Date object set to 3 months from now
 */
export function getMaxBookingDate(): Date {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  return maxDate;
}
