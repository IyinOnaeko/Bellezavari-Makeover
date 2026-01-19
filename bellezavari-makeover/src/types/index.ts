/**
 * Bellezavari Type Definitions
 * 
 * This file contains all TypeScript interfaces used throughout the application.
 * These types ensure type safety and provide clear documentation of data structures.
 */

// ============================================================================
// SERVICE TYPES
// ============================================================================

/**
 * Represents an optional add-on service that can be selected during booking.
 * Examples: Home service, hair provided, takedown service, deep conditioning
 */
export interface ServiceExtra {
  id: string;           // Unique identifier for the extra
  name: string;         // Display name (e.g., "Home Service")
  price: number;        // Price in CAD
  description?: string; // Optional description shown to clients
}

/**
 * Represents a hair styling service offered by Bellezavari.
 * This is the core entity that clients book.
 */
export interface Service {
  id: string;                    // Unique identifier (e.g., 'knotless-braids-medium')
  name: string;                  // Display name (e.g., "Medium Knotless Braids")
  description: string;           // Detailed description shown on service cards
  price: number;                 // Full service price in CAD
  depositAmount: number;         // Non-refundable deposit required to book
  durationMinutes: number;       // Expected service duration in minutes
  allowedStartTimes: string[];   // Valid start times in 24h format (e.g., ["09:00", "11:00"])
                                 // CRITICAL: Long services (7+ hours) should only have early times
  extras: ServiceExtra[];        // Service-specific extras (currently unused, using global extras)
  category: 'braids' | 'locs' | 'weaves' | 'natural' | 'other'; // Service category for filtering
  imageUrl?: string;             // Optional image URL for the service card
  isActive: boolean;             // Whether the service is currently available for booking
}

// ============================================================================
// BOOKING TYPES
// ============================================================================

/**
 * Represents an extra that was selected and paid for in a booking.
 * Stored on the booking record for reference.
 */
export interface BookingExtras {
  extraId: string;  // Reference to the ServiceExtra.id
  name: string;     // Name at time of booking (in case extra name changes)
  price: number;    // Price paid at time of booking
}

/**
 * Client information collected during the booking process.
 * Minimal data required for service delivery per privacy requirements.
 */
export interface ClientDetails {
  firstName: string;  // Client's first name
  lastName: string;   // Client's last name
  email: string;      // Email for confirmation (required)
  phone: string;      // Phone number in Canadian format
  notes?: string;     // Optional notes from the client (special requests, etc.)
}

/**
 * Represents a confirmed or pending booking in the system.
 * This is created after successful payment verification via webhook.
 */
export interface Booking {
  id: string;                   // Firestore document ID
  serviceId: string;            // Reference to the booked service
  serviceName: string;          // Service name at time of booking
  startTime: Date;              // Appointment start datetime
  endTime: Date;                // Appointment end datetime (calculated from duration)
  client: ClientDetails;        // Client information
  extras: BookingExtras[];      // Selected add-ons
  subtotal: number;             // Service price
  extrasTotal: number;          // Sum of all extras prices
  depositAmount: number;        // Deposit that was paid
  totalPaid: number;            // Amount actually paid (usually equals deposit)
  balanceDue: number;           // Remaining amount due at appointment
  paymentReference: string;     // Paystack transaction reference
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'; // Payment state
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'; // Booking state
  createdAt: Date;              // When the booking was created
  updatedAt: Date;              // Last modification timestamp
  policyAcknowledged: boolean;  // Client confirmed they read policies
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

/**
 * Defines working hours for a specific day of the week.
 * Used to determine available booking days and times.
 */
export interface WorkingHours {
  dayOfWeek: number;  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isOpen: boolean;    // Whether the business is open this day
  openTime: string;   // Opening time in 24h format (e.g., "09:00")
  closeTime: string;  // Closing time in 24h format (e.g., "19:00")
}

/**
 * Global business settings and configuration.
 * These values are used throughout the application.
 */
export interface Settings {
  businessName: string;           // Business name (e.g., "Bellezavari")
  timezone: string;               // IANA timezone (e.g., "America/Toronto")
  workingHours: WorkingHours[];   // Array of 7 entries, one per day of week
  offDays: string[];              // Specific closed dates in 'YYYY-MM-DD' format
  bufferMinutes: number;          // Minutes between appointments for cleanup/prep
  currency: string;               // ISO currency code (e.g., "CAD")
  currencySymbol: string;         // Currency symbol for display (e.g., "$")
  location: {
    address: string;              // Street address or general location
    city: string;                 // City name
    postcode: string;             // Postal code
  };
  homeServiceFee: number;         // Additional fee for home service in dollars
  instagramUrl: string;           // Instagram profile URL
  contactEmail: string;           // Business contact email
  contactPhone: string;           // Business contact phone
}

// ============================================================================
// BOOKING FLOW TYPES
// ============================================================================

/**
 * Tracks the current state of the multi-step booking flow.
 * Used by the booking page to manage user progress.
 */
export interface BookingFlowState {
  step: 'service' | 'date' | 'time' | 'extras' | 'details' | 'review' | 'payment';
  selectedService: Service | null;      // Service chosen in step 1
  selectedDate: Date | null;            // Date chosen in step 2
  selectedTime: string | null;          // Time slot chosen in step 3
  selectedExtras: ServiceExtra[];       // Extras chosen in step 4
  clientDetails: ClientDetails | null;  // Details entered in step 5
  isHomeService: boolean;               // Whether home service was selected
  policyAcknowledged: boolean;          // Policy checkbox state in step 6
}

/**
 * Represents an available or unavailable time slot for booking.
 * Generated by the availability engine for a specific date/service combination.
 */
export interface TimeSlot {
  time: string;       // Time in 24h format (e.g., "09:00")
  isAvailable: boolean;  // Whether this slot can be booked
  reason?: string;    // If unavailable, explains why (e.g., "Already booked")
}

// ============================================================================
// PAYSTACK TYPES
// ============================================================================

/**
 * Response from Paystack transaction initialization API.
 * Contains the URL to redirect the client for payment.
 */
export interface PaystackInitResponse {
  status: boolean;    // Whether the request was successful
  message: string;    // Status message
  data: {
    authorization_url: string;  // URL to redirect client for payment
    access_code: string;        // Unique access code for this transaction
    reference: string;          // Our generated reference for tracking
  };
}

/**
 * Webhook payload received from Paystack after payment events.
 * Used to verify and process successful payments.
 * 
 * IMPORTANT: Always verify the webhook signature before processing!
 */
export interface PaystackWebhookEvent {
  event: string;  // Event type (e.g., "charge.success", "charge.failed")
  data: {
    id: number;                   // Paystack transaction ID
    domain: string;               // "test" or "live"
    status: string;               // Transaction status
    reference: string;            // Our reference (matches what we sent)
    amount: number;               // Amount in cents (divide by 100 for dollars)
    message: string | null;       // Status message
    gateway_response: string;     // Response from payment gateway
    paid_at: string;              // ISO timestamp of payment
    created_at: string;           // ISO timestamp of creation
    channel: string;              // Payment channel (e.g., "card")
    currency: string;             // Currency code (e.g., "CAD")
    ip_address: string;           // Client IP address
    metadata: {
      bookingId?: string;         // Our booking ID (if we sent it)
      serviceId?: string;         // Service ID
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
    };
    authorization: {
      authorization_code: string;
      bin: string;                // First 6 digits of card
      last4: string;              // Last 4 digits of card
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;              // Card brand (e.g., "visa")
      reusable: boolean;
      signature: string;
    };
  };
}
