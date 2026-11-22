# API Contract — Website Marketplace

**Version:** 1.0-draft  
**Base path:** `/api/v1`  
**Format:** JSON over HTTPS

## 1. Conventions

### 1.1 Request headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <short-lived-token>   # if bearer auth is selected
Idempotency-Key: <unique-client-key>       # required for retriable create operations
X-Correlation-Id: <client-generated-or-server-issued-id>
```

Browser session deployments should use secure HttpOnly cookies and CSRF protection as required; do not expose a long-lived access token to browser JavaScript.

### 1.2 Response envelope

Resource endpoints return resource DTOs directly or a consistent `{ data, meta }` envelope. Choose one convention for the whole API. Recommended list response:

```json
{
  "data": [
    {
      "id": "2d8d8d9f-8ff4-4c1a-8c36-9b0f1a960a01",
      "title": "Restaurant Website",
      "slug": "restaurant-website"
    }
  ],
  "meta": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

### 1.3 Error response

Use a Problem Details-inspired shape with an application error code:

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation failed",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "detail": "One or more fields are invalid.",
  "fieldErrors": {
    "contact.email": ["Email address is invalid."]
  },
  "traceId": "01J..."
}
```

Never return stack traces, SQL errors, provider secrets or private moderation/internal notes.

### 1.4 Status codes

- `200` read/update success.
- `201` resource created.
- `202` accepted for asynchronous processing.
- `204` successful no-content action.
- `400` malformed request.
- `401` unauthenticated.
- `403` authenticated but unauthorized.
- `404` resource absent or not visible to the actor.
- `409` state conflict/idempotency conflict.
- `422` field/domain validation failure.
- `429` rate limit.
- `500` unexpected failure.

### 1.5 Pagination and filters

- Public catalog: cursor pagination preferred; maximum page size bounded (e.g. 48).
- Admin tables: page/limit is acceptable for UX; enforce maximum limit.
- Allowed sort fields are server-defined, e.g. `newest`, `popular` (only after metric is defined), `price_asc`, `price_desc`.
- Filter values must be validated against known enums/IDs.

## 2. Public Catalog APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/public/categories` | Category tree/list | Public |
| GET | `/public/tags` | Public filter tags | Public |
| GET | `/public/features` | Filterable feature dictionary | Public |
| GET | `/public/listings` | Search/filter listing | Public |
| GET | `/public/listings/:slug` | Listing detail + active offers | Public |
| GET | `/public/sellers/:slug` | Public seller profile | Public |
| GET | `/public/pages/:slug` | CMS page | Public |

Example:

```http
GET /api/v1/public/listings?category=restaurant&fulfillment=MANAGED_SERVICE&pricing=FIXED&features=cms,booking&sort=newest&limit=24
```

Example listing summary:

```json
{
  "id": "7a3f2a6f-4181-4f1f-9605-9b1e2b2a12c0",
  "slug": "restaurant-website",
  "title": "Restaurant Website",
  "shortDescription": "Responsive website for restaurants and cafes.",
  "listingKind": "BUSINESS_WEBSITE",
  "category": { "id": "...", "name": "Food & Beverage", "slug": "food-beverage" },
  "seller": { "id": "...", "name": "Platform Studio", "slug": "platform-studio", "sellerType": "PLATFORM" },
  "coverImage": { "url": "https://cdn.example.com/public/...", "alt": "Restaurant website preview" },
  "badges": ["Responsive", "CMS"],
  "availableFulfillmentTypes": ["SOURCE_CODE", "MANAGED_SERVICE"],
  "priceSummary": { "label": "From", "amountMinor": 5000000, "currency": "VND" }
}
```

Public DTO must not include private asset keys, moderation note, seller tax data, unapproved offer, draft revision or internal analytics.

## 3. Quote Request APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/quote-requests` | Create guest/customer request | Public with abuse controls |
| GET | `/me/quote-requests` | Current user's requests | Customer |
| GET | `/quote-requests/:id` | Get own request detail | Customer/assigned staff/admin |
| POST | `/quote-requests/:id/messages` | Add customer-visible message | Customer/authorized staff |
| POST | `/quote-requests/:id/attachments/presign` | Create upload intent | Public scoped token/customer |

Create request payload:

```json
{
  "relatedListingId": null,
  "relatedOfferId": null,
  "title": "Website for a language center",
  "industryCategoryId": "a3d0d7ef-2f06-41d7-80f0-e13b157d0321",
  "solutionType": "BUSINESS_WEBSITE",
  "goal": "Introduce courses, collect leads and allow trial-class registration.",
  "budget": {
    "minMinor": 10000000,
    "maxMinor": 30000000,
    "currency": "VND",
    "flexibility": "NEGOTIABLE"
  },
  "targetDate": "2027-02-01",
  "requirements": {
    "estimatedPages": "5_TO_10",
    "features": ["CMS", "CONTACT_FORM", "COURSE_CATALOG", "BOOKING"],
    "integrations": ["EMAIL"],
    "designReferenceUrls": ["https://example.org/reference"],
    "technicalConfidence": "NEED_CONSULTATION"
  },
  "contact": {
    "name": "Nguyen Van A",
    "email": "buyer@example.com",
    "phone": "+84...",
    "company": "Example Language Center"
  },
  "consent": {
    "privacyPolicyVersion": "2026-11-01",
    "marketingOptIn": false
  },
  "captchaToken": "provider-issued-token"
}
```

