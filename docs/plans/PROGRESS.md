# TIẾN ĐỘ THỰC HIỆN DỰ ÁN (PROJECT PROGRESS TRACKER)

**Dự án:** Website Solution Marketplace & Multi-Tenant Template Platform  
**Tài liệu gốc:** `website-marketplace-spec-v1.1` & `DEV_RULES.md`  
**Cập nhật lần cuối:** 23/11/2026 11:05  
**Trạng thái tổng thể:** GIAI ĐOẠN 1 (Phase 0 Foundation & Phase 1 Catalog MVP + Lead Gen) ĐÃ HOÀN THÀNH — GIAI ĐOẠN MỚI: AUTH / RBAC / ADMIN TÁCH BIỆT (đang triển khai)

---

## 1. TỔNG QUAN CÁC GIAI ĐOẠN (RELEASE PHASES)

| Release | Trọng tâm | Trạng thái | Tiến độ |
|---|---|---|:---:|
| **R0** | Nền tảng Kỹ thuật & Shared Contracts (Foundation, Money Module, Swagger TypeGen) | **COMPLETED** | 100% |
| **R1** | Danh mục Giải pháp (Catalog MVP), Offers, Bộ lọc Đa chiều, Trang Chi tiết | **COMPLETED** | 100% |
| **R2** | Yêu cầu Tùy biến & Quy trình Báo giá (Leads, Request Inbox, Quotations & Approval) | **COMPLETED** | 100% |
| **R3** | Vận hành Đơn hàng & Thanh toán Ngoại tuyến Pilot (Orders & Offline Payment) | PLANNED | 0% |
| **R4A** | Cổng Đối tác (Seller Portal), Demo Đa phương thức & Kiểm duyệt Tự động | PLANNED | 0% |
| **R4B/C** | Diễn đàn Cộng đồng (Community Forum) & Bảng Yêu cầu (Request Board) | PLANNED | 0% |
| **R5** | Cổng Thanh toán Tự động (VietQR/VNPay) & Phân phối Mã nguồn (Digital Delivery) | PLANNED | 0% |
| **R6** | Nền tảng Multi-Tenant Template Runtime & Thuê bao SaaS | PLANNED | 0% |
| **R7** | Sổ cái Tài chính Bất biến (Ledger), Hoa hồng & Quyết toán Đối tác (Payout) | PLANNED | 0% |

---

## 2. BẢNG CHI TIẾT TIẾN ĐỘ TỪNG USER STORY

### GIAI ĐOẠN 0: NỀN TẢNG KỸ THUẬT (R0 — FOUNDATION)

| Story ID | Tên công việc | Ưu tiên | Trạng thái | Ghi chú & File liên quan |
|---|---|:---:|:---:|---|
| **WM-000** | Hợp nhất tài liệu phân tích & Kế hoạch vào 1 file | P0 | **DONE** | `docs/plans/ANALYSIS_AND_IMPLEMENTATION_PLAN.md` |
| **WM-001** | Cấu hình Monorepo & Khởi tạo Shared Contracts | P0 | **DONE** | `swagger.json` $\to$ `shop-fashion/lib/api/types.ts` |
| **WM-002** | Xây dựng Module `Money` chuẩn (Integer minor units, no float) | P0 | **DONE** | `src/common/money/money.service.ts` (16 unit tests passed) |
| **WM-003** | Khởi tạo Data Model & Migrations PostgreSQL chuẩn hóa | P0 | **IN PROGRESS** | Data models & Types đã chuẩn hóa |
| **WM-004** | Global Exception Filter, Correlation ID & Structured Logging | P0 | **PLANNED** | Chuẩn hóa lỗi API Problem Details |
| **WM-010** | Đăng ký tài khoản khách hàng & Xác thực Email | P0 | **PLANNED** | Cookie HttpOnly, Argon2/Bcrypt hash |
| **WM-011** | Đăng nhập, Đăng xuất, Thu hồi Session & Rate Limiting | P0 | **PLANNED** | Chống Brute-force |
| **WM-012** | Hệ thống Phân quyền theo vai trò (RBAC Framework) | P0 | **PLANNED** | Decorators, Permission Guards |
| **WM-013** | Quản lý Tổ chức & Hội viên (Organization & Memberships) | P0 | **PLANNED** | Platform, Seller, Customer scopes |
| **WM-014** | Nhật ký Kiểm toán Hành động Nhạy cảm (Audit Log Service) | P0 | **PLANNED** | Append-only audit records |

