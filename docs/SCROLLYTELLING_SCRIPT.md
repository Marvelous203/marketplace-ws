# Kịch bản Scrollytelling — "Cách hoạt động" của Website Marketplace

**Phiên bản:** 1.0-draft · **Ngày:** 22/11/2026
**Vị trí:** Section dưới phần đầu trang chủ, và trang `/how-it-works`
**Hướng diện mạo tạm dùng:** "Xưởng thiết kế" (giấy ngà, mực đen, nhấn đỏ son). Có thể thay bằng "Bản vẽ kỹ thuật" hoặc "Phố nghề" mà không đổi cấu trúc.

---

## 1. Mục đích và nguyên tắc

**Mục đích:** để khách doanh nghiệp (ít kỹ thuật) hiểu trong khoảng 60–90 giây cách tìm, chọn, ước tính chi phí, xem trước và bắt đầu một dự án website trên nền tảng.

**Nguyên tắc:**
1. **Một vật thể duy nhất biến hình.** Một "tờ giấy" ghim giữa màn hình; nội dung bên trong đổi theo mức cuộn. Không cắt cảnh rời rạc.
2. **Người dùng cầm lái.** Hiệu ứng chỉ chạy theo cuộn. Không tự chạy, không chiếm quyền cuộn.
3. **Dữ liệu thật, hứa hẹn thật.** Dùng listing và giá thật khi có. Số liệu minh họa phải ghi rõ "minh họa". Không hứa báo giá tự động hay thời hạn cố định ngoài những gì đặc tả cho phép.
4. **Kết thúc bằng hành động thật.** Section này giới thiệu, không thay thế luồng đặt hàng; mọi nút dẫn sang luồng thật.
5. **Nội dung đầy đủ khi không có hiệu ứng.** Cùng một nội dung, hai cách trình bày (động và tĩnh).

---

## 2. Cấu trúc tổng thể

```text
[Mở]  Tiêu đề section + một câu dẫn                 (~60vh, không ghim)
[1]   Nói cho chúng tôi ngành của bạn                (~100vh, khung ghim)
[2]   Chọn một mẫu hợp ý                              (~100vh)
[3]   Chọn tính năng, thấy chi phí                    (~120vh)
[4]   Xem trước trên mọi thiết bị                     (~100vh)
[5]   Bắt đầu và theo dõi tiến độ                     (~100vh)
[Kết] Lời kêu gọi hành động                            (~60vh, nhả ghim)
```

**Bố cục desktop:**
- **Khung "tờ giấy"**: chiếm khoảng 60% chiều rộng, ghim giữa màn hình.
- **Cột chữ** (khoảng 30%): số chương lớn, tiêu đề, 1–2 câu mô tả, một liên kết phụ.
- **Đường mực tiến trình**: một nét mảnh dọc mép trái, vẽ dần theo mức cuộn, có 5 nút số.

**Bố cục di động:** khung ghim ở nửa trên màn hình, chữ cuộn nhẹ bên dưới. Mỗi chương một đoạn ngắn. Đường mực chuyển thành thanh ngang mảnh trên cùng.

---

## 3. Bảng thời gian theo mức cuộn

`progress` = phần trăm cuộn trong toàn bộ section (0–100%).

| progress | Chương | Hành vi chính |
|---|---|---|
| 0–8% | Mở | Tiêu đề hiện lên; tờ giấy trượt vào từ dưới |
| 8–24% | 1 | Tìm kiếm tự gõ; kết quả bắt đầu hiện |
| 24–40% | 2 | Thẻ giải pháp xuất hiện; một thẻ được chọn và phóng lớn |
| 40–62% | 3 | Thẻ mở thành bảng tính năng; số tiền, thời gian đổi |
| 62–80% | 4 | Khung co lại thành thiết bị; chuyển desktop → tablet → mobile |
| 80–94% | 5 | Đường cột mốc vẽ ra; tờ giấy "hạ cánh" |
| 94–100% | Kết | Nhả ghim; hiện nút kêu gọi hành động |

