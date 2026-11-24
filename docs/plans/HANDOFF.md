# HANDOFF — 2026-11-23T11:06:00+07:00 — Auth / RBAC / Admin Separation

## 1. Mục tiêu hiện tại

Triển khai hệ thống Authentication (JWT), Authorization phân quyền RBAC 5 roles, Admin UI tách biệt hoàn toàn với marketplace frontend, và sub-role scoped theo tenant (ADR-009, ADR-010).

## 2. Trạng thái

- Nhánh: `main` · build: OK · test: 81/81 passed (100%).
- **Đã hoàn thành toàn bộ trong phiên:**
  - [x] `DECISIONS.md`: Bổ sung ADR-009 (5-Role Platform Architecture & Promotion Workflow) và ADR-010 (Tenant-Scoped Sub-Roles & Dedicated Admin Separation).
  - [x] `DATA_MODEL.md`: Bổ sung §16 — bảng `roles`, `user_roles`, `tenant_sub_role_definitions`, `tenant_sub_role_assignments`, `audit_logs`.
  - [x] `API_SPEC.md`: Bổ sung §14 (Auth: `/login`, `/me`, `/logout`) và §15 (Admin: `GET /admin/users`, `POST /promote-owner`, `POST /tenants/:id/sub-roles`).
  - [x] Backend NestJS (`shop-befashion`):
    - Module `auth/`: JWT Token HMAC SHA-256, 5 mock accounts, `JwtAuthGuard`, `RolesGuard`, `@Roles()`.
    - Module `users/`: `AdminUsersController`, promote `tenant` $\to$ `admin_owner`, gán `sub_roles` scoped theo `tenant_id`.
    - Bảo vệ các endpoint `/api/v1/admin/*` (`requests`, `quotations`, `catalog`) bằng Guards.
    - 26 unit tests mới (tổng bộ test: 81/81 tests passed 100%).
    - Đồng bộ `swagger.json` và `lib/api/types.ts`.
  - [x] Frontend Next.js (`shop-fashion`):
    - `lib/context/AuthContext.tsx`: Quản lý session 5 roles, auto auth headers, 1-click test.
    - `app/admin/layout.tsx`: Tách biệt 100% với Marketplace, sidebar sơn mài, header context, màn hình chặn 403 Forbidden trang nhã.
    - `app/admin/login/page.tsx`: Cổng đăng nhập quản trị, fast auth 5 roles.
    - `app/admin/users/page.tsx`: Quản lý user & modal phân quyền website (`super_admin` promote `tenant` $\to$ `admin_owner`, cấu hình sub-roles).
    - `app/admin/requests/page.tsx`: Gỡ bỏ navbar khách hàng, chạy trong layout admin biệt lập.
    - `npm run build`: 23/23 routes compiled với 0 lỗi.
  - [x] Kiểm thử trực quan (Evidence Screenshots):
    - `admin_login_portal.png`
    - `admin_users_rbac.png`
    - `admin_requests_isolated.png`

- **Chưa bắt đầu:**
  - Chuyển đổi báo giá sang đơn hàng (WM-053, R3).
  - Thanh toán online (R5).

## 3. Quyết định đã chốt trong phiên

| Quyết định | Nội dung |
|---|---|
| ADR-009 | 5 roles: `guest`, `tenant`, `dev_freelance`, `admin_owner`, `super_admin`. Chỉ `super_admin` promote `tenant` → `admin_owner`. |
| ADR-010 | Sub-roles scoped theo `tenant_id`. Admin UI (`/admin/*`) tách biệt 100% với marketplace. |
| JWT scope | `accessToken` embed `role` + `tenant_id` (nullable). Guard check cả hai. |
| Audit | Mọi RBAC action ghi `audit_logs` với before/after summary (không ghi token/hash). |
| Mock accounts | Seed 5 mock accounts (1 mỗi role) trong dev/test. |

## 4. Việc tiếp theo (khi các worker hoàn thành)

1. Chờ @nestjs-worker báo cáo `pnpm test` pass 100%.
2. Chờ @fe-shop báo cáo `npm run build` pass 0 errors.
3. @monitor kiểm thử end-to-end (login → promote → sub-role assign → 403 screen).
4. Merge vào `main`, cập nhật `PROGRESS.md`.
5. Mở sprint tiếp theo: R3 Order pilot (WM-053).

## 5. Đang chờ duyệt

- Thời hạn token: access 15min + refresh 7 ngày (có thể rút ngắn theo security review).
- Sub-role permission codes cụ thể cho từng tenant type (food, retail, service, ...).

## 6. Rủi ro / lưu ý

- `app/admin/layout.tsx` PHẢI không import bất kỳ component nào từ `app/marketplace/` hay `components/shop/`.
- JWT `tenant_id` phải được validate server-side trên mọi `/api/v1/admin/tenants/:tenantId/*` request; không tin client claim.
- Sau khi thêm module auth mới vào NestJS: chạy `node dist/generate-swagger.js` rồi `npm run generate:types` ở Next.js.

## 7. Cách chạy / kiểm tra nhanh

```bash
# Backend
cd e:\WEBV2\shop-befashion && pnpm test
cd e:\WEBV2\shop-befashion && pnpm start:dev   # port 3001

# Frontend
cd e:\WEBV2\shop-fashion && npm run build
cd e:\WEBV2\shop-fashion && npm run dev         # port 3000

# Admin UI
http://localhost:3000/admin/login
http://localhost:3000/admin/users
http://localhost:3001/api-docs
```

## 8. Tham chiếu

- `website-marketplace-spec-v1.1/website-marketplace-spec/DECISIONS.md` (ADR-009, ADR-010)
- `website-marketplace-spec-v1.1/website-marketplace-spec/DATA_MODEL.md` (§16 Auth/RBAC tables)
- `website-marketplace-spec-v1.1/website-marketplace-spec/API_SPEC.md` (§14 Auth, §15 Admin)
- `docs/plans/PROGRESS.md`
- `DEV_RULES.md`
