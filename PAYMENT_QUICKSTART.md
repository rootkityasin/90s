# Quick Start: bKash Payment Integration

Follow these steps to get bKash payments working:

## 1. Install Dependencies
```bash
npm install axios
```

## 2. Get bKash Credentials
- Go to https://developer.bka.sh
- Register for a Sandbox account
- Get your: Username, Password, App Key, App Secret

## 3. Configure Environment
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and fill in your bKash credentials
```

## 4. Verify .gitignore
Make sure `.env.local` is in your `.gitignore`:
```
.env.local
```

## 5. Implement the Code
Follow the step-by-step instructions in `BKASH_INTEGRATION_GUIDE.md`

Files to create:
- `src/lib/payment/bkash.ts` - bKash service
- `src/app/api/payment/bkash/create/route.ts` - Create payment endpoint
- `src/app/api/payment/bkash/execute/route.ts` - Execute payment endpoint
- `src/app/api/payment/bkash/callback/route.ts` - Callback handler
- `src/app/api/payment/bkash/query/route.ts` - Query payment status
- `src/app/components/payment/BkashPayment.tsx` - Payment button component
- `src/app/payment/success/page.tsx` - Success page
- `src/app/payment/failed/page.tsx` - Failed page
- `src/app/payment/cancelled/page.tsx` - Cancelled page

## 6. Test in Sandbox
Use bKash sandbox test numbers:
- Wallet: 01619777282 (PIN: 12345)

## 7. Before Production
- [ ] Switch to production credentials
- [ ] Enable HTTPS
- [ ] Set up database for payment logs
- [ ] Implement Redis rate limiting
- [ ] Add monitoring
- [ ] Test all security measures
- [ ] Review legal requirements

## Security Checklist
✅ All credentials in .env.local (never committed)
✅ Server-side only API calls
✅ Input validation on all endpoints
✅ Rate limiting implemented
✅ HTTPS enforced in production
✅ Error messages don't expose internals
✅ Payment verification before order completion
✅ Audit logging enabled

## Need Help?
- Read: `BKASH_INTEGRATION_GUIDE.md` (comprehensive guide)
- bKash Docs: https://developer.bka.sh
- Support: merchant.support@bka.sh
