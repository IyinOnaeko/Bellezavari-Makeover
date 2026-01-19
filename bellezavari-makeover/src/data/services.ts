import { Service } from '@/types';

// Service catalog with time enforcement rules
// Long services (7+ hours) only allow early start times (9:00 AM)
// Medium services allow 9:00 AM or 11:00 AM
// Short services have more flexibility

export const services: Service[] = [
  // BRAIDS CATEGORY
  {
    id: 'knotless-braids-small',
    name: 'Small Knotless Braids',
    description: 'Lightweight, natural-looking small knotless braids. Perfect for a neat, long-lasting protective style. Includes consultation, wash, and styling.',
    price: 280,
    depositAmount: 100,
    durationMinutes: 480, // 8 hours
    allowedStartTimes: ['09:00'], // Long service - early start only
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'knotless-braids-medium',
    name: 'Medium Knotless Braids',
    description: 'Classic medium-sized knotless braids for a versatile look. Gentle on edges, easy to style. Includes consultation, wash, and styling.',
    price: 220,
    depositAmount: 80,
    durationMinutes: 360, // 6 hours
    allowedStartTimes: ['09:00', '11:00'], // Medium service
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'knotless-braids-large',
    name: 'Large Knotless Braids',
    description: 'Bold, chunky knotless braids for a statement look. Quick installation with maximum impact. Includes consultation, wash, and styling.',
    price: 160,
    depositAmount: 60,
    durationMinutes: 240, // 4 hours
    allowedStartTimes: ['09:00', '11:00', '13:00'], // Shorter service
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'box-braids-small',
    name: 'Small Box Braids',
    description: 'Traditional small box braids for a timeless protective style. Durable and long-lasting. Includes consultation, wash, and styling.',
    price: 260,
    depositAmount: 100,
    durationMinutes: 480, // 8 hours
    allowedStartTimes: ['09:00'], // Long service - early start only
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'box-braids-medium',
    name: 'Medium Box Braids',
    description: 'Classic medium box braids. Versatile and easy to maintain. Includes consultation, wash, and styling.',
    price: 200,
    depositAmount: 80,
    durationMinutes: 360, // 6 hours
    allowedStartTimes: ['09:00', '11:00'],
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'cornrows-feed-in',
    name: 'Feed-in Cornrows',
    description: 'Sleek feed-in cornrows with a natural, seamless finish. Choice of straight back or custom pattern. Includes consultation and wash.',
    price: 120,
    depositAmount: 50,
    durationMinutes: 180, // 3 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'braids',
    isActive: true,
  },
  {
    id: 'stitch-braids',
    name: 'Stitch Braids',
    description: 'Trendy stitch braids with defined parts for a clean, modern look. Various patterns available. Includes consultation and wash.',
    price: 140,
    depositAmount: 60,
    durationMinutes: 240, // 4 hours
    allowedStartTimes: ['09:00', '11:00', '13:00'],
    extras: [],
    category: 'braids',
    isActive: true,
  },

  // LOCS CATEGORY
  {
    id: 'faux-locs-small',
    name: 'Small Faux Locs',
    description: 'Authentic-looking small faux locs. Lightweight and stylish. Perfect for those wanting the loc look without commitment. Includes consultation and wash.',
    price: 300,
    depositAmount: 120,
    durationMinutes: 540, // 9 hours
    allowedStartTimes: ['09:00'], // Very long service - early start only
    extras: [],
    category: 'locs',
    isActive: true,
  },
  {
    id: 'faux-locs-medium',
    name: 'Medium Faux Locs',
    description: 'Beautiful medium faux locs for a natural, bohemian vibe. Includes consultation, wash, and styling.',
    price: 240,
    depositAmount: 100,
    durationMinutes: 420, // 7 hours
    allowedStartTimes: ['09:00'], // Long service - early start only
    extras: [],
    category: 'locs',
    isActive: true,
  },
  {
    id: 'butterfly-locs',
    name: 'Butterfly Locs',
    description: 'Trendy distressed butterfly locs with a bohemian, lived-in look. Lightweight and gorgeous. Includes consultation and wash.',
    price: 260,
    depositAmount: 100,
    durationMinutes: 420, // 7 hours
    allowedStartTimes: ['09:00'], // Long service - early start only
    extras: [],
    category: 'locs',
    isActive: true,
  },
  {
    id: 'soft-locs',
    name: 'Soft Locs',
    description: 'Soft, lightweight locs with a natural wrapped finish. Comfortable and stylish. Includes consultation and wash.',
    price: 250,
    depositAmount: 100,
    durationMinutes: 420, // 7 hours
    allowedStartTimes: ['09:00'], // Long service - early start only
    extras: [],
    category: 'locs',
    isActive: true,
  },

  // WEAVES & WIGS CATEGORY
  {
    id: 'sew-in-weave',
    name: 'Full Sew-in Weave',
    description: 'Professional full sew-in weave installation. Includes braided base, sew-in, and styling. Bring your own hair or purchase from us.',
    price: 180,
    depositAmount: 70,
    durationMinutes: 300, // 5 hours
    allowedStartTimes: ['09:00', '11:00'],
    extras: [],
    category: 'weaves',
    isActive: true,
  },
  {
    id: 'frontal-install',
    name: 'Frontal Wig Install',
    description: 'Flawless lace frontal wig installation. Includes customization, bleaching knots, and baby hair styling. Bring your own wig.',
    price: 150,
    depositAmount: 60,
    durationMinutes: 180, // 3 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'weaves',
    isActive: true,
  },
  {
    id: 'closure-install',
    name: 'Closure Wig Install',
    description: 'Professional closure wig installation with a natural finish. Includes customization and styling. Bring your own wig.',
    price: 120,
    depositAmount: 50,
    durationMinutes: 150, // 2.5 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'weaves',
    isActive: true,
  },

  // NATURAL HAIR CATEGORY
  {
    id: 'twist-out',
    name: 'Twist Out Styling',
    description: 'Beautiful twist out on natural hair. Includes deep conditioning treatment, twisting, and styling. Perfect for natural hair lovers.',
    price: 80,
    depositAmount: 40,
    durationMinutes: 120, // 2 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00', '15:00'],
    extras: [],
    category: 'natural',
    isActive: true,
  },
  {
    id: 'silk-press',
    name: 'Silk Press',
    description: 'Sleek, bouncy silk press for natural hair. Includes wash, deep condition, blow dry, and flat iron. Heat protection included.',
    price: 90,
    depositAmount: 40,
    durationMinutes: 150, // 2.5 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00'],
    extras: [],
    category: 'natural',
    isActive: true,
  },
  {
    id: 'wash-style',
    name: 'Wash & Style',
    description: 'Refreshing wash and style service. Includes shampoo, condition, detangle, and style of choice. Perfect maintenance appointment.',
    price: 60,
    depositAmount: 30,
    durationMinutes: 90, // 1.5 hours
    allowedStartTimes: ['09:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    extras: [],
    category: 'natural',
    isActive: true,
  },
];

// Global extras available for all services
export const globalExtras = [
  {
    id: 'home-service',
    name: 'Home Service',
    price: 50,
    description: 'Stylist travels to your location within service area',
  },
  {
    id: 'hair-provided',
    name: 'Hair Provided',
    price: 40,
    description: 'Premium quality braiding/loc hair included',
  },
  {
    id: 'takedown',
    name: 'Takedown Service',
    price: 30,
    description: 'Professional removal of previous style before new installation',
  },
  {
    id: 'deep-condition',
    name: 'Deep Conditioning Treatment',
    price: 25,
    description: 'Intensive moisture treatment for healthier hair',
  },
  {
    id: 'edge-control-kit',
    name: 'Edge Control Kit',
    price: 15,
    description: 'Premium edge control products to take home',
  },
];

// Helper function to get service by ID
export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

// Helper function to get services by category
export const getServicesByCategory = (category: Service['category']): Service[] => {
  return services.filter(service => service.category === category && service.isActive);
};

// Helper function to get all active services
export const getActiveServices = (): Service[] => {
  return services.filter(service => service.isActive);
};

// Category display names
export const categoryNames: Record<Service['category'], string> = {
  braids: 'Braids',
  locs: 'Locs & Faux Locs',
  weaves: 'Weaves & Wigs',
  natural: 'Natural Hair',
  other: 'Other Services',
};
