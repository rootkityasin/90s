# Server Actions Fix – Eliminating JSON Parse Errors on Vercel

## Incident Summary
Vercel deployments were throwing `Unexpected token '<'` when admin actions attempted to `fetch` the API endpoints they share a process with. The HTML error response from a failed self-request cannot be parsed as JSON, causing the crash.

## Root Cause
`src/app/admin/actions.ts` used an `internalFetch()` helper to call `/api/admin/products`. In serverless environments this approach is brittle: environment URLs can differ, cold starts add latency, and any HTML error response breaks JSON parsing.

## Resolution
Server actions now call MongoDB helpers directly. The API routes remain available for external clients, but admin server actions bypass HTTP entirely.

### Updated Imports
```typescript
import { addProduct, updateProduct as updateProductInDB, deleteProduct as deleteProductFromDB } from '../../lib/data/store';
import { broadcastProductUpdate, broadcastProductDelete } from '../../lib/realtime';
```

### New Pattern
1. Call database helpers synchronously (no `fetch`).
2. Revalidate affected paths (`/admin`, `/retail`, `/client/catalog`, product detail pages).
3. Broadcast real-time updates (`broadcastProductUpdate` / `broadcastProductDelete`).
4. Return typed objects or error messages directly from the action.

### Removed
- `internalFetch()` helper
- `VERCEL_URL` dependency
- All server-to-server HTTP calls inside actions

## Benefits
- **Stability** – No more HTML responses masquerading as JSON.
- **Performance** – Eliminates redundant network hops.
- **Type Safety** – Actions operate on first-party TypeScript interfaces.
- **Parity** – Admin UI mirrors the behavior of API routes without reimplementing business logic.

## QA Checklist
- ✅ Create, edit, and delete products via `/admin` with data persisting in MongoDB.
- ✅ Retail and client storefronts update instantly through SSE after each action.
- ✅ Vercel logs show no JSON parse errors.
- ✅ `/api/admin/products` continues to function for external integrations.

## Follow-Up Recommendations
- Keep business logic consolidated in `src/lib/data/store.ts` so both server actions and API routes stay in sync.
- If future features need cross-service communication, use internal SDK calls instead of HTTP self-requests.
- Monitor for regressions via automated admin CRUD tests before each deployment.
