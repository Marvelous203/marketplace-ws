# Multi-Tenant & Template Platform — Implementation Backlog

**Version:** 1.0-draft  
**Parent documents:** `MULTI_TENANT_TEMPLATE_ARCHITECTURE.md`, `TECHNICAL_SPEC.md`, `DATA_MODEL.md`  
**Purpose:** Các story kỹ thuật chi tiết cho Runtime Platform. Các Story ID bắt đầu từ `MT-` để không xung đột với marketplace backlog `WM-*`.

## Delivery rules

- Làm theo dependency; không làm template builder trước tenant/site isolation.
- Mọi story có migration, tests, logging và rollback note khi thay đổi dữ liệu/hạ tầng.
- MVP phải hoàn tất EPIC MT-01 đến MT-05 và chứng minh 2–3 Site chạy cùng Runtime.
- MT-06 trở đi là controlled rollout; không đưa vào MVP chỉ để “đủ kiến trúc”.

## Epic summary

| Epic | Nội dung | Priority | Phase |
|---|---|---:|---|
| MT-01 | Tenant, Site & Membership Foundation | P0 | A |
| MT-02 | Domain Mapping & Tenant Resolver | P0 | A |
| MT-03 | Tenant Isolation & Security | P0 | A |
| MT-04 | Template Registry & Versioning | P0 | B |
| MT-05 | Site Config & Page Block Runtime | P0 | B |
| MT-06 | Module Registry & Installation | P1 | C |
| MT-07 | Site Provisioning | P1 | D |
| MT-08 | Release, Upgrade & Rollback | P1 | E |
| MT-09 | Dedicated Deployment | P2 | F |
| MT-10 | Source Code Delivery | P2 | G |
| MT-11 | Extension SDK & Governance | P2 | H |
| MT-12 | Runtime Operations & Performance | P1 | A–E |

---

## MT-01 — Tenant, Site & Membership Foundation

### MT-001 — Create tenant and site data model
**Priority:** P0 · **Depends on:** marketplace DB foundation

Tasks:
- [ ] Add `tenants`, `tenant_memberships`, `sites` tables.
- [ ] Add enums/check constraints for lifecycle states and isolation tier.
- [ ] Add unique slug constraints and timestamps/archive fields.
- [ ] Add composite unique `(tenant_id, id)` for Site relation safety.
- [ ] Add migrations, seeds and rollback notes.

Acceptance criteria:
- Tenant can own multiple Site records.
- Site cannot be associated with an invalid/non-existing Tenant.
- Duplicate membership `(tenant_id, user_id)` is rejected.
- State values are validated in DB and domain service.

### MT-002 — Tenant membership and resource policy
**Priority:** P0 · **Depends on:** MT-001, Identity/Access Control

Tasks:
- [ ] Define tenant owner/admin/editor/viewer permission matrix.
- [ ] Implement membership lookup and authorization policy.
- [ ] Add invite/accept flow only if included in customer portal MVP.
- [ ] Add audit events for role changes and membership removal.

Acceptance criteria:
- User can only list/read Sites belonging to a Tenant they are authorized to access.
- Role change is permission-checked and audited.
- Removing the last owner is blocked unless ownership transfer is completed.

### MT-003 — Site lifecycle and administration
**Priority:** P0 · **Depends on:** MT-001, MT-002

Tasks:
- [ ] Implement create/update/archive Site service.
- [ ] Define DRAFT, PROVISIONING, ACTIVE, SUSPENDED, ARCHIVED transitions.
- [ ] Add platform admin Site list/detail filters.
- [ ] Add audit and activity history.

Acceptance criteria:
- Only permitted roles can update Site metadata.
- Suspended/archived Site cannot be published through public runtime.
- Invalid state transitions return domain errors.

---

## MT-02 — Domain Mapping & Tenant Resolver

### MT-010 — Implement domain normalization and domain model
**Priority:** P0 · **Depends on:** MT-001

