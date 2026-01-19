/**
 * Service Catalog
 * 
 * This file defines all hair styling services offered by Bellezavari.
 * 
 * CRITICAL BUSINESS RULE - TIME ENFORCEMENT:
 * The `allowedStartTimes` array controls when a service can be booked.
 * This is how we prevent clients from booking long services late in the day:
 * 
 * - 8-9 hour services: ["09:00"] - Must start at 9 AM only
 * - 6-7 hour services: ["09:00", "11:00"] - Can start at 9 AM or 11 AM
 * - 4-5 hour services: ["09:00", "11:00", "13:00"] - More flexibility
 * - Under 4 hours: Multiple time slots available throughout the day
 * 
 * This ensures all services complete within business hours without
 * requiring the stylist to work overtime.
 */

import { Service } from '@/types';

/**
 * Main service catalog array.
 * Each service includes pricing in CAD, duration, and allowed start times.
 * 
 * To add a new service:
 * 1. Choose a unique id (lowercase, hyphenated)
 * 2. Set the price and deposit (deposit is typically 35-40% of price)
 * 3. Estimate duration carefully - this affects available time slots
 * 4. Set allowedStartTimes based on duration (see rules above)
 * 5. Assign to appropriate category
 */
export const services: Service[] = [
  // =========================================================================
  // BRAIDS CATEGORY
  // These services range from 3-8 hours depending on size/complexity
  // =========================================================================
  {
    id: 'knotless-braids-small',
    name: 'Small Knotless Braids',
    description: 'Lightweight, natural-looking small knotless braids. Perfect for a neat, long-lasting protective style. Includes consultation, wash, and styling.',
    price: 350,              // Full service price in CAD
    depositAmount: 125,      // ~36% deposit - non-refundable
    durationMinutes: 480,    // 8 hours - this is a full day service
    allowedStartTimes: ['09:00'], // LONG SERVICE: 9 AM start only
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'knotless-braids-medium',
    name: 'Medium Knotless Braids',
    description: 'Classic medium-sized knotless braids for a versatile look. Gentle on edges, easy to style. Includes consultation, wash, and styling.',
    price: 280,
    depositAmount: 100,
    durationMinutes: 360,    // 6 hours
    allowedStartTimes: ['09:00', '11:00'], // MEDIUM SERVICE: Two early options
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'knotless-braids-large',
    name: 'Large Knotless Braids',
    description: 'Bold, chunky knotless braids for a statement look. Quick installation with maximum impact. Includes consultation, wash, and styling.',
    price: 200,
    depositAmount: 75,
    durationMinutes: 240,    // 4 hours
    allowedStartTimes: ['09:00', '11:00', '13:00'], // SHORTER SERVICE: More flexibility
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'box-braids-small',
    name: 'Small Box Braids',
    description: 'Traditional small box braids for a timeless protective style. Durable and long-lasting. Includes consultation, wash, and styling.',
    price: 325,
    depositAmount: 125,
    durationMinutes: 480,    // 8 hours
    allowedStartTimes: ['09:00'], // LONG SERVICE: 9 AM start only
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'box-braids-medium',
    name: 'Medium Box Braids',
    description: 'Classic medium box braids. Versatile and easy to maintain. Includes consultation, wash, and styling.',
    price: 250,
    depositAmount: 100,
    durationMinutes: 360,    // 6 hours
    allowedStartTimes: ['09:00', '11:00'],
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'cornrows-feed-in',
    name: 'Feed-in Cornrows',
    description: 'Sleek feed-in cornrows with a natural, seamless finish. Choice of straight back or custom pattern. Includes consultation and wash.',
    price: 150,
    depositAmount: 60,
    durationMinutes: 180,    // 3 hours - shorter service
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'], // Many options available
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'stitch-braids',
    name: 'Stitch Braids',
    description: 'Trendy stitch braids with defined parts for a clean, modern look. Various patterns available. Includes consultation and wash.',
    price: 175,
    depositAmount: 75,
    durationMinutes: 240,    // 4 hours
    allowedStartTimes: ['09:00', '11:00', '13:00'],
    extras: [],
    category: 'braids',
    isActive: true,
  },

  // =========================================================================
  // LOCS CATEGORY
  // These services are typically the longest (7-9 hours)
  // ALL loc services should have limited start times
  // =========================================================================
  {
    id: 'faux-locs-small',
    name: 'Small Faux Locs',
    description: 'Authentic-looking small faux locs. Lightweight and stylish. Perfect for those wanting the loc look without commitment. Includes consultation and wash.',
    price: 375,
    depositAmount: 150,
    durationMinutes: 540,    // 9 hours - longest service
    allowedStartTimes: ['09:00'], // VERY LONG: 9 AM only, will finish around 6 PM
    extras: [],
    category: 'locs',
    isActive: true,
  },
  {
    id: 'faux-locs-medium',
    name: 'Medium Faux Locs',
    description: 'Beautiful medium faux locs for a natural, bohemian vibe. Includes consultation, wash, and styling.',
    price: 300,
    depositAmount: 125,
    durationMinutes: 420,    // 7 hours
    allowedStartTimes: ['09:00'], // LONG SERVICE: 9 AM start only
    extras: [],
    category: 'locs',
    isActive: true,
  },
  {
    id: 'butterfly-locs',
    name: 'Butterfly Locs',
    description: 'Trendy distressed butterfly locs with a bohemian, lived-in look. Lightweight and gorgeous. Includes consultation and wash.',
    price: 325,
    depositAmount: 125,
    durationMinutes: 420,    // 7 hours
    allowedStartTimes: ['09:00'], // LONG SERVICE: 9 AM start only
    extras: [],
    category: 'locs',
    isActive: true,
  },
  {
    id: 'soft-locs',
    name: 'Soft Locs',
    description: 'Soft, lightweight locs with a natural wrapped finish. Comfortable and stylish. Includes consultation and wash.',
    price: 310,
    depositAmount: 125,
    durationMinutes: 420,    // 7 hours
    allowedStartTimes: ['09:00'], // LONG SERVICE: 9 AM start only
    extras: [],
    category: 'locs',
    isActive: true,
  },

  // =========================================================================
  // WEAVES & WIGS CATEGORY
  // These services are typically 2.5-5 hours
  // =========================================================================
  {
    id: 'sew-in-weave',
    name: 'Full Sew-in Weave',
    description: 'Professional full sew-in weave installation. Includes braided base, sew-in, and styling. Bring your own hair or purchase from us.',
    price: 225,
    depositAmount: 90,
    durationMinutes: 300,    // 5 hours
    allowedStartTimes: ['09:00', '11:00'],
    extras: [],
    category: 'weaves',
    isActive: true,
  },
  {
    id: 'frontal-install',
    name: 'Frontal Wig Install',
    description: 'Flawless lace frontal wig installation. Includes customization, bleaching knots, and baby hair styling. Bring your own wig.',
    price: 185,
    depositAmount: 75,
    durationMinutes: 180,    // 3 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'weaves',
    isActive: true,
  },
  {
    id: 'closure-install',
    name: 'Closure Wig Install',
    description: 'Professional closure wig installation with a natural finish. Includes customization and styling. Bring your own wig.',
    price: 150,
    depositAmount: 60,
    durationMinutes: 150,    // 2.5 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'weaves',
    isActive: true,
  },

  // =========================================================================
  // NATURAL HAIR CATEGORY
  // These are shorter services (1.5-2.5 hours) with most flexibility
  // =========================================================================
  {
    id: 'twist-out',
    name: 'Twist Out Styling',
    description: 'Beautiful twist out on natural hair. Includes deep conditioning treatment, twisting, and styling. Perfect for natural hair lovers.',
    price: 100,
    depositAmount: 50,
    durationMinutes: 120,    // 2 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00', '15:00'], // Short service, flexible
    extras: [],
    category: 'natural',
    isActive: true,
  },
  {
    id: 'silk-press',
    name: 'Silk Press',
    description: 'Sleek, bouncy silk press for natural hair. Includes wash, deep condition, blow dry, and flat iron. Heat protection included.',
    price: 115,
    depositAmount: 50,
    durationMinutes: 150,    // 2.5 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'natural',
    isActive: true,
  },
  {
    id: 'wash-style',
    name: 'Wash & Style',
    description: 'Refreshing wash and style service. Includes shampoo, condition, detangle, and style of choice. Perfect maintenance appointment.',
    price: 75,
    depositAmount: 35,
    durationMinutes: 90,     // 1.5 hours - shortest service
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00', '15:00', '16:00'], // Most flexible
    extras: [],
    category: 'natural',
    isActive: true,
  },
];