Response:

```json
{
  "data": {
    "id": "...",
    "referenceCode": "WMR-7K4P9D2A",
    "status": "NEW",
    "submittedAt": "2026-11-22T04:30:00Z",
    "nextStep": "CHECK_EMAIL"
  }
}
```

Do not return the contact snapshot after guest submission. For guest status tracking, use an expiring signed access link or email verification, never a predictable numeric ID.

## 4. Authentication and Customer APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create customer account |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Revoke current session |
| POST | `/auth/email/verify` | Verify email token |
| POST | `/auth/password/forgot` | Request reset |
| POST | `/auth/password/reset` | Reset with single-use token |
| GET | `/me` | Current user and memberships |
| GET | `/me/orders` | Customer orders |
| GET | `/me/quotations` | Customer quotations |
| GET | `/me/projects` | Customer projects |
| GET | `/me/downloads` | Download entitlements |
| GET | `/me/subscriptions` | SaaS subscriptions |

Security rules: generic login failure response, rate limiting, verified email for sensitive actions, account/session revoke and resource ownership checks.

## 5. Quotation APIs

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/quotations/:id` | View quotation | Customer owner/authorized seller/admin |
| POST | `/admin/quotations` | Create quotation draft | Admin |
| POST | `/admin/quotations/:id/versions` | Create next version | Admin |
| POST | `/admin/quotations/:id/send` | Send current draft version | Admin |
| POST | `/quotations/:id/accept` | Accept exact version | Customer |
| POST | `/quotations/:id/reject` | Reject exact version | Customer |

Create quotation payload:

```json
{
  "quoteRequestId": "...",
  "sellerOrganizationId": "...",
  "currency": "VND",
  "validUntil": "2026-12-10T16:59:59Z",
  "scope": {
    "deliverables": ["Responsive website", "CMS admin", "Deployment assistance"],
    "included": ["Up to 8 pages", "Contact form"],
    "excluded": ["Paid hosting", "Copywriting"],
    "assumptions": ["Customer supplies logo and initial content"]
  },
  "terms": {
    "paymentSchedule": [
      { "label": "Deposit", "percent": 50 },
      { "label": "Final payment", "percent": 50 }
    ],
    "warrantyDays": 30,
    "supportSummary": "Business-hours support during warranty."
  },
  "lines": [
    {
      "lineType": "SERVICE",
      "description": "Website design and development",
      "quantity": 1,
      "unit": "PROJECT",
      "unitPriceMinor": 18000000,
      "discountMinor": 0,
      "taxCode": "STANDARD"
    }
  ]
}
```

Acceptance payload:

```json
{
  "quotationVersionId": "...",
  "acceptanceName": "Nguyen Van A",
  "acceptanceNote": "I agree with the stated scope and payment schedule.",
  "termsVersion": "QUOTE-TERMS-1.0"
}
```

Server calculates every line and header total; client totals are ignored. `quotationVersionId` must be current and valid. API returns created `orderId` only after transaction commits.

## 6. Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/admin/categories` | List/create categories |
| PATCH | `/admin/categories/:id` | Update category |
| GET/POST | `/admin/listings` | List/create listing |
| GET/PATCH | `/admin/listings/:id` | Read/update listing |
| POST | `/admin/listings/:id/publish` | Publish after validation |
| POST | `/admin/listings/:id/suspend` | Suspend with reason |
| POST | `/admin/listings/:id/offers` | Add offer |
| PATCH | `/admin/offers/:id` | Update offer draft |
| GET | `/admin/quote-requests` | Request inbox/filter |
| POST | `/admin/quote-requests/:id/assign` | Assign owner |
| POST | `/admin/quote-requests/:id/status` | Validated status transition |
| POST | `/admin/quote-requests/:id/internal-notes` | Add internal note |
| GET | `/admin/orders` | Order search |
| POST | `/admin/orders/:id/record-offline-payment` | Record offline payment |
| GET | `/admin/audit-logs` | Restricted audit search |

Admin endpoints must use permission guards plus resource policy. Do not allow arbitrary status patching or mass assignment.

## 7. Seller APIs (Phase 2)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/seller/applications` | Submit partner application |
| GET | `/seller/profile` | Current seller profile |
| PATCH | `/seller/profile` | Update editable profile fields |
| GET/POST | `/seller/listings` | List/create own listing draft |
| PATCH | `/seller/listings/:id` | Update own draft |
| POST | `/seller/listings/:id/submit` | Submit for moderation |
| GET | `/seller/leads` | Assigned/owned leads subject to policy |
| GET | `/seller/orders` | Seller's order items |
| GET | `/seller/earnings` | Settlement statement (after ledger) |