Tasks:
- [ ] Add `site_domains` model/table.
- [ ] Normalize hostname (lowercase, IDNA/punycode, trailing dot, port handling).
- [ ] Add global unique constraint for normalized hostname.
- [ ] Enforce one primary domain per Site.
- [ ] Define platform subdomain vs custom domain types.

Acceptance criteria:
- Two Sites cannot claim the same normalized hostname.
- Domain alias can map to one Site only.
- Hostname parser rejects malformed/unsafe values.

### MT-011 — Domain ownership verification
**Priority:** P1 · **Depends on:** MT-010

Tasks:
- [ ] Generate DNS TXT verification challenge.
- [ ] Verify TXT/CNAME using provider-neutral adapter.
- [ ] Add verification expiry/reissue and attempt limits.
- [ ] Store verification result and audit actor/time.
- [ ] Keep domain inactive until verified.

Acceptance criteria:
- Unverified custom domain cannot serve Site content.
- Verification challenge is non-guessable, time-limited and single-use/rotatable.
- Verification can be retried without duplicate domain records.

### MT-012 — Runtime host resolver
**Priority:** P0 · **Depends on:** MT-010

Tasks:
- [ ] Implement trusted-host resolver service.
- [ ] Resolve hostname → verified domain → Site → Tenant.
- [ ] Reject unknown, unverified, suspended and archived mappings.
- [ ] Create immutable `SiteRuntimeContext` per request.
- [ ] Add structured logs and safe error pages.

Acceptance criteria:
- Two different domains resolve to the correct independent Sites.
- No default-tenant fallback occurs when resolution fails.
- Client-provided tenant/site IDs cannot override resolved context.

### MT-013 — Domain mapping cache and invalidation
**Priority:** P1 · **Depends on:** MT-012, Redis

Tasks:
- [ ] Add normalized-host cache with TTL.
- [ ] Invalidate on domain verify/change/delete and Site state change.
- [ ] Add safe negative caching with short TTL.
- [ ] Add cache metrics.

Acceptance criteria:
- Domain change takes effect within documented invalidation window.
- Host A cache cannot return Site B mapping.
- Cache failure falls back safely to DB, with bounded load behavior.

---

## MT-03 — Tenant Isolation & Security

### MT-020 — Add tenant/site context to runtime repository layer
**Priority:** P0 · **Depends on:** MT-001, MT-012

Tasks:
- [ ] Implement request-scoped TenantContext/SiteRuntimeContext.
- [ ] Require context for tenant/site repositories.
- [ ] Add tenant-aware repository helper or query policy.
- [ ] Ensure workers carry validated scope.

Acceptance criteria:
- Missing context fails closed for tenant-owned queries.
- No endpoint can choose arbitrary tenant scope from request body/query.
- Worker jobs validate tenant/site ownership before processing.

### MT-021 — Apply PostgreSQL RLS and composite constraints
**Priority:** P0 · **Depends on:** MT-020

Tasks:
- [ ] Identify all tenant-owned tables and define RLS policies.
- [ ] Set context with transaction-local settings; verify connection-pool behavior.
- [ ] Add composite tenant/site foreign keys where possible.
- [ ] Ensure migration/worker/admin service paths use explicit scoped bypass with audit where necessary.

Acceptance criteria:
- RLS fails closed when tenant context is absent.
- Tenant A cannot read/write Tenant B rows using direct SQL under app role.
- Context does not leak between reused DB connections.

### MT-022 — Cross-tenant authorization regression suite
**Priority:** P0 · **Depends on:** MT-020, MT-021

Tasks:
- [ ] Add two-tenant/two-site fixtures.
- [ ] Test GET/POST/PATCH/DELETE/export/download isolation.
- [ ] Test IDOR by swapping Site, asset and resource IDs.
- [ ] Test admin/support elevated access audit.
- [ ] Run integration tests against PostgreSQL, not SQLite mocks.

Acceptance criteria:
- All cross-tenant negative cases return non-disclosing 403/404 policy result.
- Test suite runs in CI and blocks merge on failure.
- Support access requires explicit permission and reason code.

