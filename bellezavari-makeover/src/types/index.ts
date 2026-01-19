// Service Types
export interface ServiceExtra {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  depositAmount: number;
  durationMinutes: number;
  allowedStartTimes: string[]; // e.g., ["09:00", "11:00"]
  extras: ServiceExtra[];
  category: 'braids' | 'locs' | 'weaves' | 'natural' | 'other';
  imageUrl?: string;
  isActive: boolean;
}

// Booking Types
export interface BookingExtras {
  extraId: string;
  name: string;
  price: number;
}

export interface ClientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Booking {
  id: string;
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
  paymentReference: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  createdAt: Date;
  updatedAt: Date;
  policyAcknowledged: boolean;
}

// Settings Types
export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
}

export interface Settings {
  businessName: string;
  timezone: string;
  workingHours: WorkingHours[];
  offDays: string[]; // Specific dates like "2024-12-25"
  bufferMinutes: number;
  currency: string;
  currencySymbol: string;
  location: {
    address: string;
    city: string;
    postcode: string;
  };
  homeServiceFee: number;
  instagramUrl: string;
  contactEmail: string;
  contactPhone: string;
}

// Booking Flow State
export interface BookingFlowState {
  step: 'service' | 'date' | 'time' | 'extras' | 'details' | 'review' | 'payment';
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedExtras: ServiceExtra[];
  clientDetails: ClientDetails | null;
  isHomeService: boolean;
  policyAcknowledged: boolean;
}

// Time Slot
export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

// Paystack Types
export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      bookingId?: string;
      serviceId?: string;
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
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
  };
}
