# Đặc tả bổ sung — Seller Submission, Demo chi tiết và Kiểm duyệt Listing

**Version:** 1.2-draft (addendum)
**Ngày:** 22/11/2026
**Phụ thuộc:** PRD §6.4, §9.3; DATA_MODEL §5; API_SPEC §7; BACKLOG WM-EP03
**Release:** R4A

## 1. Mục tiêu

Cho phép seller (cá nhân/studio/agency) đăng giải pháp, mô tả demo đủ chi tiết để người mua đánh giá mà không cần liên hệ, gửi chờ duyệt, nhận phản hồi theo từng trường, sửa và được xuất bản. Admin có công cụ kiểm duyệt có checklist, kiểm tra tự động và quy trình gỡ vi phạm.

**Không thuộc phạm vi R4A:** seller thu tiền qua nền tảng, payout, chạy code seller trên runtime chung, demo do nền tảng host.

## 2. Luồng nghiệp vụ

```text
Seller Application ──duyệt──▶ Seller APPROVED + ký Seller Agreement
        │
        ▼
Listing DRAFT ──submit──▶ AUTO_CHECKING ──pass──▶ SUBMITTED/IN_REVIEW
                               │fail                    │
                               ▼                        ├─▶ CHANGES_REQUESTED ─▶ (seller sửa) ─▶ SUBMITTED
                          CHECK_FAILED (sửa)            ├─▶ REJECTED (có lý do, có thể kháng nghị 1 lần)
                                                        └─▶ PUBLISHED
PUBLISHED ──seller sửa──▶ Revision mới (bản đang live giữ nguyên) ──duyệt──▶ thay thế
PUBLISHED ──vi phạm/khiếu nại──▶ SUSPENDED ──xử lý──▶ PUBLISHED | ARCHIVED
```

Quy tắc:
- Seller chỉ submit khi seller `APPROVED` và đã chấp nhận Seller Agreement phiên bản hiện hành.
- Revision đã submit bị khóa chỉnh sửa; seller có thể rút lại (`WITHDRAWN`).
- Thay đổi giá, phạm vi, license, nguồn demo của listing đang live bắt buộc revision mới và duyệt lại; sửa lỗi chính tả/ảnh có thể áp "duyệt nhanh" theo cờ rủi ro do admin cấu hình.
- Bản đang live chỉ đổi khi revision mới được duyệt (atomic swap `current_published_revision_id`).
- Mọi chuyển trạng thái đi qua service, ghi audit và activity.

## 3. Mô tả demo chi tiết (cấu trúc bắt buộc)

### 3.1 Loại demo (`demo_kind`)

| Loại | Mô tả | Rủi ro/Kiểm soát |
|---|---|---|
| `EXTERNAL_LINK` | URL demo seller tự host (mặc định) | Gắn nhãn "liên kết ngoài"; không proxy, không fetch phía server ngoài kiểm tra có kiểm soát; mở tab mới `rel="noopener noreferrer"` |
| `APPROVED_EMBED` | Iframe nhúng từ domain allowlist | `sandbox` hạn chế, CSP `frame-src` allowlist, admin duyệt từng domain |
| `VIDEO` | Video walkthrough (liên kết nền tảng video hoặc file đã quét) | Chỉ nhúng nhà cung cấp allowlist |
| `SCREENSHOTS` | Bộ ảnh theo trang/tính năng | Ảnh qua pipeline media (quét, resize) |
| `SANDBOX_ACCOUNT` | Demo có tài khoản (admin/user) | Thông tin đăng nhập dùng cho demo công khai, ghi rõ reset định kỳ; không dùng thông tin thật |
| `PLATFORM_HOSTED` | Nền tảng host từ template runtime | **Sau R6** |

Bắt buộc tối thiểu: `SCREENSHOTS` ≥ 4 ảnh **và** một trong `EXTERNAL_LINK`/`VIDEO`/`APPROVED_EMBED`.

### 3.2 Mẫu mô tả demo (trường dữ liệu)

