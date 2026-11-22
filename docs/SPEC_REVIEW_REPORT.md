# Báo cáo rà soát bộ đặc tả — Website Marketplace

**Vai trò rà soát:** Product Owner + Senior Software Architect
**Phạm vi:** README, PRD, DECISIONS, TECHNICAL_SPEC, DATA_MODEL, API_SPEC, BACKLOG, MULTI_TENANT_TEMPLATE_ARCHITECTURE, MULTI_TENANT_TEMPLATE_BACKLOG
**Ngày:** 22/11/2026

---

## 0. Kết luận

Bộ tài liệu có nền tảng tốt (ADR rõ, snapshot bất biến, idempotency, tách Listing/Offer, tách Tenant/Seller, tiền dùng integer). **Chưa nên bắt đầu build** cho đến khi xử lý 3 nhóm vấn đề:

1. **Thiếu hai năng lực cốt lõi bạn muốn:** (a) seller đăng giải pháp, chờ duyệt, kèm mô tả demo chi tiết; (b) diễn đàn thảo luận và mua bán/tìm giải pháp. Hiện seller bị đẩy sang R4 và gần như chỉ có khung "moderation"; diễn đàn chưa tồn tại trong tài liệu nào.
2. **Hai mô hình dữ liệu chồng chéo:** `DATA_MODEL.md` (`saas_tenants`, `tenant_memberships`, `tenant_domains`, `provisioning_jobs`) trùng và xung đột với `MULTI_TENANT_TEMPLATE_ARCHITECTURE.md` (`tenants`, `sites`, `site_domains`, `provisioning_jobs`). Ghi chú "hợp nhất khi triển khai" chưa đủ.
3. **Xung đột phạm vi MVP:** README/PRD nói MVP = lead + báo giá thủ công, nhưng `MULTI_TENANT_TEMPLATE_BACKLOG` đòi MVP gate gồm shared runtime nhiều site, RLS, block registry. Đây là hai MVP khác nhau.

Ngoài ra có khoảng 20 điểm không nhất quán hoặc thiếu nhỏ hơn (mục 2).

---

## 1. Điểm mạnh nên giữ

- ADR-001…008: ownership hybrid, Listing/Offer tách, snapshot bất biến, modular monolith.
- Quy tắc tiền (integer minor units), idempotency, outbox, webhook verify, DTO tách internal/customer.
- Backlog có DoR/DoD, test matrix, dependency map, release gate.
- Nguyên tắc "không execute code seller trong shared runtime" (ADR-MT-005) — đúng và quan trọng khi mở cho seller upload.

---

## 2. Findings (mức độ: 🔴 chặn build · 🟠 phải sửa trước khi chia task · 🟡 nên sửa)