### MT-023 — Tenant-scoped object storage
**Priority:** P1 · **Depends on:** MT-020, media module

Tasks:
- [ ] Use opaque object IDs and tenant/site namespace.
- [ ] Add private bucket defaults and short-lived signed URLs.
- [ ] Validate file ownership before download.
- [ ] Add scan/quarantine state and retention cleanup.

Acceptance criteria:
- User from Tenant A cannot download Tenant B private asset.
- Signed URL generation checks ownership/entitlement.
- Upload is rejected until file scan policy passes.

---

## MT-04 — Template Registry & Versioning

### MT-030 — Create template registry model
**Priority:** P0 · **Depends on:** MT-001

Tasks:
- [ ] Add `templates` and `template_versions` tables.
- [ ] Add manifest/config schema/block schema storage.
- [ ] Store immutable artifact URI and SHA-256 digest.
- [ ] Add draft/review/published/deprecated states.
- [ ] Validate semantic version uniqueness.

Acceptance criteria:
- `(template_id, version)` is unique.
- A released artifact cannot be overwritten by update.
- Only approved/published versions can be assigned to production Site.

### MT-031 — Template manifest validator
**Priority:** P0 · **Depends on:** MT-030

Tasks:
- [ ] Define manifest JSON Schema.
- [ ] Validate required/optional modules and runtime API range.
- [ ] Validate supported locale and block declarations.
- [ ] Reject unknown/unsafe manifest fields.

Acceptance criteria:
- Invalid manifest cannot be published.
- Compatibility report lists missing/incompatible modules/runtime API.
- Manifest schema version is explicit.

### MT-032 — Site template assignment and pinning
**Priority:** P0 · **Depends on:** MT-030, MT-031, MT-012

Tasks:
- [ ] Add `site_template_assignments` and assignment history.
- [ ] Enforce one current assignment per Site.
- [ ] Implement assignment preview and activation.
- [ ] Audit actor, source order/offer and previous version.

Acceptance criteria:
- Site uses exactly one active Template Version at a time.
- Publishing a new template version does not update existing Sites.
- Unauthorized users cannot change template assignment.

### MT-033 — Template artifact build and trust pipeline
**Priority:** P1 · **Depends on:** MT-030, CI/CD

Tasks:
- [ ] Build allowlisted template packages.
- [ ] Scan dependencies and licenses; generate SBOM.
- [ ] Sign artifact and verify digest at publish/deploy.
- [ ] Store artifact in private registry/storage.

Acceptance criteria:
- Runtime only accepts trusted artifact digest.
- Artifact tampering causes release rejection.
- Build is reproducible from committed source and lockfile.

---

## MT-05 — Site Config & Page Block Runtime

### MT-040 — Site configuration schema and revisioning
**Priority:** P0 · **Depends on:** MT-032

Tasks:
- [ ] Add `site_configurations` with `schema_version` and `revision`.
- [ ] Define branding/theme/nav/SEO/locale JSON schemas.
- [ ] Add config validation and revision history.
- [ ] Add schema migration interface.

Acceptance criteria:
- Invalid config cannot be published.
- Config update increments revision and invalidates relevant cache.
- Secrets are rejected from config schema or stored as secret references only.

### MT-041 — Registered block renderer
**Priority:** P0 · **Depends on:** MT-031, MT-040

Tasks:
- [ ] Implement typed Block Registry.
- [ ] Add first-party blocks: hero, rich-text, image, CTA, feature-grid, contact.
- [ ] Validate block props on save/publish and render.
- [ ] Sanitize rich-text and unknown block fallback.

Acceptance criteria:
- Only registered block types render.
- Invalid props cannot cause unsafe execution.
- Unknown blocks do not crash the whole page and emit structured error.

### MT-042 — Site pages and immutable revisions
**Priority:** P0 · **Depends on:** MT-040, MT-041

