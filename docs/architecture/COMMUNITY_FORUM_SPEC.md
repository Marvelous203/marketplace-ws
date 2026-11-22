# Đặc tả bổ sung — Community Forum và Request Board

**Version:** 1.2-draft (addendum)
**Ngày:** 22/11/2026
**Release:** R4B (diễn đàn thảo luận) · R4C (Request Board + Proposal)
**Phụ thuộc:** Identity (WM-010/011), RBAC (WM-012), Seller (WM-030…), Request/Quotation (WM-EP04/05), Notification (WM-081)

## 1. Mục tiêu và nguyên tắc

Tạo cộng đồng nơi người dùng thảo luận về website/giải pháp, hỏi đáp, khoe sản phẩm, và **người cần giải pháp đăng yêu cầu để seller đề xuất**. Mọi giao dịch có giá trị phải đi qua luồng Request/Quotation/Order của nền tảng.

Nguyên tắc:
1. **Thảo luận công khai, giao dịch qua hệ thống.** Diễn đàn không là nơi chốt giá/thanh toán.
2. **Tin cậy gắn với danh tính:** huy hiệu seller xác minh, uy tín người dùng, lịch sử.
3. **Kiểm duyệt theo mức độ tin cậy:** thành viên mới hậu kiểm hạn chế, thành viên lâu năm tự do hơn.
4. **Không tạo luồng giao dịch song song:** Proposal dẫn tới Quote Request hiện có.
5. **Đồng bộ với tài liệu hiện có:** dùng chung `users`, `organizations`, `audit_logs`, `notifications`, `media_assets`.

Không thuộc phạm vi: chat realtime, group riêng tư, livestream, nhắn tin riêng đa năng, điểm thưởng đổi tiền, NFT… Nhắn tin riêng chỉ trong phạm vi proposal.

## 2. Vai trò

| Vai trò | Khả năng |
|---|---|
| Khách (chưa đăng nhập) | Đọc nội dung công khai (SEO) |
| Thành viên | Đăng thread/trả lời, reaction, báo cáo, theo dõi, đăng yêu cầu "Cần giải pháp" |
| Seller xác minh | Thêm huy hiệu, gắn listing vào bài, **gửi proposal** vào Wanted thread |
| Moderator | Duyệt hàng đợi, ẩn/khóa/di chuyển bài, mute/ban tạm thời, xử lý báo cáo |
| Admin | Mọi quyền Moderator, cấu hình chuyên mục/luật, ban vĩnh viễn, xem audit |

Quyền là permission-based (`community.post.create`, `community.moderate`, `community.proposal.create`…).

## 3. Cấu trúc thông tin

```text
/community                       Trang chủ cộng đồng
/community/c/:slug               Chuyên mục
/community/t/:slug               Chi tiết thread
/community/new                   Tạo thread
/community/requests              Bảng "Cần giải pháp" (Request Board)
/community/requests/:slug        Chi tiết yêu cầu + proposals của tôi
/community/u/:username           Hồ sơ cộng đồng
/community/search                Tìm kiếm
/community/guidelines            Nội quy
/account/community               Thông báo, theo dõi, bài của tôi
/admin/community/*               Chuyên mục, hàng đợi, báo cáo, người dùng bị hạn chế
```

Chuyên mục khởi tạo: Thông báo (chỉ admin), Thảo luận chung, Hỏi đáp kỹ thuật (có "câu trả lời được chấp nhận"), Giới thiệu sản phẩm (Showcase), **Cần giải pháp** (Wanted), Góp ý nền tảng.

## 4. Loại thread

| `thread_type` | Mô tả | Đặc thù |
|---|---|---|
| `DISCUSSION` | Thảo luận tự do | — |
| `QUESTION` | Hỏi đáp | Người hỏi chọn câu trả lời được chấp nhận; sắp xếp theo hữu ích |
| `SHOWCASE` | Khoe sản phẩm/dự án | Có thể gắn listing; ảnh bắt buộc |
| `WANTED` | Người cần giải pháp | Có trường: mục tiêu, ngân sách, thời hạn, fulfillment mong muốn; cho phép proposal |
| `ANNOUNCEMENT` | Thông báo | Chỉ admin |

## 5. Request Board và Proposal (cầu nối với giao dịch)