### Nhóm A — Phạm vi và sản phẩm

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| A-01 | 🔴 | Không có diễn đàn/community ở bất kỳ tài liệu nào. | Thêm `COMMUNITY_FORUM_SPEC.md` (đã soạn), Epic WM-EP12, FR-COM-*, BR-COM-*. |
| A-02 | 🔴 | Luồng "người khác đăng giải pháp, chờ duyệt, kèm demo chi tiết" quá sơ sài: chỉ có `demo_url`, `preview_mode`, `moderation_note_private`. Thiếu mô tả demo có cấu trúc, tài khoản demo, bằng chứng quyền sở hữu, kiểm tra tự động, checklist duyệt, feedback theo trường, quy trình gỡ vi phạm (takedown). | Thêm `SELLER_SUBMISSION_AND_DEMO_SPEC.md` (đã soạn), stories WM-034…039. |
| A-03 | 🟠 | Seller self-service ở R4 (P1) trong khi mục tiêu cuối của bạn xoay quanh việc cho người khác đăng bán. | Chuyển "Partner listing submission (không thanh toán qua nền tảng)" lên R4A ngay sau pilot R3. Thanh toán/payout partner vẫn giữ R5–R7. |
| A-04 | 🟠 | D-01 (merchant of record), D-03 (ai thu tiền), D-05 (seller verification) đang "trước launch thương mại" nhưng sẽ chặn R4/R5 khi seller bán thật. | Nâng D-01/D-03/D-05/D-06 thành **gate của R4A/R5**. Mặc định tạm: nền tảng là merchant of record, quyết toán thủ công (A-06 hiện có). |
| A-05 | 🟠 | MVP bị định nghĩa hai nơi (PRD §16 vs MT MVP Acceptance Gate). | Chốt: **Marketplace MVP = R0–R3** (không có runtime). **Runtime Platform = track riêng, bắt đầu sau R3, gắn với R6 (SaaS)**. Trừ khi bạn muốn tự dùng runtime để host demo (xem mục 6). |
| A-06 | 🟠 | MT MVP gate yêu cầu "module bật/tắt theo site" và "backup/restore, monitoring" nhưng các story tương ứng (MT-050/051, MT-112, MT-110) là P1 và nằm ngoài EPIC MT-01…05. | Hoặc nâng các story đó lên P0, hoặc bỏ các dòng đó khỏi gate. Ghi rõ trong MT backlog. |
| A-07 | 🟠 | "SaaS" trong PRD (phần mềm chạy tenant) khác với "Website Runtime" trong MT (site chạy trên runtime chung). Enum `fulfillment_type` chưa có chỗ cho "Hosted Website trên runtime". | Quyết định: giữ `SAAS` và thêm `product_code` (ví dụ `WEBSITE_RUNTIME`) trong offer/plan; hoặc thêm `HOSTED_SITE`. Ghi vào ADR-003. |
| A-08 | 🟡 | KPI "Demo Engagement Rate", "Request Conversion", "Funnel" cần dữ liệu sự kiện nhưng không có bảng/luồng analytics. | Thêm `analytics_events` (ẩn danh hóa, consent) hoặc dùng công cụ ngoài; thêm story. |
| A-09 | 🟡 | `FR-CAT-09` (yêu thích/so sánh) P2 không có story; không có Reports/Dispute. | Chấp nhận P2 nhưng liệt kê trong backlog "Later". |

### Nhóm B — Mô hình dữ liệu

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| B-01 | 🔴 | Trùng thực thể: `saas_tenants` ↔ `tenants`+`sites`; `tenant_domains` ↔ `site_domains`; `provisioning_jobs` hai định nghĩa (khóa theo `tenant_id` vs `site_id`); `tenant_status` hai bộ giá trị. | **Canonical:** bỏ `saas_tenants`/`tenant_domains`; dùng `tenants` + `sites` + `site_domains` từ MT. `subscriptions.tenant_id` (hoặc `site_id`) thay vì tạo tenant riêng. Một `provisioning_jobs` duy nhất (MT-060 sở hữu). Cập nhật ADR-007 thêm "Site". |
| B-02 | 🟠 | `listings` vừa là bản nháp có thể sửa vừa là nội dung công khai → mâu thuẫn với "revision frozen for review" (WM-032) và "listing published tiếp tục hiển thị khi sửa". | Thêm `listings.current_published_revision_id`. Nội dung công khai đọc từ revision đã duyệt; `listings` giữ identity, owner, slug, status. Snapshot revision là cấu trúc typed, không chỉ blob. |
| B-03 | 🟠 | Order chỉ có `status` chung; PRD §12.4 yêu cầu fulfillment status riêng (source/managed/SaaS) nhưng không có cột/bảng. | Thêm `order_items.fulfillment_status` (text + check theo fulfillment_type) hoặc bảng `order_fulfillments`. |
| B-04 | 🟠 | Chưa có bảng cho: invoice/receipt (FR-ORD-09), payment schedule/deposit/milestone (FR-QUO-08), tax codes/rates, CMS pages/FAQ (WM-082), role/permission tables đầy đủ, session, token verify/reset, legal documents + consent, terms acceptance. | Bổ sung nhóm bảng: `payment_schedules`, `invoices`, `tax_rates`, `cms_pages`, `legal_documents`, `legal_acceptances`, `auth_tokens`, `user_sessions`. |
| B-05 | 🟠 | Offer chưa liên kết được tới Template/Module version (MT mô tả `product_configuration_snapshot` nhưng DATA_MODEL không có). | Thêm `offer_template_links`, `offer_module_links` (hoặc JSONB có schema) và `order_items.configuration_snapshot`. |
| B-06 | 🟠 | `quotations.status` và `quotation_versions.status` đều có, không nói cái nào là nguồn sự thật. | Quy định: trạng thái hiệu lực nằm ở version; `quotations.status` là dẫn xuất/cache, hoặc bỏ. |
| B-07 | 🟠 | `request_status` có cả `CONVERTED` và `CLOSED_WON` — trùng nghĩa. | Chọn: `CONVERTED` = đã tạo order; `CLOSED_WON` = thắng ngoài hệ thống (offline). Ghi vào state machine. |
| B-08 | 🟡 | Không định nghĩa khi user đăng ký thì có tạo `CUSTOMER` organization không. | Mặc định: tạo workspace một thành viên khi lần đầu cần (quote/order). Ghi ADR. |
| B-09 | 🟡 | `quotation_lines.quantity` kiểu chưa nêu; `tax_rate_snapshot` kiểu chưa nêu. | `quantity numeric(12,3)`, `tax_rate_snapshot numeric(7,4)`, quy tắc làm tròn trong Money module. |
| B-10 | 🟡 | `payment_events` unique `(provider_code, provider_event_id)` ổn, nhưng `idempotency_records` unique với `actor_id` NULL cần partial index (đã nhắc) — chưa có quyết định cho request ẩn danh (quote request guest). | Dùng khóa `(scope, key, actor_key)` với `actor_key` = hash IP+UA cho anonymous hoặc token phiên guest. |

