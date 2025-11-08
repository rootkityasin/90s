# API Reference

This project exposes a small REST surface area for catalog management and read models, plus an SSE channel for real-time updates. Server Actions reuse the same database helpers, so the endpoints documented here are suitable for external tooling, automated tests, or integrating other services.

Base URL during local development: `http://localhost:3000`

## Authentication

The admin API currently relies on environment-level access (no tokens yet). Restrict usage to trusted environments and add middleware before opening it to the public internet.

## Admin Products API (`/api/admin/products`)

### GET `/api/admin/products`
Returns the full product catalog (retail and client bases).

**Response**
```json
{
  "success": true,
  "products": [
    {
      "productCode": "CRG-ASH-01",
      "base": "retail",
      "category": "cargos",
      "variants": [
        {
          "sku": "CRG-ASH-01-M",
          "retailPriceBDT": 2200
        }
      ]
    }
  ]
}
```

### POST `/api/admin/products`
Creates a new product and broadcasts the update to all SSE subscribers.

**Required fields**: `title`, `category`, `productCode`, `base`, `variants[]`

**Sample request**
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Stone Wash Cargo",
    "category": "cargos",
    "productCode": "CRG-STONE-01",
    "base": "retail",
    "images": ["https://res.cloudinary.com/.../cargos/stone-01.jpg"],
    "variants": [
      {
        "id": "b1c5d6",
        "sku": "CRG-STONE-01-M",
        "color": "stone",
        "size": "M",
        "retailPriceBDT": 2200
      }
    ]
  }'
```

### PUT `/api/admin/products`
Updates a product identified by `productCode`. You may send partial fields; timestamps update automatically.

**Sample request**
```bash
curl -X PUT http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "productCode": "CRG-STONE-01",
    "title": "Stone Wash Cargo Pants",
    "variants": [
      {
        "id": "b1c5d6",
        "sku": "CRG-STONE-01-M",
        "color": "stone",
        "size": "M",
        "retailPriceBDT": 2350
      }
    ]
  }'
```

### DELETE `/api/admin/products?productCode=CRG-STONE-01`
Deletes a product and emits a `productDelete` SSE event.

**Sample request**
```bash
curl -X DELETE "http://localhost:3000/api/admin/products?productCode=CRG-STONE-01"
```

## Retail Catalog API (`/api/retail/products`)

Returns only the retail catalog, including prices.

### Query Parameters
- `productCode` – fetch a specific product (retail base only)
- `category` – filter by main category (`cargos`, `tshirt`, etc.)
- `search` – substring match on title, description, or product code

**Sample request**
```bash
curl "http://localhost:3000/api/retail/products?category=cargos&search=stone"
```

**Response fields**
- `products` – array of products matching the filters
- `categories` – set of available categories for the retail base
- `subCategories` – distinct subcategories
- `categoryTree` – categories mapped to subcategories
- `total` – number of products returned after filtering

## Client Catalog API (`/api/client/products`)

Mirrors the retail endpoint but hides pricing and augments each variant with a token derived from the SKU. Requires users to pass the client gate inside the app to view.

### Query Parameters
- `productCode` – single client product (rejects retail entries)
- `sku` – fetch a product by variant SKU and include token in response
- `category`, `search` – same as retail API

**Response fields**
- `products` – catalog with `variants[].token`
- `variant` – present only when querying by `sku`
- `categories`, `subCategories`, `categoryTree`, `total`

## Real-Time Stream (`/api/realtime-products`)

Server-Sent Events (SSE) channel used by the admin dashboard and storefronts.

| Event | Payload |
| --- | --- |
| `snapshot` | Entire product array on initial connection |
| `productUpdate` | Single product document after create/update |
| `productDelete` | `{ "id": "PRODUCT_CODE" }` for deletions |
| `ping` | Timestamp keepalive every 25 seconds |

Example listener (Node):
```javascript
const evtSource = new EventSource('http://localhost:3000/api/realtime-products');
evtSource.addEventListener('productUpdate', (event) => {
  const product = JSON.parse(event.data);
  console.log('Product updated', product.productCode);
});
```

## Auxiliary Endpoints

- `GET /api/health` – Report MongoDB and Cloudinary readiness plus environment metadata.
- `GET /api/test-cloudinary` – Verify Cloudinary credentials without triggering an upload.
- `POST /api/upload-image` – Accepts multipart form data (`file`) and returns Cloudinary upload metadata.
- `GET /api/client-auth` – Used by the client gate to verify cookie state.
- `POST /api/client-auth` – Accepts `{ "password": "..." }`, validates against `CLIENT_ACCESS_PASSWORD`, and sets a secure cookie.

## Error Handling

All routes return a consistent envelope:
```json
{ "success": false, "error": "message" }
```

HTTP status codes:
- `200` – Request succeeded
- `201` – Resource created
- `400` – Validation failure or missing parameter
- `404` – Resource not found or base mismatch
- `429` – Reserved for rate-limited operations (used in payment blueprint)
- `500` – Unexpected runtime error (see logs for stack trace)

## Testing Checklist

1. `curl http://localhost:3000/api/admin/products` – verify the admin feed.
2. `curl "http://localhost:3000/api/retail/products?category=cargos"` – confirm category filters.
3. `curl -X POST /api/admin/products` – create a sample product, then watch `/api/realtime-products` for a `productUpdate` event.
4. `curl -X DELETE /api/admin/products?productCode=...` – ensure deletions propagate with `productDelete`.
5. `curl http://localhost:3000/api/health` – confirm `mongodb` and `cloudinary` report `true` before deploying.

## Future Hardening
- Add authentication middleware (NextAuth, JWT, or HMAC signatures) before exposing admin endpoints publicly.
- Introduce role-aware rate limiting via Redis or Upstash to defend against brute force attempts.
- Expand error telemetry with a centralized logger (e.g., Sentry) so 500 responses surface actionable details.
