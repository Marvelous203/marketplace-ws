'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ScrollytellingSection() {
  const [activeStep, setActiveStep] = useState(1);

  // Dữ liệu Chương 3: Tính năng tương tác & ước tính chi phí
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'cms',
    'booking',
    'qr',
  ]);

  const featureList = [
    { id: 'cms', name: 'Quản trị nội dung & hình ảnh (CMS)', included: true, price: 0, days: 0 },
    { id: 'booking', name: 'Hệ thống đặt bàn / đặt hẹn trực tuyến', included: false, price: 1500000, days: 2 },
    { id: 'qr', name: 'Thực đơn điện tử mã QR tại bàn', included: false, price: 800000, days: 1 },
    { id: 'multilang', name: 'Đa ngôn ngữ (Việt - Anh)', included: false, price: 1200000, days: 2 },
    { id: 'crm', name: 'Kết nối quản lý khách hàng (CRM/Zalo ZNS)', included: false, price: 2000000, days: 3 },
  ];

  const basePrice = 3500000;
  const baseDays = 3;

  const currentEstimatedPrice =
    basePrice +
    featureList
      .filter((f) => selectedFeatures.includes(f.id) && !f.included)
      .reduce((acc, curr) => acc + curr.price, 0);

  const currentEstimatedDays =
    baseDays +
    featureList
      .filter((f) => selectedFeatures.includes(f.id) && !f.included)
      .reduce((acc, curr) => acc + curr.days, 0);

  const toggleFeature = (id: string) => {
    if (id === 'cms') return; // Base included
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const steps = [
    { num: 1, title: 'Kể ngành nghề', desc: 'Chọn lĩnh vực kinh doanh' },
    { num: 2, title: 'Chọn mẫu hợp ý', desc: 'Xem giải pháp minh bạch' },
    { num: 3, title: 'Chọn tính năng', desc: 'Thấy chi phí & thời gian ngay' },
    { num: 4, title: 'Xem trước thiết bị', desc: 'Trực quan trên mọi màn hình' },
    { num: 5, title: 'Bắt đầu & theo dõi', desc: 'Rõ ràng từng cột mốc' },
  ];

  return (
    <section
      id="how-it-works"
      className="relative border-b border-[#E8DECE] bg-[#FAF5EB] py-16 lg:py-24"
      aria-label="Cách hoạt động 5 bước"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề mục */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-xs border border-[#D4C3AC] bg-[#FFFDF9] px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase text-[#6E5A4D]">
            <span>CÁCH HOẠT ĐỘNG · 5 BƯỚC</span>
          </div>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-[#3A2418]">
            Từ ý tưởng đến website vận hành, không cần rành kỹ thuật.
          </h2>
          <p className="mt-3 text-base text-[#6E5A4D] leading-relaxed">
            Bạn kể về việc kinh doanh của mình. Phần còn lại, chúng tôi sắp xếp rõ ràng, có bảo chứng và cam kết không phát sinh.
          </p>
        </div>

        {/* Thanh chuyển bước kiểu Thước đo Phố nghề (Stepper tabs) */}
        <div className="mt-10 flex border-b border-[#E8DECE] overflow-x-auto pb-px">
          {steps.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveStep(s.num)}
              className={`flex-1 min-w-[150px] py-3 px-3 text-left border-b-2 transition-all cursor-pointer ${
                activeStep === s.num
                  ? 'border-[#A8412A] bg-[#FFFDF9]/60'
                  : 'border-transparent hover:border-[#D4C3AC]'
              }`}
            >
              <span
                className={`font-mono text-xs font-bold block ${
                  activeStep === s.num ? 'text-[#A8412A]' : 'text-[#6E5A4D]'
                }`}
              >
                0{s.num}
              </span>
              <span
                className={`font-serif text-sm font-bold block mt-0.5 ${
                  activeStep === s.num ? 'text-[#3A2418]' : 'text-[#6E5A4D]'
                }`}
              >
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Nội dung "Tờ giấy thiết kế" biến hình theo từng bước */}
        <div className="mt-8 rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Đường chỉ đỏ viền giấy dó */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#A8412A]/80"></div>

          {/* BƯỚC 1: Kể ngành nghề */}
          {activeStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="font-mono text-xs font-bold text-[#A8412A]">
                  CHƯƠNG 01
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                  Bạn kinh doanh gì?
                </h3>
                <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
                  Gõ vài chữ về lĩnh vực của bạn hoặc bấm chọn các gợi ý bên dưới. Không cần biết các thuật ngữ kỹ thuật hay hosting phức tạp.
                </p>
                <div className="mt-6">
                  <Link
                    href="/marketplace"
                    className="text-xs font-bold text-[#A8412A] hover:underline"
                  >
                    Xem tất cả các phố ngành nghề →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
                <label className="block text-xs font-semibold text-[#6E5A4D] mb-2 uppercase tracking-wide">
                  Thanh tìm kiếm thông minh:
                </label>
                <div className="flex items-center gap-2 rounded-md border border-[#D4C3AC] bg-[#FFFDF9] px-3.5 py-2.5 shadow-xs">
                  <span className="text-[#6E5A4D]">🔍</span>
                  <input
                    type="text"
                    readOnly
                    value="website nhà hàng ẩm thực, có đặt bàn & thực đơn QR"
                    className="w-full bg-transparent text-sm text-[#3A2418] font-medium outline-none cursor-default"
                  />
                  <span className="animate-pulse text-[#A8412A] font-bold">|</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-[#6E5A4D] py-1 font-medium">Gợi ý:</span>
                  {['Nhà hàng & Cafe', 'Thời trang Lookbook', 'Phòng khám & Y tế', 'Doanh nghiệp Xây dựng'].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#D4C3AC] bg-[#FFFDF9] px-3 py-1 text-xs text-[#3A2418] font-medium shadow-2xs"
                      >
                        {chip}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 2: Chọn mẫu hợp ý */}
          {activeStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="font-mono text-xs font-bold text-[#A8412A]">
                  CHƯƠNG 02
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                  Xem những gì hợp với bạn.
                </h3>
                <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
                  Mỗi mẫu giải pháp cho biết rõ bao gồm những gì, bàn giao theo hình thức nào (mã nguồn, trọn gói, SaaS) và giá khởi điểm không phát sinh.
                </p>
                <div className="mt-5 flex gap-2">
                  <span className="stamp-tag text-[#2F6F73] border-[#2F6F73]">
                    BẢN QUYỀN MÃ NGUỒN
                  </span>
                  <span className="stamp-tag text-[#3A2418] border-[#3A2418]">
                    TRỌN GÓI
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#3A2418]">
                    Mẫu tiêu biểu: Restaurant Pro
                  </span>
                  <span className="chop-seal">DEMO ĐÃ KIỂM</span>
                </div>
                <div className="relative h-44 rounded-md border border-[#D4C3AC] bg-[#FFFDF9] flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <p className="font-serif text-base font-bold text-[#3A2418]">
                      Giao diện Nhà hàng & Đặt bàn Cao cấp
                    </p>
                    <p className="text-xs text-[#6E5A4D] mt-1">
                      Next.js 16 · Tốc độ tải 0.8s · Tối ưu SEO Google · Thực đơn QR
                    </p>
                    <div className="mt-4 flex justify-center gap-3">
                      <Link
                        href="/solutions/restaurant-pro"
                        className="btn-ink-primary text-xs py-1.5 px-3"
                      >
                        Xem demo thực tế →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Chọn tính năng thấy chi phí */}
          {activeStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <span className="font-mono text-xs font-bold text-[#A8412A]">
                  CHƯƠNG 03
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                  Thêm những gì bạn cần. Chi phí hiện ngay.
                </h3>
                <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
                  Bật hoặc tắt từng tính năng để thấy ngay ước tính chi phí và thời gian dự kiến. Báo giá chính thức được chúng tôi xác nhận bất biến sau khi trao đổi.
                </p>
                <div className="mt-6 rounded-md border border-[#E8DECE] bg-[#FAF5EB] p-4">
                  <p className="text-[11px] text-[#6E5A4D] italic leading-normal">
                    * Bảng tính tương tác tham khảo minh bạch theo đặc tả PRD v1.1. Chi phí chính thức sẽ được đóng băng trong hợp đồng báo giá.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
                <div className="space-y-2.5">
                  {featureList.map((f) => {
                    const isChecked = selectedFeatures.includes(f.id);
                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleFeature(f.id)}
                        className={`flex items-center justify-between p-3 rounded-md border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-[#A8412A] bg-[#FFFDF9] shadow-2xs'
                            : 'border-[#E8DECE] bg-[#FAF5EB]/50 hover:bg-[#FFFDF9]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            disabled={f.included}
                            className="h-4 w-4 accent-[#A8412A]"
                          />
                          <span className="text-xs font-medium text-[#3A2418]">
                            {f.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#6E5A4D]">
                          {f.included
                            ? 'Đã gồm trong gói'
                            : `+ ${f.price.toLocaleString('vi-VN')} ₫`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tổng ước tính chi phí & thời gian */}
                <div className="mt-6 pt-4 border-t border-[#D4C3AC] flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF9] p-4 rounded-md border">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6E5A4D] block">
                      Ước tính chi phí
                    </span>
                    <span className="font-serif text-xl font-bold text-[#A8412A]">
                      {currentEstimatedPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6E5A4D] block">
                      Thời gian dự kiến
                    </span>
                    <span className="font-serif text-lg font-bold text-[#2F6F73]">
                      ~ {currentEstimatedDays} ngày làm việc
                    </span>
                  </div>
                  <Link
                    href={`/request-project?features=${selectedFeatures.join(',')}`}
                    className="btn-ink-primary text-xs py-2 px-3.5"
                  >
                    Gửi yêu cầu với cấu hình này →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 4: Xem trước trên mọi thiết bị */}
          {activeStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="font-mono text-xs font-bold text-[#A8412A]">
                  CHƯƠNG 04
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                  Thấy trước website của bạn.
                </h3>
                <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
                  Trải nghiệm trực quan trên máy tính, máy tính bảng và điện thoại với các điểm chú thích đánh số rõ ràng, khớp từng tính năng đã chọn.
                </p>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#3A2418]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] text-[10px] font-bold text-[#FAF5EB]">
                      1
                    </span>
                    <span>Thực đơn & giỏ đặt món thông minh</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3A2418]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] text-[10px] font-bold text-[#FAF5EB]">
                      2
                    </span>
                    <span>Form đặt bàn trực tuyến giữ chỗ</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3A2418]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] text-[10px] font-bold text-[#FAF5EB]">
                      3
                    </span>
                    <span>Nút gọi nhanh & chỉ đường bản đồ</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6 text-center">
                <div className="device-frame mx-auto max-w-md">
                  <div className="device-bar flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="device-dot"></span>
                      <span className="device-dot"></span>
                      <span className="device-dot"></span>
                    </div>
                    <span className="font-mono text-[10px] text-[#6E5A4D]">
                      preview.webmarket.vn/demo
                    </span>
                    <div className="w-8"></div>
                  </div>
                  <div className="p-6 bg-[#FFFDF9] min-h-[220px] flex flex-col justify-center items-center">
                    <span className="chop-seal mb-3">TƯƠNG THÍCH ĐA THIẾT BỊ</span>
                    <p className="font-serif text-lg font-bold text-[#3A2418]">
                      Hiển thị chuẩn xác trên Mobile, Tablet & Desktop
                    </p>
                    <p className="text-xs text-[#6E5A4D] mt-2 max-w-xs">
                      Tối ưu tốc độ tải và trải nghiệm vuốt chạm cho khách hàng trên điện thoại thông minh.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 5: Bắt đầu & Theo dõi tiến độ */}
          {activeStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="font-mono text-xs font-bold text-[#A8412A]">
                  CHƯƠNG 05
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                  Rõ ràng từng mốc, từ lúc bắt đầu đến khi chạy.
                </h3>
                <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
                  Sau khi hai bên thống nhất phạm vi và ký kết báo giá, bạn có thể theo dõi tiến độ từng mốc trực tiếp ngay trong tài khoản.
                </p>
                <div className="mt-6">
                  <Link
                    href="/request-project"
                    className="btn-ink-primary text-xs py-2.5 px-4"
                  >
                    Bắt đầu dự án của bạn ngay →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
                {/* Đường mực 4 cột mốc */}
                <div className="space-y-4">
                  {[
                    { step: '01', title: 'Khởi tạo', desc: 'Thiết lập dự án & phạm vi đã thống nhất', status: 'HOÀN THÀNH', color: 'text-[#2F6F73]' },
                    { step: '02', title: 'Nhập nội dung & thương hiệu', desc: 'Logo, màu sắc, hình ảnh & menu của bạn', status: 'ĐANG LÀM', color: 'text-[#A8412A]' },
                    { step: '03', title: 'Kiểm thử & Tối ưu', desc: 'Kiểm tra trên các thiết bị & tối ưu tốc độ', status: 'CHỜ', color: 'text-[#6E5A4D]' },
                    { step: '04', title: 'Bàn giao & Vận hành', desc: 'Gắn tên miền và website sẵn sàng hoạt động', status: 'CHỜ', color: 'text-[#6E5A4D]' },
                  ].map((m, idx) => (
                    <div key={m.step} className="flex items-start gap-3.5 relative">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4C3AC] bg-[#FFFDF9] font-mono text-xs font-bold text-[#3A2418] shrink-0">
                        {m.step}
                      </div>
                      <div className="flex-1 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                            {m.title}
                          </h4>
                          <span className={`text-[10px] font-bold ${m.color}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#6E5A4D] mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