### Nhóm C — API

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| C-01 | 🟠 | Chưa chốt envelope, auth (Bearer vs cookie), pagination — "choose one". | Chốt: `{data, meta}`; cookie HttpOnly + CSRF cho web; Bearer chỉ cho tích hợp máy-máy. Ghi vào API_SPEC §1. |
| C-02 | 🟠 | Thiếu API: moderation (approve/reject/request-changes listing/revision), seller application admin, admin users/orgs, admin dashboard, listing media presign, order detail (`/me/orders/:id`), project admin, reviews, CMS, notifications, admin quotation list/read versions. | Bổ sung nhóm endpoint (xem patch register). |
| C-03 | 🟠 | Guest xem/accept báo giá: API_SPEC cho "customer owner", WM-052 phụ thuộc WM-010 (tài khoản), BR-07 và Technical Spec cho "secure guest link". Mâu thuẫn. | Quyết định D-19. Đề xuất: guest được **xem** qua magic link; **accept** yêu cầu xác minh email (OTP) trong phiên đó, lưu bằng chứng (thời gian, email đã xác minh, IP hash). |
| C-04 | 🟡 | `PAYMENT_EVENT_DUPLICATE` liệt kê như error code nhưng HTTP 200. | Chuyển thành ghi chú hành vi, không phải lỗi. |
| C-05 | 🟡 | `/me/subscriptions` khai báo 2 lần. | Giữ một. |
| C-06 | 🟡 | `POST /quote-requests` public dùng Idempotency-Key nhưng chưa nói scope cho guest. | Xem B-10. |

