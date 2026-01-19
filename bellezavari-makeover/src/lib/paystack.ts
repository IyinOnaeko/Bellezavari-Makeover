import { generateId } from './utils';

// Paystack configuration
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo/pesewas (smallest currency unit)
  currency?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  channels?: string[];
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

export interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  trxref: string;
}

// Initialize Paystack payment
export function initializePaystackPayment(config: PaystackConfig): void {
  if (typeof window === 'undefined') return;

  // Load Paystack script if not already loaded
  const existingScript = document.getElementById('paystack-script');
  
  if (!existingScript) {
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      openPaystackPopup(config);
    };
  } else {
    openPaystackPopup(config);
  }
}

function openPaystackPopup(config: PaystackConfig): void {
  const PaystackPop = (window as unknown as { PaystackPop: { setup: (config: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop;
  
  if (!PaystackPop) {
    console.error('Paystack script not loaded');
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'GBP',
    ref: config.reference || generatePaystackReference(),
    metadata: config.metadata || {},
    channels: config.channels || ['card', 'bank'],
    callback: config.callback,
    onClose: config.onClose,
  });

  handler.openIframe();
}

// Generate a unique Paystack reference
export function generatePaystackReference(): string {
  return `BEL_${generateId()}`;
}

// Verify payment via API (server-side only)
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
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      return { success: true, data: data.data };
    }

    return { success: false, error: data.message || 'Payment verification failed' };
  } catch (error) {
    console.error('Paystack verification error:', error);
    return { success: false, error: 'Failed to verify payment' };
  }
}

// Calculate amount in smallest currency unit (for GBP, it's pence)
export function toPence(amount: number): number {
  return Math.round(amount * 100);
}

// Convert from pence to pounds
export function fromPence(amount: number): number {
  return amount / 100;
}