/**
 * Global extras available for all services.
 * These are add-ons that clients can select during booking.
 * They are paid upfront with the deposit to avoid unpaid balances.
 */
export const globalExtras = [
  {
    id: 'home-service',
    name: 'Home Service',
    price: 75,
    description: 'Stylist travels to your location within the Greater Toronto Area',
  },
  {
    id: 'hair-provided',
    name: 'Hair Provided',
    price: 50,
    description: 'Premium quality braiding/loc hair included',
  },
  {
    id: 'takedown',
    name: 'Takedown Service',
    price: 40,
    description: 'Professional removal of previous style before new installation',
  },
  {
    id: 'deep-condition',
    name: 'Deep Conditioning Treatment',
    price: 30,
    description: 'Intensive moisture treatment for healthier hair',
  },
  {
    id: 'edge-control-kit',
    name: 'Edge Control Kit',
    price: 20,
    description: 'Premium edge control products to take home',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Retrieves a service by its unique ID.
 * Returns undefined if no service found.
 */
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

/**
 * Gets all active services in a specific category.
 * Used by the Services page for category filtering.
 */
export const getServicesByCategory = (category: Service['category']): Service[] => {
  return services.filter(service => service.category === category && service.isActive);
};

/**
 * Gets all services that are currently active.
 * Inactive services won't appear on the website.
 */
export const getActiveServices = (): Service[] => {
  return services.filter(service => service.isActive);
};

/**
 * Human-readable names for each service category.
 * Used for display in the UI.
 */
export const categoryNames: Record<Service['category'], string> = {
  braids: 'Braids',
  locs: 'Locs & Faux Locs',
  weaves: 'Weaves & Wigs',
  natural: 'Natural Hair',
  other: 'Other Services',
};
