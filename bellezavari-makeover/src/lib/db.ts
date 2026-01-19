/**
 * Database Service (Firestore)
 * 
 * This module handles all database operations for the booking system.
 * It uses Firebase Firestore as the database, which is:
 * - NoSQL document database
 * - Real-time capable
 * - Serverless (no database management required)
 * - Free tier available (Spark plan)
 * 
 * COLLECTIONS:
 * - bookings: Stores all appointment bookings
 * - processedPayments: Tracks processed payment references for idempotency
 * 
 * IMPORTANT: Firestore security rules should be configured to:
 * - Allow clients to create bookings (pending status only)
 * - Only allow server (webhook) to confirm bookings
 * - Prevent direct modification of payment-related fields
 */

import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Booking, ClientDetails, BookingExtras } from '@/types';

// ============================================================================
// COLLECTION NAMES
// Using constants to avoid typos and enable easy renaming
// ============================================================================

const BOOKINGS_COLLECTION = 'bookings';
const PROCESSED_PAYMENTS_COLLECTION = 'processedPayments';

// ============================================================================
// TYPE CONVERSION HELPERS
// ============================================================================

/**
 * Converts a Firestore document to a Booking type.
 * Firestore stores dates as Timestamps, which need conversion to JS Date objects.
 * 
 * @param doc - Firestore document data
 * @returns Properly typed Booking object
 */
function docToBooking(doc: DocumentData): Booking {
  const data = doc;
  return {
    ...data,
    id: doc.id,
    // Convert Firestore Timestamps to JavaScript Dates
    startTime: data.startTime?.toDate() || new Date(data.startTime),
    endTime: data.endTime?.toDate() || new Date(data.endTime),
    createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate() || new Date(data.updatedAt),
  } as Booking;
}

// ============================================================================
// BOOKING CRUD OPERATIONS
// ============================================================================

/**
 * Creates a new booking in the database.
 * Called after a client completes the booking form but BEFORE payment.
 * The booking is created with 'pending' status until payment is confirmed.
 * 
 * @param bookingData - Booking information from the form
 * @returns The Firestore document ID of the created booking
 */
export async function createBooking(bookingData: {
  serviceId: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  client: ClientDetails;
  extras: BookingExtras[];
  subtotal: number;
  extrasTotal: number;
  depositAmount: number;
  totalPaid: number;
  balanceDue: number;
  policyAcknowledged: boolean;
}): Promise<string> {
  const booking = {
    ...bookingData,
    // Convert JS Dates to Firestore Timestamps for proper storage
    startTime: Timestamp.fromDate(bookingData.startTime),
    endTime: Timestamp.fromDate(bookingData.endTime),
    // Initialize payment/status fields
    paymentReference: '',
    paymentStatus: 'pending' as const,
    bookingStatus: 'pending' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), booking);
  return docRef.id;
}

/**
 * Retrieves a booking by its Firestore document ID.
 * 
 * @param bookingId - The Firestore document ID
 * @returns The Booking object, or null if not found
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docToBooking({ id: docSnap.id, ...docSnap.data() });
}

/**
 * Finds a booking by its Paystack payment reference.
 * Used by the webhook to find which booking to confirm after payment.
 * 
 * @param reference - The Paystack transaction reference
 * @returns The Booking object, or null if not found
 */
export async function getBookingByPaymentRef(reference: string): Promise<Booking | null> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('paymentReference', '==', reference)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return docToBooking({ id: doc.id, ...doc.data() });
}

/**
 * Updates a booking's status.
 * Called by the webhook after successful payment, or by admin for status changes.
 * 
 * @param bookingId - The Firestore document ID
 * @param status - New booking status
 * @param paymentReference - Optional Paystack reference (set on payment confirmation)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: Booking['bookingStatus'],
  paymentReference?: string
): Promise<void> {
  const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
  
  const updateData: Record<string, unknown> = {
    bookingStatus: status,
    updatedAt: Timestamp.now(),
  };

  // If confirming payment, also update payment fields
  if (paymentReference) {
    updateData.paymentReference = paymentReference;
    updateData.paymentStatus = 'paid';
  }

  await updateDoc(docRef, updateData);
}

// ============================================================================
// BOOKING QUERIES
// These functions retrieve bookings for availability checking and admin views
// ============================================================================

/**
 * Gets all bookings within a date range.
 * Used by the admin schedule view.
 * 
 * @param startDate - Start of range (inclusive)
 * @param endDate - End of range (inclusive)
 * @returns Array of bookings sorted by start time
 */
export async function getBookingsForDateRange(
  startDate: Date,
  endDate: Date
): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate)),
    where('bookingStatus', 'in', ['confirmed', 'pending']),
    orderBy('startTime', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToBooking({ id: doc.id, ...doc.data() }));
}

/**
 * Gets all confirmed/pending bookings from today onwards.
 * Used by the availability engine to check for conflicts.
 * 
 * @returns Array of future bookings
 */
export async function getConfirmedBookings(): Promise<Booking[]> {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('startTime', '>=', Timestamp.fromDate(now)),
    where('bookingStatus', 'in', ['confirmed', 'pending']),
    orderBy('startTime', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToBooking({ id: doc.id, ...doc.data() }));
}

/**
 * Gets all bookings for a specific date.
 * Convenience wrapper around getBookingsForDateRange.
 * 
 * @param date - The date to query
 * @returns Array of bookings on that date
 */
export async function getBookingsForDate(date: Date): Promise<Booking[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getBookingsForDateRange(startOfDay, endOfDay);
}

// ============================================================================
// IDEMPOTENCY HELPERS
// These functions prevent duplicate booking confirmations from webhook retries
// ============================================================================

/**
 * Checks if a payment reference has already been processed.
 * This prevents the webhook from creating duplicate bookings if Paystack
 * sends the same event multiple times (which can happen).
 * 
 * @param reference - The Paystack transaction reference
 * @returns True if this reference was already processed
 */
export async function isPaymentProcessed(reference: string): Promise<boolean> {
  const docRef = doc(db, PROCESSED_PAYMENTS_COLLECTION, reference);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

/**
 * Records that a payment reference has been processed.
 * Call this immediately after confirming a booking via webhook.
 * 
 * @param reference - The Paystack transaction reference
 * @param bookingId - The booking that was confirmed
 */
export async function markPaymentProcessed(
  reference: string,
  bookingId: string
): Promise<void> {
  const docRef = doc(db, PROCESSED_PAYMENTS_COLLECTION, reference);
  await updateDoc(docRef, {
    bookingId,
    processedAt: Timestamp.now(),
  }).catch(async () => {
    // If doc doesn't exist, create it
    await addDoc(collection(db, PROCESSED_PAYMENTS_COLLECTION), {
      reference,
      bookingId,
      processedAt: Timestamp.now(),
    });
  });
}

// ============================================================================
// BOOKING STATUS ACTIONS
// Convenience functions for common status updates
// ============================================================================

/**
 * Cancels a booking.
 * Note: This does NOT trigger a refund - deposits are non-refundable.
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'cancelled');
}

/**
 * Marks a booking as completed (service was delivered).
 */
export async function completeBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'completed');
}

/**
 * Marks a booking as a no-show (client didn't arrive).
 * Deposit is forfeited per policy.
 */
export async function markNoShow(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'no-show');
}
