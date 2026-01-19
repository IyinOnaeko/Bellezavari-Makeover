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

// Collection names
const BOOKINGS_COLLECTION = 'bookings';
const PROCESSED_PAYMENTS_COLLECTION = 'processedPayments';

// Convert Firestore document to Booking type
function docToBooking(doc: DocumentData): Booking {
  const data = doc;
  return {
    ...data,
    id: doc.id,
    startTime: data.startTime?.toDate() || new Date(data.startTime),
    endTime: data.endTime?.toDate() || new Date(data.endTime),
    createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
    updatedAt: data.updatedAt?.toDate() || new Date(data.updatedAt),
  } as Booking;
}

// Create a new booking
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
    startTime: Timestamp.fromDate(bookingData.startTime),
    endTime: Timestamp.fromDate(bookingData.endTime),
    paymentReference: '',
    paymentStatus: 'pending' as const,
    bookingStatus: 'pending' as const,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), booking);
  return docRef.id;
}

// Get booking by ID
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docToBooking({ id: docSnap.id, ...docSnap.data() });
}

// Get booking by payment reference
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

// Update booking status
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

  if (paymentReference) {
    updateData.paymentReference = paymentReference;
    updateData.paymentStatus = 'paid';
  }

  await updateDoc(docRef, updateData);
}

// Get bookings for a date range
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

// Get all confirmed bookings (for availability checking)
export async function getConfirmedBookings(): Promise<Booking[]> {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where('startTime', '>=', Timestamp.fromDate(now)),
    where('bookingStatus', 'in', ['confirmed', 'pending']),
    orderBy('startTime', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => docToBooking({ id: doc.id, ...doc.data() }));
}

// Get bookings for a specific date
export async function getBookingsForDate(date: Date): Promise<Booking[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getBookingsForDateRange(startOfDay, endOfDay);
}

// Check if payment reference has been processed (idempotency)
export async function isPaymentProcessed(reference: string): Promise<boolean> {
  const docRef = doc(db, PROCESSED_PAYMENTS_COLLECTION, reference);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

// Mark payment as processed
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

// Cancel a booking
export async function cancelBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'cancelled');
}

// Mark booking as completed
export async function completeBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'completed');
}

// Mark booking as no-show
export async function markNoShow(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'no-show');
}