### Nhóm D — Backlog và truy vết

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| D-01 | 🟠 | WM-010 (R0–R1) phụ thuộc WM-081 (R2): dependency đảo phase, không có trong dependency map. | Chuyển WM-081 sang R1 (P0) hoặc tách phần email verification tối thiểu. |
| D-02 | 🟠 | FR P0 không có story: **FR-ADM-01** (dashboard), **FR-ADM-03** (quản lý user/org/seller), **FR-SEL-02** (admin tạo seller), **FR-ORD-08** (order status theo fulfillment), **FR-REQ-11** (anti-spam chỉ nằm ẩn trong WM-042). | Thêm story: WM-015 (Admin user/org/seller mgmt), WM-016 (Admin dashboard cơ bản), WM-054 (anti-spam request), gắn FR-ORD-08 vào WM-060. |
| D-03 | 🟡 | Ba hệ đánh số phase: PRD (Phase 0–4), BACKLOG (R0–R7), MT (A–H); API_SPEC dùng "Phase 2/3". | Bảng ánh xạ ở mục 5; mọi tài liệu dùng R-số. |
| D-04 | 🟡 | Không có trace matrix FR → WM → TC. | Tạo `TRACEABILITY.md` (bảng) khi chia task. |
| D-05 | 🟡 | `DECISIONS.md` không chứa ADR-MT-001…006. | Gộp vào DECISIONS.md (hoặc tham chiếu cố định). |

### Nhóm E — Kiến trúc và vận hành

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| E-01 | 🟠 | TECHNICAL_SPEC repo: `apps/web, api, worker`; MT Architecture: `marketplace-web, admin-web, seller-web, website-runtime, api, worker`. | Chốt cấu trúc: giai đoạn MVP `apps/web` (route groups) + `api` + `worker`; `website-runtime` chỉ thêm khi bắt đầu track Runtime. |
| E-02 | 🟠 | Seller-supplied demo URL/ảnh/file: nhiều rủi ro (phishing, malware, clickjacking, SSRF, XSS qua embed). | Quy tắc trong Seller Submission Spec: không proxy, không iframe mặc định, kiểm tra tự động, nhãn "liên kết ngoài", embed chỉ qua allowlist + `sandbox`. |
| E-03 | 🟠 | Source package seller upload: malware, mã độc, bí mật bị lộ, license GPL, tài nguyên vi phạm bản quyền ("nulled theme"). | Pipeline quét + chữ ký + checksum + kiểm tra license + quy trình takedown. |
| E-04 | 🟡 | RLS chỉ nêu cho runtime tenant; marketplace seller scope chỉ ở tầng service. | Cân nhắc RLS theo `owner_organization_id` cho bảng seller-scoped như phòng thủ chiều sâu. |
| E-05 | 🟡 | Chưa có tài liệu pháp lý/chính sách: ToS, Seller Agreement, Content & IP Policy, Refund Policy, Privacy. | Thêm `docs/legal/` (checklist ở báo cáo này), version hóa qua `legal_documents`. |
| E-06 | 🟡 | NFR chưa nêu dung lượng mục tiêu (số listing, seller, thread/ngày). | Ước lượng sơ bộ trước load test (WM-113). |

---

## 3. Quyết định bổ sung cần chốt (ghi vào DECISIONS.md)

| ID | Câu hỏi | Đề xuất mặc định | Chặn |
|---|---|---|---|
| D-13 | Diễn đàn: tự build hay dùng giải pháp có sẵn (ví dụ Discourse + SSO)? | Build-light trong monolith (cần tích hợp badge seller, Request Board → quote). Nếu muốn ra nhanh, chỉ phần thảo luận có thể dùng Discourse, phần Request Board vẫn tự làm. | R4B |
| D-14 | Giao dịch trong diễn đàn được phép đến đâu? | Chỉ thảo luận + "Cần giải pháp" + proposal qua hệ thống; cấm chốt giá/thanh toán/chia sẻ liên hệ trong bài công khai. | R4C |
| D-15 | Ai được đăng listing? | Seller đã xác minh mức tối thiểu (email + điện thoại + hồ sơ) và ký Seller Agreement. | R4A |
| D-16 | SLA duyệt listing? | Phản hồi đầu tiên ≤ 3 ngày làm việc; hiển thị trạng thái cho seller. | R4A |
| D-17 | Chính sách IP/bản quyền, takedown? | Notice-and-takedown + strike system. | R4A |
| D-18 | Demo do seller tự host hay nền tảng host? | MVP: seller tự host (liên kết ngoài + ảnh/video); sau này demo trên runtime của nền tảng. | R4A |
| D-19 | Guest có accept quotation không? | Xem bằng magic link, accept sau OTP email. | R2 |
| D-20 | Customer workspace tạo khi nào? | Lazy khi lần đầu có request/order gắn tài khoản. | R2 |
| D-21 | Envelope, auth mode, pagination. | `{data, meta}`, cookie + CSRF, cursor. | R0 |
| D-22 | Canonical Tenant/Site (B-01). | Dùng MT model. | R0 (data model) |
| D-23 | Forum có cần xác thực danh tính/điện thoại, đăng ký/thông báo với cơ quan quản lý theo quy định về mạng xã hội/dịch vụ Internet không? | Cần pháp lý xác nhận trước khi mở diễn đàn công khai. | R4B |
| D-24 | Runtime Platform nằm ngoài MVP? | Có (A-05). | R0 |