Tasks:
- [ ] Add `site_pages`, `site_page_revisions`.
- [ ] Add draft/preview/publish/archive workflow.
- [ ] Unique `(site_id, locale, slug)`.
- [ ] Add content preview token with limited scope/TTL.

Acceptance criteria:
- Published page references a validated immutable revision.
- Updating draft does not change current published page.
- Preview token cannot be used to edit or access other Site pages.

### MT-043 — Website Runtime rendering
**Priority:** P0 · **Depends on:** MT-012, MT-032, MT-041, MT-042

Tasks:
- [ ] Create Next.js hostname-aware runtime app.
- [ ] Load runtime snapshot using trusted context.
- [ ] Render Site page with pinned template and registered blocks.
- [ ] Add not-found/suspended/maintenance states.
- [ ] Add metadata, canonical URL and locale handling.

Acceptance criteria:
- At least two domains render distinct Site content from same Runtime build.
- Site A template/config changes do not affect Site B.
- SSR output has correct title, description, canonical and locale.

### MT-044 — Runtime cache isolation
**Priority:** P1 · **Depends on:** MT-013, MT-043

Tasks:
- [ ] Define cache key including site/template/config/page/locale revisions.
- [ ] Add publish/domain invalidation events.
- [ ] Separate public cache from personalized/private data.
- [ ] Add host poisoning and cache collision tests.

Acceptance criteria:
- Same path on two domains cannot return other Site content.
- Page publish invalidates only impacted Site/page keys.
- Authenticated/admin responses are not stored in shared public cache.

---

## MT-06 — Module Registry & Installation

### MT-050 — Module and module version registry
**Priority:** P1 · **Depends on:** MT-030

Tasks:
- [ ] Add `modules`, `module_versions`.
- [ ] Define dependencies, conflicts, permission and configuration manifests.
- [ ] Add compatibility resolver for runtime/template/module.

Acceptance criteria:
- Incompatible module cannot be installed.
- Dependency/conflict rules are deterministic and tested.

### MT-051 — Site module installation lifecycle
**Priority:** P1 · **Depends on:** MT-050, MT-020

Tasks:
- [ ] Add `site_module_installations`.
- [ ] Implement install/enable/disable state machine.
- [ ] Add idempotent install jobs and module migrations.
- [ ] Preserve data on disable by default.

Acceptance criteria:
- Module is enabled only after entitlement, compatibility and permission checks.
- Disabled module API returns policy-safe result.
- Repeated install request does not duplicate schema/data.

### MT-052 — Module entitlements and server-side guards
**Priority:** P1 · **Depends on:** WM order/offer entitlement, MT-051

Tasks:
- [ ] Map Offer entitlement to Site capability.
- [ ] Add server-side entitlement guard per module API.
- [ ] Add expiry/grace/suspension behavior.

Acceptance criteria:
- Hiding a module menu is not the only control; API/data access is blocked when unauthorized.
- Entitlement snapshot can be traced to order/subscription.

---

## MT-07 — Site Provisioning

> **Dependency note:** `WM-090/WM-091` phát sinh và xác thực sự kiện subscription/order ở tầng commerce. `MT-060` tiêu thụ event đó để tạo Tenant/Site và cấu hình Runtime. Không tạo hai provisioning state machine song song.

### MT-060 — Provisioning job and orchestrator
**Priority:** P1 · **Depends on:** MT-001, MT-032, MT-051, Order/Subscription events

Tasks:
- [ ] Add `provisioning_jobs`, outbox event and idempotency key.
- [ ] Define job state machine/retry/backoff/dead-letter.
- [ ] Implement orchestration steps for Tenant/Site/config/template/module.
- [ ] Add manual retry/cancel UI and audit.

Acceptance criteria:
- Duplicate order/subscription events do not create duplicate Site.
- Partial failure is resumable or safely compensatable.
- Active state is set only after runtime health check passes.

### MT-061 — Seed website content and configuration
**Priority:** P1 · **Depends on:** MT-060, MT-042

