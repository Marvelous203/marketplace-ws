# DEV_RULES — Quy tắc kỹ thuật cho codebase Website Marketplace

**Áp dụng cho:** mọi dev và AI IDE làm việc trong `src`/monorepo (Next.js + NestJS + PostgreSQL + Redis + object storage).
**Đặt tại:** root repo (`DEV_RULES.md`, và tham chiếu từ `AGENTS.md`/`CLAUDE.md`/`.cursorrules`).
**Mức ràng buộc:** MUST = bắt buộc · SHOULD = nên · NEVER = cấm.

---

## 0. Nguồn sự thật và thứ tự ưu tiên

Khi có mâu thuẫn, ưu tiên theo thứ tự:

1. `DECISIONS.md` (ADR + quyết định đã chốt)
2. `PRD.md` (FR-*, BR-*) và state machine
3. `DATA_MODEL.md` / `API_SPEC.md`
4. `TECHNICAL_SPEC.md`
5. `BACKLOG.md` (story + acceptance criteria)
6. File này (cách làm)
7. Ý kiến cá nhân / thói quen

- MUST đọc story, các FR/BR liên quan và ADR trước khi viết code.
- NEVER tự bịa trạng thái, quy tắc tiền, quyền, endpoint không có trong tài liệu. Cần thay đổi → tạo đề xuất vào `DECISIONS.md` và **dừng chờ duyệt** (mục 10).

---

## 1. Quy trình cho mỗi story

1. **Chọn đúng một story** theo dependency trong `BACKLOG.md`. Không làm hai story trong một nhánh.
2. **Kiểm tra DoR** (backlog §7). Thiếu → dừng hỏi.
3. **Viết plan ngắn** (≤ 15 dòng) vào mô tả PR/`docs/plans/<story>.md`: file sẽ đụng, migration, endpoint, quyền, test, rủi ro.
4. **Làm nhỏ, commit nhỏ**, mỗi commit build/test được.
5. **Test trước khi báo xong:** acceptance criteria + bad path + permission-denied.
6. **Chạy:** lint, typecheck, unit, integration liên quan, build.
7. **Tự review theo checklist PR** (mục 13) trước khi mở PR.
8. Cập nhật tài liệu/OpenAPI/`.env.example` nếu thay đổi.

NEVER đánh dấu xong khi chỉ chạy với dữ liệu mock hoặc chỉ có happy path.

---

## 2. Chống conflict

### 2.1 Git
- MUST: một story = một nhánh = một PR nhỏ (gợi ý ≤ 400 dòng thay đổi logic; không tính file sinh tự động).
- Nhánh: `feat/WM-021-listing-crud`, `fix/WM-052-stale-quote`, `chore/...`.
- Commit theo Conventional Commits: `feat(catalog): add listing publish validator (WM-024)`.
- MUST `rebase` lên `main` trước khi mở/merge PR; giải quyết conflict thủ công, không chấp nhận "mine/theirs" mù quáng.
- NEVER force-push lên `main` hoặc nhánh dùng chung. NEVER commit `.env`, secret, file build, file tạm.
- NEVER "drive-by refactor": không đổi định dạng/tên/cấu trúc ngoài phạm vi story. Cần refactor → PR riêng.

### 2.2 Ranh giới module (TECHNICAL_SPEC §3.1, §4)
- Mỗi module chỉ được gọi module khác qua **public service/interface** (`index.ts` export có chủ đích).
- NEVER import repository/entity/file nội bộ của module khác.
- Bắt buộc enforce bằng lint (`eslint-plugin-boundaries` hoặc `dependency-cruiser`) và chạy trong CI.
- Không import vòng. Cần dữ liệu chéo module → dùng service hoặc domain event (outbox).

### 2.3 Quyền sở hữu file và vùng nóng
- Vùng dễ conflict: `schema.prisma`/migrations, `package.json`, lockfile, route index, permission catalog, enum chung, i18n bundle.
- MUST: thay đổi vùng nóng đi trong PR riêng nhỏ, merge sớm; các PR khác rebase lại.
- Dùng `CODEOWNERS` cho `prisma/`, `packages/contracts/`, `auth/`, `payment/`.
- Enum/permission/error code đặt **một chỗ duy nhất** (`packages/contracts`), không khai báo lặp.

