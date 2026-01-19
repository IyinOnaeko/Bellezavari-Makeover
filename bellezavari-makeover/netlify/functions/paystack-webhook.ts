import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import * as crypto from 'crypto';

// Paystack webhook handler
// This function receives payment events from Paystack and updates booking status

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

interface PaystackWebhookPayload {
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
    metadata: {
      bookingId?: string;
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

// Verify Paystack webhook signature
function verifySignature(payload: string, signature: string): boolean {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

// Idempotency check - prevent duplicate processing
const processedReferences = new Set<string>();

function isAlreadyProcessed(reference: string): boolean {
  return processedReferences.has(reference);
}

function markAsProcessed(reference: string): void {
  processedReferences.add(reference);
  
  // Clean up old references after 1 hour (in production, use a database)
  setTimeout(() => {
    processedReferences.delete(reference);
  }, 3600000);
}

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get the signature from headers
  const signature = event.headers['x-paystack-signature'];
  
  if (!signature) {
    console.error('Missing Paystack signature');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing signature' }),
    };
  }

  // Verify signature
  const payload = event.body || '';
  
  if (!verifySignature(payload, signature)) {
    console.error('Invalid Paystack signature');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid signature' }),
    };
  }

  try {
    const webhookData: PaystackWebhookPayload = JSON.parse(payload);
    const { event: eventType, data } = webhookData;

    console.log(`Received Paystack event: ${eventType}`, {
      reference: data.reference,
      status: data.status,
    });

    // Handle charge.success event
    if (eventType === 'charge.success') {
      const { reference, status, metadata } = data;

      // Idempotency check
      if (isAlreadyProcessed(reference)) {
        console.log(`Reference ${reference} already processed, skipping`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Already processed' }),
        };
      }

      if (status === 'success') {
        // Mark as processed immediately to prevent duplicates
        markAsProcessed(reference);

        // In production, this would:
        // 1. Update the booking status in Firestore to 'confirmed'
        // 2. Send confirmation email to the client
        // 3. Log the successful payment

        console.log('Payment successful:', {
          reference,
          bookingId: metadata.bookingId,
          serviceId: metadata.serviceId,
          email: data.customer.email,
          amount: data.amount / 100, // Convert from kobo/pence
        });

        // TODO: Implement Firestore update
        // await updateBookingStatus(metadata.bookingId, 'confirmed', reference);
        
        // TODO: Send confirmation email
        // await sendConfirmationEmail(data.customer.email, metadata);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: 'Payment processed successfully',
            reference,
          }),
        };
      }
    }

    // Handle other events (optional)
    if (eventType === 'charge.failed') {
      console.log('Payment failed:', data.reference);
      // Handle failed payment - maybe send notification
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event received' }),
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
