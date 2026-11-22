# PRD — Website Marketplace

**Product:** Website Solution Marketplace  
**Version:** 1.0-draft  
**Date:** 22/11/2026  
**Owner:** Product Owner / Business Owner  
**Status:** Draft for review

---

## 1. Executive Summary

Website Marketplace là nền tảng giúp khách hàng khám phá, lựa chọn, mua hoặc thuê các giải pháp website thuộc nhiều lĩnh vực; đồng thời tiếp nhận yêu cầu phát triển riêng khi khách hàng chưa tìm thấy giải pháp phù hợp.

Nền tảng vận hành theo mô hình **hybrid marketplace**:

- **First-party:** nền tảng tự sở hữu, xuất bản và bán các mẫu/giải pháp.
- **Third-party:** seller/partner (freelancer, studio, agency) có thể đăng ký, được xét duyệt và xuất bản listing theo chính sách marketplace.

Một listing có thể cung cấp nhiều offer, trong đó mỗi offer xác định phương thức định giá và bàn giao riêng:

1. **Source / Template:** khách hàng mua quyền sử dụng hoặc nhận source/template.
2. **Managed Website:** nền tảng/seller thực hiện tùy chỉnh, phát triển, cấu hình domain/hosting và bàn giao website hoàn chỉnh.
3. **SaaS:** khách hàng đăng ký gói định kỳ và được provision một tenant/workspace riêng.
4. **Custom Project:** khách hàng mô tả yêu cầu, nhận tư vấn, báo giá và ký xác nhận phạm vi.

Doanh thu bao gồm giá cố định, báo giá theo yêu cầu và phí thuê bao định kỳ. Hệ thống được thiết kế để hỗ trợ đa lĩnh vực bằng taxonomy, tag và feature metadata có thể mở rộng, thay vì hard-code logic riêng cho từng ngành.

## 2. Problem Statement

Khách hàng thường gặp một hoặc nhiều vấn đề:

- Không biết tìm mẫu website phù hợp ở đâu và khó so sánh các giải pháp.
- Không rõ giá niêm yết bao gồm giao diện, source code, hosting, nội dung hay triển khai.
- Có ý tưởng nhưng chưa đủ kỹ năng để viết tài liệu yêu cầu kỹ thuật.
- Không biết đơn vị nào chịu trách nhiệm, tiến độ và chính sách hỗ trợ sau bàn giao.
- Khó theo dõi báo giá, trao đổi và trạng thái dự án ở một nơi.

Nhà cung cấp/seller cũng gặp vấn đề:

- Thiếu kênh trưng bày sản phẩm và tạo lead có chất lượng.
- Khó mô tả phạm vi gói dịch vụ một cách tiêu chuẩn.
- Quy trình tiếp nhận lead, báo giá và theo dõi đơn hàng phân tán qua email/chat.
- Thiếu cơ chế quản lý listing, đơn hàng, doanh thu và uy tín.

## 3. Product Vision

Trở thành điểm đến tập trung để doanh nghiệp/cá nhân có thể tìm được giải pháp web phù hợp, hiểu rõ phạm vi và chi phí, đặt dịch vụ hoặc gửi yêu cầu riêng; đồng thời giúp nhà cung cấp tiếp cận khách hàng và vận hành giao dịch minh bạch.

### 3.1 Product Principles

1. **Discover before contact:** khách hàng có thể hiểu giải pháp trước khi phải để lại thông tin.
2. **Offer clarity:** giá, phạm vi, hình thức bàn giao, license và chi phí recurring phải rõ ràng.
3. **One listing, multiple offers:** tách nội dung giới thiệu giải pháp khỏi gói thương mại.
4. **Human-assisted where needed:** cho phép admin/seller tư vấn thủ công khi yêu cầu phức tạp.
5. **Trust and traceability:** có kiểm duyệt seller/listing, lịch sử báo giá, trạng thái và audit log.
6. **Modular growth:** MVP là modular monolith; mở rộng tính năng mà chưa cần microservices.
7. **Vertical-neutral core:** dữ liệu ngành nghề và tính năng mở rộng bằng taxonomy/metadata, không tạo một code path cho mỗi ngành.

## 4. Goals, Success Metrics and Non-goals

### 4.1 Goals

- Tập trung danh mục website/giải pháp đa lĩnh vực trong một catalog.
- Giúp khách hàng xem chi tiết, demo và hiểu offer trước khi mua.
- Tiếp nhận lead từ cả listing có sẵn và yêu cầu custom.
- Cho admin quản lý seller, listing, package/offer, yêu cầu, báo giá và đơn hàng.
- Xây nền tảng dữ liệu để bổ sung source delivery, SaaS subscription, seller portal và payout.

### 4.2 North-star and supporting metrics

