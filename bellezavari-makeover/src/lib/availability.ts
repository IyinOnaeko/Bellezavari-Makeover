/**
 * Availability Engine
 * 
 * This module is the core of the booking system's time management.
 * It handles all time slot calculations and enforces critical business rules:
 * 
 * 1. SERVICE-SPECIFIC START TIMES: Long services (7-9 hours) can only start at 9 AM
 *    to ensure completion within working hours. This is defined per-service in
 *    the allowedStartTimes array.
 * 
 * 2. WORKING HOURS: Respects business opening/closing times per day of week.
 * 
 * 3. CONFLICT PREVENTION: Prevents double-booking by checking existing bookings.
 * 
 * 4. BUFFER TIME: Ensures adequate time between appointments for cleanup/prep.
 * 
 * IMPORTANT: This is where the "time enforcement for long styles" requirement is
 * implemented. The system will only show start times that are in the service's
 * allowedStartTimes array, preventing clients from booking long services late.
 */

import { Service, TimeSlot, Booking } from '@/types';
import { settings } from '@/data/settings';

// ============================================================================
// TIME CONVERSION UTILITIES
// ============================================================================

/**
 * Converts a time string (HH:MM) to minutes from midnight.
 * Example: "09:00" -> 540, "14:30" -> 870
 * 
 * @param time - Time string in 24h format (e.g., "09:00")
 * @returns Number of minutes from midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight back to a time string.
 * Example: 540 -> "09:00", 870 -> "14:30"
 * 
 * @param minutes - Minutes from midnight
 * @returns Time string in HH:MM format
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Checks if a service starting at a given time would finish before closing.
 * This prevents booking services that would run past business hours.
 * 
 * @param startTime - Proposed start time in HH:MM format
 * @param durationMinutes - Service duration in minutes
 * @param closeTime - Business closing time in HH:MM format
 * @returns True if service would end on or before closing time
 */
function wouldEndWithinWorkingHours(
  startTime: string,
  durationMinutes: number,
  closeTime: string
): boolean {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;
  const closeMinutes = timeToMinutes(closeTime);
  return endMinutes <= closeMinutes;
}

/**
 * Checks if a proposed time slot conflicts with any existing bookings.
 * Considers both the service duration and buffer time between appointments.
 * 
 * @param date - The date being checked
 * @param startTime - Proposed start time
 * @param durationMinutes - Service duration
 * @param existingBookings - Array of all bookings to check against
 * @param bufferMinutes - Required buffer between appointments
 * @returns True if there's a conflict (slot NOT available)
 */
