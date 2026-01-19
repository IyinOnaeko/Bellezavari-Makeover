# Bellezavari - Premium Hair Styling Booking Platform

A beautiful, modern booking platform for Bellezavari hair styling services in Toronto, Canada. Built with Next.js, Tailwind CSS, Firebase, and Paystack.

## Features

- ✨ **Premium Design** - Beautiful, mobile-first UI with elegant animations
- 📅 **Smart Booking** - Service-specific time slots with automatic availability checking
- ⏰ **Time Enforcement** - Long services (7+ hours) automatically limited to early start times
- 💳 **Paystack Integration** - Secure payment processing with webhooks
- 📧 **Automated Confirmations** - Payment-verified booking confirmations
- 🔒 **Non-Refundable Deposits** - Clear policy acknowledgment before payment
- 📱 **Admin Dashboard** - Schedule view with booking details

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Firebase Firestore
- **Payments**: Paystack
- **Hosting**: Netlify
- **Functions**: Netlify Functions (for webhooks)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Paystack account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IyinOnaeko/Bellezavari-Makeover.git
cd bellezavari-makeover
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx

# Site URL
URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bellezavari-makeover/
├── netlify/
│   └── functions/         # Serverless functions
│       ├── paystack-webhook.ts
│       └── create-payment.ts
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Home page
│   │   ├── services/      # Services listing
│   │   ├── book/          # Multi-step booking flow
│   │   ├── gallery/       # Portfolio gallery
│   │   ├── about/         # About page
│   │   ├── policies/      # Booking policies
│   │   └── admin/         # Admin schedule view
│   ├── components/        # Reusable components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── data/              # Static data
│   │   ├── services.ts    # Service catalog
│   │   └── settings.ts    # Business settings
│   ├── lib/               # Utilities
│   │   ├── availability.ts
│   │   ├── db.ts
│   │   ├── firebase.ts
│   │   ├── paystack.ts
│   │   └── utils.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── netlify.toml           # Netlify configuration
└── package.json
```

## Configuration

### Service Catalog

Edit `src/data/services.ts` to customize:
- Service names, descriptions, and prices
- Duration in minutes
- Deposit amounts
- **Allowed start times** (critical for time enforcement)

Example:
```typescript
{
  id: 'knotless-braids-small',
  name: 'Small Knotless Braids',
  price: 280,
  depositAmount: 100,
  durationMinutes: 480, // 8 hours
  allowedStartTimes: ['09:00'], // Only 9 AM start allowed
  // ...
}
```

### Business Settings

Edit `src/data/settings.ts` to customize:
- Working hours
- Off days (holidays)
- Buffer time between appointments
- Location
- Contact information

### Booking Rules

The availability engine (`src/lib/availability.ts`) automatically enforces:
1. Service-specific start times
2. Working hours constraints
3. Existing booking conflicts
4. Buffer time between appointments

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Set up Paystack webhook URL: `https://your-site.netlify.app/.netlify/functions/paystack-webhook`

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Create the following collections:
   - `bookings`
   - `processedPayments`
4. Set up Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{booking} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null; // Only server can update
    }
    match /processedPayments/{payment} {
      allow read, write: if request.auth != null; // Only server
    }
  }
}
```

### Paystack Setup

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your API keys from Settings > API Keys & Webhooks
3. Set webhook URL to: `https://your-site.netlify.app/.netlify/functions/paystack-webhook`
4. Enable test mode for development

## Booking Flow

1. **Service Selection** - Client chooses a service
2. **Date Selection** - Calendar shows available dates
3. **Time Selection** - Only valid start times shown (based on service duration)
4. **Extras Selection** - Optional add-ons (home service, hair, etc.)
5. **Client Details** - Name, email, phone
6. **Review** - Summary with policy acknowledgment checkbox
7. **Payment** - Paystack checkout for deposit
8. **Confirmation** - Webhook verifies payment, booking confirmed

## Key Features Explained

### Time Enforcement

Long services (7+ hours) are automatically restricted to early start times:
- 8-9 hour services: 9:00 AM only
- 6-7 hour services: 9:00 AM or 11:00 AM
- Shorter services: More flexibility

This prevents clients from booking long services late in the day.

### Non-Refundable Deposits

- Deposit amount shown clearly during booking
- Required checkbox acknowledgment before payment
- Policies page explains all terms
- No booking created until payment confirmed via webhook

### Automated Flow

- No accept/decline required from stylist
- Payment + availability = automatic confirmation
- Webhook creates booking only after payment success
- Idempotency prevents duplicate bookings

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Future Enhancements

- [ ] Email confirmation via SendGrid/Resend
- [ ] SMS/WhatsApp reminders
- [ ] Admin authentication
- [ ] Booking modifications
- [ ] Analytics dashboard
- [ ] Multi-stylist support

## License

Private - All rights reserved

## Support

For questions or support, contact [hello@bellezavari.com](mailto:hello@bellezavari.com)
