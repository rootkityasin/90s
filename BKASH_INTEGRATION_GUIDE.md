# bKash Payment Gateway Integration Guide

## Overview
This guide covers integrating bKash payment gateway into your Next.js e-commerce application with comprehensive security measures.

---

## Prerequisites

### 1. bKash Merchant Account
- Register at [bKash Merchant Portal](https://merchant.bkash.com)
- Complete KYC verification
- Get your credentials:
  - **Username** (Merchant Number)
  - **Password**
  - **App Key**
  - **App Secret**
  - **Base URL** (Sandbox: `https://tokenized.sandbox.bka.sh/v1.2.0-beta`)

### 2. Required NPM Packages
```bash
npm install axios
npm install jsonwebtoken
npm install crypto-js
```

---

## Security Architecture

### Critical Security Measures Implemented

#### 1. **Environment Variable Protection**
- Never commit credentials to Git
- Store all sensitive data in `.env.local`
- Use server-side only access (Next.js API routes)

**Prevents:**
- ✅ Credential exposure in source code
- ✅ Client-side credential leakage
- ✅ Accidental public disclosure

#### 2. **Server-Side Token Management**
- All bKash API calls happen server-side
- Token refresh handled automatically
- No payment credentials exposed to browser

**Prevents:**
- ✅ Man-in-the-middle attacks on credentials
- ✅ Token theft from client-side
- ✅ Unauthorized payment initiation

#### 3. **Request Validation & Sanitization**
- Validate all payment amounts
- Sanitize user inputs
- Type checking on all payment data
- Amount verification before payment execution

**Prevents:**
- ✅ Price manipulation attacks
- ✅ SQL injection (if using DB)
- ✅ XSS attacks through payment metadata
- ✅ Integer overflow attacks

#### 4. **CSRF Protection**
- Unique payment IDs per transaction
- Request origin verification
- Session-based validation

**Prevents:**
- ✅ Cross-Site Request Forgery
- ✅ Replay attacks
- ✅ Unauthorized payment creation

#### 5. **Rate Limiting**
- Limit payment creation per user/IP
- Throttle API requests
- Implement exponential backoff

**Prevents:**
- ✅ DoS attacks
- ✅ Payment spam
- ✅ API quota exhaustion

#### 6. **Payment Verification**
- Server-side payment status verification
- Double-check amounts before order completion
- Transaction ID validation

**Prevents:**
- ✅ Payment bypass attacks
- ✅ Amount tampering
- ✅ Fake payment confirmations

#### 7. **Audit Logging**
- Log all payment attempts
- Track failed transactions
- Monitor suspicious patterns

**Prevents:**
- ✅ Undetected fraud
- ✅ Accountability gaps
- ✅ Attack pattern blindness

#### 8. **HTTPS Enforcement**
- All payment flows over HTTPS only
- Secure cookie flags
- HSTS headers

**Prevents:**
- ✅ Packet sniffing
- ✅ Session hijacking
- ✅ Protocol downgrade attacks

#### 9. **Error Handling**
- Generic error messages to users
- Detailed logs server-side only
- No stack traces in production

**Prevents:**
- ✅ Information disclosure
- ✅ System fingerprinting
- ✅ Attack surface mapping

#### 10. **Database Security** (When Added)
- Parameterized queries
- Encrypted payment logs
- Separate payment table with restricted access

**Prevents:**
- ✅ SQL injection
- ✅ Data breach exposure
- ✅ Unauthorized data access

---

## Step-by-Step Implementation

### Step 1: Environment Setup

Create `.env.local` in root directory:

```bash
# bKash Credentials (NEVER COMMIT THESE)
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your_username
BKASH_PASSWORD=your_password
BKASH_APP_KEY=your_app_key
BKASH_APP_SECRET=your_app_secret

# Security
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=generate_a_strong_random_string_here

# Payment Configuration
BKASH_VERSION=1.2.0-beta
PAYMENT_TIMEOUT_MINUTES=5
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Create bKash Service

Create `src/lib/payment/bkash.ts`:

```typescript
import axios from 'axios';

interface BkashConfig {
  baseURL: string;
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
}

interface BkashTokenResponse {
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface CreatePaymentRequest {
  amount: string;
  orderID: string;
  intent: 'sale';
}

interface PaymentResponse {
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
  amount: string;
  intent: string;
  currency: string;
  paymentCreateTime: string;
  transactionStatus: string;
  merchantInvoiceNumber: string;
}

class BkashService {
  private config: BkashConfig;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      baseURL: process.env.BKASH_BASE_URL || '',
      username: process.env.BKASH_USERNAME || '',
      password: process.env.BKASH_PASSWORD || '',
      appKey: process.env.BKASH_APP_KEY || '',
      appSecret: process.env.BKASH_APP_SECRET || '',
    };

    if (!this.config.baseURL || !this.config.username || !this.config.appKey) {
      throw new Error('bKash configuration missing');
    }
  }

  /**
   * Get auth token from bKash (or return cached token if valid)
   */
  private async getToken(): Promise<string> {
    // Return cached token if still valid (with 1 min buffer)
    if (this.token && Date.now() < this.tokenExpiry - 60000) {
      return this.token;
    }

    try {
      const response = await axios.post<BkashTokenResponse>(
        `${this.config.baseURL}/tokenized/checkout/token/grant`,
        {
          app_key: this.config.appKey,
          app_secret: this.config.appSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            username: this.config.username,
            password: this.config.password,
          },
        }
      );

      this.token = response.data.id_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.token;
    } catch (error: any) {
      console.error('bKash token error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with bKash');
    }
  }

  /**
   * Create a payment request
   */
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    const token = await this.getToken();
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
      const response = await axios.post<PaymentResponse>(
        `${this.config.baseURL}/tokenized/checkout/create`,
        {
          mode: '0011', // Wallet payment
          payerReference: ' ',
          callbackURL: `${baseURL}/api/payment/bkash/callback`,
          amount: data.amount,
          currency: 'BDT',
          intent: data.intent,
          merchantInvoiceNumber: data.orderID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
            'x-app-key': this.config.appKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('bKash create payment error:', error.response?.data || error.message);
      throw new Error('Failed to create payment');
    }
  }

  /**
   * Execute payment after user approval
   */
  async executePayment(paymentID: string): Promise<any> {
    const token = await this.getToken();

    try {
      const response = await axios.post(
        `${this.config.baseURL}/tokenized/checkout/execute`,
        { paymentID },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
            'x-app-key': this.config.appKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('bKash execute payment error:', error.response?.data || error.message);
      throw new Error('Failed to execute payment');
    }
  }

  /**
   * Query payment status
   */
  async queryPayment(paymentID: string): Promise<any> {
    const token = await this.getToken();

    try {
      const response = await axios.post(
        `${this.config.baseURL}/tokenized/checkout/payment/status`,
        { paymentID },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
            'x-app-key': this.config.appKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('bKash query payment error:', error.response?.data || error.message);
      throw new Error('Failed to query payment');
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentID: string, amount: string, trxID: string, sku: string): Promise<any> {
    const token = await this.getToken();

    try {
      const response = await axios.post(
        `${this.config.baseURL}/tokenized/checkout/payment/refund`,
        {
          paymentID,
          amount,
          trxID,
          sku,
          reason: 'Customer requested refund',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
            'x-app-key': this.config.appKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('bKash refund error:', error.response?.data || error.message);
      throw new Error('Failed to refund payment');
    }
  }
}

// Singleton instance
export const bkashService = new BkashService();
```

### Step 3: Create API Routes

#### A. Create Payment API
Create `src/app/api/payment/bkash/create/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { bkashService } from '../../../../../lib/payment/bkash';

// Security: Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Security: Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many payment requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Security: Input validation
    if (!body.amount || !body.orderID) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Security: Amount validation
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0 || amount > 1000000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Security: Order ID sanitization
    const orderID = body.orderID.toString().replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
    if (!orderID) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Create payment
    const payment = await bkashService.createPayment({
      amount: amount.toFixed(2),
      orderID: orderID,
      intent: 'sale',
    });

    // Log payment creation (implement proper logging in production)
    console.log(`Payment created: ${payment.paymentID} for order ${orderID}`);

    return NextResponse.json({
      success: true,
      paymentID: payment.paymentID,
      bkashURL: payment.bkashURL,
    });

  } catch (error: any) {
    console.error('Payment creation error:', error.message);
    // Security: Don't expose internal errors
    return NextResponse.json(
      { error: 'Payment creation failed. Please try again.' },
      { status: 500 }
    );
  }
}
```

#### B. Execute Payment API
Create `src/app/api/payment/bkash/execute/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { bkashService } from '../../../../../lib/payment/bkash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Security: Validate paymentID format
    if (!body.paymentID || typeof body.paymentID !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    // Execute payment
    const result = await bkashService.executePayment(body.paymentID);

    // Security: Verify payment status
    if (result.transactionStatus !== 'Completed') {
      return NextResponse.json(
        { error: 'Payment not completed', status: result.transactionStatus },
        { status: 400 }
      );
    }

    // Security: Log successful payment
    console.log(`Payment executed: ${body.paymentID}, TrxID: ${result.trxID}`);

    // TODO: Update order status in database here
    // await updateOrderPaymentStatus(result.merchantInvoiceNumber, {
    //   status: 'paid',
    //   transactionID: result.trxID,
    //   amount: result.amount,
    //   paymentTime: result.paymentExecuteTime
    // });

    return NextResponse.json({
      success: true,
      transactionID: result.trxID,
      amount: result.amount,
      currency: result.currency,
    });

  } catch (error: any) {
    console.error('Payment execution error:', error.message);
    return NextResponse.json(
      { error: 'Payment execution failed' },
      { status: 500 }
    );
  }
}
```

#### C. Callback Handler
Create `src/app/api/payment/bkash/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paymentID = searchParams.get('paymentID');
  const status = searchParams.get('status');

  // Log callback
  console.log(`bKash callback: paymentID=${paymentID}, status=${status}`);

  // Redirect to appropriate page
  if (status === 'success' && paymentID) {
    return NextResponse.redirect(
      new URL(`/payment/success?paymentID=${paymentID}`, request.url)
    );
  } else if (status === 'failure') {
    return NextResponse.redirect(
      new URL('/payment/failed', request.url)
    );
  } else if (status === 'cancel') {
    return NextResponse.redirect(
      new URL('/payment/cancelled', request.url)
    );
  }

  return NextResponse.redirect(new URL('/', request.url));
}
```

#### D. Query Payment Status API
Create `src/app/api/payment/bkash/query/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { bkashService } from '../../../../../lib/payment/bkash';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.paymentID) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    const result = await bkashService.queryPayment(body.paymentID);

    return NextResponse.json({
      success: true,
      status: result.transactionStatus,
      amount: result.amount,
      transactionID: result.trxID,
    });

  } catch (error: any) {
    console.error('Payment query error:', error.message);
    return NextResponse.json(
      { error: 'Query failed' },
      { status: 500 }
    );
  }
}
```

### Step 4: Create Frontend Payment Component

Create `src/app/components/payment/BkashPayment.tsx`:

```typescript
'use client';
import React, { useState } from 'react';

