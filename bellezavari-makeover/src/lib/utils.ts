import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price with currency
export function formatPrice(amount: number, currencySymbol: string = '$'): string {
  return `${currencySymbol}${amount.toFixed(0)}`;
}

// Format duration in hours and minutes
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return `${hours}h ${mins}m`;
}

// Format time from 24h to 12h format
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Format date short
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    day: 'numeric',
    month: 'short',
  });
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Canadian/North American phone number
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Accepts formats: +1XXXXXXXXXX, 1XXXXXXXXXX, XXXXXXXXXX (10 digits)
  const phoneRegex = /^(\+?1)?[2-9]\d{2}[2-9]\d{6}$/;
  return phoneRegex.test(cleaned);
}

// Get start time description for services
export function getStartTimeDescription(allowedStartTimes: string[]): string {
  if (allowedStartTimes.length === 1) {
    return `Must start at ${formatTime(allowedStartTimes[0])}`;
  }
  if (allowedStartTimes.length <= 3) {
    return `Available: ${allowedStartTimes.map(formatTime).join(' or ')}`;
  }
  return 'Flexible start times';
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Check if a date is in the past
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// Get minimum booking date (tomorrow or later)
export function getMinBookingDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// Get maximum booking date (3 months out)
export function getMaxBookingDate(): Date {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  return maxDate;
}
