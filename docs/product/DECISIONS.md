# Product and Architecture Decisions

**Version:** 1.0-draft  
**Date:** 22/11/2026

This file records baseline decisions and open items. Change a decision only after impact analysis across PRD, data model, API contract, backlog and tests.

## 1. Accepted Baseline Decisions

### ADR-001 — Hybrid marketplace ownership

**Decision:** Support both platform-owned and partner-owned listings. All listings reference an owner organization. Seed a platform organization/seller so first-party catalog follows the same model as partner catalog.

**Reason:** Avoid special cases and prepare for seller onboarding without building a full seller portal in the first release.

**Consequence:** Seller-scoped authorization and moderation status are part of the foundation even if partner self-service is Phase 2.

### ADR-002 — Listing and Offer are separate entities

**Decision:** A Listing describes a solution; an Offer describes a purchasable/bookable commercial package.

**Reason:** One website solution may be sold as source code, implementation service, subscription or consultation package with different prices and terms.

**Consequence:** Catalog detail aggregates active offers; order stores immutable listing/offer snapshots.

### ADR-003 — Fulfillment type is separate from pricing model

**Decision:** `fulfillment_type` and `pricing_model` are independent but validated as compatible.

**Reason:** A fixed price does not tell the system how the service is delivered; a source package and a managed implementation may both have fixed prices.

**Consequence:** State machines and post-payment actions branch by fulfillment type.

### ADR-004 — PostgreSQL for transactional core

**Decision:** Use PostgreSQL for marketplace source of truth.

**Reason:** Orders, quotations, payment events, subscription and ledger require strong transactions, constraints and reporting joins.

**Consequence:** Use JSONB selectively for requirements snapshot/metadata, not to replace relations. If MongoDB is mandated, design a separate consistency strategy before implementation.

### ADR-005 — Modular monolith first

**Decision:** Next.js frontend + NestJS modular monolith backend, worker process for async jobs.

**Reason:** Keeps deployment and transactions manageable for MVP while preserving module boundaries.

**Consequence:** No microservices until measured scale/team boundaries justify them.

### ADR-006 — Human-assisted MVP sales operations

**Decision:** Admin manually reviews requests, prepares quotations and coordinates delivery. Fixed-price automated checkout may be added when provider/commercial policy is selected.

**Reason:** Validates demand and pricing without premature investment in complex marketplace finance.

**Consequence:** Manual payment recording must be permissioned, auditable and reconciled.

### ADR-007 — SaaS tenant is not seller organization

**Decision:** Customer SaaS runtime tenant is a separate entity from marketplace seller/customer organizations.

**Reason:** Seller workspace controls marketplace publishing; SaaS tenant is the environment where purchased software runs.

**Consequence:** Use separate authorization context and isolation tests.

### ADR-008 — Immutable commercial snapshots

**Decision:** Order and quotation versions preserve exact offer, price, scope, license and terms at transaction time.

**Reason:** Listings/offers evolve; historical commitments must not change retroactively.

**Consequence:** Offer changes create new price/revision records rather than rewriting transaction history.

## 2. Assumptions Used in This Specification

| ID | Assumption | Why it is reasonable | Must validate by |
|---|---|---|---|
| A-01 | Initial market is Vietnam; default UI language Vietnamese and currency VND | User/product context | Before commercial launch |
| A-02 | Platform acts as the initial primary seller and service coordinator | Allows controlled MVP | Business owner |
| A-03 | Partner sellers are invite/review-based, not unrestricted open registration | Reduces fraud/quality risk | Before Phase 2 |
| A-04 | Custom request can be submitted as guest | Lowers lead friction | Product/Privacy owner |
| A-05 | One order can contain one primary offer in MVP | Simplifies fulfillment and tax/payment | Before cart/multi-item checkout |
| A-06 | No automatic split payment or escrow in MVP | Reduces settlement complexity | Before partner payout |
| A-07 | Managed service project may have deposit/milestone terms | Typical custom delivery model | Contracts/Finance |
| A-08 | Source code requires explicit license and version metadata | Prevents ambiguous usage rights | Legal/Business |
| A-09 | SaaS subscription can provision tenant through adapter/product-specific provisioner | Product-independent architecture | Before first SaaS offer |

## 3. Decisions Required Before Launch

| ID | Question | Options / impact | Owner |
|---|---|---|---|
| D-01 | Who is merchant of record? | Platform vs seller; affects payment, invoice, liability, refunds | Business/Legal |
| D-02 | How is tax shown/calculated? | Tax-inclusive vs exclusive; tax category/rate; invoice obligations | Finance/Legal |
| D-03 | How are seller payments collected? | Platform collects and settles vs seller direct collection | Business/Finance |
| D-04 | Commission model? | Flat %, category-based, fixed listing fee, subscription or hybrid | Business |
| D-05 | Seller verification level? | Individual, business, tax/identity proof and retention | Legal/Operations |
| D-06 | Source license types? | Single project, multiple projects, unlimited, resale restriction, updates | Legal/Product |
| D-07 | Refund policy by fulfillment? | Before download, after download, before work starts, milestone-based | Business/Legal |
| D-08 | Managed service warranty/SLA? | Warranty duration, response time, maintenance | Delivery owner |
| D-09 | SaaS data lifecycle? | Export, cancellation, grace period, deletion, backup | Product/Legal |
| D-10 | Payment gateway/provider? | Must support webhook signature, refunds, subscription and marketplace needs | Finance/Engineering |
| D-11 | E-invoice/e-signature needs? | Provider integration and evidence/contract requirements | Finance/Legal |
| D-12 | Multi-language/multi-currency launch? | Vietnamese/VND only vs EN/FX from day one | Product |

## 4. Change Control

Any change to one of the decisions above must include:

1. Business reason and expected outcome.
2. Impact on user journey and release scope.
3. Data migration/backfill impact.
4. API compatibility impact.
5. Security/authorization/privacy impact.
6. Test plan and rollback/forward-fix plan.
7. Update to affected `FR-*`, `BR-*`, `WM-*` identifiers.

---

**End of Decisions**