---

## 4. Checklist pháp lý/chính sách (cần luật sư/kế toán xác nhận — tôi không thay thế tư vấn pháp lý)

- Sàn giao dịch thương mại điện tử: điều kiện đăng ký/thông báo với cơ quan quản lý, nghĩa vụ công bố quy chế, giải quyết tranh chấp.
- Dịch vụ diễn đàn/mạng xã hội: yêu cầu xác thực tài khoản, lưu trữ thông tin, gỡ nội dung vi phạm, lưu nhật ký.
- Bảo vệ dữ liệu cá nhân: consent, retention, quyền xóa/xuất dữ liệu.
- Sở hữu trí tuệ: quy trình khiếu nại và gỡ bỏ nội dung vi phạm bản quyền.
- Thuế/hóa đơn điện tử, hợp đồng điện tử/chữ ký số (D-02, D-11).
- Tài liệu: ToS, Seller Agreement, Content & IP Policy, Refund Policy, Privacy Policy, Community Guidelines.

---

## 5. Roadmap hợp nhất (ánh xạ phase)

| Release | Nội dung | PRD cũ | MT cũ |
|---|---|---|---|
| R0 | Foundation (+ chốt D-21, D-22) | Phase 0 | — |
| R1 | Catalog admin-run | Phase 1 | — |
| R2 | Lead + quotation + order (thủ công) | Phase 1 | — |
| R3 | Pilot ops + hardening | Phase 1 | — |
| **R4A** | **Seller application + Listing submission/duyệt + demo chi tiết** (chưa thanh toán qua nền tảng) | Phase 2 | — |
| **R4B** | **Community v1: diễn đàn thảo luận (hậu kiểm), hồ sơ, báo cáo vi phạm** | mới | — |
| **R4C** | **Request Board ("Cần giải pháp") + Proposal → Quote Request** | mới | — |
| R5 | Source delivery + payment provider | Phase 2 | — |
| R6 | SaaS + **Runtime Platform (track MT-01…)** | Phase 3 | A–E |
| R7 | Ledger/commission/payout | Phase 4 | F–H sau đó |

Gợi ý thứ tự: **R4A trước R4B**. Diễn đàn cần có người bán uy tín và listing để có nội dung; nhưng Community v1 chỉ thảo luận nên có thể chạy song song nếu có nhân lực moderation.

---

## 6. Gợi ý thêm (ngoài yêu cầu trực tiếp)

1. **Demo do nền tảng host** (R6+): dùng chính Website Runtime để dựng site demo từ template đã duyệt, bảo mật hơn link ngoài và đo được tương tác thật.
2. **Huy hiệu tin cậy:** "Demo đã kiểm", "Source đã quét", "Seller xác minh", "Có hỗ trợ ≥ 6 tháng" — hiển thị ở card và detail.
3. **So sánh listing** (FR-CAT-09) nên kéo lên P1: tăng chuyển đổi.
4. **Lịch sử thay đổi + changelog công khai** cho listing/phiên bản source.
5. **Dùng diễn đàn làm kênh SEO:** thread Q&A công khai, schema.org `QAPage`.
6. **Chống rò rỉ giao dịch ra ngoài** (commission leakage): ẩn thông tin liên hệ cho đến khi có proposal được chấp nhận; cảnh báo khi phát hiện mẫu số điện thoại/Zalo/Telegram trong bài.
7. **Chương trình "Bug bounty/Seller strike":** khuyến khích báo cáo bản crack, template ăn cắp.
8. **Tách môi trường staging có dữ liệu giả cho seller thử** (sandbox cho seller portal).
9. **Chuẩn hóa "Spec nhỏ cho AI IDE":** mỗi story kèm file bối cảnh ngắn để tránh AI làm lệch ADR.