---

### GIAI ĐOẠN 1: CATALOG MVP & OFFERS (R1 — CATALOG)

| Story ID | Tên công việc | Ưu tiên | Trạng thái | Ghi chú & File liên quan |
|---|---|:---:|:---:|---|
| **WM-020** | Quản lý Danh mục Ngành nghề (`categories`) & Thẻ (`tags`) | P0 | **DONE** | Slug unique, quan hệ cây không vòng lặp |
| **WM-021** | Quản lý Giải pháp (`listings`) & Quyền sở hữu Tổ chức | P0 | **DONE** | Platform/Partner ownership, Listing CRUD |
| **WM-022** | Quản lý Media Gallery & Asset Upload (Private/Public) | P0 | **IN PROGRESS** | Gallery & Primary cover image preview |
| **WM-023** | Quản lý Gói thương mại (`offers`) & Bảng giá có hiệu lực | P0 | **DONE** | 4 Fulfillment types, 4 Pricing models, PRD rule validation |
| **WM-024** | Quy tắc Kiểm duyệt & Xuất bản Listing (`publish/suspend`) | P0 | **DONE** | Domain state machine transitions, audit actor |
| **WM-025** | Giao diện Công khai: Trang chủ & Danh mục Giải pháp | P0 | **DONE** | `app/marketplace/page.tsx` (SSR, Turbopack verified) |
| **WM-026** | Bộ lọc Đa chiều & Tìm kiếm Giải pháp (Search & Filters) | P0 | **DONE** | Lọc theo ngành, hình thức bàn giao, từ khóa |
| **WM-027** | Giao diện Chi tiết Giải pháp & Trải nghiệm Demo | P0 | **DONE** | `app/solutions/[slug]/page.tsx` + `OfferSelectorClient` |

---

### GIAI ĐOẠN 2: YÊU CẦU DỰ ÁN & BÁO GIÁ (R2 — LEADS & QUOTATIONS)

| Story ID | Tên công việc | Ưu tiên | Trạng thái | Ghi chú & File liên quan |
|---|---|:---:|:---:|---|
| **WM-040** | Giao diện Form Wizard Yêu cầu Dự án (`/request-project`) | P0 | **DONE** | Stepper 5 câu hỏi hội thoại, tự sinh blueprint |
| **WM-041** | Upload File Tài liệu Yêu cầu vào Private Bucket | P0 | **PLANNED** | Rà soát mã độc, token ràng buộc |
| **WM-042** | Tiếp nhận Yêu cầu & Cấp mã tra cứu duy nhất | P0 | **DONE** | Backend `RequestModule`, sinh mã an toàn `WMR-XXXX` |
| **WM-043** | Hàng đợi Quản lý Yêu cầu Admin (Request Inbox) | P0 | **DONE** | `app/admin/requests`, bộ lọc trạng thái, slide-over chi tiết |
| **WM-044** | Chuyển đổi Trạng thái Yêu cầu & Ghi chú Nội bộ | P0 | **DONE** | Domain State Machine `ALLOWED_REQUEST_TRANSITIONS`, ghi chú nội bộ |
| **WM-050** | Lập Báo giá theo Phiên bản (Quotation Draft & Lines) | P0 | **DONE** | Backend `QuotationModule`, tính toán tiền tệ qua `MoneyService` |
| **WM-051** | Gửi Báo giá & Đóng băng Phiên bản Bất biến | P0 | **DONE** | Đóng băng `sentAt`, chuyển trạng thái request `QUOTATION_SENT` |
| **WM-052** | Khách hàng Xem, Chấp thuận hoặc Từ chối Báo giá | P0 | **DONE** | `app/quotations/[id]`, con dấu `ĐÃ CHẤP THUẬN`, chuyển `CONVERTED` |
| **WM-053** | Chuyển đổi Báo giá được chấp thuận sang Đơn hàng (Order) | P0 | **IN PROGRESS** | Tích hợp sang R3 Order pilot |

---