### 2.4 Migration
- Tên có timestamp, một migration một mục đích. NEVER sửa migration đã merge; tạo migration mới.
- Quy tắc **expand → migrate/backfill → contract** cho thay đổi phá vỡ; không `DROP` cột/bảng trong cùng release.
- Mỗi migration có ghi chú rollback hoặc forward-fix. Migration phá dữ liệu cần phê duyệt (mục 10).
- Seed phải idempotent.
- Hai người cùng đổi schema → thống nhất trước, một người rebase migration sau khi người kia merge.

### 2.5 Contract
- DTO/Zod schema nằm ở `packages/contracts`; frontend và backend dùng chung/ sinh type từ OpenAPI.
- Thay đổi contract không tương thích ngược → tăng version/`expand-contract`, cần duyệt.
- Dependency: thêm lib mới cần lý do (kích thước, bảo trì, license, bảo mật). Một ORM, một thư viện validation, một thư viện date/money cho toàn dự án.

---

## 3. Clean code

### 3.1 Cấu trúc và phân lớp (backend)
```text
module/
  dto/              request/response DTO (không dùng entity trực tiếp)
  domain/           entity thuần, value object, state machine, policy
  application/      use case / service (điều phối, transaction)
  infrastructure/   repository, provider adapter, queue consumer
  presentation/     controller, guard, serializer
  index.ts          public API của module
```
- Controller chỉ: xác thực quyền, validate, gọi use case, map DTO. **Không chứa logic nghiệp vụ.**
- Service/use case chứa nghiệp vụ; repository chỉ truy cập dữ liệu; domain không phụ thuộc framework.
- NEVER serialize ORM entity trực tiếp ra API.

### 3.2 Quy ước
- TypeScript `strict`. NEVER `any` (dùng `unknown` + narrowing/validate). NEVER `@ts-ignore` không kèm lý do và ticket.
- Hàm ≤ ~40 dòng, một trách nhiệm; tham số ≤ 4 (dùng object); độ phức tạp thấp, return sớm.
- Tên nói rõ nghiệp vụ (`acceptQuotationVersion`, không `handleData`). Dùng ngôn ngữ domain trong PRD.
- Không magic number/string: dùng const/enum/config. Không comment "làm gì" — comment "tại sao".
- Không code chết, không `console.log`, không TODO không có ticket.
- Lỗi: dùng domain error có `code` theo API_SPEC §12; không throw string; không nuốt lỗi (`catch {}` rỗng).
- Không mutate input; dùng immutable cho snapshot.
- Mỗi file một mục đích; không "utils" dumping ground — đặt theo domain.
- Format/lint tự động (Prettier + ESLint) chạy pre-commit và CI.

### 3.3 Frontend
- Server Components mặc định; Client Component khi cần tương tác. Hạn chế state toàn cục.
- Dữ liệu từ server qua lớp API client có type; không `fetch` rải rác trong component.
- Component nhỏ, tách presentational/container; tái sử dụng từ `packages/ui`.
- Form: một thư viện (ví dụ React Hook Form + Zod), schema dùng chung với backend khi có thể.

---

## 4. Quy tắc nghiệp vụ (logic thực tế)

Mapping tới `BR-*`; vi phạm = lỗi nghiêm trọng.

1. **Tiền (BR-20):** chỉ dùng integer minor units + currency qua module `Money` duy nhất. NEVER float. Làm tròn một chỗ, có test biên.
2. **Server tính, client không quyết:** giá, tổng, thuế, quyền, `sellerId`, `tenantId`, `isAdmin` luôn suy ra ở server. Bỏ qua mọi giá trị tương ứng gửi từ client.
3. **Snapshot bất biến (BR-05/06):** order/quotation lưu snapshot offer, giá, scope, license, seller. Đổi listing/offer không đổi lịch sử.
4. **State machine (BR-18):** mọi chuyển trạng thái qua method domain với bảng transition tập trung; NEVER `PATCH status` tùy ý; ghi actor/from/to/reason/correlationId; test cả transition hợp lệ và bị chặn.
5. **Idempotency (BR-10, BR-11):** tạo request/checkout/convert quotation/webhook/entitlement/provisioning đều idempotent bằng unique constraint DB + idempotency key. Retry không tạo bản ghi trùng.
6. **Transaction:** thao tác nhiều bản ghi (accept quotation + tạo order + outbox) trong một transaction; side effect (email, provisioning) qua **outbox**, không gọi trực tiếp trong transaction.
7. **Không tin redirect frontend:** `PAID` chỉ khi webhook/provider query xác minh (FR-ORD-05).
8. **Quyền theo tài nguyên:** RBAC + policy theo owner/organization/tenant; query luôn kèm scope (seller, customer, tenant). Missing context → fail closed.
9. **Tách loại thực thể:** Listing ≠ Offer; Seller org ≠ Tenant; Template ≠ Module (ADR). Không dùng `organization_id` thay `tenant_id`.
10. **Hard delete bị cấm** với dữ liệu giao dịch/audit (BR-17): archive/suspend/anonymize.
11. **Dữ liệu nội bộ:** internal note, moderation note, tax id, credentials demo không bao giờ vào DTO public/customer.
12. **Edge case phải xử lý có chủ đích:** hết hạn quotation, version stale, đồng thời (race), request lặp, mất mạng giữa chừng, provider chậm, đối tượng bị suspend giữa luồng, múi giờ (lưu UTC, hiển thị giờ địa phương), VND không có số lẻ.
13. **Tính năng bật theo flag** cho payment, seller, delivery, SaaS, community (BACKLOG §1).