Every query is scoped by active organization membership on the server. Seller cannot choose arbitrary seller organization ID to access another seller's records.

## 8. Checkout and Payment APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/checkout/sessions` | Create checkout intent |
| GET | `/checkout/sessions/:id` | Retrieve checkout state |
| POST | `/checkout/sessions/:id/confirm` | Confirm checkout intent, not payment success |
| POST | `/payments/webhooks/:providerCode` | Provider webhook; signature verification required |
| POST | `/orders/:id/cancel` | Cancel when policy/state permits |
| POST | `/admin/payments/:id/refunds` | Request refund with permission |

Checkout payload:

```json
{
  "offerId": "...",
  "quantity": 1,
  "currency": "VND",
  "billingSnapshot": {
    "name": "Example Company",
    "email": "billing@example.com",
    "taxIdentifier": null,
    "address": "Ho Chi Minh City, Viet Nam"
  },
  "termsAccepted": {
    "termsVersion": "MARKETPLACE-TERMS-1.0",
    "accepted": true
  }
}
```

Response may return a provider checkout URL or manual instructions. It must not claim `PAID` until server-side provider confirmation is processed. Repeated calls with the same idempotency key return the same logical checkout result.

Webhook provider adapters must:
- Verify signature against raw body.
- Validate merchant account, event type, amount, currency and reference.
- Deduplicate provider event ID.
- Persist processing status and safely retry.
- Avoid exposing webhook endpoint as a generic unauthenticated business mutation.

## 9. Digital Delivery APIs (Phase 2)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/me/entitlements` | List owned entitlements |
| POST | `/entitlements/:id/download-url` | Issue short-lived signed URL |
| GET | `/admin/entitlements/:id/download-events` | Support audit |
| POST | `/admin/entitlements/:id/revoke` | Revoke with reason |

Backend checks order paid/confirmed, user ownership, entitlement active, license constraints and asset scan status before issuing a URL.

## 10. Project APIs (Phase 2)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/projects/:id` | Project detail |
| GET | `/projects/:id/milestones` | Milestones |
| POST | `/projects/:id/acceptances` | Accept/change request |
| GET | `/projects/:id/deliverables` | Authorized deliverables |
| POST | `/projects/:id/deliverables/upload-intent` | Upload intent |

Project endpoints authorize membership by customer/seller organization and role. Change request may require quotation change order before work proceeds.

## 11. SaaS Subscription APIs (Phase 3)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/subscriptions/checkout` | Start subscription checkout |
| GET | `/me/subscriptions` | List subscriptions |
| POST | `/subscriptions/:id/cancel` | Cancel now/end-of-period based on policy |
| GET | `/tenants/:id` | Customer tenant status |
| POST | `/tenants/:id/domains` | Add custom domain |
| POST | `/tenants/:id/domains/:domainId/verify` | Verify domain |
| GET | `/admin/provisioning-jobs` | Operations queue |
| POST | `/admin/provisioning-jobs/:id/retry` | Retry failed job |

Tenant ID supplied by client is never sufficient for authorization. Resolve membership and product entitlement server-side.

## 12. Example Domain Error Codes

| Code | HTTP | Meaning |
|---|---:|---|
| `LISTING_NOT_PUBLISHED` | 404 | Listing not public or not found |
| `OFFER_NOT_PURCHASABLE` | 409 | Offer inactive or flow unsupported |
| `QUOTE_REQUEST_RATE_LIMITED` | 429 | Too many submissions |
| `QUOTATION_EXPIRED` | 409 | Quote no longer valid |
| `QUOTATION_VERSION_STALE` | 409 | Customer accepted stale version |
| `QUOTATION_ALREADY_CONVERTED` | 409 | Order already created |
| `PAYMENT_AMOUNT_MISMATCH` | 409 | Provider amount differs from order |
| `PAYMENT_EVENT_DUPLICATE` | 200 | Duplicate event safely ignored |
| `ENTITLEMENT_NOT_ACTIVE` | 403 | Download not allowed |
| `SELLER_SCOPE_FORBIDDEN` | 404/403 | Resource not in seller scope |
| `TENANT_CONTEXT_REQUIRED` | 403 | Tenant context missing |
| `TENANT_ACCESS_DENIED` | 404/403 | Caller lacks tenant membership |

## 13. API Security Checklist

- [ ] DTO validation and maximum lengths for every input.
- [ ] Unknown fields rejected on sensitive commands.
- [ ] No direct ORM entity serialization.
- [ ] Seller and tenant scope enforced in services/repositories.
- [ ] Customer and internal message DTO separated.
- [ ] Rate limits on login, reset, form, upload, checkout and download.
- [ ] Upload presign token bound to resource and user/session.
- [ ] Webhook signature and idempotency tested.
- [ ] Checkout/quotation acceptance use idempotency and database constraints.
- [ ] Admin sensitive actions audited and permission checked.
- [ ] CORS, CSRF, CSP, cookie flags and security headers configured.
- [ ] OpenAPI docs do not expose internal-only endpoints to public users.

---

**End of API Contract**