Tasks:
- [ ] Define template seed data/preset.
- [ ] Copy default pages/navigation/config without sharing mutable records.
- [ ] Replace demo content with customer-provided values where available.

Acceptance criteria:
- Two Sites created from same Template receive independent content records.
- Updating Site A seed-derived content does not mutate Site B.

### MT-062 — Platform subdomain and custom domain provisioning
**Priority:** P1 · **Depends on:** MT-010, MT-011, MT-060

Tasks:
- [ ] Allocate unique platform subdomain.
- [ ] Add DNS verification and SSL adapter.
- [ ] Add domain health monitoring.

Acceptance criteria:
- Subdomain collision is prevented.
- Custom domain does not become active before verification and TLS readiness.

---

## MT-08 — Release, Upgrade & Rollback

### MT-070 — Compatibility and upgrade planner
**Priority:** P1 · **Depends on:** MT-031, MT-050

Tasks:
- [ ] Compare template/module/runtime versions.
- [ ] Produce breaking-change/config migration report.
- [ ] Identify affected Site cohort.

Acceptance criteria:
- Upgrade blocked when incompatible dependency has no valid migration.
- Report shows current/target version and affected Site count.

### MT-071 — Template/module preview upgrade
**Priority:** P1 · **Depends on:** MT-070, preview runtime

Tasks:
- [ ] Create preview release pointer or isolated preview environment.
- [ ] Generate temporary preview URL/token.
- [ ] Add approval step and change summary.

Acceptance criteria:
- Preview does not mutate production Site assignment/content.
- Preview access expires and is restricted to authorized users.

### MT-072 — Controlled rollout and rollback
**Priority:** P1 · **Depends on:** MT-071

Tasks:
- [ ] Add canary/cohort rollout.
- [ ] Add migration checkpoint and release audit.
- [ ] Implement code/config pointer rollback.
- [ ] Add forward-fix path for irreversible data migrations.

Acceptance criteria:
- Upgrade to Site A does not affect Site B.
- Rollback restores prior compatible template/module assignment.
- Destructive migration cannot run without backup/approval gate.

---

## MT-09 — Dedicated Deployment

### MT-080 — Deployment target abstraction
**Priority:** P2 · **Depends on:** MT-060

Tasks:
- [ ] Define shared/dedicated/customer-managed target interface.
- [ ] Add `deployment_targets`, `deployments` and release digest.
- [ ] Add secret reference and health check contract.

Acceptance criteria:
- Provisioning orchestrator does not contain provider-specific logic.
- Deployment record pins immutable image/release digest.

### MT-081 — Dedicated target adapter
**Priority:** P2 · **Depends on:** MT-080

Tasks:
- [ ] Implement first supported dedicated runtime provider.
- [ ] Provision app/DB/network/secrets/monitoring.
- [ ] Add backup/restore and rollback runbook.

Acceptance criteria:
- Dedicated tenant has isolated credentials and target.
- Deployment failure is visible and retryable.

---

## MT-10 — Source Code Delivery

### MT-090 — Delivery bundle manifest and entitlement
**Priority:** P2 · **Depends on:** delivery/order/license foundation

Tasks:
- [ ] Define package allowlist and version lock.
- [ ] Build manifest with template/module/extension versions.
- [ ] Validate order/license scope.

Acceptance criteria:
- Bundle contains only packages included in customer entitlement.
- Bundle manifest is immutable and references order/license.

### MT-091 — Reproducible source bundle pipeline
**Priority:** P2 · **Depends on:** MT-090

Tasks:
- [ ] Build archive from approved packages.
- [ ] Generate checksum/SBOM/license notices/setup docs.
- [ ] Malware/dependency scan and artifact signing.
- [ ] Store private artifact with expiring download entitlement.

Acceptance criteria:
- Artifact integrity verifies by checksum/signature.
- Unauthorized user cannot download bundle.
- Marketplace secrets, production credentials and unrelated customer data never enter bundle.

---

## MT-11 — Extension SDK & Governance

### MT-100 — Extension manifest and SDK contracts
**Priority:** P2 · **Depends on:** module contracts