---

## 5. Bảo mật

### 5.1 Bắt buộc ở mọi endpoint
- Validate input (DTO, max length, enum, whitelist field). Từ chối field lạ với lệnh nhạy cảm; NEVER spread body vào ORM.
- Xác thực + phân quyền ở **backend**, test ở mức API (không chỉ ẩn UI).
- Chống IDOR: truy vấn qua scope của chủ sở hữu; trả 404 không tiết lộ tồn tại khi phù hợp.
- Rate limit cho login, reset, form công khai, upload, checkout, download, tìm kiếm, community post/report.
- Response lỗi theo chuẩn, không lộ stack/SQL/secret/ghi chú nội bộ.

### 5.2 Dữ liệu và bí mật
- Secret chỉ ở secret manager/env; có `.env.example`; quét secret (gitleaks) trong CI.
- Token reset/verify/magic link: ngẫu nhiên đủ mạnh, hash khi lưu, dùng một lần, hết hạn ngắn.
- Mật khẩu: thuật toán băm hiện đại (argon2id/bcrypt cost phù hợp). Phiên: cookie HttpOnly + Secure + SameSite; CSRF khi cần.
- NEVER log mật khẩu, token, dữ liệu thanh toán, nội dung file riêng, PII không cần thiết. Redact tập trung.
- PII/IP: băm/rút gọn theo chính sách retention.

### 5.3 Nội dung và file
- Rich text/markdown: sanitize theo allowlist; không render HTML thô; link ngoài `rel="ugc nofollow noopener"`.
- Upload: kiểm MIME thật + extension + kích thước, tên lưu ngẫu nhiên, private mặc định, quét mã độc, chặn truy cập đến khi `CLEAN`, signed URL ngắn hạn sau khi kiểm quyền.
- SSRF: NEVER server-side fetch URL do người dùng/seller cung cấp ngoài worker cô lập có allowlist, chặn IP nội bộ/metadata, giới hạn redirect/timeout.
- Không proxy demo ngoài; embed chỉ qua allowlist + `sandbox` + CSP.
- Chống open redirect; kiểm tra `returnUrl` theo allowlist.

### 5.4 Webhook/tài chính
- Verify chữ ký trên raw body; kiểm tra amount/currency/reference/merchant; dedupe theo event id; xử lý bất đồng bộ an toàn; đối soát định kỳ.
- Hành động nhạy cảm (refund, đổi quyền, duyệt seller, thanh toán thủ công) có permission riêng, audit, và nếu cần re-auth/2FA/maker-checker.

### 5.5 Chuỗi cung ứng
- Lockfile, quét dependency/image, cập nhật định kỳ, không dùng package ít bảo trì cho phần nhạy cảm.
- NEVER thực thi code do seller/khách upload trong runtime chung (ADR-MT-005); NEVER `eval`/import động từ DB.

---

## 6. Hiệu năng và cơ sở dữ liệu

- Mọi query list phải có **giới hạn trang** (tối đa theo API_SPEC), sort allowlist, và **index** phục vụ filter chính. Chạy `EXPLAIN` cho query mới ở đường nóng.
- Tránh N+1: dùng join/include có chủ đích hoặc batch loader; có test đếm query ở endpoint quan trọng.
- Chỉ select cột cần; DTO tối giản cho card danh sách.
- Cache có chủ đích: key chứa phiên bản/revision (+ site/tenant/locale nếu có), có TTL và cơ chế invalidation; NEVER cache dữ liệu riêng tư trong cache công khai.
- Việc chậm (email, quét file, webhook, provisioning) → queue/worker, API trả nhanh.
- Giữ transaction ngắn; không gọi mạng bên ngoài trong transaction DB.
- Đối tượng đếm (`reply_count`…) cập nhật nguyên tử; có job đối soát nếu cần.
- Frontend: tách code theo route, lazy-load phần nặng, tối ưu ảnh (kích thước/định dạng), tránh render lại không cần, đặt ngân sách hiệu năng (LCP < 2.5s mục tiêu PRD).
- Đo trước khi tối ưu: không tối ưu sớm khi chưa có số liệu; ghi kết quả đo vào PR.