Ranh giới chương có vùng chồng lấn khoảng 3% để chuyển cảnh liền mạch.

---

## 4. Kịch bản từng chương

### Mở

- **Nhãn nhỏ (mono):** `CÁCH HOẠT ĐỘNG · 5 BƯỚC`
- **Tiêu đề:** *Từ ý tưởng đến website vận hành, không cần rành kỹ thuật.*
- **Câu dẫn:** Bạn kể về việc kinh doanh của mình. Phần còn lại, chúng tôi sắp xếp cho rõ ràng.
- **Chuyển động:** tiêu đề hiện từng dòng (so le ~80ms), tờ giấy trượt lên 24px và mờ dần hiện ra (240ms).

---

### Chương 1 — Kể cho chúng tôi ngành của bạn

- **Số chương:** `01`
- **Tiêu đề:** *Bạn kinh doanh gì?*
- **Mô tả:** Gõ vài chữ về lĩnh vực của bạn. Không cần biết thuật ngữ kỹ thuật.
- **Trong khung:** một thanh tìm kiếm lớn. Con trỏ nhấp nháy, rồi chữ được gõ ra lần lượt các cụm sau, mỗi cụm dừng khoảng 1,2 giây rồi xóa:
  1. `website nhà hàng, có đặt bàn`
  2. `trang giới thiệu spa & thẩm mỹ`
  3. `website bất động sản cao cấp`
  4. `trung tâm ngoại ngữ, nhận đăng ký học thử`
- **Ràng buộc nội dung:** mỗi cụm phải **trả ra kết quả thật** khi tìm trong catalog. Chỉ dùng cụm khi đã có ít nhất một listing tương ứng.
- **Chuyển động:**
  - 8–14%: gõ chữ cụm đầu.
  - 14–20%: cụm thứ hai và thứ ba lướt qua nhanh hơn khi người dùng cuộn tiếp (gắn với mức cuộn, không tự lặp).
  - 20–24%: thanh tìm kiếm thu nhỏ lên đầu khung, dưới nó xuất hiện dòng gợi ý danh mục dạng chip nhỏ (Nhà hàng · Spa · Bất động sản · Giáo dục…).
- **Liên kết phụ:** `Xem tất cả ngành →` (tới `/marketplace`).
- **Đo lường:** `howitworks_step_view{step:1}`; bấm chip → `howitworks_category_click`.

---

### Chương 2 — Chọn một mẫu hợp ý

- **Số chương:** `02`
- **Tiêu đề:** *Xem những gì hợp với bạn.*
- **Mô tả:** Mỗi mẫu cho biết rõ nó gồm gì, giao theo cách nào và giá khởi điểm. Xem demo trong ít phút.
- **Trong khung:** 4–5 thẻ giải pháp trượt vào so le, kích thước **không đều nhau** (tạo cảm giác tường tranh).
  - Mỗi thẻ: ảnh trong khung thiết bị, tên, 2–3 chip tính năng, **con tem** loại bàn giao (`Trọn gói`, `Mã nguồn`, `Thuê bao`), nhãn giá (`Từ 5.000.000 ₫`).
  - Một thẻ nổi bật hơn, được chọn khi cuộn tới giữa chương.
- **Hai hành động trên thẻ được chọn:** `Xem demo` và `Nhờ tư vấn`.
  - *Ghi chú:* "Nhờ tư vấn" dẫn tới form yêu cầu hiện có. Nếu muốn **đặt lịch hẹn**, cần quyết định riêng (xem mục 9).
- **Chuyển động:**
  - 24–30%: thẻ trượt vào (24px, mờ→rõ, so le 60ms).
  - 30–36%: con tem "dập" xuống thẻ chọn (scale 1.1→1, 180ms).
  - 36–40%: các thẻ còn lại mờ đi và lùi về nền; thẻ chọn phóng lớn chuẩn bị mở rộng.
