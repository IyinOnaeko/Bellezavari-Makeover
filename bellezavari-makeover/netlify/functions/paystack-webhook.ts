/**
 * Paystack Webhook Handler
 * 
 * This Netlify Function receives webhook events from Paystack when payment
 * events occur (success, failure, etc.). This is the CRITICAL path for
 * confirming bookings after payment.
 * 
 * WEBHOOK FLOW:
 * 1. Client pays deposit via Paystack
 * 2. Paystack sends POST request to this endpoint with event details
 * 3. We verify the webhook signature to ensure it's from Paystack
 * 4. We check idempotency to prevent duplicate processing
 * 5. If payment successful, we confirm the booking in Firestore
 * 6. We send confirmation email to the client
 * 
 * SECURITY CONSIDERATIONS:
 * - ALWAYS verify webhook signatures before processing
 * - Use idempotency checks - Paystack may send the same event multiple times
 * - Never trust client-side success callbacks alone
 * - Log all events for debugging/auditing
 * 
 * SETUP IN PAYSTACK:
 * 1. Go to Paystack Dashboard > Settings > API Keys & Webhooks
 * 2. Set Webhook URL to: https://your-site.netlify.app/.netlify/functions/paystack-webhook
 * 3. Ensure PAYSTACK_SECRET_KEY is set in Netlify environment variables
 */

import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import * as crypto from 'crypto';

// Secret key for verifying webhook signatures (from environment)
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Structure of the webhook payload from Paystack.
 * We only use the fields we need; Paystack sends more.
 */
interface PaystackWebhookPayload {
  event: string;  // Event type: "charge.success", "charge.failed", etc.
  data: {
    id: number;
    domain: string;           // "test" or "live"
    status: string;           // "success", "failed", etc.
    reference: string;        // Our reference (BEL_xxx)
    amount: number;           // Amount in cents
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    metadata: {
      bookingId?: string;     // We send this when creating payment
      serviceId?: string;
      serviceName?: string;
      clientEmail?: string;
    };
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
  };
}

// ============================================================================
// SIGNATURE VERIFICATION
// ============================================================================

/**
 * Verifies that the webhook request came from Paystack.
 * Paystack signs each webhook with HMAC-SHA512 using our secret key.
 * 
 * CRITICAL: Never process webhooks without verifying the signature!
 * An attacker could send fake webhook requests to confirm unpaid bookings.
 * 
 * @param payload - Raw request body string
 * @param signature - x-paystack-signature header value
 * @returns True if signature is valid
 */
function verifySignature(payload: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

// ============================================================================
// IDEMPOTENCY
// ============================================================================

/**
 * In-memory set of processed payment references.
 * 
 * NOTE: This is a simple implementation for demonstration.
 * In production, use the Firestore processedPayments collection instead,
 * as in-memory storage is lost when the function cold starts.
 */
const processedReferences = new Set<string>();

/**
 * Checks if we've already processed this payment reference.
 * Paystack may send the same webhook multiple times (retries).
 */
function isAlreadyProcessed(reference: string): boolean {
  return processedReferences.has(reference);
}

/**
 * Marks a payment reference as processed.
 * Called immediately after successful processing to prevent duplicates.
 */
function markAsProcessed(reference: string): void {
  processedReferences.add(reference);
  
  // Clean up old references after 1 hour to prevent memory bloat
  // In production, this would be handled by Firestore TTL or cleanup job
  setTimeout(() => {
    processedReferences.delete(reference);
  }, 3600000); // 1 hour
}

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================

/**
 * Main handler function for Paystack webhooks.
 * 
 * This function is called by Netlify when Paystack sends a webhook.
 * It must return a 200 status quickly to acknowledge receipt,
 * even if background processing continues.
 */
export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Step 1: Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Step 2: Verify webhook signature
  const signature = event.headers['x-paystack-signature'];
  
  if (!signature) {
    console.error('Missing Paystack signature header');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing signature' }),
    };
  }

  const payload = event.body || '';
  
  if (!verifySignature(payload, signature)) {
    console.error('Invalid Paystack signature - possible attack or misconfiguration');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid signature' }),
    };
  }

  // Step 3: Parse and process the webhook
  try {
    const webhookData: PaystackWebhookPayload = JSON.parse(payload);
    const { event: eventType, data } = webhookData;

    // Log the event for debugging/auditing
    console.log(`[Paystack Webhook] Event: ${eventType}`, {
      reference: data.reference,
      status: data.status,
      amount: data.amount / 100, // Convert to dollars for logging
      email: data.customer?.email,
    });

    // Step 4: Handle charge.success event
    if (eventType === 'charge.success') {
      const { reference, status, metadata } = data;

      // Check idempotency - skip if already processed
      if (isAlreadyProcessed(reference)) {
        console.log(`[Paystack Webhook] Reference ${reference} already processed, skipping`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Already processed' }),
        };
      }

      if (status === 'success') {
        // Mark as processed IMMEDIATELY to prevent race conditions
        markAsProcessed(reference);

        // Log successful payment details
        console.log('[Paystack Webhook] Payment successful:', {
          reference,
          bookingId: metadata.bookingId,
          serviceId: metadata.serviceId,
          email: data.customer.email,
          amount: data.amount / 100,
          currency: data.currency,
        });

        // TODO: Implement these in production:
        // 1. Update booking status in Firestore
        // await updateBookingStatus(metadata.bookingId, 'confirmed', reference);
        
        // 2. Send confirmation email to client
        // await sendConfirmationEmail(data.customer.email, metadata);
        
        // 3. Optionally notify stylist of new booking
        // await notifyStylist(metadata);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: 'Payment processed successfully',
            reference,
          }),
        };
      }
    }

    // Step 5: Handle charge.failed event
    if (eventType === 'charge.failed') {
      console.log('[Paystack Webhook] Payment failed:', {
        reference: data.reference,
        reason: data.gateway_response,
      });
      
      // TODO: Optionally clean up pending booking or notify client
      // await handleFailedPayment(data.reference);
    }

    // For all other events, just acknowledge receipt
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event received' }),
    };

  } catch (error) {
    // Log error but still return 200 to prevent Paystack retries
    // (unless we want retries, then return 500)
    console.error('[Paystack Webhook] Processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