function hasBookingConflict(
  date: Date,
  startTime: string,
  durationMinutes: number,
  existingBookings: Booking[],
  bufferMinutes: number
): boolean {
  // Convert date to string for comparison (YYYY-MM-DD)
  const dateStr = date.toISOString().split('T')[0];
  
  // Calculate the full time range including buffer
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes + bufferMinutes;

  // Filter to only confirmed/pending bookings on this date
  const dayBookings = existingBookings.filter(booking => {
    const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
    return bookingDate === dateStr && 
           (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending');
  });

  // Check each booking for overlap
  for (const booking of dayBookings) {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    // Convert booking times to minutes from midnight
    const bookingStartMinutes = bookingStart.getHours() * 60 + bookingStart.getMinutes();
    const bookingEndMinutes = bookingEnd.getHours() * 60 + bookingEnd.getMinutes() + bufferMinutes;

    // Check for any overlap between the time ranges
    // Overlap occurs if:
    // - New booking starts during existing booking
    // - New booking ends during existing booking
    // - New booking completely contains existing booking
    if (
      (startMinutes >= bookingStartMinutes && startMinutes < bookingEndMinutes) ||
      (endMinutes > bookingStartMinutes && endMinutes <= bookingEndMinutes) ||
      (startMinutes <= bookingStartMinutes && endMinutes >= bookingEndMinutes)
    ) {
      return true; // Conflict found
    }
  }

  return false; // No conflicts
}

/**
 * Checks if a time slot has already passed (for same-day bookings).
 * Adds a 2-hour buffer to prevent last-minute bookings.
 * 
 * @param date - The booking date
 * @param time - The proposed time slot
 * @returns True if the time has passed or is too soon
 */
function hasTimePassed(date: Date, time: string): boolean {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  // Only check for today's date
  if (
    date.getDate() !== now.getDate() ||
    date.getMonth() !== now.getMonth() ||
    date.getFullYear() !== now.getFullYear()
  ) {
    return false; // Future date, time hasn't passed
  }

  // Create datetime for the slot
  const slotTime = new Date(date);
  slotTime.setHours(hours, minutes, 0, 0);
  
  // Require at least 2 hours notice for booking
  const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  return slotTime < minBookingTime;
}

// ============================================================================
// MAIN AVAILABILITY FUNCTIONS
// ============================================================================

/**
 * Gets all available time slots for a service on a specific date.
 * 
 * This is the main function called by the booking page to display
 * available appointment times. It enforces all booking rules:
 * 
 * 1. Only shows times from the service's allowedStartTimes array
 * 2. Filters out times outside working hours
 * 3. Filters out times that would end after closing
 * 4. Filters out times that conflict with existing bookings
 * 5. Filters out times that have already passed (for today)
 * 
 * @param service - The service being booked
 * @param date - The date to check availability for
 * @param existingBookings - All current bookings (for conflict checking)
 * @returns Array of TimeSlot objects with availability status
 */
export function getAvailableTimeSlots(
  service: Service,
  date: Date,
  existingBookings: Booking[] = []
): TimeSlot[] {
  // Get working hours for this day of week
  const dayOfWeek = date.getDay();
  const workingDay = settings.workingHours.find(wh => wh.dayOfWeek === dayOfWeek);

  // If business is closed this day, return empty array
  if (!workingDay || !workingDay.isOpen) {
    return [];
  }

  // Check if this specific date is an off day (holiday, vacation, etc.)
  const dateStr = date.toISOString().split('T')[0];
  if (settings.offDays.includes(dateStr)) {
    return [];
  }

  const timeSlots: TimeSlot[] = [];

  // IMPORTANT: We only iterate through the service's allowedStartTimes
  // This is how we enforce that long services can only start early
  for (const startTime of service.allowedStartTimes) {
    const slot: TimeSlot = {
      time: startTime,
      isAvailable: true,
    };

    // CHECK 1: Is this time after the business opens?
    const openMinutes = timeToMinutes(workingDay.openTime);
    const startMinutes = timeToMinutes(startTime);
    
    if (startMinutes < openMinutes) {
      slot.isAvailable = false;
      slot.reason = 'Before opening time';
      timeSlots.push(slot);
      continue;
    }

    // CHECK 2: Would the service end before closing?
    if (!wouldEndWithinWorkingHours(startTime, service.durationMinutes, workingDay.closeTime)) {
      slot.isAvailable = false;
      slot.reason = 'Service would end after closing';
      timeSlots.push(slot);
      continue;
    }

    // CHECK 3: Has this time already passed (if booking for today)?
    if (hasTimePassed(date, startTime)) {
      slot.isAvailable = false;
      slot.reason = 'Time has passed';
      timeSlots.push(slot);
      continue;
    }

    // CHECK 4: Does this conflict with an existing booking?
    if (hasBookingConflict(date, startTime, service.durationMinutes, existingBookings, settings.bufferMinutes)) {
      slot.isAvailable = false;
      slot.reason = 'Already booked';
      timeSlots.push(slot);
      continue;
    }

    // All checks passed - slot is available!
    timeSlots.push(slot);
  }

  return timeSlots;
}

/**
 * Quick check if any time slot is available for a service on a date.
 * Used by the calendar to highlight available dates.
 * 
 * @param service - The service being booked
 * @param date - The date to check
 * @param existingBookings - Current bookings
 * @returns True if at least one time slot is available
 */
export function hasAvailableSlots(
  service: Service,
  date: Date,
  existingBookings: Booking[] = []
): boolean {
  const slots = getAvailableTimeSlots(service, date, existingBookings);
  return slots.some(slot => slot.isAvailable);
}

/**
 * Finds the next date with available slots for a service.
 * Useful for suggesting alternatives when selected date is full.
 * 
 * @param service - The service being booked
 * @param existingBookings - Current bookings
 * @param startFrom - Date to start searching from (defaults to today)
 * @returns Next available date, or null if none found within 90 days
 */
export function getNextAvailableDate(
  service: Service,
  existingBookings: Booking[] = [],
  startFrom: Date = new Date()
): Date | null {
  const maxDays = 90; // Don't look more than 90 days ahead
  const checkDate = new Date(startFrom);
  checkDate.setDate(checkDate.getDate() + 1); // Start from tomorrow

  for (let i = 0; i < maxDays; i++) {
    if (hasAvailableSlots(service, checkDate, existingBookings)) {
      return new Date(checkDate);
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return null; // No availability found
}

/**
 * Calculates the end time given a start time and duration.
 * 
 * @param startTime - Start time in HH:MM format
 * @param durationMinutes - Duration in minutes
 * @returns End time in HH:MM format
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;
  return minutesToTime(endMinutes);
}

/**
 * Creates a full Date object from a date and time string.
 * Used when saving bookings to Firestore.
 * 
 * @param date - The date (time component will be overwritten)
 * @param time - Time in HH:MM format
 * @returns Date object with correct date and time
 */
export function createDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
}