- **Dữ liệu:** lấy từ listing đã xuất bản (chọn thủ công 4–5 listing "nổi bật" bằng cờ `featured`). Giá lấy từ `priceSummary`.
- **Đo lường:** `howitworks_card_click`, `howitworks_demo_click`.

---

### Chương 3 — Chọn tính năng, thấy chi phí

- **Số chương:** `03`
- **Tiêu đề:** *Thêm những gì bạn cần. Chi phí hiện ngay.*
- **Mô tả:** Bật hoặc tắt từng tính năng để thấy ước tính chi phí và thời gian. Báo giá chính thức do chúng tôi xác nhận sau khi trao đổi.
- **Trong khung:** thẻ đã chọn **mở rộng** thành bảng. Bên trái là danh sách tính năng có ô tick; bên phải là hai ô tổng:
  - **Ước tính chi phí:** `từ … đến …`
  - **Thời gian dự kiến:** `… ngày làm việc`
- **Danh sách tính năng minh họa** (dữ liệu minh họa, thay bằng dữ liệu offer thật):

| Tính năng | Ghi chú hiển thị |
|---|---|
| Quản trị nội dung (CMS) | Đã gồm trong gói |
| Đặt bàn / đặt lịch | + chi phí thêm |
| Nhiều ngôn ngữ | + chi phí thêm |
| Tên miền riêng | + chi phí thêm |
| Kết nối quản lý khách hàng (CRM) | + chi phí thêm |
| Chat hỗ trợ khách | + chi phí thêm |

- **Chuyển động:**
  - 40–46%: thẻ mở rộng, danh sách hiện lần lượt.
  - 46–56%: **tự động tick** lần lượt 2–3 ô theo mức cuộn (người dùng thấy ví dụ minh họa). Mỗi lần tick, **số lăn** sang giá trị mới (300ms, giảm tốc), dòng "đã thêm" có vệt đỏ son chạy nhẹ.
  - 56–62%: bảng nén lại, chỉ còn các dòng đã chọn, tạo thành "phiếu cấu hình".
- **Dòng nhỏ cố định dưới bảng:** *Đây là ước tính tham khảo. Báo giá chính thức được gửi sau khi chúng tôi trao đổi với bạn.*
- **Hành động:** `Gửi yêu cầu với cấu hình này` (chuyển các tính năng đã chọn thành dữ liệu form yêu cầu dự án, điền sẵn trường `features`).
- **Lưu ý triển khai:** nếu chưa có dữ liệu tính năng có giá trong hệ thống, giữ bảng ở chế độ **minh họa tĩnh** có nhãn "Minh họa" và bỏ hành động gửi cấu hình.
- **Đo lường:** `howitworks_estimate_toggle{feature}`, `howitworks_send_config_click`.

---

### Chương 4 — Xem trước trên mọi thiết bị

- **Số chương:** `04`
- **Tiêu đề:** *Thấy trước website của bạn.*
- **Mô tả:** Xem giao diện trên máy tính, máy tính bảng và điện thoại, với nội dung mẫu đúng ngành của bạn.
- **Trong khung:** "phiếu cấu hình" co lại thành **một thiết bị**. Thiết bị đổi lần lượt: màn hình máy tính → máy tính bảng → điện thoại. Nội dung trang bên trong giữ nguyên chủ đề và thay đổi bố cục theo khung.
- **Chú thích bản vẽ:** 3–4 **vòng tròn đánh số** nằm trên ảnh, nối bằng đường mảnh với cột chữ: `① Menu và đặt bàn · ② Ảnh món · ③ Nút gọi nhanh · ④ Bản đồ`. Cuộn qua mỗi số, vòng tròn tương ứng sáng lên.
- **Chuyển động:**
  - 62–68%: thiết bị hiện (scale 0.96→1, mờ→rõ).
  - 68–72%: chuyển sang máy tính bảng (xoay và đổi tỉ lệ, 320ms).
  - 72–78%: chuyển sang điện thoại; ảnh trong khung cuộn nhẹ xuống như đang đọc trang.
  - 78–80%: thiết bị thu nhỏ về góc, nhường chỗ cho chương sau.