---

## 7. Trải nghiệm người dùng (UX)

- Mọi màn hình có đủ 4 trạng thái: **loading, empty, error, permission-denied** (+ success).
- Form: validation theo trường (inline), thông báo tiếng Việt rõ nguyên nhân + cách sửa; giữ dữ liệu khi lỗi hoặc khi quay lại; chống double-submit (disable nút + idempotency); không mất dữ liệu khi refresh (nháp tự lưu với form dài).
- Hành động rủi ro/không hoàn tác (hủy, từ chối, gỡ, thanh toán) có xác nhận và nói rõ hệ quả.
- Trạng thái dùng ngôn ngữ khách hàng, không lộ enum kỹ thuật.
- Phản hồi nhanh: skeleton thay vì spinner dài; optimistic UI chỉ cho thao tác an toàn và có rollback.
- Mobile-first; vùng chạm đủ lớn; không phụ thuộc hover.
- Khả năng truy cập (WCAG 2.2 AA): label gắn input, lỗi gắn `aria-describedby`, focus nhìn thấy, thao tác bằng bàn phím, tương phản, heading đúng cấp.
- URL phản ánh trạng thái (filter/sort/page) để chia sẻ được; SEO: SSR, metadata, canonical, sitemap cho trang công khai.
- i18n: không hardcode chuỗi trong component; mặc định `vi`, sẵn sàng thêm ngôn ngữ; định dạng tiền/ngày theo locale.
- Nội dung chờ duyệt/bị từ chối luôn nói rõ lý do và bước tiếp theo (seller, người đăng yêu cầu).

---

## 8. Kiểm thử

- Test theo rủi ro: logic tiền, state machine, quyền, idempotency, đồng thời → bắt buộc unit + integration.
- Integration test dùng **PostgreSQL thật** (container), không SQLite/mock cho test cô lập tenant/ràng buộc.
- Mỗi story có: happy path, bad path (422/409/403/404), permission matrix, race condition cho thao tác tạo bản ghi duy nhất.
- Bộ test bảo mật chạy trong CI (WM-110): IDOR, seller scope, leak ghi chú nội bộ, XSS, upload abuse, webhook giả mạo.
- E2E cho hành trình chính (WM-111). Test phải ổn định: không phụ thuộc thứ tự, không `sleep` tùy tiện; dữ liệu qua factory.
- Bug fix → viết test tái hiện trước khi sửa.
- NEVER xóa/skip test để CI xanh; nếu test sai, sửa và ghi lý do trong PR.

---

## 9. Quan sát và vận hành

- Log có cấu trúc, kèm `traceId/correlationId`, actor, resource; không PII/secret.
- Metric/alert cho lỗi 5xx, độ trễ, hàng đợi, webhook fail, email fail, upload scan fail.
- Mọi job có retry/backoff/dead-letter và hành vi idempotent.
- Hành động nhạy cảm sinh audit event (WM-014).
- Feature flag + kế hoạch rollback/forward-fix cho thay đổi rủi ro.

---

## 10. Gate duyệt — khi nào PHẢI DỪNG và hỏi

**Dừng, không tự quyết, không "làm tạm cho chạy"** khi gặp:

| Loại | Ví dụ |
|---|---|
| Mâu thuẫn tài liệu | PRD nói A, DATA_MODEL nói B; story thiếu acceptance criteria |
| Thay đổi ADR/quyết định | Đổi kiến trúc, thêm dịch vụ hạ tầng, đổi ORM, thêm microservice |
| Thay đổi phá vỡ | Đổi schema không tương thích, đổi contract API, xóa/đổi tên cột/bảng, migration phá dữ liệu |
| Tiền/thuế/hoàn tiền | Công thức, làm tròn, trạng thái payment/refund, commission, payout |
| Bảo mật/quyền | Nới quyền, bỏ kiểm tra, thêm endpoint public, đổi cơ chế xác thực, lưu dữ liệu nhạy cảm mới |
| Pháp lý/chính sách | License, điều khoản, hoàn tiền, nội dung cấm, lưu trữ dữ liệu cá nhân |
| Phạm vi | Cần làm thêm ngoài story, hoặc story quá lớn cần tách |
| Rủi ro dữ liệu | Backfill lớn, xóa dữ liệu, chạy trên production |
| Không chắc nghiệp vụ | Có nhiều cách hiểu hợp lý, tác động tới khách hàng/tiền |
| Test thất bại không rõ nguyên nhân | Nghi lỗi spec, không phải lỗi code |