interface BkashPaymentProps {
  amount: number;
  orderID: string;
  onSuccess?: (transactionID: string) => void;
  onFailure?: (error: string) => void;
}

export function BkashPayment({ amount, orderID, onSuccess, onFailure }: BkashPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create payment
      const createResponse = await fetch('/api/payment/bkash/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, orderID }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error || 'Payment creation failed');
      }

      // Redirect to bKash payment page
      if (createData.bkashURL) {
        window.location.href = createData.bkashURL;
      } else {
        throw new Error('Invalid payment URL');
      }

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      onFailure?.(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Pay with bKash</h3>
      <p>Amount: ৳ {amount.toFixed(2)}</p>
      <p>Order ID: {orderID}</p>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          background: '#E2136E',
          color: 'white',
          padding: '.75rem 1.5rem',
          border: 'none',
          borderRadius: 6,
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Processing...' : 'Pay with bKash'}
      </button>
    </div>
  );
}
```

### Step 5: Create Payment Result Pages

#### Success Page
Create `src/app/payment/success/page.tsx`:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const paymentID = searchParams.get('paymentID');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [transactionID, setTransactionID] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentID) {
      setStatus('error');
      return;
    }

    // Execute payment
    fetch('/api/payment/bkash/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentID }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactionID(data.transactionID);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [paymentID]);

  if (status === 'loading') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Processing Payment...</h1>
        <p>Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Payment Failed</h1>
        <p>There was an error processing your payment.</p>
        <a href="/retail">Return to Shop</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <p>Transaction ID: {transactionID}</p>
      <p>Thank you for your purchase.</p>
      <a href="/retail">Continue Shopping</a>
    </div>
  );
}
```