| Metric | Định nghĩa | Ghi chú |
|---|---|---|
| Qualified Requests | Số yêu cầu đạt tiêu chí đủ thông tin để tư vấn | Phải thống nhất tiêu chí qualified |
| Request Conversion Rate | Requests / unique marketplace visitors | Theo dõi theo nguồn và danh mục |
| Demo Engagement Rate | Phiên xem demo / phiên xem listing | Đo sức hút listing |
| Quotation Acceptance Rate | Báo giá được chấp thuận / báo giá đã gửi | Phân tích theo seller và offer |
| Lead First Response Time | Thời gian từ lúc tạo request đến phản hồi đầu tiên | KPI vận hành |
| Paid Order Conversion | Đơn thanh toán thành công / checkout initiated | Chỉ áp dụng offer fixed-price |
| Subscription MRR | Tổng doanh thu thuê bao tháng quy đổi | Phase SaaS |
| Seller Activation | Seller được duyệt có listing publish và phát sinh lead/order | Phase partner |
| Refund / Dispute Rate | Refund/dispute trên tổng order đã thanh toán | KPI chất lượng và rủi ro |

Không đặt target số tuyệt đối trong PRD trước khi có baseline traffic và năng lực vận hành. Product Owner thiết lập target sau giai đoạn pilot.

### 4.3 Non-goals for initial MVP

- Không xây trình kéo-thả website builder.
- Không làm hosting control panel hoặc deployment platform đa cloud.
- Không tự động chia tiền/payout seller trong MVP.
- Không triển khai escrow hoặc hệ thống giải quyết tranh chấp phức tạp.
- Không làm chat realtime.
- Không xây CRM tổng quát thay thế hệ thống CRM doanh nghiệp.
- Không hỗ trợ mọi cổng thanh toán/tiền tệ ngay ngày đầu.
- Không tự động sinh website từ prompt bằng AI trong MVP.
- Không bảo đảm mọi listing đều tương thích hoặc có license phân phối nếu chưa qua kiểm duyệt.

## 5. Target Users and Personas

### 5.1 Visitor / Buyer

Cá nhân hoặc doanh nghiệp muốn có website, chưa chắc hiểu thuật ngữ kỹ thuật.

**Needs:** tìm theo mục đích/ngành, xem demo, hiểu giá và scope, so sánh, được tư vấn, theo dõi yêu cầu/đơn hàng.

### 5.2 Customer Account Owner

Người đại diện khách hàng đã tạo tài khoản hoặc được mời vào workspace khách hàng.

**Needs:** quản lý yêu cầu, quotation, orders, dự án, file bàn giao, thành viên và hóa đơn.

### 5.3 Seller Owner / Seller Staff

Freelancer, studio hoặc agency cung cấp template/dịch vụ/SaaS.

**Needs:** tạo profile, gửi listing duyệt, quản lý offer, nhận lead/order, phản hồi khách hàng, theo dõi doanh thu và tuân thủ chính sách.

### 5.4 Platform Admin

Nhân sự vận hành marketplace.

**Needs:** kiểm duyệt seller/listing, phân công lead, tư vấn, tạo báo giá, kiểm soát order, xử lý refund và theo dõi hiệu quả.

### 5.5 Platform Operations / Support

Nhân sự hỗ trợ có quyền giới hạn.

**Needs:** tra cứu giao dịch, hỗ trợ khách hàng, quản lý sự cố và để lại audit trail; không mặc định có quyền thay đổi thanh toán hoặc payout.

## 6. Product and Commercial Model

### 6.1 Core concepts

- **Category:** ngành/lĩnh vực hoặc nhóm giải pháp (Restaurant, Education, Real Estate, Healthcare, Portfolio, E-commerce...).
- **Listing:** trang công khai giới thiệu một giải pháp/template/dịch vụ.
- **Offer:** lựa chọn thương mại khách hàng có thể mua/đặt/đăng ký. Listing có thể có nhiều offer.
- **Fulfillment Type:** cách cung cấp kết quả: `SOURCE_CODE`, `MANAGED_SERVICE`, `SAAS`, `CUSTOM_PROJECT`.
- **Pricing Model:** `FIXED`, `STARTING_AT`, `QUOTE`, `SUBSCRIPTION`.
- **Seller:** tổ chức cung cấp offer. Platform cũng được biểu diễn như một seller đặc biệt (`PLATFORM`).
- **Order:** giao dịch đã được khách hàng xác nhận/đặt mua.
- **Quote Request:** yêu cầu tư vấn/báo giá chưa phải order.
- **Quotation:** đề xuất chi phí và phạm vi có phiên bản, có hiệu lực.
- **SaaS Tenant:** workspace được tạo riêng cho khách hàng sử dụng sản phẩm SaaS; không đồng nhất với seller organization.

### 6.2 Fulfillment and pricing matrix