```text
Thành viên đăng WANTED ─▶ (mới: hậu kiểm/chờ duyệt) ─▶ OPEN
Seller xác minh gửi PROPOSAL (riêng tư với người đăng + staff)
Người đăng xem so sánh, trao đổi trong proposal
Người đăng chọn "Tiếp tục với proposal này" ─▶ tạo QUOTE_REQUEST liên kết proposal
→ quy trình Quotation → Accept → Order hiện có (ADMIN/seller theo ADR-006)
WANTED chuyển AWARDED khi có quote request được tạo; CLOSED/EXPIRED khi hết hạn
```

Quy tắc:
- Proposal **không bắt buộc người cần tiết lộ liên hệ**. Thông tin liên hệ chỉ mở sau khi hai bên chấp nhận tiếp tục.
- Proposal nội dung: tóm tắt giải pháp, listing/offer liên quan (nếu có), phạm vi, mốc thời gian, mức giá hoặc khoảng giá. Giá mang tính **không ràng buộc** cho tới khi có Quotation.
- Mỗi seller một proposal đang hoạt động cho mỗi WANTED (có thể sửa phiên bản).
- Một WANTED tối đa N proposal (mặc định 20) để tránh spam.
- Seller bị strike/không APPROVED không gửi được proposal.
- Quote request tạo từ proposal giữ `source_proposal_id`, `source_thread_id` để truy vết và đo chuyển đổi.
- Hoa hồng (D-04) áp theo giao dịch phát sinh qua hệ thống; không cần cơ chế riêng.

### State machine

```text
Thread:   PENDING_REVIEW -> PUBLISHED -> LOCKED | HIDDEN | ARCHIVED ; DELETED (soft)
Wanted:   OPEN -> IN_DISCUSSION -> AWARDED | CLOSED | EXPIRED
Proposal: SUBMITTED -> SHORTLISTED -> ACCEPTED | DECLINED ; SUBMITTED -> WITHDRAWN | EXPIRED
Post:     PUBLISHED -> EDITED(revision) | HIDDEN | DELETED(soft)
Report:   OPEN -> IN_REVIEW -> RESOLVED_ACTION | RESOLVED_NO_ACTION | DISMISSED
```

## 6. Uy tín, mức tin cậy và chống spam

| Mức | Điều kiện | Hạn chế |
|---|---|---|
| TL0 Mới | Đã xác minh email | Bài đầu tiên hậu kiểm/chờ duyệt, không chèn liên kết, không đăng ảnh ngoài, giới hạn bài/giờ |
| TL1 Thành viên | Hoạt động ≥ X ngày, ≥ Y bài được chấp nhận, không bị khóa | Liên kết tối đa K; không cần duyệt |
| TL2 Tin cậy | Hoạt động bền vững + báo cáo chính xác | Có thể gắn cờ ưu tiên, ít giới hạn |
| Seller xác minh | Seller APPROVED | Huy hiệu, đăng proposal |

Giá trị X/Y/K do admin cấu hình, không hardcode.

Chống lạm dụng:
- Rate limit theo user/IP/thiết bị; CAPTCHA theo rủi ro; honeypot.
- Bộ lọc nội dung: từ khóa cấm, mẫu liên hệ trực tiếp (điện thoại/Zalo/Telegram/email) bị che hoặc chuyển hàng đợi ở TL0/TL1; cảnh báo hiển thị nêu rõ chính sách.
- Phát hiện nội dung lặp/spam liên kết; cổng adapter chống spam (có thể thay nhà cung cấp).
- Báo cáo từ cộng đồng; ẩn tạm tự động khi vượt ngưỡng báo cáo từ người tin cậy, moderator quyết định cuối.
- Cấm tuyệt đối: bản crack/nulled, tài liệu vi phạm bản quyền, lừa đảo, chia sẻ thông tin đăng nhập/dữ liệu cá nhân, nội dung bất hợp pháp. Danh sách chi tiết đặt trong Community Guidelines (cần pháp lý duyệt).

## 7. Moderation

- Hàng đợi: bài chờ duyệt, báo cáo, nội dung bị bộ lọc giữ.
- Hành động: duyệt, ẩn, khóa, di chuyển, gộp, chỉnh tiêu đề/thẻ, cảnh cáo, mute (có thời hạn), ban (tạm/vĩnh viễn), gỡ huy hiệu.
- Mọi hành động có lý do, audit, thông báo người liên quan; quyền kháng nghị 1 lần.
- Bài bị ẩn/xóa giữ bản sao cho điều tra theo retention (D-pháp lý); người dùng thường không thấy.
- Moderator không xem được dữ liệu riêng tư ngoài phạm vi (proposal riêng chỉ staff có quyền xem khi có báo cáo).