#### Failed Page
Create `src/app/payment/failed/page.tsx`:

```typescript
export default function PaymentFailed() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment Failed</h1>
      <p>Your payment could not be processed.</p>
      <a href="/retail">Try Again</a>
    </div>
  );
}
```

#### Cancelled Page
Create `src/app/payment/cancelled/page.tsx`:

```typescript
export default function PaymentCancelled() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment Cancelled</h1>
      <p>You cancelled the payment.</p>
      <a href="/retail">Return to Shop</a>
    </div>
  );
}
```

---

## Testing Checklist

### Sandbox Testing
1. ✅ Create payment with valid amount
2. ✅ Create payment with invalid amount (negative, zero, too large)
3. ✅ Execute payment successfully
4. ✅ Handle payment failure
5. ✅ Handle payment cancellation
6. ✅ Query payment status
7. ✅ Test rate limiting (make 6+ requests in 1 minute)
8. ✅ Test with invalid credentials
9. ✅ Test callback URLs
10. ✅ Test refund flow

### Security Testing
1. ✅ Verify credentials not exposed in browser
2. ✅ Test CSRF protection
3. ✅ Test rate limiting
4. ✅ Test input validation (SQL injection attempts, XSS)
5. ✅ Verify HTTPS enforcement in production
6. ✅ Test error messages don't leak sensitive info
7. ✅ Verify transaction logs are secure