- **Nội dung hình ảnh:** ban đầu dùng **ảnh/video chụp sẵn** từ phần mô tả demo của listing. Xem trước tương tác thật chỉ làm khi nền tảng host demo (sau R6).
- **Hành động:** `Xem demo đầy đủ →` mở trang chi tiết giải pháp.
- **Đo lường:** `howitworks_device_view{device}`.

---

### Chương 5 — Bắt đầu và theo dõi tiến độ

- **Số chương:** `05`
- **Tiêu đề:** *Rõ ràng từng mốc, từ lúc bắt đầu đến khi chạy.*
- **Mô tả:** Sau khi hai bên thống nhất phạm vi, bạn theo dõi từng giai đoạn ngay trong tài khoản.
- **Trong khung:** một **đường mực** vẽ dần nối bốn cột mốc:
  1. `Khởi tạo` — thiết lập dự án và phạm vi đã thống nhất
  2. `Nhập nội dung & thương hiệu` — logo, ảnh, văn bản của bạn
  3. `Kiểm thử` — kiểm tra trên các thiết bị
  4. `Bàn giao` — website sẵn sàng vận hành
- **Mỗi mốc:** biểu tượng nhỏ, tên, một dòng mô tả, nhãn trạng thái (ví dụ `Đang làm`). Mốc 1 hiện đã hoàn thành, mốc 2 đang làm, hai mốc sau chờ.
- **Dòng thời gian dự kiến:** *Thời gian dự kiến theo từng gói, được ghi rõ trong báo giá.* (không ghi con số cứng ngoài dữ liệu của offer).
- **Chuyển động:**
  - 80–88%: đường mực vẽ dần từ mốc 1 đến mốc 4 (stroke-dash).
  - Mỗi mốc "bật sáng" khi đường mực chạm tới (opacity + scale nhẹ).
  - 88–94%: toàn bộ tờ giấy hạ xuống, thu về thành thẻ nhỏ hình nút kêu gọi.
- **Đo lường:** `howitworks_step_view{step:5}`.

---

### Kết

- **Tiêu đề:** *Sẵn sàng bắt đầu?*
- **Hai nút:** `Xem các giải pháp` (chính, nhấn đỏ son) · `Gửi yêu cầu riêng` (phụ, viền).
- **Dòng dưới:** *Chưa tìm thấy mẫu phù hợp? Hãy kể cho chúng tôi ý tưởng của bạn.*
- **Chuyển động:** khung nhả ghim và cuộn đi cùng trang; nút hiện nhẹ (24px, 200ms).
- **Đo lường:** `howitworks_cta_click{type}`.

---

## 5. Bảng chuyển động (tóm tắt)

| Yếu tố | Thời lượng | Easing | Ghi chú |
|---|---|---|---|
| Hiện thẻ/chữ | 200–260ms | ease-out | Chỉ chuyển vị 24px + độ mờ |
| So le (stagger) | 60–80ms mỗi phần tử | — | Tối đa 6 phần tử một nhóm |
| Con tem dập | 180ms | ease-out | scale 1.1 → 1 |
| Số lăn | 300ms | ease-out | Chỉ khi giá trị thay đổi |
| Thiết bị chuyển | 320ms | ease-in-out | Dùng chuyển cảnh chia sẻ |
| Đường mực vẽ | gắn với mức cuộn | tuyến tính | Dùng stroke-dash |
| Không dùng | — | — | Bật nảy, xoay liên tục, parallax mạnh, tự chạy lặp |

---

## 6. Phiên bản di động

- Khung ghim ở nửa trên (~50% chiều cao màn hình), chữ bên dưới.
- Mỗi chương rút gọn: một tiêu đề + một câu.
- Chương 2: tối đa 3 thẻ, trượt ngang.
- Chương 3: tối đa 4 tính năng; ô tick đủ lớn để chạm.
- Chương 4: **chỉ một thiết bị** (điện thoại); bỏ chuyển desktop/tablet.
- Chương 5: đường mực chuyển thành dọc, gọn.
- Không dùng hiệu ứng nặng; giảm số phần tử chuyển động đồng thời.