| Nhóm | Trường | Bắt buộc |
|---|---|---|
| Tổng quan | Mục đích, đối tượng dùng, ngành, ngôn ngữ giao diện | ✓ |
| Tính năng | Danh sách tính năng (khóa từ `feature_definitions` + mô tả tự do), mỗi tính năng có ảnh/mốc video/đường dẫn demo | ✓ (≥ 3) |
| Trang/màn hình | Danh sách trang có trong gói (home, about, product, blog, checkout…) | ✓ |
| Kỹ thuật | Stack/framework + phiên bản, DB, yêu cầu hosting, trình duyệt/thiết bị hỗ trợ, responsive | ✓ |
| Chất lượng | Điểm Lighthouse tự khai (kèm ngày đo), a11y, SEO cơ bản; nền tảng đo lại khi duyệt | Khuyến khích |
| Tích hợp | Cổng thanh toán, email, analytics, API bên thứ ba | Nếu có |
| Gói bao gồm / không bao gồm | Source, DB seed, tài liệu, ảnh/font, hosting, cài đặt, nội dung | ✓ |
| Tài khoản demo | URL admin, user/pass demo, chính sách reset, giới hạn | Nếu có admin |
| Giới hạn đã biết | Tính năng chưa hoàn thiện, lỗi đã biết | ✓ (có thể "Không") |
| Hỗ trợ & cập nhật | Thời gian hỗ trợ, kênh, cam kết cập nhật, changelog | ✓ |
| License & bên thứ ba | Loại license (D-06), danh sách tài nguyên bên thứ ba (font/ảnh/plugin) kèm license, công bố nội dung AI nếu có | ✓ |
| Bằng chứng sở hữu | Tuyên bố tác giả/quyền phân phối; với mã nguồn: cam kết + (tuỳ rủi ro) lịch sử repo/ảnh chụp màn hình dev | ✓ |
| Tài liệu | Link/tệp hướng dẫn cài đặt, cấu trúc thư mục | ✓ với SOURCE_CODE |

Mô tả dùng rich text đã sanitize; ảnh có `alt` bắt buộc.

## 4. Kiểm tra tự động (trước khi vào hàng đợi duyệt)

| Kiểm tra | Chi tiết | Kết quả |
|---|---|---|
| Đủ trường bắt buộc, độ dài, ngôn ngữ | Schema validation | PASS/FAIL |
| URL demo | Cú pháp, scheme HTTPS, chặn IP nội bộ/localhost/metadata (SSRF), kiểm tra tồn tại (HEAD có timeout) từ worker cô lập, không theo redirect ra ngoài vô hạn; kiểm tra danh sách chặn (phishing/malware) | PASS/WARN/FAIL |
| Ảnh/video | MIME thật, kích thước, quét mã độc, phát hiện trùng lặp ảnh với listing khác (perceptual hash) | PASS/WARN |
| Gói source (nếu có) | Quét mã độc, tìm secret (khóa API, `.env`), SCA dependency + license (GPL/AGPL cảnh báo), checksum SHA-256, kiểm tra tệp thực thi lạ | PASS/WARN/FAIL |
| Trùng lặp nội dung | So khớp tiêu đề/mô tả/ảnh với listing có sẵn (nghi sao chép) | WARN |
| Giá/offer | Tổ hợp fulfillment/pricing hợp lệ (ADR-003) | PASS/FAIL |

Kết quả lưu ở `listing_review_checks`; `FAIL` chặn submit, `WARN` đẩy lên cho reviewer xem.

## 5. Checklist duyệt thủ công (reviewer)

1. Danh tính seller và quyền phân phối: hồ sơ khớp, không có strike nghiêm trọng.
2. Demo truy cập được, **khớp mô tả** (không quảng cáo quá thực tế).
3. Tính năng khai báo có thật trên demo; không có nội dung vi phạm.
4. Bản quyền: ảnh/font/plugin có license; không phải "nulled/cracked/ripped".
5. License và phạm vi offer rõ ràng, khớp D-06; giá hợp lý, không gây hiểu nhầm (giá "từ…" ghi rõ).
6. Source: không mã độc/backdoor/tracking ẩn; tài liệu cài đặt chạy được (kiểm tra mẫu).
7. Hỗ trợ/cập nhật/hoàn tiền rõ ràng.
8. Nội dung SEO không spam, không keyword stuffing.
9. Tuân thủ chính sách nội dung.

Phản hồi theo **từng trường** (`listing_review_comments`: field_path, severity BLOCKER/SUGGESTION, comment). Seller xem được; ghi chú nội bộ tách riêng (`moderation_note_private`).

## 6. Strike, kháng nghị và takedown

