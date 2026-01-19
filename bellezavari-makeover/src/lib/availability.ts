import { Service, TimeSlot, Booking } from '@/types';
import { settings } from '@/data/settings';

/**
 * Availability Engine
 * 
 * This module handles all time slot calculations and enforces:
 * - Service-specific allowed start times (e.g., long services at 9 AM only)
 * - Working hours constraints
 * - Existing booking conflicts
 * - Buffer time between appointments
 */

// Convert time string to minutes from midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes from midnight to time string
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Check if a time slot would end within working hours
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

// Check if a time slot conflicts with existing bookings
function hasBookingConflict(
  date: Date,
  startTime: string,
  durationMinutes: number,
  existingBookings: Booking[],
  bufferMinutes: number
): boolean {
  const dateStr = date.toISOString().split('T')[0];
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes + bufferMinutes;

  // Get bookings for this date
  const dayBookings = existingBookings.filter(booking => {
    const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
    return bookingDate === dateStr && 
           (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending');
  });

  // Check for conflicts
  for (const booking of dayBookings) {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);
    
    const bookingStartMinutes = bookingStart.getHours() * 60 + bookingStart.getMinutes();
    const bookingEndMinutes = bookingEnd.getHours() * 60 + bookingEnd.getMinutes() + bufferMinutes;

    // Check overlap
    if (
      (startMinutes >= bookingStartMinutes && startMinutes < bookingEndMinutes) ||
      (endMinutes > bookingStartMinutes && endMinutes <= bookingEndMinutes) ||
      (startMinutes <= bookingStartMinutes && endMinutes >= bookingEndMinutes)
    ) {
      return true;
    }
  }

  return false;
}

// Check if time has already passed (for today's date)
function hasTimePassed(date: Date, time: string): boolean {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  // Only check if the date is today
  if (
    date.getDate() !== now.getDate() ||
    date.getMonth() !== now.getMonth() ||
    date.getFullYear() !== now.getFullYear()
  ) {
    return false;
  }

  const slotTime = new Date(date);
  slotTime.setHours(hours, minutes, 0, 0);
  
  // Add some buffer (can't book within next 2 hours)
  const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  return slotTime < minBookingTime;
}

/**
 * Get available time slots for a service on a specific date
 */
export function getAvailableTimeSlots(
  service: Service,
  date: Date,
  existingBookings: Booking[] = []
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const workingDay = settings.workingHours.find(wh => wh.dayOfWeek === dayOfWeek);

  // Check if this day is a working day
  if (!workingDay || !workingDay.isOpen) {
    return [];
  }

  // Check if this is an off day
  const dateStr = date.toISOString().split('T')[0];
  if (settings.offDays.includes(dateStr)) {
    return [];
  }

  const timeSlots: TimeSlot[] = [];

  // For each allowed start time for this service
  for (const startTime of service.allowedStartTimes) {
    const slot: TimeSlot = {
      time: startTime,
      isAvailable: true,
    };

    // Check 1: Is this time within working hours start?
    const openMinutes = timeToMinutes(workingDay.openTime);
    const startMinutes = timeToMinutes(startTime);
    
    if (startMinutes < openMinutes) {
      slot.isAvailable = false;
      slot.reason = 'Before opening time';
      timeSlots.push(slot);
      continue;
    }

    // Check 2: Would the service end within working hours?
    if (!wouldEndWithinWorkingHours(startTime, service.durationMinutes, workingDay.closeTime)) {
      slot.isAvailable = false;
      slot.reason = 'Service would end after closing';
      timeSlots.push(slot);
      continue;
    }

    // Check 3: Has this time already passed (for today)?
    if (hasTimePassed(date, startTime)) {
      slot.isAvailable = false;
      slot.reason = 'Time has passed';
      timeSlots.push(slot);
      continue;
    }

    // Check 4: Is there a booking conflict?
    if (hasBookingConflict(date, startTime, service.durationMinutes, existingBookings, settings.bufferMinutes)) {
      slot.isAvailable = false;
      slot.reason = 'Already booked';
      timeSlots.push(slot);
      continue;
    }

    // All checks passed - slot is available
    timeSlots.push(slot);
  }

  return timeSlots;
}

/**
 * Check if a specific date has any available slots for a service
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
 * Get the next available date for a service
 */
export function getNextAvailableDate(
  service: Service,
  existingBookings: Booking[] = [],
  startFrom: Date = new Date()
): Date | null {
  const maxDays = 90; // Look up to 90 days ahead
  const checkDate = new Date(startFrom);
  checkDate.setDate(checkDate.getDate() + 1); // Start from tomorrow

  for (let i = 0; i < maxDays; i++) {
    if (hasAvailableSlots(service, checkDate, existingBookings)) {
      return new Date(checkDate);
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return null;
}

/**
 * Calculate end time given start time and duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;
  return minutesToTime(endMinutes);
}

/**
 * Create full datetime from date and time string
 */
export function createDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
}