**Cách hỏi (ngắn gọn, có phương án):**
```text
Vấn đề: <mô tả 1–2 câu, trích mục tài liệu liên quan>
Tác động: <người dùng/tiền/bảo mật/dữ liệu>
Phương án: A) ... (ưu/nhược)  B) ... (ưu/nhược)
Đề xuất: <A hoặc B + lý do>
Đã làm tới đâu / chặn ở đâu: <trạng thái>
```
Trong lúc chờ: làm phần không bị chặn, ghi vào `docs/plans/HANDOFF.md` mục "Đang chờ quyết định". Sau khi được duyệt: cập nhật `DECISIONS.md` rồi mới code.

---

## 11. Gần hết quota/ngữ cảnh — lập kế hoạch ghi nhớ cho đợt sau

**Kích hoạt:** khi ước lượng còn ≲ 15–20% quota/ngữ cảnh, hoặc trước khi kết thúc phiên, hoặc khi bị chặn chờ duyệt.

**Việc phải làm theo thứ tự:**
1. **Dừng mở việc mới.** Hoàn tất hoặc thu gọn đơn vị công việc đang dở tới trạng thái an toàn (code build được, test không đỏ do dang dở; nếu không được, đặt sau feature flag hoặc nhánh WIP, **không** merge vào `main`).
2. **Commit/push nhánh** với message mô tả trạng thái (`wip(WM-050): quotation totals — pending line tax rules`).
3. **Cập nhật `docs/plans/HANDOFF.md`** theo mẫu dưới (ghi đè, giữ bản gọn; bản cũ lưu `docs/plans/archive/`).
4. Báo cáo ngắn cho người dùng: đã xong gì, đang dở gì, bước tiếp theo đầu tiên, câu hỏi chờ duyệt.

**Mẫu `docs/plans/HANDOFF.md`:**
```markdown
# HANDOFF — <ngày giờ> — <story/epic>

## 1. Mục tiêu hiện tại
<story ID + mục tiêu 1–2 câu>

## 2. Trạng thái
- Nhánh: <tên> · commit cuối: <hash> · build: OK/FAIL · test: <tóm tắt>
- Đã xong: <danh sách ngắn, có file/đường dẫn chính>
- Đang dở: <việc + vì sao dừng + trạng thái file>
- Chưa bắt đầu: <danh sách theo thứ tự>

## 3. Việc tiếp theo (làm đúng thứ tự)
1. <hành động cụ thể đầu tiên, file/lệnh>
2. ...

## 4. Quyết định đã chốt trong phiên (đã/cần ghi vào DECISIONS.md)
- <quyết định + lý do>

## 5. Đang chờ duyệt
- <câu hỏi + phương án + đề xuất>

## 6. Rủi ro / lưu ý / bẫy
- <điều dễ làm sai, dữ liệu/migration nhạy cảm, lệnh không được chạy>

## 7. Cách chạy/kiểm tra nhanh
- <lệnh chạy app/test cho phần đang làm>

## 8. Tham chiếu
- FR/BR/WM liên quan, tài liệu, PR/issue
```

**Quy tắc ghi nhớ:**
- Handoff phải **đủ để người khác (hoặc phiên sau, không nhớ gì) tiếp tục mà không hỏi lại**: ghi đường dẫn, lệnh, tên hàm, lý do quyết định.
- Ghi "tại sao", không chỉ "cái gì". Ghi cả hướng đã thử và bị loại bỏ.
- Mỗi cuối phiên dài, kể cả khi chưa hết quota, cập nhật handoff (checkpoint).
- Đầu phiên mới: đọc `HANDOFF.md`, `DECISIONS.md`, story hiện tại; xác nhận trạng thái bằng `git status`/test trước khi làm tiếp; **không tin handoff mù quáng nếu repo đã đổi**.
- NEVER để thay đổi dở dang không được mô tả; NEVER lưu secret trong handoff.

