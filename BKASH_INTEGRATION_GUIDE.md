# bKash Integration Guide

Payment collection over bKash follows a tokenized checkout flow that keeps credentials on the server, protects against replay attacks, and validates every step before an order is marked paid. This document captures the architecture, security controls, and implementation blueprint tailored for the 90's Commerce project.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [System Architecture](#system-architecture)
4. [Implementation Blueprint](#implementation-blueprint)
5. [Security Hardening](#security-hardening)
6. [Testing Strategy](#testing-strategy)
7. [Production Rollout](#production-rollout)
8. [Troubleshooting](#troubleshooting)
9. [Appendix: Reference Snippets](#appendix-reference-snippets)

---

## Prerequisites
- Active bKash merchant sandbox (https://developer.bka.sh) with verified KYC.
- Issued credentials: `username`, `password`, `app_key`, `app_secret`, and the tokenized checkout base URL.
- Node.js 18+, npm 9+, and the 90's Commerce codebase.
- Optional (recommended): Redis instance or similar store if you want distributed rate limiting from day one.

Install project dependencies used by the integration:

```powershell
npm install axios jsonwebtoken crypto-js
```

---

## Environment Configuration
Create or update `.env.local` with the following keys:

```bash
# bKash sandbox (replace with production values when going live)
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your_sandbox_username
BKASH_PASSWORD=your_sandbox_password
BKASH_APP_KEY=your_sandbox_app_key
BKASH_APP_SECRET=your_sandbox_app_secret

# Security
JWT_SECRET=32_byte_hex_string
PAYMENT_TIMEOUT_MINUTES=5
MAX_PAYMENT_AMOUNT=1000000
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=60000

# Frontend callbacks
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate a strong secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Mirror the same variables in Vercel once you deploy. Never expose credentials to the client; they stay in server-only code and environment configuration.

---

## System Architecture

1. **Create** – Admin or storefront initiates a payment by calling `/api/payment/bkash/create`. The server requests an `id_token` from bKash, builds a payment request, and returns the hosted gateway URL.
2. **Redirect** – Customer approves the payment on bKash’s hosted page.
3. **Callback** – bKash redirects back to `/api/payment/bkash/callback` with the `paymentID` and status.
4. **Execute** – The app calls `/api/payment/bkash/execute` to finalize the payment. Successful executions log the transaction ID and amount.
5. **Query / Refund** – Optional follow-up requests fetch status or trigger refunds.
6. **Reconciliation** – Transaction metadata is persisted in MongoDB for audits and admin dashboards.

All traffic happens server-to-server after the initial redirect, preventing credential leakage and enabling verification before updating order state.

---

## Implementation Blueprint

### Core Service (`src/lib/payment/bkash.ts`)
Create a singleton service responsible for:
- caching and refreshing the `id_token` (with buffer to avoid expiry mid-request)
- exposing `createPayment`, `executePayment`, `queryPayment`, and `refundPayment`
- signing all requests with the correct headers (`authorization`, `x-app-key`, credentials)

```typescript
class BkashService {
  private token: string | null = null;
  private tokenExpiry = 0;

  private async getToken() {
    if (this.token && Date.now() < this.tokenExpiry - 60_000) return this.token;
    const { data } = await axios.post(`${baseURL}/tokenized/checkout/token/grant`, {
      app_key: appKey,
      app_secret: appSecret,
    }, { headers: { username, password } });
    this.token = data.id_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000;
    return this.token;
  }

  async createPayment(payload: { amount: string; orderID: string }) {
    const token = await this.getToken();
    return axios.post(`${baseURL}/tokenized/checkout/create`, {
      mode: '0011',
      amount: payload.amount,
      currency: 'BDT',
      intent: 'sale',
      payerReference: ' ',
      callbackURL: `${siteURL}/api/payment/bkash/callback`,
      merchantInvoiceNumber: payload.orderID,
    }, { headers: { authorization: token, 'x-app-key': appKey } });
  }

  // executePayment, queryPayment, refundPayment follow the same pattern
}
```

Keep the service free of framework concerns so it can be reused in jobs or background workers later.

### API Routes
Namespace: `src/app/api/payment/bkash/*`

| Route | Method | Purpose |
| --- | --- | --- |
| `create` | POST | Create a payment session and return `bkashURL` |
| `execute` | POST | Finalize payment after callback with `paymentID` |
| `query` | POST | Check status for reconciliation or retries |
| `refund` | POST (optional) | Initiate a refund request |
| `callback` | GET | Handle redirect from bKash and forward to UX pages |

Each route should:
- enforce rate limits (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`)
- validate payloads (`amount`, `orderID`, `paymentID`)
- sanitize strings to avoid injection (`orderID` max length, whitelist characters)
- map gateway errors to user-friendly responses while logging full details server-side

Example skeleton for the create handler:

```typescript
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!allowRequest(ip)) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });

  const { amount, orderID } = await req.json();
  if (!isValidAmount(amount) || !isValidOrderId(orderID)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const { data } = await bkashService.createPayment({ amount: formatAmount(amount), orderID });
    return NextResponse.json({ success: true, paymentID: data.paymentID, bkashURL: data.bkashURL });
  } catch (error) {
    logGatewayError('create', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
```

Implement similar patterns for execute/query to centralize error logging and avoid leaking stack traces.

### Frontend Hooks
- `src/app/components/payment/BkashPayment.tsx` should call `create` and redirect to the `bkashURL`.
- `/payment/success`, `/payment/failed`, `/payment/cancelled` handle post-checkout UX. The success page must call `execute` immediately, confirm the transaction, and show the `trxID`.
- Add optimistic order state in MongoDB so abandoned flows can be tracked and retried.

### Order Persistence
- Extend MongoDB with a `payments` collection or embed payment documents on orders.
- Store `orderID`, `paymentID`, `trxID`, `amount`, `status`, `customer`, `timestamps`.
- Include request/response snapshots (sanitized) for audits.

---

## Security Hardening
- **Secrets**: Credentials live in environment variables; never expose them to the client.
- **Token caching**: Store tokens in memory per server instance; reduce gateway load and avoid excessive auth calls.
- **Validation**: Clamp amounts, enforce currency `BDT`, sanitize order IDs, verify callback domains.
- **Rate limiting**: Block brute force attempts and accidental double submits. When scaling, move in-memory maps to Redis or Upstash.
- **Session integrity**: Pair each payment with a signed JWT or HMAC stored in cookies/local storage to defend against replay.
- **Logging**: Log gateway errors with correlation IDs. Mask credentials in logs.
- **HTTPS**: Force HTTPS in production (Vercel does this automatically). Ensure callback URLs point to HTTPS origins.
- **Error responses**: Keep responses generic (`Payment creation failed`). Internals belong in logs only.
- **Compliance**: Follow bKash PCI requirements—no storing of sensitive wallet data.

---

## Testing Strategy

### Manual Sandbox Flow
1. Prepare a mock order with a known amount.
2. Trigger the payment from the admin or storefront.
3. Approve using sandbox wallet `01619777282` (PIN `12345`).
4. Verify `/payment/success` calls `execute` and records the transaction in MongoDB.
5. Attempt cancellation and failure paths to ensure UX handles them gracefully.
6. Run `/api/payment/bkash/query` to confirm the final status matches the executed transaction.

### Automated Tests (Recommended)
- Unit test the `BkashService` with Axios mocks to confirm request payloads and header formation.
- Integration test API routes with Supertest/Pact to validate validation and error mapping.
- Add contract tests for webhook/callback handling using recorded sandbox payloads.

---

## Production Rollout
1. Request live credentials from bKash after passing sandbox certification.
2. Move credentials into Vercel production environment variables and redeploy.
3. Update `NEXT_PUBLIC_SITE_URL` to the live domain.
4. Lock callback URLs to the production domain from the bKash merchant console.
5. Rotate secrets on a regular cadence and after personnel changes.
6. Monitor logs and set up alerts for spikes in `429` or `500` responses.

---

## Troubleshooting

| Symptom | Likely Cause | Resolution |
| --- | --- | --- |
| `401 Unauthorized` from gateway | Expired or invalid credentials | Regenerate app secret, verify username/password, redeploy |
| `400 Invalid Amount` | Amount improperly formatted | Always send two decimal places as a string (e.g. `"2500.00"`) |
| No redirect after approval | Callback URL mismatch | Check `callbackURL`, ensure `NEXT_PUBLIC_SITE_URL` matches the deployed domain |
| `execute` returns non-Completed status | Customer cancelled or timeout | Surface message to user, allow retry, log for review |
| Sandbox works, production fails | Live credentials not yet activated | Confirm live merchant account, whitelist domains with bKash |

---

## Appendix: Reference Snippets

**Rate Limiter Helper**
```typescript
const cache = new Map<string, { count: number; reset: number }>();
export function allowRequest(key: string, limit = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW_MS) {
  const now = Date.now();
  const entry = cache.get(key);
  if (!entry || now > entry.reset) {
    cache.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
```

**Amount Validation**
```typescript
export function isValidAmount(amount: unknown) {
  const parsed = typeof amount === 'number' ? amount : parseFloat(String(amount));
  return Number.isFinite(parsed) && parsed > 0 && parsed <= MAX_PAYMENT_AMOUNT;
}

export function formatAmount(amount: unknown) {
  return isValidAmount(amount) ? parseFloat(String(amount)).toFixed(2) : '0.00';
}
```

Use these helpers inside the API routes to keep handlers clean and auditable.

---

For wireframes, UX copy, and migration plans, refer back to `PAYMENT_QUICKSTART.md`. For compliance updates or new gateway versions, update constants in one place (`src/lib/payment/bkash.ts`) and revisit sandbox testing before promoting to production.