| Fulfillment | Pricing model phù hợp | Khách hàng nhận | Kênh bàn giao |
|---|---|---|---|
| Source/Template | Fixed / Quote | File source, package, license, hướng dẫn | Download entitlement có kiểm soát hoặc link bàn giao an toàn |
| Managed Service | Fixed / Starting At / Quote | Website đã tùy chỉnh và triển khai | Project workflow, staging, nghiệm thu, bàn giao |
| SaaS | Subscription / Trial / Quote | Tài khoản và tenant/workspace đang hoạt động | Provisioning, subscription lifecycle |
| Custom Project | Quote | Sản phẩm theo SOW/quotation | Project milestones, nghiệm thu và bàn giao |

Không cho phép tổ hợp không hợp lệ chỉ vì schema có thể lưu. Ví dụ: `SOURCE_CODE + SUBSCRIPTION` chỉ được bật khi có nghiệp vụ license thuê bao rõ ràng; mặc định không hỗ trợ ở MVP.

### 6.3 Revenue streams

- Fixed sale: thu một lần theo giá offer.
- Quote-based: thu theo quotation được khách hàng chấp thuận; có thể có deposit/milestone theo hợp đồng.
- Subscription: thu định kỳ theo tháng/năm; xử lý trial, renewal, failed payment, cancellation và grace period.
- Marketplace commission: tỷ lệ/phí nền tảng trên giao dịch của seller, rollout sau khi hoàn thiện ledger và đối soát.
- Optional services: hosting, maintenance, content entry, SEO, support plan nếu được định nghĩa thành offer/add-on rõ ràng.

### 6.4 Seller model

- `PLATFORM`: listing do nền tảng sở hữu; seller organization nội bộ được tạo khi seed hệ thống.
- `PARTNER`: seller bên ngoài; phải có hồ sơ, trạng thái xét duyệt và điều khoản hợp tác.
- Seller chỉ có quyền quản lý dữ liệu thuộc seller organization của mình.
- Mọi listing partner phải qua moderation trước khi public.
- Listing đang có order không được xóa cứng; chỉ được archive/suspend và giữ lịch sử giao dịch.

## 7. Scope and Release Strategy

### Phase 0 — Foundation

- Repository, environments, CI/CD, auth, RBAC, audit log, storage.
- Seed platform seller và taxonomy ban đầu.
- Base catalog schema, listing/offer schema và API conventions.

### Phase 1 — MVP: Validate demand and operations

**Buyer experience**
- Homepage, marketplace browse, category, search/filter, listing detail, demo links.
- Listing có offer fixed/starting-at/quote.
- Custom project wizard, file upload, submit success and reference code.
- Guest request được phép; tài khoản có thể liên kết request sau khi xác minh email.

**Admin operations**
- Admin login/RBAC.
- CRUD category, listing, media, tags, feature, offer.
- Publish/unpublish listing.
- Request inbox, assign owner, update status, internal note, customer response.
- Manual quotation creation with version, send email, accept/reject.
- Manual order creation/recording for managed service if payment integration is not ready.

**MVP commercial rule**
- Fixed-price purchase có thể dùng checkout đơn giản nếu payment gateway đã được chọn và kiểm thử.
- Nếu cổng thanh toán chưa được phê duyệt, MVP vẫn cho phép `Request to purchase`/manual confirmation; không giả lập thanh toán thành công.
- Seller records có owner và dữ liệu ownership ngay từ đầu; seller self-service chưa bắt buộc.

### Phase 2 — Seller Portal and Digital Delivery

- Seller application, verification review, seller dashboard.
- Listing submission/update by seller with moderation workflow.
- Seller lead/order inbox.
- Digital source delivery with entitlement, signed URLs, license/usage terms and download logs.
- Customer portal đầy đủ và review sau fulfilled order.
- Manual seller settlement statement/ledger; chưa tự động payout nếu chưa qua kiểm toán quy trình.

### Phase 3 — SaaS and Subscription Commerce

- Subscription plan, recurring payment, trial, renewal, dunning and cancellation.
- Tenant provisioning/deprovisioning; tenant domain mapping.
- SaaS usage and limits.
- Tenant isolation test and support tooling.

### Phase 4 — Marketplace Scale

- Seller commissions, immutable financial ledger, payout workflow/automation.
- Dispute/refund workflow nâng cao.
- Seller analytics and performance ranking.
- Multi-currency, localization, promotions and API integrations as justified.

## 8. Information Architecture

### Public

- `/` — Homepage
- `/marketplace` — Browse listings
- `/categories/:slug` — Category landing
- `/solutions/:slug` — Listing detail
- `/request-project` — Custom project wizard
- `/how-it-works` — Process and buying guide
- `/pricing` — Pricing explanation (optional if offers own pricing)
- `/about`, `/contact`, `/faq`, `/terms`, `/privacy`

### Customer portal

