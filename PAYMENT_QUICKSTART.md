# bKash Integration Quick Start

Use this checklist when you are ready to activate the bKash tokenized payment flow. It is a companion to the deep dive in `BKASH_INTEGRATION_GUIDE.md`.

## 1. Prepare Credentials
- Create a sandbox account at https://developer.bka.sh.
- Collect `BKASH_USERNAME`, `BKASH_PASSWORD`, `BKASH_APP_KEY`, `BKASH_APP_SECRET`, and the sandbox base URL.
- Copy `.env.example` to `.env.local` and populate the bKash section. Keep credentials out of version control.

## 2. Install Dependencies
```powershell
npm install axios
```

Axios powers the signed server-side HTTP calls to the bKash gateway. If you prefer `fetch`, adjust the guide accordingly.

## 3. Scaffold the Payment Modules
Implement the files covered in the full guide:
- `src/lib/payment/bkash.ts` – service helpers (token cache, payload builders, signature validation)
- `src/app/api/payment/bkash/create/route.ts` – initiate payment session
- `src/app/api/payment/bkash/execute/route.ts` – finalize payment after OTP approval
- `src/app/api/payment/bkash/query/route.ts` – reconcile or poll status
- `src/app/api/payment/bkash/callback/route.ts` – async callback consumer
- `src/app/components/payment/BkashPayment.tsx` – UI trigger for web checkout
- `src/app/payment/{success|failed|cancelled}/page.tsx` – post-transaction screens

Follow the naming and request/response shapes outlined in `BKASH_INTEGRATION_GUIDE.md` to stay aligned with the sandbox console.

## 4. Configure Security Controls
- Generate a strong `JWT_SECRET` for session signing.
- Review rate limit constants (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`). Increase or back off depending on expected traffic.
- Log each transaction attempt to MongoDB so the admin team can audit unusual activity.

## 5. Run Sandbox Tests
- Use the official test wallet `01619777282` (PIN `12345`) to exercise initiation, execution, and reversal scenarios.
- Verify the callback route receives notifications and updates order status correctly.
- Confirm the UI handles timeouts gracefully using `PAYMENT_TIMEOUT_MINUTES`.

## 6. Production Readiness Checklist
1. Switch `.env.production` to the live base URL and credentials supplied by bKash.
2. Enforce HTTPS end-to-end and lock down callback URLs in the bKash dashboard.
3. Enable observability (Vercel logs + custom logger) and alerting for failed transactions.
4. Rotate credentials regularly and document the rotation flow for the operations team.

## Reference Material
- Detailed implementation: `BKASH_INTEGRATION_GUIDE.md`
- Official API documentation: https://developer.bka.sh
- Merchant support: merchant.support@bka.sh