- Báo cáo vi phạm từ người dùng/chủ sở hữu bản quyền qua form công khai → `takedown_notices` (reporter, listing, claim_type: COPYRIGHT/MALWARE/MISLEADING/OTHER, evidence, status).
- Admin có thể `SUSPEND` ngay khi có bằng chứng đáng tin cậy; seller được thông báo và có quyền phản hồi.
- Hệ thống strike: cảnh cáo → tạm khóa đăng bài → đóng seller. Hành động có lý do, audit.
- Kháng nghị 1 lần cho `REJECTED`/`SUSPENDED`, do reviewer khác xử lý.

## 7. Data model bổ sung

```text
listing_demos
  id, listing_revision_id (FK), demo_kind, url (nullable), embed_domain_id (nullable),
  title, description, credentials_encrypted (nullable, demo-only), reset_policy,
  status, last_checked_at, last_check_result, sort_order, created_at

listing_revisions (bổ sung)
  structured_content JSONB (schema_version)   -- nội dung typed theo mục 3.2
  review_status, submitted_at, withdrawn_at, auto_check_status

listing_review_checks
  id, listing_revision_id, check_code, result(PASS/WARN/FAIL), detail_json, checked_at

listing_review_comments
  id, listing_revision_id, reviewer_user_id, field_path, severity, comment, resolved_at, created_at

legal_documents(id, doc_type, version, content_ref, effective_from, status)
legal_acceptances(id, document_id, user_id, organization_id, accepted_at, ip_hash)

seller_strikes(id, seller_organization_id, reason_code, listing_id nullable, issued_by, issued_at, expires_at)
takedown_notices(id, listing_id, reporter_contact_encrypted, claim_type, evidence_json,
                 status, handled_by, handled_at, outcome)
embed_allowlist(id, hostname, purpose, status, approved_by)
listings.current_published_revision_id (FK listing_revisions)
```

Ràng buộc: `unique(listing_id, revision_number)`; chỉ một revision `IN_REVIEW`/`SUBMITTED` mỗi listing; `credentials_encrypted` không bao giờ vào public DTO.

## 8. API bổ sung

| Method | Endpoint | Mục đích | Auth |
|---|---|---|---|
| POST | `/seller/listings/:id/revisions` | Tạo revision từ bản live hoặc nháp | Seller |
| PUT | `/seller/listings/:id/revisions/:rev/demos` | Cập nhật demo | Seller |
| POST | `/seller/media/presign` | Upload ảnh/video/source | Seller |
| POST | `/seller/listings/:id/revisions/:rev/submit` | Submit duyệt | Seller |
| POST | `/seller/listings/:id/revisions/:rev/withdraw` | Rút lại | Seller |
| GET | `/seller/listings/:id/revisions/:rev/feedback` | Phản hồi theo trường | Seller |
| GET | `/admin/moderation/queue` | Hàng đợi, lọc SLA/rủi ro | Admin/Reviewer |
| GET | `/admin/moderation/revisions/:rev` | Chi tiết + kết quả check | Reviewer |
| POST | `/admin/moderation/revisions/:rev/comments` | Phản hồi theo trường | Reviewer |
| POST | `/admin/moderation/revisions/:rev/decision` | `APPROVE`/`REQUEST_CHANGES`/`REJECT` + lý do | Reviewer |
| POST | `/admin/sellers/:id/strikes` | Phát hành strike | Admin |
| POST | `/public/takedown-notices` | Báo cáo vi phạm | Public (rate limit/CAPTCHA) |
| GET/POST | `/admin/embed-allowlist` | Quản lý allowlist | Admin |

Mã lỗi mới: `SELLER_NOT_APPROVED` (403), `AGREEMENT_NOT_ACCEPTED` (409), `REVISION_LOCKED` (409), `REVISION_ALREADY_IN_REVIEW` (409), `AUTO_CHECK_FAILED` (422), `DEMO_URL_REJECTED` (422).

## 9. Yêu cầu chức năng và quy tắc bổ sung

| ID | Yêu cầu | P |
|---|---|---|
| FR-SEL-11 | Seller nhập mô tả demo có cấu trúc theo §3 | R4A |
| FR-SEL-12 | Kiểm tra tự động trước khi vào hàng đợi | R4A |
| FR-SEL-13 | Reviewer duyệt bằng checklist và phản hồi theo trường | R4A |
| FR-SEL-14 | Seller ký Seller Agreement có phiên bản | R4A |
| FR-SEL-15 | Báo cáo vi phạm công khai, takedown, strike, kháng nghị | R4A |
| FR-SEL-16 | Hiển thị huy hiệu: Seller xác minh, Demo đã kiểm, Source đã quét | R4A |