- `/account/overview`
- `/account/requests`
- `/account/requests/:id`
- `/account/quotations/:id`
- `/account/orders`
- `/account/orders/:id`
- `/account/projects/:id`
- `/account/downloads`
- `/account/subscriptions`
- `/account/profile`, `/account/security`

### Seller portal (Phase 2)

- `/seller/onboarding`
- `/seller/dashboard`
- `/seller/listings`
- `/seller/listings/new`
- `/seller/leads`
- `/seller/orders`
- `/seller/earnings`
- `/seller/team`, `/seller/settings`

### Admin

- `/admin/dashboard`
- `/admin/sellers`, `/admin/sellers/:id`
- `/admin/categories`, `/admin/tags`, `/admin/features`
- `/admin/listings`, `/admin/listings/:id`
- `/admin/offers`
- `/admin/requests`, `/admin/requests/:id`
- `/admin/quotations`, `/admin/quotations/:id`
- `/admin/orders`, `/admin/orders/:id`
- `/admin/projects`, `/admin/projects/:id`
- `/admin/subscriptions`
- `/admin/reviews`, `/admin/reports`
- `/admin/content`, `/admin/settings`, `/admin/audit-logs`

## 9. Main User Journeys

### 9.1 Browse and request an existing solution

1. Visitor enters marketplace or category page.
2. Visitor searches/filters by category, solution type, price model, fulfillment type, technology and feature.
3. Visitor opens listing detail and reviews screenshots, demo, scope, seller profile, support and license details.
4. Visitor chooses an offer.
5. If offer is fixed-price, visitor starts checkout or requests consultation depending on configuration.
6. If offer is starting-at/quote, visitor creates a quote request linked to listing and offer.
7. Customer receives reference code and email notification.
8. Admin/seller responds; accepted quotation can convert to order.

### 9.2 Custom project request

1. Visitor selects `I need a custom solution`.
2. Wizard captures project goal, industry, solution type, target audience, pages/features, integrations, design references, budget range, timeline and contact.
3. User may answer `Not sure yet` for nonessential technical selections.
4. Upload validates file type/size and stores private object.
5. On submit, backend validates consent, rate limits and creates request in `NEW`.
6. Request is assigned by admin or routing rule.
7. Admin asks clarification, records internal notes and creates a quotation.
8. Customer receives quotation link; can accept or reject with recorded timestamp and quotation version.
9. Accepted quotation creates order and optionally project.

### 9.3 Seller listing workflow

1. Seller applies and submits organization/profile details.
2. Admin reviews and approves/rejects/requests changes.
3. Approved seller creates listing draft and one or more offers.
4. Seller submits listing for moderation.
5. Admin reviews rights, content, demo URL, pricing and fulfillment claims.
6. Admin publishes, rejects or requests changes.
7. Published listing appears in public catalog.
8. Seller edits a published listing by creating a revision; important changes require re-review.

### 9.4 Source/template order

1. Customer chooses source offer and license.
2. Checkout creates order with immutable price/license snapshot.
3. Payment is confirmed by verified provider webhook.
4. Entitlement is created once, idempotently.
5. Customer downloads via short-lived signed URL.
6. System records download events and entitlement status.

### 9.5 Managed service order

1. Customer accepts offer/quotation and payment terms.
2. Order creates project with scope snapshot.
3. Project progresses through kickoff, in progress, review, delivery and acceptance.
4. Customer submits feedback/approval.
5. Final deliverables are stored securely; handover acknowledgement is recorded.
6. Order/project completes; review may be requested.

### 9.6 SaaS subscription

1. Customer selects subscription offer and accepts terms.
2. Payment provider confirms subscription/payment.
3. Subscription service requests tenant provisioning.
4. Provisioner creates tenant, initial admin membership, plan entitlements and domain/workspace.
5. Tenant becomes active only after successful provisioning.
6. Renewal/failed payment/cancellation events update subscription and access according to grace-period policy.

## 10. Functional Requirements

Priority: **P0** = MVP blocker; **P1** = next release; **P2** = later scale feature.

### 10.1 Public Catalog

| ID | Requirement | Priority |
|---|---|---|
| FR-CAT-01 | Người dùng xem danh sách listing đã publish và chưa bị suspend/archive. | P0 |
| FR-CAT-02 | Lọc listing theo category, tags, fulfillment type, pricing model và feature. | P0 |
| FR-CAT-03 | Tìm kiếm theo title, summary, category và tags. | P0 |
| FR-CAT-04 | Xem listing detail gồm mô tả, media, demo, seller, offer, scope và điều khoản. | P0 |
| FR-CAT-05 | Một listing hỗ trợ nhiều offer độc lập. | P0 |
| FR-CAT-06 | Admin quản lý category có phân cấp, slug và trạng thái. | P0 |
| FR-CAT-07 | Admin quản lý tag và feature dictionary. | P0 |
| FR-CAT-08 | Listing có SEO title, description, canonical slug và social image. | P1 |
| FR-CAT-09 | Khách hàng yêu thích và so sánh listing. | P2 |
| FR-CAT-10 | Listing có review chỉ từ order đủ điều kiện. | P1 |

