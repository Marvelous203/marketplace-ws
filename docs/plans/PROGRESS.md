# TIẾN ĐỘ THỰC HIỆN DỰ ÁN (PROJECT PROGRESS TRACKER)

**Dự án:** Website Solution Marketplace & Multi-Tenant Template Platform  
**Tài liệu gốc:** `website-marketplace-spec-v1.1` & `DEV_RULES.md`  
**Cập nhật lần cuối:** 22/11/2026 15:40  
**Trạng thái tổng thể:** GIAI ĐOẠN 1 (Phase 0 Foundation & Phase 1 Catalog MVP + Lead Gen) ĐÃ HOÀN THÀNH MỤC TIÊU CỐT LÕI

---

## 1. TỔNG QUAN CÁC GIAI ĐOẠN (RELEASE PHASES)

| Release | Trọng tâm | Trạng thái | Tiến độ |
|---|---|---|:---:|
| **R0** | Nền tảng Kỹ thuật & Shared Contracts (Foundation, Money Module, Swagger TypeGen) | **COMPLETED** | 100% |
| **R1** | Danh mục Giải pháp (Catalog MVP), Offers, Bộ lọc Đa chiều, Trang Chi tiết | **COMPLETED** | 100% |
| **R2** | Yêu cầu Tùy biến (Custom Project Wizard UI & Mã tra cứu) | **IN PROGRESS** | 70% |
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

### GIAI ĐOẠN 1 (TIẾP): YÊU CẦU DỰ ÁN & BÁO GIÁ (R2 — LEADS & QUOTATIONS)

| Story ID | Tên công việc | Ưu tiên | Trạng thái | Ghi chú & File liên quan |
|---|---|:---:|:---:|---|
| **WM-040** | Giao diện Form Wizard Yêu cầu Dự án (`/request-project`) | P0 | **DONE** | Stepper 4 bước, Guest & Member, tùy chọn "Chưa rõ" |
| **WM-041** | Upload File Tài liệu Yêu cầu vào Private Bucket | P0 | **PLANNED** | Rà soát mã độc, token ràng buộc |
| **WM-042** | Tiếp nhận Yêu cầu & Cấp mã tra cứu duy nhất | P0 | **DONE** | Sinh mã tham chiếu ngẫu nhiên `WMR-XXXX` |
| **WM-043** | Hàng đợi Quản lý Yêu cầu Admin (Request Inbox) | P0 | **PLANNED** | Phân công phụ trách, bộ lọc theo trạng thái |
| **WM-044** | Chuyển đổi Trạng thái Yêu cầu & Ghi chú Nội bộ | P0 | **PLANNED** | Internal notes tách biệt DTO |
| **WM-050** | Lập Báo giá theo Phiên bản (Quotation Draft & Lines) | P0 | **PLANNED** | Tính toán tiền tệ integer qua module Money |
| **WM-051** | Gửi Báo giá & Đóng băng Phiên bản Bất biến | P0 | **PLANNED** | Link tra cứu an toàn qua email |
| **WM-052** | Khách hàng Xem, Chấp thuận hoặc Từ chối Báo giá | P0 | **PLANNED** | Ghi nhận timestamp, IP, phiên bản điều khoản |
| **WM-053** | Chuyển đổi Báo giá được chấp thuận sang Đơn hàng (Order) | P0 | **PLANNED** | Transaction bất biến, chống trùng lặp |

---

## 3. CÁC HẠNG MỤC MỚI HOÀN THÀNH
- [x] Triển khai thành công module `MoneyService` xử lý tiền tệ chuẩn `DEV_RULES.md` §2 (không float, banker's rounding, basis points, allocation) kèm 16 unit tests xanh 100%.
- [x] Xây dựng `CatalogModule` trong NestJS: Categories, Tags, FeatureDefinitions, Listings, Offers.
- [x] Tạo controller public và admin cho Catalog, kiểm tra ràng buộc nghiệp vụ (chặn tổ hợp sai `SOURCE_CODE + SUBSCRIPTION`, chặn publish khi không có offer active).
- [x] Viết 12 unit tests cho `CatalogService` đạt kết quả xanh 100% (tổng cộng 29 unit tests backend đều passed).
- [x] Cập nhật tài liệu Swagger OpenAPI tự động và sinh file TypeScript types sang Next.js (`lib/api/types.ts`).
- [x] Xây dựng trang Khám phá giải pháp `/marketplace` với bộ lọc đa chiều (ngành nghề, hình thức bàn giao, từ khóa).
- [x] Xây dựng trang Chi tiết giải pháp `/solutions/[slug]` với bộ chọn gói thương mại tương tác `OfferSelectorClient` (bóc tách phạm vi bao gồm, không bao gồm, giấy phép).
- [x] Xây dựng trang Form Wizard Yêu cầu Dự án `/request-project` 4 bước kèm mã tham chiếu bảo mật `WMR-XXXX`.
- [x] Kiểm thử build Next.js (Turbopack) thành công 100% không còn lỗi prerender / dynamic data.