---

## 12. Danh sách NEVER (tóm tắt)

- NEVER float cho tiền; NEVER tin giá/quyền/ID chủ sở hữu từ client.
- NEVER PATCH status tùy ý; NEVER hard delete dữ liệu giao dịch/audit.
- NEVER serialize ORM entity ra API; NEVER lộ ghi chú nội bộ.
- NEVER log secret/PII/token; NEVER commit `.env`.
- NEVER SSRF/proxy URL do người dùng cung cấp; NEVER thực thi code upload trong runtime chung.
- NEVER sửa migration đã merge; NEVER `DROP` trong cùng release phá vỡ.
- NEVER import nội bộ module khác; NEVER import vòng.
- NEVER `any`/`@ts-ignore` không lý do; NEVER bỏ qua hoặc xóa test để xanh CI.
- NEVER tự đổi ADR/phạm vi/contract mà không qua duyệt.
- NEVER cache dữ liệu riêng tư ở cache công khai.
- NEVER báo hoàn thành khi chưa có bad path + permission-denied được kiểm thử.

---

## 13. Checklist PR (tự kiểm trước khi mở)

- [ ] Một story, phạm vi gọn; không refactor ngoài lề
- [ ] Đã đọc FR/BR/ADR liên quan; không mâu thuẫn tài liệu
- [ ] Acceptance criteria đều có test; có bad path + permission matrix
- [ ] Backend tự validate + phân quyền; không dựa vào UI
- [ ] Tiền qua module Money; server tính; có snapshot nếu là giao dịch
- [ ] State transition qua domain service; có audit/activity
- [ ] Thao tác tạo bản ghi duy nhất có idempotency/unique constraint
- [ ] Không N+1; query có index/limit; có `EXPLAIN` nếu đường nóng
- [ ] 4 trạng thái UI + a11y + thông báo lỗi tiếng Việt rõ ràng
- [ ] Không lộ dữ liệu nội bộ/PII trong DTO, log, email
- [ ] Migration an toàn (expand/contract), seed idempotent, có ghi chú rollback
- [ ] Lint, typecheck, test, build, quét dependency/secret đều xanh
- [ ] OpenAPI/`.env.example`/tài liệu cập nhật
- [ ] Các điểm cần duyệt đã được liệt kê trong mô tả PR

---

## 14. Gợi ý thêm (nên áp dụng sớm)

1. **Tự động hóa rule bằng công cụ, không chỉ bằng văn bản:** `eslint-plugin-boundaries`/`dependency-cruiser` (ranh giới module), `commitlint` + `husky`, `gitleaks`, `semgrep` (mẫu nguy hiểm: `eval`, raw SQL nối chuỗi, `any`), `knip` (code chết), `renovate/dependabot`.
2. **Contract-first:** OpenAPI sinh từ DTO; contract test chặn thay đổi phá vỡ; client frontend sinh tự động.
3. **Test cô lập tenant/seller bằng fixture hai bên** làm "bộ regression bắt buộc" trong CI.
4. **ADR nhẹ:** mỗi quyết định kỹ thuật đáng kể thêm một file `docs/adr/NNN-*.md` (ngắn, 10–15 dòng).
5. **Feature flag + dark launch** cho payment/seller/community; kill-switch cho tính năng rủi ro cao.
6. **Playwright + axe** kiểm a11y tự động ở hành trình chính; Storybook cho component và 4 trạng thái UI.
7. **k6 smoke/load** cho catalog, tạo request, quotation accept; đặt ngân sách p95 trong CI nightly.
8. **Seed dữ liệu thực tế (VN)** để dev/test thấy tiếng Việt dài, dấu, tên dài, VND lớn.
9. **Runbook ngắn** cho từng cảnh báo (webhook, email, queue, upload scan) đặt cạnh code.
10. **Định nghĩa "stop-the-line":** lỗi rò rỉ dữ liệu, sai tiền, hoặc IDOR → dừng release, ưu tiên hotfix và post-mortem không đổ lỗi.
11. **Mẫu prompt cho AI IDE:** "Làm story WM-xxx. Đọc DEV_RULES.md, DECISIONS.md, story và FR/BR liên quan. Lập plan trước, chờ tôi xác nhận nếu chạm mục 10. Không sửa ngoài phạm vi."
12. **CODEOWNERS + bảo vệ nhánh `main`:** bắt buộc review, CI xanh, không merge trực tiếp.