### 10.2 Seller and Listing Governance

| ID | Requirement | Priority |
|---|---|---|
| FR-SEL-01 | Mọi listing thuộc một owner organization; có platform seller mặc định. | P0 |
| FR-SEL-02 | Admin tạo và quản lý seller organization/profile. | P0 |
| FR-SEL-03 | Seller partner gửi application để được xét duyệt. | P1 |
| FR-SEL-04 | Seller owner quản lý staff và quyền seller-scoped. | P1 |
| FR-SEL-05 | Seller tạo/sửa draft listing và offer. | P1 |
| FR-SEL-06 | Listing partner phải được moderation trước khi public. | P1 |
| FR-SEL-07 | Admin approve/reject/request changes/suspend listing. | P0 |
| FR-SEL-08 | Seller chỉ đọc/sửa tài nguyên thuộc organization của mình. | P1 |
| FR-SEL-09 | Lưu lịch sử revision, người chỉnh và nội dung publish. | P1 |
| FR-SEL-10 | Admin có thể ẩn hoặc suspend seller/listing kèm lý do. | P1 |

### 10.3 Custom Request and CRM Workflow

| ID | Requirement | Priority |
|---|---|---|
| FR-REQ-01 | Visitor gửi custom project request không bắt buộc đăng nhập. | P0 |
| FR-REQ-02 | Form wizard hỗ trợ bước, tiến trình, validation và câu trả lời “chưa xác định”. | P0 |
| FR-REQ-03 | Request có industry, solution type, goals, features, budget, timeline và contact snapshot. | P0 |
| FR-REQ-04 | Request có thể liên kết listing/offer hoặc là custom không liên kết. | P0 |
| FR-REQ-05 | Cho phép upload file an toàn và lưu private. | P0 |
| FR-REQ-06 | Sinh mã tham chiếu request duy nhất và email xác nhận. | P0 |
| FR-REQ-07 | Admin lọc, tìm kiếm, phân loại, assign và thay đổi status request. | P0 |
| FR-REQ-08 | Admin thêm internal note không hiển thị với khách hàng. | P0 |
| FR-REQ-09 | Customer và admin trao đổi qua thread/message có phân quyền. | P1 |
| FR-REQ-10 | Request có activity timeline. | P0 |
| FR-REQ-11 | Chống spam bằng rate limit, honeypot/CAPTCHA theo rủi ro. | P0 |
| FR-REQ-12 | Customer có thể liên kết request guest vào tài khoản sau email verification. | P1 |

### 10.4 Quotation

| ID | Requirement | Priority |
|---|---|---|
| FR-QUO-01 | Admin tạo quotation cho request hoặc order consultation. | P0 |
| FR-QUO-02 | Quotation gồm line items, quantity, unit price, discount, tax, total, currency và notes. | P0 |
| FR-QUO-03 | Mỗi lần gửi quotation tạo version bất biến. | P0 |
| FR-QUO-04 | Quotation có valid_until và terms/scope/deliverables/exclusions. | P0 |
| FR-QUO-05 | Customer xem, accept hoặc reject đúng version. | P0 |
| FR-QUO-06 | Chỉ quotation hợp lệ và chưa hết hạn mới được accept. | P0 |
| FR-QUO-07 | Accepted quotation tạo order idempotently. | P0 |
| FR-QUO-08 | Admin/seller ghi nhận deposit và milestone payment terms. | P1 |
| FR-QUO-09 | Lưu lý do từ chối và lịch sử revision. | P1 |

### 10.5 Checkout, Orders and Payments

| ID | Requirement | Priority |
|---|---|---|
| FR-ORD-01 | Fixed offer có thể tạo checkout/order. | P1 |
| FR-ORD-02 | Order item lưu snapshot tên offer, giá, license, scope, seller và tax tại thời điểm mua. | P0 |
| FR-ORD-03 | Payment provider được tích hợp qua adapter; không phụ thuộc trực tiếp một provider. | P1 |
| FR-ORD-04 | Webhook xác minh chữ ký và idempotent. | P1 |
| FR-ORD-05 | Không đánh dấu paid từ redirect frontend; chỉ xác nhận từ provider callback/query đáng tin cậy. | P1 |
| FR-ORD-06 | Admin ghi nhận giao dịch thủ công có reference và audit log nếu dùng offline payment. | P0 |
| FR-ORD-07 | Refund là record riêng, có reason, amount, status và actor. | P1 |
| FR-ORD-08 | Hỗ trợ order status riêng theo fulfillment flow. | P0 |
| FR-ORD-09 | Customer xem lịch sử order và receipt/invoice status. | P1 |
| FR-ORD-10 | Seller chỉ xem order/line thuộc seller của mình. | P1 |