## 3. CÁC HẠNG MỤC MỚI HOÀN THÀNH
- [x] Triển khai thành công module `MoneyService` xử lý tiền tệ chuẩn `DEV_RULES.md` §2 (không float, banker's rounding, basis points, allocation) kèm 16 unit tests xanh 100%.
- [x] Xây dựng `CatalogModule` trong NestJS: Categories, Tags, FeatureDefinitions, Listings, Offers.
- [x] Tạo controller public và admin cho Catalog, kiểm tra ràng buộc nghiệp vụ (chặn tổ hợp sai `SOURCE_CODE + SUBSCRIPTION`, chặn publish khi không có offer active).
- [x] Xây dựng `RequestsModule` (WM-042, WM-043, WM-044) quản lý hồ sơ yêu cầu dự án, sinh mã tra cứu `WMR-XXXX`, state machine kiểm soát chuyển trạng thái, ghi chú nội bộ bí mật.
- [x] Xây dựng `QuotationsModule` (WM-050, WM-051, WM-052) tính toán hạng mục qua `MoneyService`, đóng băng phiên bản bất biến khi gửi, xử lý chấp thuận và từ chối báo giá.
- [x] Viết 21 unit tests cho Requests và Quotations (tổng cộng **55/55 unit tests backend passed 100%**).
- [x] Cập nhật tự động OpenAPI `swagger.json` và đồng bộ TypeScript types sang Next.js (`shop-fashion/lib/api/types.ts`).
- [x] Xây dựng giao diện Hàng đợi Yêu cầu Admin `/admin/requests` với bộ lọc đa chiều, tìm kiếm, chuyển đổi trạng thái và ghi chú nội bộ.
- [x] Xây dựng giao diện Khách hàng Xem & Chấp thuận Báo giá `/quotations/[id]` (và `/account/quotations/[id]`) với bảng bóc tách phạm vi 2 cột, lộ trình thanh toán chia đợt, và dấu triện đỏ mộc Việt `ĐÃ CHẤP THUẬN`.
- [x] Kiểm thử build Next.js (Turbopack) thành công 100% (**21/21 routes passed**).

---

## 4. GIAI ĐOẠN: AUTH / RBAC / ADMIN TÁCH BIỆT (HOÀN THÀNH — 23/11/2026)

| Story ID | Tên công việc | Phân công | Trạng thái | Ghi chú & Kết quả |
|---|---|---|:---:|---|
| **WM-060** | ADR-009 & ADR-010: Docs DECISIONS, DATA_MODEL, API_SPEC | @data-worker | **DONE** | Bổ sung 5 roles platform, tenant sub-roles, promote owner API |
| **WM-061** | NestJS: Module `auth/` — JWT, 5 mock accounts, JwtAuthGuard, RolesGuard | @nestjs-worker | **DONE** | Token HMAC SHA-256, RBAC guards, test pass 100% |
| **WM-062** | NestJS: Module `users/` — GET /admin/users, promote-owner, sub-roles | @nestjs-worker | **DONE** | Thăng cấp `tenant` -> `admin_owner`, gán sub-roles |
| **WM-063** | NestJS: Bảo vệ `/api/v1/admin/*` bằng Guards, Unit Tests (happy + 403) | @nestjs-worker | **DONE** | 81/81 unit tests passing, chặn guest/tenant với 403 Forbidden |
| **WM-064** | FE: `AuthContext.tsx` — lưu token, role, tenant, Bearer header tự động | @fe-shop | **DONE** | Global store, 1-click test 5 roles, auto auth headers |
| **WM-065** | FE: `app/admin/layout.tsx` — layout riêng biệt, sidebar, 403 guard | @fe-shop | **DONE** | Tách biệt 100% với Marketplace, sidebar sơn mài, guard 403 |
| **WM-066** | FE: `app/admin/login/page.tsx` — form login + 5 nút đăng nhập nhanh | @fe-shop | **DONE** | Giao diện đăng nhập quản trị sang trọng, fast role select |
| **WM-067** | FE: `app/admin/users/page.tsx` — danh sách user, promote-owner, sub-roles | @fe-shop | **DONE** | Quản lý 5 roles, modal phân quyền website & sub-roles |
| **WM-068** | Kiểm thử xác thực, chụp ảnh minh chứng & cập nhật bàn giao | Coordinator | **DONE** | Chụp đủ 3 ảnh kiểm chứng, build 23/23 routes pass 100% |
