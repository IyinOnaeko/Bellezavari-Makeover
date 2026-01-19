/**
 * Create Payment Function
 * 
 * This Netlify Function initializes a Paystack payment transaction.
 * It's called from the client when the user is ready to pay their deposit.
 * 
 * FLOW:
 * 1. Client submits booking form and clicks "Pay Deposit"
 * 2. Frontend calls this function with booking details
 * 3. We create a payment transaction with Paystack's API
 * 4. We return the authorization URL to the frontend
 * 5. Frontend redirects user to Paystack for payment
 * 
 * WHY USE A SERVER FUNCTION?
 * - The Paystack secret key must not be exposed in client-side code
 * - We can validate and sanitize the request before sending to Paystack
 * - We can add additional security checks (rate limiting, etc.)
 * 
 * PAYSTACK API DOCS:
 * https://paystack.com/docs/api/#transaction-initialize
 */

import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';

// Secret key from environment (NEVER expose this in client code!)
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Expected request body from the frontend.
 */
interface CreatePaymentRequest {
  email: string;      // Customer email (required by Paystack)
  amount: number;     // Amount in dollars (we convert to cents)
  bookingId: string;  // Our internal booking reference
  serviceId: string;  // Service being booked
  serviceName: string; // Human-readable service name
  clientName: string; // For Paystack metadata display
  extras?: Array<{ name: string; price: number }>; // Selected add-ons
}

/**
 * Response structure from Paystack's initialize endpoint.
 */
interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;  // URL to redirect user to
    access_code: string;        // Access code for inline payment
    reference: string;          // Transaction reference
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

/**
 * Main handler function for creating Paystack payments.
 * 
 * Returns an authorization URL that the frontend uses to redirect
 * the user to Paystack's payment page.
 */
export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Handle CORS preflight requests
  // This is needed for cross-origin requests from the frontend
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const body: CreatePaymentRequest = JSON.parse(event.body || '{}');
    const { email, amount, bookingId, serviceId, serviceName, clientName, extras } = body;

    // Validate required fields
    if (!email || !amount || !bookingId || !serviceId) {
      console.error('[Create Payment] Missing required fields:', { email: !!email, amount: !!amount, bookingId: !!bookingId, serviceId: !!serviceId });
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate a unique reference with our prefix for easy identification
    // Format: BEL_bookingId_timestamp
    const reference = `BEL_${bookingId}_${Date.now()}`;

    // Convert amount from dollars to cents (Paystack requirement)
    const amountInCents = Math.round(amount * 100);

    // Log the payment initialization
    console.log('[Create Payment] Initializing:', {
      reference,
      amount,
      amountInCents,
      email,
      bookingId,
      serviceName,
    });

    // Call Paystack's transaction initialize API
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInCents,
        currency: 'CAD',
        reference,
        // Callback URL - where Paystack redirects after payment
        callback_url: `${process.env.URL || 'https://bellezavari.com'}/book/success`,
        // Metadata - attached to the transaction for webhook processing
        metadata: {
          bookingId,
          serviceId,
          serviceName,
          clientName,
          extras: extras || [],
          // Custom fields appear on Paystack dashboard and receipts
          custom_fields: [
            {
              display_name: 'Service',
              variable_name: 'service',
              value: serviceName,
            },
            {
              display_name: 'Client',
              variable_name: 'client',
              value: clientName,
            },
          ],
        },
      }),
    });

    const data: PaystackInitResponse = await response.json();

    // Check if Paystack accepted the request
    if (!data.status) {
      console.error('[Create Payment] Paystack rejected request:', data.message);
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: data.message || 'Payment initialization failed' }),
      };
    }

    // Log successful initialization
    console.log('[Create Payment] Success:', {
      reference: data.data.reference,
      authUrl: data.data.authorization_url,
    });

    // Return the authorization details to the frontend
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        authorizationUrl: data.data.authorization_url,  // Redirect URL
        accessCode: data.data.access_code,              // For inline payment
        reference: data.data.reference,                 // Transaction reference
      }),
    };

  } catch (error) {
    console.error('[Create Payment] Error:', error);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