### 10.6 Source/Template Delivery

| ID | Requirement | Priority |
|---|---|---|
| FR-DIG-01 | Offer source ghi rõ license, version, compatibility, included files và update policy. | P1 |
| FR-DIG-02 | Tạo entitlement sau khi payment/order được xác nhận. | P1 |
| FR-DIG-03 | Download dùng signed URL ngắn hạn, không public object URL. | P1 |
| FR-DIG-04 | Có thể revoke entitlement theo refund/violation policy. | P1 |
| FR-DIG-05 | Ghi log lượt tải, thời gian, user và asset version. | P1 |

### 10.7 Managed Project

| ID | Requirement | Priority |
|---|---|---|
| FR-PRJ-01 | Order managed/custom có thể tạo project. | P0 |
| FR-PRJ-02 | Project lưu scope, milestones, owner, target dates và status. | P1 |
| FR-PRJ-03 | Customer và delivery team xem tiến độ theo quyền. | P1 |
| FR-PRJ-04 | Tệp bàn giao và biên bản nghiệm thu được lưu versioned/private. | P1 |
| FR-PRJ-05 | Ghi nhận customer acceptance hoặc change request. | P1 |

### 10.8 SaaS Subscription and Tenant

| ID | Requirement | Priority |
|---|---|---|
| FR-SAA-01 | Offer SaaS định nghĩa billing interval, trial, feature entitlement và usage limit. | P2 |
| FR-SAA-02 | Tạo subscription từ checkout/provider event. | P2 |
| FR-SAA-03 | Provision tenant qua job có retry và idempotency. | P2 |
| FR-SAA-04 | Tenant có domain/workspace, owner membership, plan và trạng thái. | P2 |
| FR-SAA-05 | Xử lý renewal, payment failed, grace period, cancellation và suspension. | P2 |
| FR-SAA-06 | Bắt buộc tenant isolation cho mọi truy cập dữ liệu SaaS. | P2 |
| FR-SAA-07 | Ghi usage event và áp dụng quota/limit theo entitlement. | P2 |

### 10.9 Customer Portal, Reviews and Notifications

| ID | Requirement | Priority |
|---|---|---|
| FR-CUS-01 | Customer đăng ký/đăng nhập và xác minh email. | P1 |
| FR-CUS-02 | Customer xem request, quotation, order, project và subscription của mình. | P1 |
| FR-CUS-03 | Customer xem/tải file được phép. | P1 |
| FR-CUS-04 | Customer update profile và quản lý session. | P1 |
| FR-REV-01 | Review chỉ được tạo từ order fulfilled/eligible. | P1 |
| FR-REV-02 | Admin ẩn review vi phạm và lưu reason. | P1 |
| FR-NOT-01 | Gửi email khi request created, request updated, quotation sent/accepted/rejected, order state changed. | P0 |
| FR-NOT-02 | Email gửi bất đồng bộ qua queue và có retry. | P0 |
| FR-NOT-03 | Lưu notification delivery status và provider message id. | P1 |

### 10.10 Admin, CMS and Reporting

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | Admin dashboard hiển thị requests, quotations, orders và funnel cơ bản. | P0 |
| FR-ADM-02 | RBAC theo role và permission; hỗ trợ resource scope cho seller. | P0 |
| FR-ADM-03 | Admin quản lý user, organization, seller và trạng thái. | P0 |
| FR-ADM-04 | Admin cấu hình terms, contact, email sender và marketplace settings. | P1 |
| FR-ADM-05 | Admin quản lý homepage blocks, FAQ và nội dung tĩnh. | P1 |
| FR-ADM-06 | Audit log cho hành động nhạy cảm. | P0 |
| FR-ADM-07 | Export CSV có kiểm soát quyền và log. | P2 |

## 11. Business Rules

