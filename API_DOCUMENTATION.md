# API-Based CRUD Operations

## Overview

The admin panel now uses RESTful API routes for all CRUD operations instead of direct server actions. This ensures better compatibility with Vercel's serverless architecture and provides a clean separation of concerns.

## API Endpoints

### Admin API (`/api/admin/products`)

**Base URL:** `/api/admin/products`

#### GET - List all products
```bash
GET /api/admin/products
```
**Response:**
```json
{
  "success": true,
  "products": [...],
}
```

#### POST - Create new product
```bash
POST /api/admin/products
Content-Type: application/json
```
**Body:**
```json
{
  "slug": "product-slug",
  "title": "Product Title",
  "description": "Product description",
  "subCategory": "Optional subcategory",
  "productCode": "PROD-01",
  "fabricDetails": "Material details",
  "careInstructions": "Care instructions",
  "category": "cargos",
  "heroImage": "/path/to/hero.jpg",
  "images": ["/path/1.jpg", "/path/2.jpg"],
  "variants": [
    {
      "id": "uuid",
      "sku": "PROD-M",
      "color": "Blue",
      "size": "M",
      "retailPriceBDT": 2000
    }
  ]
}
```
**Response:**
```json
{
  "success": true,
  "product": {...}
}
```

#### PUT - Update existing product
```bash
PUT /api/admin/products
Content-Type: application/json
```
**Body:**
```json
{
  "slug": "product-slug",  // Required - identifies the product
  "title": "Updated Title",
  // ... any fields to update
}
```
**Response:**
```json
{
  "success": true,
  "product": {...}
}
```

#### DELETE - Remove product
```bash
DELETE /api/admin/products?slug=product-slug
```
**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Retail API (`/api/retail/products`)

**Base URL:** `/api/retail/products`

#### GET - List all products (with prices)
```bash
GET /api/retail/products

# Optional filters:
GET /api/retail/products?category=cargos
GET /api/retail/products?search=keyword
GET /api/retail/products?slug=product-slug
```

**Response:**
```json
{
  "success": true,
  "products": [...],
  "total": 25
}
```

---

### Client API (`/api/client/products`)

**Base URL:** `/api/client/products`

#### GET - List all products (with tokens instead of prices)
```bash
GET /api/client/products

# Optional filters:
GET /api/client/products?category=cargos
GET /api/client/products?search=keyword
GET /api/client/products?slug=product-slug
GET /api/client/products?sku=PROD-M
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "...": "...",
      "variants": [
        {
          "sku": "PROD-M",
          "token": "PROD-M",  // Token for client ordering
          "color": "Blue",
          "size": "M"
        }
      ]
    }
  ],
  "total": 25
}
```

---

## Server Actions

The server actions in `/src/app/admin/actions.ts` now act as thin wrappers around the API:

- `createProduct(formData)` → POST `/api/admin/products`
- `editProduct(slug, formData)` → PUT `/api/admin/products`
- `fullEditProduct(formData)` → PUT `/api/admin/products`
- `deleteProduct(slug)` → DELETE `/api/admin/products`

## Benefits

1. **Vercel Compatible:** Works with serverless architecture
2. **Consistent Data:** All requests go through the same API layer
3. **RESTful:** Standard HTTP methods (GET, POST, PUT, DELETE)
4. **Real-time Updates:** Broadcasts changes via SSE
5. **Easy to Test:** Can test API endpoints directly
6. **Separation of Concerns:** Clear boundary between UI and data layer

## Product Identification

Products are identified by **slug** instead of random UUID because:
- ✅ Slugs are consistent across serverless instances
- ✅ Slugs are human-readable and SEO-friendly
- ✅ Slugs are generated from product manifest (deterministic)
- ❌ Random UUIDs differ in each serverless instance

## Search Functionality

All API endpoints support searching by:
- Product title
- Description
- **Product code** (NEW!)

Example:
```bash
GET /api/retail/products?search=TRS-01
# Returns products matching "TRS-01" in title, description, or product code
```

## Error Handling

All API endpoints return consistent error format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing fields)
- `404` - Not Found
- `500` - Server Error

## Environment Variables

```env
# Optional: Set custom API base URL
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

If not set, defaults to `http://localhost:3000` in development.

## Real-time Updates

The system uses Server-Sent Events (SSE) for real-time product updates:

1. Client connects to `/api/realtime-products`
2. Server sends initial snapshot
3. On product update/delete, server broadcasts to all connected clients
4. Clients update their UI automatically

**Events:**
- `snapshot` - Initial product list
- `productUpdate` - Product created/updated
- `productDelete` - Product deleted
- `ping` - Keepalive (every 25s)

## Testing

Test the API directly:

```bash
# List products
curl http://localhost:3000/api/admin/products

# Create product
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Product","category":"tshirt","variants":[...]}'

# Update product
curl -X PUT http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-product","title":"Updated Title"}'

# Delete product
curl -X DELETE "http://localhost:3000/api/admin/products?slug=test-product"
```

## Migration Notes

### Before (Direct Store Access)
```typescript
import { updateProduct } from '../../lib/data/store';
const updated = updateProduct(productId, patch);
```

### After (API-Based)
```typescript
const response = await fetch(`${API_BASE}/api/admin/products`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ slug: productSlug, ...patch }),
});
const data = await response.json();
```

## Troubleshooting

**Issue:** "Product not found" error  
**Solution:** Make sure you're passing the `slug` field, not random `id`

**Issue:** Changes don't persist on Vercel  
**Solution:** Ensure `NEXT_PUBLIC_API_URL` is set to your Vercel domain

**Issue:** API returns 500 error  
**Solution:** Check Vercel function logs for detailed error messages

**Issue:** Real-time updates not working  
**Solution:** Check SSE connection at `/api/realtime-products`

## Next Steps

1. ✅ All CRUD operations use API routes
2. ✅ Product code search enabled
3. ✅ Slug-based identification
4. ⏳ Deploy to Vercel and test
5. ⏳ Add authentication/authorization to admin API
6. ⏳ Migrate to database (PostgreSQL/Prisma)