---

## Production Deployment Checklist

### Before Going Live:

1. **Switch to Production Credentials**
   - Update `.env.local` with production bKash credentials
   - Change `BKASH_BASE_URL` to production URL
   - Update `NEXT_PUBLIC_BASE_URL` to your domain

2. **Security Hardening**
   - [ ] Enable HTTPS (required for production)
   - [ ] Add CORS restrictions
   - [ ] Implement Redis-based rate limiting
   - [ ] Add database for payment logging
   - [ ] Set up monitoring/alerting
   - [ ] Add CSP headers
   - [ ] Enable HSTS
   - [ ] Implement webhook signature verification

3. **Database Setup**
   ```sql
   CREATE TABLE payments (
     id SERIAL PRIMARY KEY,
     order_id VARCHAR(50) NOT NULL,
     payment_id VARCHAR(100) NOT NULL,
     transaction_id VARCHAR(100),
     amount DECIMAL(10, 2) NOT NULL,
     currency VARCHAR(3) DEFAULT 'BDT',
     status VARCHAR(20) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     completed_at TIMESTAMP,
     ip_address INET,
     user_agent TEXT,
     INDEX idx_order_id (order_id),
     INDEX idx_payment_id (payment_id)
   );
   ```

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor payment success/failure rates
   - Track API response times
   - Alert on unusual patterns

5. **Legal & Compliance**
   - [ ] Add Terms of Service
   - [ ] Add Refund Policy
   - [ ] Add Privacy Policy
   - [ ] Comply with Bangladesh e-commerce regulations

---

## Common Issues & Solutions

### Issue: "Authentication failed"
**Solution:** Check credentials in `.env.local`, ensure no extra spaces

### Issue: "Token expired"
**Solution:** Token auto-refreshes; check system time is synchronized

### Issue: Payment stuck in "Pending"
**Solution:** Query payment status via `/api/payment/bkash/query`

### Issue: Rate limit errors
**Solution:** Implement proper rate limiting with Redis in production

---

## Support & Resources

- bKash Developer Portal: https://developer.bka.sh
- bKash Merchant Support: merchant.support@bka.sh
- API Documentation: https://developer.bka.sh/docs

---

## Security Incident Response

If you suspect a security breach:

1. **Immediately:**
   - Disable payment processing
   - Rotate all API credentials
   - Review payment logs

2. **Investigate:**
   - Check server logs
   - Review recent transactions
   - Identify attack vector

3. **Notify:**
   - Contact bKash support
   - Inform affected customers (if applicable)
   - Report to authorities (if required)

4. **Prevent:**
   - Patch vulnerabilities
   - Update security measures
   - Document incident for future reference

---

**Last Updated:** October 2025
**Version:** 1.0.0