## 8. Data model

```text
community_profiles(user_id PK, display_name, username UNIQUE, bio, avatar_asset_id,
                   trust_level, reputation_score, joined_at, status[ACTIVE|MUTED|BANNED],
                   muted_until, banned_reason)

forum_categories(id, parent_id, slug UNIQUE, name, description, sort_order,
                 allowed_thread_types, write_permission, status)

forum_threads(id, category_id, author_user_id, thread_type, title, slug UNIQUE,
              body_md, body_html_sanitized, status, pinned, locked_at,
              related_listing_id NULL, accepted_post_id NULL,
              reply_count, view_count, last_activity_at, created_at, updated_at, deleted_at)

forum_thread_tags(thread_id, tag_id)               -- dùng lại bảng tags với tag_group='COMMUNITY'

forum_posts(id, thread_id, parent_post_id NULL, author_user_id, body_md,
            body_html_sanitized, status, edited_at, created_at, deleted_at)
forum_post_revisions(id, post_id, body_md, edited_by, created_at)

forum_reactions(id, target_type[THREAD|POST], target_id, user_id, reaction_type, created_at)
   UNIQUE(target_type, target_id, user_id, reaction_type)

forum_attachments(id, target_type, target_id, asset_id, scan_status)
forum_subscriptions(user_id, thread_id|category_id, level[ALL|MENTIONS], created_at)
forum_mentions(id, post_id, mentioned_user_id, created_at)

forum_reports(id, target_type, target_id, reporter_user_id, reason_code, detail,
              status, handled_by, handled_at, outcome, created_at)
forum_moderation_actions(id, actor_user_id, target_type, target_id, action, reason,
                         duration, created_at)

wanted_requests(thread_id PK, goal_summary, budget_min_minor, budget_max_minor,
                budget_currency, target_date, desired_fulfillment[], status,
                expires_at, awarded_proposal_id NULL)

proposals(id, wanted_thread_id, seller_organization_id, author_user_id, status,
          summary, scope_json, price_min_minor, price_max_minor, currency,
          related_listing_id NULL, related_offer_id NULL,
          timeline_json, version, valid_until, created_at, updated_at)
proposal_messages(id, proposal_id, sender_user_id, body, visibility, created_at)
quote_requests (bổ sung): source_proposal_id NULL, source_thread_id NULL
```

Ràng buộc: `UNIQUE(wanted_thread_id, seller_organization_id) WHERE status IN ('SUBMITTED','SHORTLISTED')`; proposal chỉ do user thuộc seller organization APPROVED; `awarded_proposal_id` phải thuộc cùng wanted thread; xóa thread là soft-delete, không làm mất proposal đang có quote request.

## 9. API (tóm tắt)

| Method | Endpoint | Mục đích | Auth |
|---|---|---|---|
| GET | `/public/community/categories` | Chuyên mục | Public |
| GET | `/public/community/threads` | Danh sách/lọc/tìm | Public |
| GET | `/public/community/threads/:slug` | Thread + posts | Public |
| POST | `/community/threads` | Tạo thread | Thành viên |
| PATCH | `/community/threads/:id` | Sửa (tác giả/mod) | Thành viên |
| POST | `/community/threads/:id/posts` | Trả lời | Thành viên |
| POST | `/community/posts/:id/reactions` | Reaction | Thành viên |
| POST | `/community/threads/:id/accept-answer` | Chọn đáp án | Tác giả thread |
| POST | `/community/reports` | Báo cáo | Thành viên |
| GET/POST | `/community/subscriptions` | Theo dõi | Thành viên |
| GET | `/public/community/requests` | Bảng Cần giải pháp | Public (che dữ liệu nhạy cảm) |
| POST | `/community/requests` | Đăng yêu cầu | Thành viên |
| POST | `/community/requests/:id/proposals` | Gửi proposal | Seller xác minh |
| GET | `/community/requests/:id/proposals` | Xem proposals | Chủ yêu cầu/staff |
| POST | `/community/proposals/:id/messages` | Trao đổi | Bên liên quan |
| POST | `/community/proposals/:id/continue` | Tạo quote request từ proposal | Chủ yêu cầu |
| POST | `/community/proposals/:id/withdraw` | Rút | Seller |
| GET | `/admin/community/queue` | Hàng đợi moderation | Moderator |
| POST | `/admin/community/actions` | Hành động moderation | Moderator |
| POST | `/admin/community/users/:id/restrict` | Mute/ban | Moderator/Admin |