| ID | Rule |
|---|---|
| BR-01 | Mỗi listing bắt buộc có một owner organization và category chính. |
| BR-02 | Chỉ listing `PUBLISHED` và không bị seller/account restriction mới xuất hiện public. |
| BR-03 | Listing phải có tối thiểu một offer active hoặc CTA rõ ràng là contact/request quote. |
| BR-04 | Offer xác định chính xác pricing model, fulfillment type, currency và điều khoản bàn giao. |
| BR-05 | Không được thay đổi giá/scope của order đã tạo bằng cách cập nhật listing/offer. |
| BR-06 | Mọi order item lưu commercial snapshot bất biến. |
| BR-07 | Guest request cần contact verification hoặc cơ chế xác nhận phù hợp trước khi hiển thị dữ liệu nhạy cảm. |
| BR-08 | Internal note không bao giờ được serialize ra customer API. |
| BR-09 | Quotation được chấp thuận phải là version mới nhất, `SENT`, chưa hết hạn và chưa bị superseded. |
| BR-10 | Một quotation chỉ được convert thành một order (idempotent). |
| BR-11 | Payment webhook phải được xác minh chữ ký và deduplicate theo provider event id. |
| BR-12 | Chỉ backend/service tin cậy mới tạo entitlement sau khi giao dịch được xác nhận. |
| BR-13 | Seller chỉ truy cập dữ liệu theo seller organization membership và role. |
| BR-14 | Seller payout không được tính từ giá trị order đơn thuần; phải qua immutable ledger và reconciliation. |
| BR-15 | SaaS tenant identity tách khỏi seller organization; không dùng chung tenant boundary. |
| BR-16 | Tệp khách hàng/private deliverable không được lưu public. |
| BR-17 | Listing có giao dịch lịch sử không bị hard-delete; dùng archive/suspend. |
| BR-18 | Mọi thay đổi trạng thái quotation/order/payment/subscription phải phát sinh activity/audit event. |
| BR-19 | Tax, invoice, refund và consumer terms phải cấu hình theo pháp nhân/thị trường và được duyệt trước production. |
| BR-20 | Giá hiển thị và phép tính tiền dùng integer minor units (VND đồng hoặc đơn vị nhỏ nhất của currency); không dùng floating point. |

## 12. State Machines

### 12.1 Quote Request

```text
NEW -> TRIAGED -> IN_REVIEW -> WAITING_CUSTOMER -> QUOTATION_SENT
     -> CONVERTED | CLOSED_WON | CLOSED_LOST | SPAM
```

- `WAITING_CUSTOMER` và `IN_REVIEW` có thể luân phiên khi cần bổ sung thông tin.
- `CONVERTED` là request đã tạo order từ quotation.
- Mọi chuyển trạng thái phải qua service kiểm tra allowed transition.

### 12.2 Listing moderation

```text
DRAFT -> SUBMITTED -> IN_REVIEW -> PUBLISHED
                    -> CHANGES_REQUESTED -> SUBMITTED
                    -> REJECTED
PUBLISHED -> SUSPENDED -> PUBLISHED (after review) / ARCHIVED
```

### 12.3 Quotation

```text
DRAFT -> SENT -> ACCEPTED
             -> REJECTED
             -> EXPIRED
             -> SUPERSEDED
```

### 12.4 Order lifecycle

Order có status chung và fulfillment status riêng; tránh dùng một enum quá lớn.

- Common: `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUND_PENDING`, `PARTIALLY_REFUNDED`, `REFUNDED`, `COMPLETED`.
- Source delivery: `NOT_READY`, `ENTITLEMENT_ACTIVE`, `REVOKED`.
- Managed/custom: `NOT_STARTED`, `KICKOFF`, `IN_PROGRESS`, `IN_REVIEW`, `DELIVERED`, `ACCEPTED`.
- SaaS: theo subscription/tenant lifecycle, không ép vào project lifecycle.

### 12.5 Subscription

```text
INCOMPLETE -> TRIALING -> ACTIVE -> PAST_DUE -> ACTIVE
                                  -> CANCEL_AT_PERIOD_END -> CANCELED
                                  -> SUSPENDED
```

Cần chốt grace period, immediate vs end-of-period cancellation và cách xử lý tenant data sau khi subscription kết thúc.

## 13. UX and Content Requirements

- Marketplace hỗ trợ mobile-first và responsive.
- Search/filter phải giữ trạng thái trong URL để share được.
- Listing detail phải hiển thị rõ: người cung cấp, phương thức bàn giao, giá/giá khởi điểm, recurring fee nếu có, phạm vi bao gồm/không bao gồm, license, hỗ trợ và CTA.
- Demo link phải được gắn nhãn external demo; không tự động proxy URL chưa tin cậy.
- Custom request wizard có progress, back/next, validation inline và summary review trước submit.
- Không bắt buộc khách hàng biết framework, database hoặc thuật ngữ kỹ thuật.
- Form cho phép “Chưa rõ / cần tư vấn” để không làm giảm completion.
- Trạng thái request/order được diễn đạt bằng ngôn ngữ khách hàng, không lộ enum kỹ thuật.
- Nội dung legal/policy cần có version và timestamp consent.

## 14. Non-functional Requirements

