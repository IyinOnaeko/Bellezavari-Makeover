/**
 * Business Settings & Configuration
 * 
 * This file contains all configurable business settings for Bellezavari.
 * These values are used throughout the application to control:
 * - Working hours and availability
 * - Currency and pricing display
 * - Location information
 * - Contact details
 * - Booking policies
 * 
 * IMPORTANT: After modifying these settings, the changes will be reflected
 * across the entire site without code changes.
 */

import { Settings } from '@/types';

/**
 * Main settings object containing all business configuration.
 * 
 * To customize for a different business:
 * 1. Update businessName
 * 2. Set correct timezone (use IANA format)
 * 3. Adjust workingHours for each day
 * 4. Update location details
 * 5. Set contact information
 */
export const settings: Settings = {
  // Business identity
  businessName: 'Bellezavari',
  
  // Timezone for all date/time calculations
  // Uses IANA timezone format - see: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  timezone: 'America/Toronto',
  
  /**
   * Working hours for each day of the week.
   * dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
   * 
   * The availability engine uses these to determine:
   * - Which days are available for booking
   * - What time slots to show
   * - Whether a service would end after closing
   */
  workingHours: [
    { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '18:00' }, // Sunday - CLOSED
    { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Monday
    { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Tuesday
    { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Wednesday
    { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Thursday
    { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Friday
    { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '17:00' },  // Saturday (closes earlier)
  ],
  
  /**
   * Specific dates when the business is closed.
   * Add holidays, vacation days, etc. in 'YYYY-MM-DD' format.
   * These dates will show as unavailable in the booking calendar.
   */
  offDays: [
    // Examples:
    // '2024-12-25', // Christmas Day
    // '2024-12-26', // Boxing Day
    // '2024-01-01', // New Year's Day
  ],
  
  /**
   * Buffer time in minutes between appointments.
   * This gives time for cleanup, preparation, and prevents back-to-back bookings.
   * 30 minutes is recommended for hair services.
   */
  bufferMinutes: 30,
  
  // Currency settings
  currency: 'CAD',       // ISO 4217 currency code
  currencySymbol: '$',   // Symbol for display
  
  // Location information (displayed in footer and contact sections)
  location: {
    address: 'Toronto, ON',  // Can be specific or general
    city: 'Toronto',
    postcode: '',            // Optional - add if sharing exact location
  },
  
  /**
   * Additional fee charged for home service visits.
   * This is added to the booking total when "Home Service" extra is selected.
   */
  homeServiceFee: 75,
  
  // Social and contact
  instagramUrl: 'https://instagram.com/bellezavari',
  contactEmail: 'hello@bellezavari.com',
  contactPhone: '',  // Add phone number if desired
};

// ============================================================================
// BOOKING POLICIES
// These are displayed on the Policies page and during checkout
// ============================================================================

/**
 * Booking policy content.
 * Uses markdown-style formatting (** for bold, • for bullets).
 * 
 * CRITICAL: The deposit policy must clearly state that deposits are NON-REFUNDABLE.
 * This is a key business requirement.
 */
export const policies = {
  deposit: {
    title: 'Deposit Policy',
    content: `A non-refundable deposit is required to secure your booking. The deposit amount varies by service and will be clearly displayed during booking.

**Important:** Deposits are NON-REFUNDABLE under any circumstances. By paying the deposit, you acknowledge and accept this policy.

The remaining balance is due on the day of your appointment, before the service begins.`,
  },
  
  cancellation: {
    title: 'Cancellation Policy',
    content: `We understand that plans change. However, please be aware:

• **Cancellations made more than 48 hours before appointment:** You may reschedule to another date (subject to availability). Deposit transfers to new booking.

• **Cancellations within 48 hours:** Deposit is forfeited. No reschedule available.

• **No-shows:** Deposit is forfeited and you may be required to pay a full deposit for future bookings.

To cancel or reschedule, please contact us via email with at least 48 hours notice.`,
  },
  
  lateness: {
    title: 'Late Arrival Policy',
    content: `Please arrive on time for your appointment. Your appointment time is reserved exclusively for you.

• **Up to 15 minutes late:** Service may be shortened to fit remaining time slot.

• **More than 15 minutes late:** Appointment may be cancelled and treated as a no-show. Deposit is forfeited.

• **More than 30 minutes late:** Appointment will be cancelled. Deposit is forfeited.

If you know you'll be late, please contact us immediately.`,
  },
  
  homeService: {
    title: 'Home Service Policy',
    content: `We offer home service within the Greater Toronto Area for an additional fee.

• Home service fee is added to your booking total and paid upfront.

• Please ensure you have a clean, well-lit space prepared for the appointment.

• Running water and electricity must be available.

• Parking should be available or travel costs may apply.

• The stylist reserves the right to decline service if conditions are unsuitable.`,
  },
  
  general: {
    title: 'General Policies',
    content: `**Hair Condition**
Please come with clean, detangled hair unless your service includes washing. If hair is not properly prepared, additional charges may apply or the service may be refused.

**Children**
For safety reasons, please do not bring children to appointments unless they are the client.

**Hair Extensions**
For braiding and loc services, please bring quality hair extensions. We can provide hair for an additional fee.

**Photos**
We may take photos of completed styles for our portfolio. Please let us know if you prefer not to be photographed.

**Health & Safety**
If you have any scalp conditions or allergies, please inform us before your appointment.`,
  },
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Day names for display in the UI.
 * Index matches dayOfWeek (0 = Sunday).
 */
export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Formats working hours for display.
 * Returns "Closed" for non-working days, or "HH:MM - HH:MM" for working days.
 */
export const formatWorkingHours = (day: typeof settings.workingHours[0]): string => {
  if (!day.isOpen) return 'Closed';
  return `${day.openTime} - ${day.closeTime}`;
};