Quy tắc API: DTO riêng cho public/author/mod; proposal chỉ hiển thị cho chủ yêu cầu, seller sở hữu và staff có quyền; Idempotency-Key cho tạo thread/proposal/continue; phân trang cursor; không trả về email/điện thoại trong DTO công khai.

Mã lỗi: `COMMUNITY_RESTRICTED` (403), `THREAD_LOCKED` (409), `POST_RATE_LIMITED` (429), `CONTENT_REQUIRES_REVIEW` (202), `PROPOSAL_LIMIT_REACHED` (409), `PROPOSAL_NOT_ALLOWED` (403), `WANTED_NOT_OPEN` (409).

## 10. Yêu cầu chức năng và quy tắc

| ID | Yêu cầu | Release |
|---|---|---|
| FR-COM-01 | Đọc công khai chuyên mục/thread, tối ưu SEO | R4B |
| FR-COM-02 | Thành viên đăng thread/trả lời bằng markdown giới hạn | R4B |
| FR-COM-03 | Reaction, theo dõi, mention, thông báo | R4B |
| FR-COM-04 | Báo cáo và hàng đợi moderation | R4B |
| FR-COM-05 | Mức tin cậy, rate limit, bộ lọc nội dung | R4B |
| FR-COM-06 | Hồ sơ cộng đồng, huy hiệu seller | R4B |
| FR-COM-07 | Hỏi đáp có đáp án được chấp nhận | R4B |
| FR-COM-08 | Đăng WANTED với trường cấu trúc | R4C |
| FR-COM-09 | Seller gửi proposal, trao đổi riêng, tiếp tục thành quote request | R4C |
| FR-COM-10 | Gắn listing/offer vào thread/proposal | R4C |
| FR-COM-11 | Tìm kiếm full-text diễn đàn | R4B |
| FR-COM-12 | Báo cáo/phân tích: số thread, tỷ lệ proposal→quote | R4C |

| ID | Quy tắc |
|---|---|
| BR-27 | Không xử lý thanh toán hay chốt giao dịch trong thread/post; giao dịch qua Quotation/Order. |
| BR-28 | Proposal chỉ từ seller APPROVED không bị strike. |
| BR-29 | Nội dung markdown được sanitize; không HTML/JS thô; liên kết ngoài gắn `rel="ugc nofollow noopener"`. |
| BR-30 | Thông tin liên hệ cá nhân không hiển thị công khai; mở khóa chỉ khi hai bên đồng ý tiếp tục. |
| BR-31 | Hành động moderation luôn có lý do và audit. |
| BR-32 | Xóa tài khoản: ẩn danh hóa bài viết (giữ nội dung theo chính sách), không xóa proposal/quote liên quan giao dịch. |
| BR-33 | Link preview/oEmbed không fetch phía server từ URL người dùng (tránh SSRF). |

## 11. Phi chức năng và bảo mật

- XSS: sanitize allowlist khi lưu và khi render; CSP chặt.
- IDOR: kiểm tra quyền theo từng proposal/thread; proposal ẩn khỏi người không liên quan.
- Spam/abuse: rate limit theo user/IP; hàng đợi cho tài khoản mới.
- Ảnh đính kèm: quét, resize, loại bỏ EXIF; chỉ ảnh ở TL0/TL1.
- Hiệu năng: chỉ mục `(category_id, last_activity_at DESC)`, `(thread_id, created_at)`, full-text/trigram; bộ đếm (reply_count) cập nhật bằng transaction hoặc job.
- Privacy: log không chứa nội dung proposal; retention báo cáo/ảnh chụp bài vi phạm theo chính sách.
- Pháp lý: D-23 — xác nhận yêu cầu pháp lý cho dịch vụ diễn đàn/mạng xã hội (xác thực tài khoản, lưu nhật ký, cơ chế gỡ nội dung) trước khi mở công khai.
- Đo lường: bài mới/ngày, tỷ lệ spam bị chặn, thời gian xử lý báo cáo, proposal→quote request→order.

## 12. Phương án triển khai (quyết định D-13)