| ID | Quy tắc |
|---|---|
| BR-21 | Không xuất bản listing nếu thiếu demo tối thiểu theo §3.1 hoặc có kiểm tra tự động `FAIL`. |
| BR-22 | Bản live chỉ đổi khi revision mới được duyệt. |
| BR-23 | Seller không xem được ghi chú nội bộ của reviewer. |
| BR-24 | Thông tin đăng nhập demo không dùng dữ liệu thật và không xuất hiện trong log. |
| BR-25 | Nền tảng không proxy hay fetch URL demo ngoài worker kiểm tra cô lập. |
| BR-26 | Listing bị gỡ do bản quyền không được xuất bản lại khi chưa giải quyết khiếu nại. |

## 10. Backlog

#### WM-034 — Seller submission wizard + demo form
**P1 · R4A · Phụ thuộc:** WM-032, WM-022
- [ ] Form theo §3.2, lưu nháp tự động
- [ ] Upload ảnh/video qua presign
- [ ] Xem trước giống trang public
Acceptance: không submit được khi thiếu trường bắt buộc; preview không lộ dữ liệu nội bộ; seller khác không truy cập được bản nháp.

#### WM-035 — Demo management và allowlist embed
**P1 · R4A · Phụ thuộc:** WM-034
- [ ] Các loại demo, nhãn liên kết ngoài, embed sandbox + allowlist
- [ ] Mã hóa credentials demo
Acceptance: URL nội bộ/localhost bị từ chối; embed ngoài allowlist bị chặn bởi CSP; credentials không vào public DTO/log.

#### WM-036 — Auto-check pipeline
**P1 · R4A · Phụ thuộc:** WM-034, WM-081
- [ ] Worker cô lập kiểm tra URL, quét file, SCA/license
- [ ] Lưu `listing_review_checks`, retry/timeout
Acceptance: FAIL chặn submit; WARN hiển thị cho reviewer; worker không có quyền mạng nội bộ.

#### WM-037 — Moderation console
**P1 · R4A · Phụ thuộc:** WM-036, WM-014
- [ ] Hàng đợi, SLA, checklist, phản hồi theo trường, quyết định
- [ ] Atomic swap revision khi approve
Acceptance: approve tạo bản live đúng một lần; decision audit; hai reviewer cùng lúc không tạo hai quyết định.

#### WM-038 — Takedown, strike, kháng nghị
**P1 · R4A · Phụ thuộc:** WM-037
- [ ] Form báo cáo công khai, xử lý, thông báo, strike, appeal
Acceptance: suspend ngay lập tức loại listing khỏi public; lịch sử đầy đủ; rate limit chống lạm dụng báo cáo.

#### WM-039 — Seller Agreement và legal acceptance
**P1 · R4A · Phụ thuộc:** WM-030
- [ ] `legal_documents`, `legal_acceptances`, chặn submit khi chưa ký bản mới
Acceptance: cập nhật phiên bản yêu cầu seller ký lại trước lần submit tiếp theo.

## 11. Test case bổ sung

| ID | Kịch bản | Kỳ vọng |
|---|---|---|
| TC-SEL-01 | Seller chưa APPROVED submit | 403 `SELLER_NOT_APPROVED` |
| TC-SEL-02 | Demo URL trỏ tới `http://169.254.169.254/` | Từ chối `DEMO_URL_REJECTED` |
| TC-SEL-03 | Seller A đọc revision seller B | 404 |
| TC-SEL-04 | Sửa giá listing đang live | Tạo revision; bản live không đổi đến khi duyệt |
| TC-SEL-05 | Hai reviewer approve đồng thời | Chỉ một thành công, bên kia 409 |
| TC-SEL-06 | Upload source chứa `.env` có khóa | Auto-check FAIL |
| TC-SEL-07 | Public DTO listing | Không chứa credentials demo, ghi chú nội bộ, key file private |
| TC-SEL-08 | Takedown hợp lệ | Listing SUSPENDED, seller nhận thông báo, có thể kháng nghị |
