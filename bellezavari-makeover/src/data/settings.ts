import { Settings } from '@/types';

export const settings: Settings = {
  businessName: 'Bellezavari',
  timezone: 'Europe/London',
  workingHours: [
    { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '18:00' }, // Sunday - Closed
    { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Monday
    { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Tuesday
    { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Wednesday
    { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Thursday
    { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '19:00' },  // Friday
    { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '17:00' },  // Saturday
  ],
  offDays: [
    // Add specific dates when closed (holidays, vacation, etc.)
    // Format: 'YYYY-MM-DD'
  ],
  bufferMinutes: 30, // Buffer between appointments
  currency: 'GBP',
  currencySymbol: '£',
  location: {
    address: 'London, UK',
    city: 'London',
    postcode: '',
  },
  homeServiceFee: 50,
  instagramUrl: 'https://instagram.com/bellezavari',
  contactEmail: 'hello@bellezavari.com',
  contactPhone: '',
};

// Policies content
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
    content: `We offer home service within our service area for an additional fee.

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

// Day names for display
export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to format working hours
export const formatWorkingHours = (day: typeof settings.workingHours[0]): string => {
  if (!day.isOpen) return 'Closed';
  return `${day.openTime} - ${day.closeTime}`;
};