| Area | Baseline requirement |
|---|---|
| Availability | Mục tiêu ban đầu 99.5% monthly uptime sau khi production ổn định; loại trừ bảo trì có thông báo theo SLA |
| Performance | Catalog API p95 < 500ms ở tải mục tiêu; trang catalog LCP mục tiêu < 2.5s trên thiết bị/mạng đại diện |
| Scalability | Horizontal scale cho web/API/worker; database index và query plan được theo dõi |
| Security | OWASP-oriented controls, least privilege, secure session, audit, secret management, dependency scanning |
| Privacy | Thu thập tối thiểu, purpose limitation, retention policy, export/delete workflow theo chính sách được duyệt |
| Accessibility | Form labels, keyboard navigation, focus visibility, semantic headings, contrast; mục tiêu WCAG 2.2 AA |
| SEO | SSR/metadata/canonical/sitemap/robots cho listing/category public |
| Localization | MVP tiếng Việt, schema sẵn sàng i18n; tiền tệ mặc định VND |
| Backup | Daily backup tối thiểu; mục tiêu RPO/RTO phải được chốt theo chi phí vận hành |
| Observability | Structured logs, metrics, traces cho request, payment, notification và provisioning |
| Data integrity | DB transactions, unique constraints, idempotency, immutable snapshots/ledger |

## 15. Roles and Permissions Overview

| Capability | Visitor | Customer | Seller Staff | Seller Owner | Support | Admin |
|---|---:|---:|---:|---:|---:|---:|
| Browse public listings | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Submit request | ✓ | ✓ | — | — | On behalf with audit | ✓ |
| View own request/order | — | ✓ | — | — | Assigned/limited | ✓ |
| Manage own listings | — | — | Scoped | ✓ | — | ✓ |
| Submit listing moderation | — | — | Scoped | ✓ | — | ✓ |
| View seller orders | — | — | Scoped | ✓ | — | ✓ |
| Create quotation | — | — | Later scoped | Later | Limited | ✓ |
| Change payment/refund | — | — | — | — | Limited workflow | Restricted admin |
| Manage platform settings | — | — | — | — | — | ✓ |

Quyền thực tế phải là permission-based và có policy check theo resource; bảng trên chỉ là capability overview.

## 16. Acceptance Criteria for MVP

MVP được xem là đủ điều kiện pilot khi:

1. Admin có thể tạo category, listing, media và nhiều offer; publish listing.
2. Visitor có thể duyệt, tìm kiếm/lọc và xem listing detail trên desktop/mobile.
3. Visitor có thể gửi custom request, upload tệp hợp lệ, nhận reference code và email xác nhận.
4. Admin nhận request, assign, ghi internal note, cập nhật trạng thái và gửi phản hồi.
5. Admin tạo quotation versioned; khách hàng xem và accept/reject; accept tạo tối đa một order.
6. Admin có thể tạo/ghi nhận đơn managed-service thủ công nếu payment gateway chưa được tích hợp.
7. Customer/private data không bị lộ qua API public; seller isolation test đạt.
8. Audit log có cho các hành động nhạy cảm; email queue có retry và trạng thái lỗi.
9. Có automated test cho các state transition chính và happy/bad path.
10. Có staging, backup, deployment/rollback guide và runbook xử lý request/payment/email.

## 17. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Phạm vi “all industries/all delivery” quá rộng | Trễ MVP, UX rối | Taxonomy linh hoạt; pilot một nhóm listing nhưng data model tổng quát |
| Listing không rõ scope/license | Tranh chấp, refund | Bắt buộc terms, deliverables, exclusions, license; moderation checklist |
| Seller cung cấp sản phẩm kém chất lượng | Mất niềm tin | KYC/verification theo mức rủi ro, demo check, moderation, suspension |
| Custom request spam | Quá tải sales | Rate limit, honeypot/CAPTCHA, email verification, routing |
| Payment webhook xử lý lặp | Đơn/entitlement trùng | Provider event id unique, transaction, idempotency |
| Payout sai lệch | Rủi ro tài chính | Ledger bất biến, reconciliation, manual approval trước automation |
| SaaS tenant data leak | Rủi ro nghiêm trọng | Tenant context bắt buộc, isolation tests, separate tenant key/policy |
| Tùy chỉnh riêng mỗi ngành | Technical debt | Generic core, schema-driven form sections, extension points có kiểm soát |

## 18. Open Product Questions

Các câu hỏi này không chặn việc xây foundation nhưng phải chốt trước commercial launch:

1. Pháp nhân nào đứng tên bán hàng, thu tiền, xuất hóa đơn và chịu trách nhiệm bảo hành?
2. Giá niêm yết đã bao gồm VAT/thuế hay hiển thị chưa bao gồm?
3. Platform có cho seller tự thu tiền hay toàn bộ thanh toán đi qua nền tảng?
4. Chính sách commission, payout cycle, reserve/holdback và refund/dispute ra sao?
5. License source/template là single project, unlimited projects hay commercial license theo tier?
6. SLA hosting, backup, uptime và data retention của SaaS là gì?
7. Customer có được tải source khi SaaS chấm dứt không?
8. Có yêu cầu ký hợp đồng điện tử/biên bản nghiệm thu không?
9. Có hỗ trợ nhiều ngôn ngữ/tiền tệ ngay khi launch không?
10. Seller onboarding cần giấy tờ/xác minh ở mức nào?

---

**End of PRD**
