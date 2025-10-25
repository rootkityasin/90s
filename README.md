# 90's Commerce (Prototype)

Simple Next.js-only prototype showing:
- Retail vs Client views separated by role (single domain) – client view hides price and shows SKU token.
- Animated product cards (Framer Motion) kept lightweight.
- Admin dashboard with basic metrics & product creation.
- In-memory data store (replace with real DB later e.g. PostgreSQL + Prisma).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 then login. /retail for retail customers, /client for client partners, /admin for dashboard.

## Client Token Flow
Token is simply the SKU (sample reference). Contact buttons (WhatsApp first) prefill message with SKU.

## Replace Design Tokens
Edit `src/app/globals.css` to swap in your palette & font files. Keep contrast high (WCAG) for SEO & accessibility.

## Next Steps (Suggested)
1. Add authentication & role-based access (NextAuth.js or custom JWT).
2. Persist data (PostgreSQL + Prisma) & implement migrations.
3. Introduce pricing rules & per-customer token negotiation log.
4. Add structured data & OpenGraph meta per product (partial demo in `product/[slug]`).
5. Implement image optimization (switch img to next/image with width/height & priority as needed).
6. Add caching (ISR) for product pages; keep client tokens dynamic (no caching for token element).
7. Add robust admin edit & variant management (editProduct server action placeholder ready).
8. Implement analytics aggregation jobs instead of random demo data.

## Domain Strategy
Single domain using middleware to gate sections by role; can migrate to subdomains later if marketing separation needed.

## Performance Notes
- Framer Motion only wraps cards; keep dependency minimal.
- Use dynamic = 'force-dynamic' on client / retail list for now; later switch to ISR for stable catalog & client-side generate token.
- Add Lighthouse & Web Vitals tracking early.

## Payment Integration

See **[BKASH_INTEGRATION_GUIDE.md](./BKASH_INTEGRATION_GUIDE.md)** for complete bKash payment gateway integration with security measures.

### Security Features Implemented:
- ✅ Server-side credential protection
- ✅ Rate limiting & CSRF protection
- ✅ Input validation & sanitization
- ✅ Secure token management
- ✅ Payment verification & logging
- ✅ HTTPS enforcement
- ✅ Error handling without information disclosure

**Attack Prevention:** SQL injection, XSS, CSRF, man-in-the-middle, replay attacks, DoS, price manipulation, payment bypass, session hijacking, and more.

## Licensing
All code simple boilerplate; adapt freely.