---

## 7. Giảm chuyển động, truy cập và dự phòng

- **Bật "giảm chuyển động" hoặc JS không chạy:** hiển thị **5 khối tĩnh xếp dọc**, mỗi khối có số, tiêu đề, mô tả, hình minh họa và nút. Không có ghim, không có chuyển cảnh.
- **Nội dung văn bản nằm sẵn trong trang** dưới dạng 5 đề mục (`h2`/`h3`), thân thiện với SEO và trình đọc màn hình.
- **Điều hướng bàn phím:** các nút số chương cuộn tới đúng chương; có thể đi hết 5 chương mà không cần chuột.
- **Chữ gõ tự động:** cung cấp văn bản tĩnh tương ứng cho trình đọc màn hình, không đọc từng ký tự.
- **Tương phản** đạt AA; trạng thái ("Đã xong", "Đang làm") có chữ, không chỉ dựa vào màu.
- Tôn trọng cài đặt hệ thống; không có chuyển động nhấp nháy quá 3 lần/giây.

---

## 8. Hiệu năng

- Section nằm **dưới** phần nhìn thấy đầu tiên; không làm chậm LCP.
- Chừa sẵn chiều cao cho khung để không giật bố cục (CLS ≈ 0).
- Ảnh/video tải lười, video là đoạn lặp ngắn đã nén; có ảnh poster.
- Chỉ dùng thuộc tính `transform` và `opacity` để hoạt ảnh.
- Đặt ngân sách kích thước mã riêng cho section này; tải theo yêu cầu khi gần vào khung nhìn.
- Kiểm tra trên thiết bị tầm trung và mạng chậm trước khi chốt.

---

## 9. Quyết định và việc cần chuẩn bị

**Cần quyết định:**
1. **"Đặt lịch demo 1-1"** dùng cách nào: form tư vấn hiện có, hay gắn công cụ hẹn lịch ngoài?
2. **Bước 3** chạy bằng dữ liệu thật (cần bảng tính năng tùy chọn có giá) hay chế độ minh họa tĩnh ở giai đoạn đầu?
3. **Thời gian dự kiến** lấy từ trường nào của offer, ai chịu trách nhiệm cập nhật?
4. Chọn hướng diện mạo (Xưởng thiết kế / Bản vẽ / Phố nghề).

**Cần chuẩn bị nội dung:**
- 4–5 listing nổi bật có ảnh chất lượng tốt, đủ mô tả demo.
- Bộ ảnh/video thiết bị theo từng ngành dùng trong chương 4.
- Danh sách 4 cụm từ tìm kiếm đã kiểm tra ra kết quả.
- Văn bản tĩnh cho phiên bản giảm chuyển động.

**Đo lường (phễu):** xem section → chương 1…5 → bấm nút → mở trang chi tiết → gửi yêu cầu. Theo dõi điểm rời bỏ để chỉnh độ dài từng chương.

---

## 9b. Checklist nghiệm thu

- [ ] Cuộn lùi, hiệu ứng chạy ngược đúng; không kẹt cuộn.
- [ ] Mỗi chương đọc hiểu được khi tắt hiệu ứng.
- [ ] Mọi số liệu/giá hiển thị là dữ liệu thật hoặc có nhãn "minh họa".
- [ ] Không hứa báo giá tự động hay thời hạn cố định ngoài dữ liệu offer.
- [ ] Hoạt động đúng ở di động, máy tính bảng, desktop; bàn phím đi hết 5 chương.
- [ ] Bật giảm chuyển động hoặc tắt JS vẫn thấy đủ nội dung.
- [ ] LCP và CLS không xấu đi so với trang không có section này.
- [ ] Sự kiện đo lường gửi đúng, không chứa dữ liệu cá nhân.
