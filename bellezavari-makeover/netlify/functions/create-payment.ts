import { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';

// Create Paystack payment initialization
// This function creates a payment request and returns the authorization URL

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

interface CreatePaymentRequest {
  email: string;
  amount: number; // in pounds
  bookingId: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  extras?: Array<{ name: string; price: number }>;
}

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Handle CORS preflight
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

  // Only allow POST requests
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
    const body: CreatePaymentRequest = JSON.parse(event.body || '{}');
    const { email, amount, bookingId, serviceId, serviceName, clientName, extras } = body;

    // Validate required fields
    if (!email || !amount || !bookingId || !serviceId) {
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate unique reference
    const reference = `BEL_${bookingId}_${Date.now()}`;

    // Convert amount to kobo/pence (smallest currency unit)
    const amountInPence = Math.round(amount * 100);

    // Create Paystack payment
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInPence,
        currency: 'CAD',
        reference,
        callback_url: `${process.env.URL || 'https://bellezavari.com'}/book/success`,
        metadata: {
          bookingId,
          serviceId,
          serviceName,
          clientName,
          extras: extras || [],
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

    if (!data.status) {
      console.error('Paystack initialization failed:', data.message);
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: data.message || 'Payment initialization failed' }),
      };
    }

    console.log('Payment initialized:', {
      reference: data.data.reference,
      bookingId,
      amount,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      }),
    };

  } catch (error) {
    console.error('Create payment error:', error);
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