---

## 7. Patch Register — thay đổi cần áp vào từng file gốc

| File | Thay đổi |
|---|---|
| README.md | Thêm 3 tài liệu mới; cập nhật bảng "định hướng đã chốt" (thêm Community, seller đăng chờ duyệt); nêu rõ MVP ≠ Runtime; đổi phiên bản 1.2-draft. |
| PRD.md | §6.4/§7: thêm R4A/R4B/R4C; §8 IA: thêm `/community/*`, `/seller/listings/:id/preview`, `/admin/moderation/*`; §10: thêm nhóm FR-COM-*, nâng FR-SEL-03…06 lên mức R4A, thêm FR-SEL-11…15 (demo, kiểm tra, takedown, agreement); §11: thêm BR-21…BR-30; §12: thêm state machine Thread/Proposal; §15: thêm vai trò Moderator, Community Member; §17: thêm rủi ro scam/nulled theme/commission leakage/pháp lý forum; §18: thêm câu hỏi D-13…D-24. |
| DECISIONS.md | Thêm ADR-009 (Community module nằm trong modular monolith), ADR-010 (Request Board dẫn tới Quote Request, không giao dịch trong forum), ADR-011 (Demo là liên kết ngoài mặc định), ADR-012 (Canonical Tenant/Site), gộp ADR-MT-*; thêm D-13…D-24. |
| TECHNICAL_SPEC.md | §4: thêm CommunityModule, ModerationModule; §5: thêm quy tắc sanitize markdown, rate limit/trust level; §8: pipeline quét file seller; §12: link preview không fetch phía server; §13: thêm event (`ListingSubmitted`, `ListingReviewed`, `ThreadReported`, `ProposalAccepted`…); §17 sửa repo structure theo E-01. |
| DATA_MODEL.md | Xóa `saas_tenants`/`tenant_domains`, thay bằng tham chiếu MT; thêm `listing_demos`, `listing_review_checks`, `listing_review_comments`, `seller_agreements`/`legal_acceptances`, `takedown_notices`; thêm cột `listings.current_published_revision_id`; thêm các bảng B-04; thêm nhóm bảng community (xem Community spec); thêm `order_items.fulfillment_status`. |
| API_SPEC.md | Chốt envelope/auth; thêm API moderation, seller submission, demo, community, proposals; sửa C-03…C-06. |
| BACKLOG.md | Thêm WM-015, WM-016, WM-034…039, WM-054, EPIC WM-EP12 (WM-120…); chuyển WM-081 sang R1; cập nhật dependency map; cập nhật release table (R4A/B/C). |
| MULTI_TENANT_TEMPLATE_ARCHITECTURE.md | §3/§17: nêu runtime là track R6; ghi quan hệ với `saas_tenants` đã xóa; thêm mục "Demo hosting bằng runtime" (tuỳ chọn). |
| MULTI_TENANT_TEMPLATE_BACKLOG.md | Sửa MVP Gate (A-06); đổi nhãn "MVP" thành "Runtime Gate 1"; đánh dấu phụ thuộc vào R6. |

*Ghi chú:* các file gốc chưa bị ghi đè; patch register là danh sách thay đổi để bạn duyệt trước khi áp vào repository. Nếu đồng ý, bước tiếp theo là tôi xuất bản đầy đủ phiên bản 1.2 của từng file.
