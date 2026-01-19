/**
 * Paystack Payment Integration
 * 
 * This module handles client-side Paystack integration for processing deposits.
 * Paystack is a payment processor popular in Africa and increasingly used in Canada.
 * 
 * PAYMENT FLOW:
 * 1. Client completes booking form and clicks "Pay Deposit"
 * 2. We initialize Paystack with the deposit amount and booking details
 * 3. Paystack opens a popup/redirect for card payment
 * 4. On success, Paystack redirects to our success page
 * 5. Paystack sends a webhook to our server to confirm payment
 * 6. Webhook verifies payment and confirms the booking
 * 
 * IMPORTANT: Never trust client-side payment confirmation alone!
 * Always wait for the webhook to verify payment before confirming bookings.
 * 
 * SECURITY:
 * - Public key is safe to expose (client-side)
 * - Secret key must NEVER be in client code (server-side only)
 * - Always verify webhook signatures
 */

import { generateId } from './utils';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Paystack public key from environment variables.
 * This is safe to expose on the client side.
 * Get this from: Paystack Dashboard > Settings > API Keys & Webhooks
 */
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration options for initializing a Paystack payment.
 */
export interface PaystackConfig {
  email: string;              // Customer email (required by Paystack)
  amount: number;             // Amount in cents (multiply dollars by 100)
  currency?: string;          // Currency code (default: CAD)
  reference?: string;         // Our unique reference for this transaction
  metadata?: Record<string, unknown>;  // Additional data to attach to transaction
  channels?: string[];        // Allowed payment channels (card, bank, etc.)
  callback?: (response: PaystackResponse) => void;  // Called on success
  onClose?: () => void;       // Called when popup is closed
}

/**
 * Response returned by Paystack after successful payment.
 */
export interface PaystackResponse {
  reference: string;    // Our reference (matches what we sent)
  status: string;       // Payment status
  trans: string;        // Paystack transaction ID
  transaction: string;  // Another transaction identifier
  message: string;      // Status message
  trxref: string;       // Transaction reference
}

// ============================================================================
// PAYMENT INITIALIZATION
// ============================================================================

/**
 * Initializes and opens the Paystack payment popup.
 * 
 * This function:
 * 1. Loads the Paystack script if not already loaded
 * 2. Configures the payment with our options
 * 3. Opens the payment popup
 * 
 * @param config - Payment configuration options
 */
export function initializePaystackPayment(config: PaystackConfig): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Check if Paystack script is already loaded
  const existingScript = document.getElementById('paystack-script');
  
  if (!existingScript) {
    // Dynamically load the Paystack inline script
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Open popup once script is loaded
    script.onload = () => {
      openPaystackPopup(config);
    };
  } else {
    // Script already loaded, open popup directly
    openPaystackPopup(config);
  }
}

/**
 * Internal function to open the Paystack payment popup.
 * Called after ensuring the Paystack script is loaded.
 * 
 * @param config - Payment configuration options
 */
function openPaystackPopup(config: PaystackConfig): void {
  // Get the PaystackPop object from the global window
  const PaystackPop = (window as unknown as { 
    PaystackPop: { 
      setup: (config: Record<string, unknown>) => { openIframe: () => void } 
    } 
  }).PaystackPop;
  
  if (!PaystackPop) {
    console.error('Paystack script not loaded');
    return;
  }

  // Configure and open the payment handler
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'CAD',
    ref: config.reference || generatePaystackReference(),
    metadata: config.metadata || {},
    channels: config.channels || ['card', 'bank'],
    callback: config.callback,
    onClose: config.onClose,
  });

  handler.openIframe();
}

// ============================================================================
// REFERENCE GENERATION
// ============================================================================

/**
 * Generates a unique payment reference with our prefix.
 * The prefix helps identify our transactions in the Paystack dashboard.
 * 
 * Format: BEL_1710518400000-x7k2m9p3q
 * 
 * @returns Unique reference string
 */
export function generatePaystackReference(): string {
  return `BEL_${generateId()}`;
}

// ============================================================================
// SERVER-SIDE VERIFICATION
// These functions should only be called from server-side code (API routes/functions)
// ============================================================================

/**
 * Verifies a payment transaction with Paystack's API.
 * 
 * IMPORTANT: This is a SERVER-SIDE ONLY function.
 * It requires the secret key which must never be exposed to clients.
 * 
 * Call this from Netlify Functions, not from React components.
 * 
 * @param reference - The transaction reference to verify
 * @returns Object with success status and transaction data
 */
export async function verifyPaystackPayment(reference: string): Promise<{
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  
  if (!secretKey) {
    return { success: false, error: 'Paystack secret key not configured' };
  }

  try {
    // Call Paystack's verification API
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    // Check if payment was successful
    if (data.status && data.data.status === 'success') {
      return { success: true, data: data.data };
    }

    return { success: false, error: data.message || 'Payment verification failed' };
  } catch (error) {
    console.error('Paystack verification error:', error);
    return { success: false, error: 'Failed to verify payment' };
  }
}

// ============================================================================
// CURRENCY CONVERSION HELPERS
// Paystack uses smallest currency unit (cents for CAD)
// ============================================================================

/**
 * Converts a dollar amount to cents for Paystack.
 * Paystack requires amounts in the smallest currency unit.
 * 
 * Example: toPence(125) -> 12500 (for $125.00)
 * 
 * @param amount - Amount in dollars
 * @returns Amount in cents
 */
export function toPence(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converts cents back to dollars.
 * Used when displaying amounts from Paystack responses.
 * 
 * Example: fromPence(12500) -> 125 (for $125.00)
 * 
 * @param amount - Amount in cents
 * @returns Amount in dollars
 */
export function fromPence(amount: number): number {
  return amount / 100;
}
