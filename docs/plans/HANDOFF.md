# HANDOFF — 2026-11-22T15:45:00+07:00 — Phase 0 Foundation & Phase 1 Catalog MVP + Lead Gen

## 1. Mục tiêu hiện tại
- Hoàn thành trọn vẹn mục tiêu cốt lõi của Giai đoạn 1 (Release R0 Foundation & Release R1 Catalog MVP + Lead Gen Wizard UI) theo tài liệu đặc tả `website-marketplace-spec-v1.1` và quy chuẩn `DEV_RULES.md`.

## 2. Trạng thái
- Nhánh: `main` · build: OK (Cả NestJS và Next.js build xanh 100%) · test: 29/29 tests passed (MoneyModule + CatalogModule + App).
- Đã xong:
  - [x] Xuất bản tài liệu hợp nhất: `docs/plans/ANALYSIS_AND_IMPLEMENTATION_PLAN.md` và `website-marketplace-spec-v1.1/ANALYSIS_AND_IMPLEMENTATION_PLAN.md`.
  - [x] Module `MoneyService` tuân thủ nghiêm ngặt `DEV_RULES.md` §2: số nguyên minor units, HALF_EVEN Banker's Rounding, tính chiết khấu basis points, phân bổ allocation không thất thoát số lẻ (16 unit tests).
  - [x] Module `CatalogModule` trong NestJS: Categories phân cấp, Tags, Feature Definitions, Listings, Offers 4 loại fulfillment và ma trận kiểm tra tương thích nghiệp vụ (12 unit tests).
  - [x] Đồng bộ tự động Swagger `swagger.json` $\to$ OpenAPI TypeScript types (`shop-fashion/lib/api/types.ts`).
  - [x] Trang Khám phá Giải pháp Next.js `/marketplace`: Hero banner, Category tabs, Fulfillment filter pills, Solution Cards.
  - [x] Trang Chi tiết Giải pháp Next.js `/solutions/[slug]`: Showcase gallery, tính năng kỹ thuật, thẻ xác minh người bán, và bộ chọn gói thương mại tương tác `OfferSelectorClient` (bóc tách phạm vi bao gồm, không bao gồm, giấy phép).
  - [x] Trang Form Wizard Yêu cầu Dự án Next.js `/request-project`: Stepper 4 bước, tự động sinh mã tra cứu bảo mật ngẫu nhiên `WMR-XXXX`.
  - [x] Cập nhật bảng theo dõi tiến độ tổng thể `docs/plans/PROGRESS.md`.
- Đang dở:
  - API lưu trữ Request và Quotation Engine ở backend (WM-042 backend persistence, WM-050).
- Chưa bắt đầu:
  - Chuyển đổi báo giá sang đơn hàng (WM-053).
  - Thanh toán ngoại tuyến và Admin request inbox (WM-043, WM-061).

## 3. Việc tiếp theo (làm đúng thứ tự)
1. Xây dựng `RequestModule` trong NestJS backend: lưu trữ `quote_requests`, `request_attachments`, gửi email xác nhận và cấp mã `WMR-XXXX` từ API.
2. Xây dựng `QuotationModule` trong NestJS backend: Admin lập báo giá theo phiên bản có line items tính tiền integer qua `MoneyService`.
3. Xây dựng Admin Request Inbox (`/admin/requests`) và trang duyệt báo giá cho khách (`/account/quotations/:id`).
4. Cập nhật `docs/plans/PROGRESS.md` và `docs/plans/HANDOFF.md`.

## 4. Quyết định đã chốt trong phiên
- Tiền tệ: 100% qua `MoneyService`, không dùng float, VND lưu đồng nguyên.
- Kiểm duyệt Offer: Chặn tổ hợp vi phạm PRD (chặn `SOURCE_CODE + SUBSCRIPTION`, `SUBSCRIPTION` chỉ cho `SAAS`).
- Prerendering Next.js 16: Áp dụng `<Suspense>` bọc toàn bộ component truy cập runtime hooks (`searchParams`, `params`, `usePathname`).

## 5. Đang chờ duyệt
- Cổng thanh toán ưu tiên cho Phase 5: VietQR động ngân hàng.
- Lựa chọn giải pháp Object Storage: S3-compatible API (MinIO local, Cloudflare R2 production).

## 6. Rủi ro / lưu ý / bẫy
- Khi thêm endpoint mới vào NestJS, luôn chạy `node dist/generate-swagger.js` rồi chạy `npm run generate:types` bên Next.js để giữ types luôn đồng bộ 100%.

## 7. Cách chạy/kiểm tra nhanh
- Chạy backend test: `cd e:\WEBV2\shop-befashion && pnpm test` (29 tests passed)
- Chạy frontend build: `cd e:\WEBV2\shop-fashion && npm run build` (Build thành công 100%)
- Khởi động dev server:
  - Backend: `cd e:\WEBV2\shop-befashion && pnpm start:dev` (chạy trên port 3001)
  - Frontend: `cd e:\WEBV2\shop-fashion && npm run dev` (chạy trên port 3000)
- Truy cập trình duyệt:
  - `http://localhost:3000/marketplace`
  - `http://localhost:3000/solutions/restaurant-pro`
  - `http://localhost:3000/request-project`

## 8. Tham chiếu
- `docs/plans/ANALYSIS_AND_IMPLEMENTATION_PLAN.md`
- `docs/plans/PROGRESS.md`
- `DEV_RULES.md`
- `docs/delivery/BACKLOG.md`