Tasks:
- [ ] Define extension lifecycle, hooks, API permissions and compatibility.
- [ ] Build local developer SDK/docs/example.
- [ ] Define first-party vs verified partner vs customer-specific trust tier.

Acceptance criteria:
- Extension manifest validates permissions and supported API versions.
- Extension cannot request undeclared permission.

### MT-101 — Extension review and signed artifact pipeline
**Priority:** P2 · **Depends on:** MT-100, artifact pipeline

Tasks:
- [ ] Add submission/review/approval state.
- [ ] Scan source/dependencies/license and produce SBOM.
- [ ] Build/sign artifact; store immutable digest.
- [ ] Add revoke/deprecate procedure.

Acceptance criteria:
- Unapproved/unsigned extension cannot be installed in production.
- Revoked extension is blocked from new installation and has incident workflow for active sites.

### MT-102 — Isolated custom extension deployment
**Priority:** P2 · **Depends on:** MT-080, MT-101

Tasks:
- [ ] Define isolated service/container execution contract.
- [ ] Add auth service-to-service and scoped API credentials.
- [ ] Add network/resource limits and observability.

Acceptance criteria:
- Customer-specific extension cannot access unrelated tenant data.
- Extension timeout/failure does not crash shared Website Runtime.

---

## MT-12 — Runtime Operations & Performance

### MT-110 — Runtime observability
**Priority:** P1 · **Depends on:** MT-012, MT-043

Tasks:
- [ ] Add request/site/release correlation.
- [ ] Add domain resolve/render/error metrics.
- [ ] Add dashboards and actionable alerts.

Acceptance criteria:
- Operator can identify affected Site/template version from an incident trace.
- Metrics avoid high-cardinality PII labels.

### MT-111 — Runtime load and cache test
**Priority:** P1 · **Depends on:** MT-044

Tasks:
- [ ] Define representative site/domain/page mix.
- [ ] Load test resolver and public rendering.
- [ ] Test cache collision and invalidation under concurrent publish.

Acceptance criteria:
- Test report records p95/p99, error rate and cache hit ratio.
- No cross-site cache response under concurrent requests.

### MT-112 — Tenant backup and restore strategy
**Priority:** P1 · **Depends on:** MT-001, MT-020

Tasks:
- [ ] Define platform DB backup and point-in-time recovery.
- [ ] Define per-tenant export/restore limitation for shared DB.
- [ ] Define object storage versioning/retention.
- [ ] Run restore drill.

Acceptance criteria:
- RPO/RTO targets are documented and approved.
- Restore drill evidence exists before public SaaS launch.

---

## MVP Acceptance Gate — Shared Runtime

MVP architecture gate không được đánh dấu Done cho đến khi tất cả điều kiện sau hoàn thành:

- [ ] Có ít nhất hai Tenant và hai Site fixture/seed, mỗi Site có domain và config riêng.
- [ ] Một Website Runtime build phục vụ được cả hai Site.
- [ ] Mỗi Site pin được template version riêng.
- [ ] Module/feature có thể bật cho Site A và tắt ở Site B.
- [ ] Domain resolver chỉ nhận domain hợp lệ/verified.
- [ ] Tenant/site context được inject server-side; client không override được.
- [ ] RLS + integration tests chứng minh không đọc/ghi chéo Tenant.
- [ ] Page blocks chỉ chạy từ registry allowlist.
- [ ] Cache không lẫn HTML/config giữa domain.
- [ ] Có audit trail cho thay đổi domain/template/module.
- [ ] Có backup/restore runbook và health monitoring cơ bản.

**Thứ tự triển khai kỹ thuật đề xuất:** `MT-001 → MT-003 → MT-010 → MT-012 → MT-020 → MT-021 → MT-022 → MT-030 → MT-031 → MT-032 → MT-040 → MT-041 → MT-042 → MT-043 → MT-044`. Sau khi MVP gate pass, tiếp tục module registry và provisioning.