| Phương án | Ưu | Nhược |
|---|---|---|
| A. Tự build module Community trong NestJS/Next.js | Tích hợp sâu: badge seller, proposal→quote, SEO, một tài khoản | Tốn công moderation/anti-spam tự làm |
| B. Discourse + SSO cho phần thảo luận, tự làm Request Board | Ra mắt nhanh, moderation chín muồi | Hai hệ thống, trải nghiệm tách rời, khó đồng bộ huy hiệu/proposal |
| C. Hybrid theo phase | B ở R4B, tích hợp sâu ở R4C | Chuyển đổi dữ liệu/trải nghiệm |

Khuyến nghị: **A, cấu hình tối giản** (không build tính năng xã hội phức tạp), vì giá trị khác biệt nằm ở tích hợp giao dịch. Chọn B nếu muốn kiểm chứng nhu cầu cộng đồng trong thời gian ngắn mà chưa có nhân lực moderation.

## 13. Backlog — WM-EP12 Community

| ID | Story | P | Release | Phụ thuộc |
|---|---|---|---|---|
| WM-120 | Community foundation: schema, profile, permissions | P1 | R4B | WM-012 |
| WM-121 | Chuyên mục, thread, post, markdown sanitize | P1 | R4B | WM-120 |
| WM-122 | Reaction, theo dõi, mention, thông báo | P1 | R4B | WM-121, WM-081 |
| WM-123 | Báo cáo + moderation console + audit | P1 | R4B | WM-121, WM-014 |
| WM-124 | Trust level, rate limit, bộ lọc nội dung, hàng đợi bài mới | P1 | R4B | WM-123 |
| WM-125 | Tìm kiếm + SEO (SSR, canonical, schema.org) | P1 | R4B | WM-121 |
| WM-126 | Hỏi đáp: accepted answer | P1 | R4B | WM-121 |
| WM-127 | Đính kèm ảnh (quét, EXIF) | P1 | R4B | WM-022, WM-121 |
| WM-130 | Wanted thread + trường cấu trúc | P1 | R4C | WM-121, WM-040 |
| WM-131 | Proposal + trao đổi riêng + giới hạn | P1 | R4C | WM-130, WM-030 |
| WM-132 | Proposal → Quote Request (liên kết nguồn) | P1 | R4C | WM-131, WM-043, WM-050 |
| WM-133 | Gắn listing/offer vào thread/proposal, huy hiệu seller | P1 | R4C | WM-131, WM-032 |
| WM-134 | Chống rò rỉ giao dịch: phát hiện liên hệ, cảnh báo | P1 | R4C | WM-124 |
| WM-135 | Báo cáo phân tích cộng đồng | P2 | R4C | WM-132 |
| WM-136 | Authorization & abuse regression (IDOR proposal, XSS, SSRF preview) | P1 | R4B–C | WM-110 |

Tiêu chí hoàn thành mẫu:
- WM-121: markdown có script không thực thi; thread của tác giả A không sửa được bởi B; thread HIDDEN không xuất hiện ở public, tìm kiếm, sitemap.
- WM-124: TL0 đăng liên kết bị giữ duyệt; vượt rate limit trả 429; thay đổi ngưỡng không cần deploy.
- WM-131: Seller B không đọc được proposal của seller A; seller không APPROVED nhận 403; vượt giới hạn 20 proposal nhận 409.
- WM-132: gọi `continue` hai lần chỉ tạo một quote request (idempotent); quote request giữ `source_proposal_id`.

## 14. Test case

| ID | Kịch bản | Kỳ vọng |
|---|---|---|
| TC-COM-01 | Khách đọc thread công khai | Hiển thị, không lộ dữ liệu cá nhân |
| TC-COM-02 | TL0 đăng bài có liên kết | Chuyển hàng đợi duyệt (202) |
| TC-COM-03 | Post chứa `<script>` | Bị loại bỏ khi render |
| TC-COM-04 | Báo cáo vượt ngưỡng | Ẩn tạm, moderator xử lý, có audit |
| TC-COM-05 | Seller A đọc proposal seller B | 404 |
| TC-COM-06 | Chủ yêu cầu `continue` hai lần | Một quote request |
| TC-COM-07 | Bài chứa số điện thoại ở TL0 | Che hoặc giữ duyệt + cảnh báo |
| TC-COM-08 | User bị mute đăng bài | 403 `COMMUNITY_RESTRICTED` |
| TC-COM-09 | Xóa tài khoản | Bài ẩn danh; proposal/quote giữ nguyên truy vết |
| TC-COM-10 | Thread bị khóa | Reply 409 `THREAD_LOCKED` |
