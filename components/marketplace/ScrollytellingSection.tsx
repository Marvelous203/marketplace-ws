'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ScrollytellingSection() {
  const [activeStep, setActiveStep] = useState(1);

  // Hỗ trợ nhảy trực tiếp tới bước qua URL hash (#step-2, #step-3, #step-4, #step-5)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#step-2') setActiveStep(2);
      else if (hash === '#step-3') setActiveStep(3);
      else if (hash === '#step-4') setActiveStep(4);
      else if (hash === '#step-5') setActiveStep(5);

      if (hash.startsWith('#step-') || hash === '#how-it-works') {
        setTimeout(() => {
          document.getElementById('how-it-works')?.scrollIntoView();
        }, 150);
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // CHƯƠNG 1: HIỆU ỨNG MÔ PHỎNG CHỮ VIẾT (TYPEWRITER SIMULATION)
  // ─────────────────────────────────────────────────────────────
  const phrases = [
    'website nhà hàng, có đặt bàn',
    'trang giới thiệu spa & thẩm mỹ',
    'website bất động sản cao cấp',
    'trung tâm ngoại ngữ, nhận đăng ký học thử',
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Chỉ chạy hiệu ứng gõ chữ khi ở Bước 1
    if (activeStep !== 1 || isPaused) return;

    const fullText = phrases[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Đang gõ từng ký tự
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, 55 + Math.random() * 25); // jitter nhẹ tạo cảm giác gõ tay thật
      } else {
        // Gõ xong một cụm -> Dừng 1.4s để người dùng đọc
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1400);
      }
    } else {
      // Đang xóa lùi từng ký tự
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, 30);
      } else {
        // Đã xóa hết -> Chuyển sang cụm tiếp theo
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, activeStep, isPaused]);

  // Khi click chip gợi ý: điền thẳng chữ vào ô
  const handleChipClick = (text: string) => {
    setIsPaused(true);
    setIsDeleting(false);
    setCurrentText(text);
  };

  // ─────────────────────────────────────────────────────────────
  // CHƯƠNG 3: HIỆU ỨNG SỐ LĂN (ROLLING NUMBER COUNTER)
  // ─────────────────────────────────────────────────────────────
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'cms',
    'booking',
    'qr',
  ]);
  const [lastAddedFeature, setLastAddedFeature] = useState<string | null>(null);

  const featureList = [
    { id: 'cms', name: 'Quản trị nội dung & hình ảnh (CMS)', included: true, price: 0, days: 0 },
    { id: 'booking', name: 'Hệ thống đặt bàn / đặt hẹn trực tuyến', included: false, price: 1500000, days: 2 },
    { id: 'qr', name: 'Thực đơn điện tử mã QR tại bàn', included: false, price: 800000, days: 1 },
    { id: 'multilang', name: 'Đa ngôn ngữ (Việt - Anh)', included: false, price: 1200000, days: 2 },
    { id: 'crm', name: 'Kết nối quản lý khách hàng (CRM/Zalo ZNS)', included: false, price: 2000000, days: 3 },
  ];

  const basePrice = 3500000;
  const baseDays = 3;

  const targetEstimatedPrice =
    basePrice +
    featureList
      .filter((f) => selectedFeatures.includes(f.id) && !f.included)
      .reduce((acc, curr) => acc + curr.price, 0);

  const targetEstimatedDays =
    baseDays +
    featureList
      .filter((f) => selectedFeatures.includes(f.id) && !f.included)
      .reduce((acc, curr) => acc + curr.days, 0);

  // Animated rolling price display
  const [displayedPrice, setDisplayedPrice] = useState(targetEstimatedPrice);
  const [displayedDays, setDisplayedDays] = useState(targetEstimatedDays);

  useEffect(() => {
    let startPrice = displayedPrice;
    let endPrice = targetEstimatedPrice;
    if (startPrice === endPrice) return;

    const duration = 300;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startPrice + (endPrice - startPrice) * easeProgress);

      setDisplayedPrice(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayedPrice(endPrice);
      }
    };

    requestAnimationFrame(animateNumber);
    setDisplayedDays(targetEstimatedDays);
  }, [targetEstimatedPrice, targetEstimatedDays]);

  const toggleFeature = (id: string) => {
    if (id === 'cms') return; // Base included
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
      setLastAddedFeature(null);
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
      setLastAddedFeature(id);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // CHƯƠNG 4: THIẾT BỊ CHUYỂN ĐỔI (DESKTOP / TABLET / MOBILE)
  // ─────────────────────────────────────────────────────────────
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const steps = [
    { num: 1, title: 'Kể ngành nghề', desc: 'Mô phỏng chữ viết tìm kiếm' },
    { num: 2, title: 'Chọn mẫu hợp ý', desc: 'Con tem dập xuống thẻ' },
    { num: 3, title: 'Chọn tính năng', desc: 'Thấy chi phí & số lăn ngay' },
    { num: 4, title: 'Xem trước thiết bị', desc: 'Desktop, Tablet & Mobile' },
    { num: 5, title: 'Bắt đầu & theo dõi', desc: 'Nét mực nối 4 cột mốc' },
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
              onClick={() => {
                setActiveStep(s.num);
                if (s.num === 1) setIsPaused(false);
              }}
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

        {/* Khung "Tờ giấy thiết kế" biến hình theo từng bước */}
        <div className="mt-8 rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Đường chỉ đỏ viền giấy dó */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#A8412A]/80"></div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CHƯƠNG 1: KỂ CHO CHÚNG TÔI NGÀNH CỦA BẠN (GÕ CHỮ MÔ PHỎNG) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#A8412A]">
                    CHƯƠNG 01
                  </span>
                  <span className="chop-seal text-[9px]">GÕ CHỮ TỰ ĐỘNG</span>
                </div>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                  Bạn kinh doanh gì?
                </h3>
                <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
                  Xem mô phỏng cách hệ thống tự động tìm kiếm và phân loại website theo đúng ngành nghề bạn gõ, không cần hiểu về thuật ngữ kỹ thuật.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href="/marketplace"
                    className="text-xs font-bold text-[#A8412A] hover:underline"
                  >
                    Xem tất cả các phố ngành nghề →
                  </Link>
                  {isPaused && (
                    <button
                      type="button"
                      onClick={() => setIsPaused(false)}
                      className="text-xs text-[#2F6F73] underline cursor-pointer"
                    >
                      Bật lại gõ chữ tự động
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#6E5A4D] uppercase tracking-wide flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#A8412A] animate-ping"></span>
                    <span>Thanh tìm kiếm mô phỏng chữ viết:</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#6E5A4D]">
                    {isPaused ? 'Đang dừng gõ' : 'Đang gõ mẫu...'}
                  </span>
                </div>

                {/* Ô TÌM KIẾM MÔ PHỎNG GÕ CHỮ THẬT CÓ CON TRỎ NHẤP NHÁY */}
                <div className="flex items-center gap-2 rounded-md border border-[#D4C3AC] bg-[#FFFDF9] px-4 py-3 shadow-sm transition-all focus-within:border-[#A8412A]">
                  <span className="text-[#A8412A] text-sm">🔍</span>
                  <div className="flex-1 flex items-center overflow-hidden">
                    <span className="font-sans text-sm sm:text-base font-semibold text-[#3A2418] whitespace-nowrap">
                      {currentText}
                    </span>
                    <span className="typewriter-cursor text-base">|</span>
                  </div>
                </div>

                {/* Các chip gợi ý có thể bấm để điền ngay lập tức */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#6E5A4D] py-1 font-medium">Bấm thử mẫu khác:</span>
                  {phrases.map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => handleChipClick(phrase)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                        currentText === phrase
                          ? 'border-[#A8412A] bg-[#A8412A]/10 text-[#A8412A] font-bold'
                          : 'border-[#D4C3AC] bg-[#FFFDF9] text-[#3A2418] hover:border-[#3A2418]'
                      }`}
                    >
                      {phrase.split(',')[0]}
                    </button>
                  ))}
                </div>

                {/* Kết quả tìm kiếm trực quan xuất hiện theo chữ gõ */}
                <div className="mt-5 pt-4 border-t border-[#D4C3AC]">
                  <div className="flex items-center justify-between text-xs text-[#6E5A4D] mb-2">
                    <span className="font-bold text-[#3A2418]">Kết quả tương ứng trong gian phố:</span>
                    <span className="chop-seal-green text-[9px]">SẴN SÀNG TRIỂN KHAI</span>
                  </div>

                  <div className="rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-3 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏮</span>
                      <div>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-[#3A2418]">
                          {currentText.includes('nhà hàng')
                            ? 'Restaurant Pro — Mẫu Website Nhà hàng & Đặt bàn Cao cấp'
                            : currentText.includes('spa')
                            ? 'ClinicCare — Phòng khám & Spa Thẩm mỹ Cao cấp'
                            : currentText.includes('sản')
                            ? 'RealEstate EstatePro — Sàn Giao dịch Bất động sản'
                            : 'EduMaster — Học viện & Đăng ký Khóa học Trực tuyến'}
                        </h4>
                        <p className="text-[11px] text-[#6E5A4D] mt-0.5">
                          {currentText.includes('nhà hàng')
                            ? 'Bao gồm: Thực đơn điện tử QR · Đặt bàn trực tuyến · Tốc độ tải 0.8s'
                            : 'Giao diện tiêu chuẩn tối ưu chuyển đổi, bóc tách phạm vi minh bạch'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/solutions/restaurant-pro"
                      className="btn-ink-primary text-xs py-1.5 px-3 shrink-0"
                    >
                      Xem mẫu →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CHƯƠNG 2: CHỌN MỘT MẪU HỢP Ý (CON TEM DẬP XUỐNG) */}
          {/* ═══════════════════════════════════════════════════════ */}
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
                    Mẫu tiêu biểu đã kiểm định
                  </span>
                  {/* Con tem dập xuống với animation */}
                  <span className="chop-seal stamp-drop-anim">
                    DEMO ĐÃ KIỂM
                  </span>
                </div>

                <div className="device-frame p-5 bg-[#FFFDF9]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DECE]">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#A8412A]"></span>
                      <span className="font-serif text-sm font-bold text-[#3A2418]">
                        Restaurant Pro — Nhà hàng & Đặt bàn
                      </span>
                    </div>
                    <span className="stamp-tag text-[#A8412A] border-[#A8412A] stamp-drop-anim">
                      ĐÃ DẬP TEM BẢN QUYỀN
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#6E5A4D] leading-relaxed">
                    Đầy đủ giỏ gọi món, đặt bàn giữ chỗ ngày giờ, tạo mã QR cho từng bàn ăn và trang quản trị trực quan.
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E8DECE] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6E5A4D] block uppercase font-bold">Giá khởi điểm</span>
                      <span className="font-serif text-base font-bold text-[#A8412A]">Từ 3.500.000 ₫</span>
                    </div>
                    <div className="flex gap-2">
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

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CHƯƠNG 3: CHỌN TÍNH NĂNG, THẤY CHI PHÍ (SỐ LĂN TƯƠNG TÁC) */}
          {/* ═══════════════════════════════════════════════════════ */}
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
                  Bật hoặc tắt từng tính năng bên phải. Số tiền và thời gian sẽ <strong>tự động lăn số</strong> thay đổi ngay trước mắt bạn.
                </p>
                <div className="mt-5 rounded-md border border-[#E8DECE] bg-[#FAF5EB] p-4">
                  <p className="text-[11px] text-[#6E5A4D] italic leading-normal">
                    * Bảng tính tương tác minh họa theo chuẩn Money Module của DEV_RULES.md (không làm tròn float). Chi phí chính thức sẽ đóng băng trong hợp đồng báo giá.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
                <div className="space-y-2.5">
                  {featureList.map((f) => {
                    const isChecked = selectedFeatures.includes(f.id);
                    const isJustAdded = lastAddedFeature === f.id;

                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleFeature(f.id)}
                        className={`flex items-center justify-between p-3 rounded-md border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-[#A8412A] bg-[#FFFDF9] shadow-xs'
                            : 'border-[#E8DECE] bg-[#FAF5EB]/50 hover:bg-[#FFFDF9]'
                        } ${isJustAdded ? 'ink-highlight-wave' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            disabled={f.included}
                            className="h-4 w-4 accent-[#A8412A] cursor-pointer"
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

                {/* TỔNG ƯỚC TÍNH CHI PHÍ VỚI HIỆU ỨNG SỐ LĂN (ROLLING NUMBER) */}
                <div className="mt-6 pt-4 border-t border-[#D4C3AC] flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF9] p-4 rounded-md border shadow-2xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6E5A4D] block">
                      Ước tính chi phí (Lăn số tự động)
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#A8412A] tabular-nums transition-all">
                      {displayedPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6E5A4D] block">
                      Thời gian dự kiến
                    </span>
                    <span className="font-serif text-lg font-bold text-[#2F6F73] tabular-nums">
                      ~ {displayedDays} ngày làm việc
                    </span>
                  </div>
                  <Link
                    href={`/request-project?features=${selectedFeatures.join(',')}`}
                    className="btn-ink-primary text-xs py-2 px-3.5"
                  >
                    Gửi cấu hình này →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CHƯƠNG 4: XEM TRƯỚC TRÊN MỌI THIẾT BỊ (DESKTOP/TABLET/MOBILE) */}
          {/* ═══════════════════════════════════════════════════════ */}
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
                  Chuyển đổi giữa 3 thiết bị để xem bố cục tự co giãn và trải nghiệm vuốt chạm trực quan trên từng kích thước màn hình.
                </p>

                {/* Nút chuyển đổi thiết bị */}
                <div className="mt-5 flex gap-2">
                  {[
                    { id: 'desktop', label: '🖥️ Máy tính' },
                    { id: 'tablet', label: '📱 Tablet' },
                    { id: 'mobile', label: '📲 Điện thoại' },
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => setActiveDevice(dev.id as any)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                        activeDevice === dev.id
                          ? 'border-[#A8412A] bg-[#A8412A] text-white shadow-xs'
                          : 'border-[#E8DECE] bg-[#FFFDF9] text-[#3A2418] hover:border-[#3A2418]'
                      }`}
                    >
                      {dev.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-2 text-xs text-[#3A2418]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] text-[10px] font-bold text-white">
                      1
                    </span>
                    <span>Menu món ăn & thanh giỏ gọi món</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] text-[10px] font-bold text-white">
                      2
                    </span>
                    <span>Biểu mẫu đặt bàn giữ chỗ tức thì</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] text-[10px] font-bold text-white">
                      3
                    </span>
                    <span>Mã QR thanh toán & hotline gọi nhanh</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6 flex justify-center">
                <div
                  className={`device-frame transition-all duration-300 ${
                    activeDevice === 'desktop'
                      ? 'w-full max-w-lg'
                      : activeDevice === 'tablet'
                      ? 'w-72 sm:w-80'
                      : 'w-48 sm:w-56'
                  }`}
                >
                  <div className="device-bar flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="device-dot"></span>
                      <span className="device-dot"></span>
                      <span className="device-dot"></span>
                    </div>
                    <span className="font-mono text-[9px] text-[#6E5A4D] truncate max-w-[120px]">
                      preview.webmarket.vn/{activeDevice}
                    </span>
                    <div className="w-4"></div>
                  </div>

                  <div className="p-5 bg-[#FFFDF9] min-h-[220px] flex flex-col justify-center items-center text-center">
                    <span className="chop-seal mb-2">
                      {activeDevice.toUpperCase()} VIEWPORT
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                      Nhà Hàng Cơm Quê & Đặt Bàn
                    </h4>
                    <p className="text-[11px] text-[#6E5A4D] mt-1 max-w-xs leading-relaxed">
                      Tự động thích ứng giao diện 100%, không bị tràn lề hay vỡ font chữ trên bất kỳ máy nào.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="stamp-tag text-[9px] text-[#2F6F73] border-[#2F6F73]">
                        LIGHTHOUSE 98/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CHƯƠNG 5: BẮT ĐẦU VÀ THEO DÕI TIẾN ĐỘ (ĐƯỜNG MỰC VẼ DẦN) */}
          {/* ═══════════════════════════════════════════════════════ */}
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
                  Đường mực minh chứng tiến độ: Bạn có thể kiểm tra từng bước bàn giao ngay trong tài khoản, cam kết đúng thời hạn báo giá.
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

              <div className="lg:col-span-7 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6 relative">
                {/* SVG ĐƯỜNG MỰC VẼ NỐI CÁC CỘT MỐC */}
                <svg
                  className="absolute left-[31px] top-[40px] bottom-[40px] w-2 h-[calc(100%-80px)] pointer-events-none z-0"
                  viewBox="0 0 4 200"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="2"
                    y1="0"
                    x2="2"
                    y2="200"
                    stroke="#A8412A"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    className="ink-draw-line"
                  />
                </svg>

                <div className="space-y-4 relative z-10">
                  {[
                    { step: '01', title: 'Khởi tạo dự án', desc: 'Thiết lập phạm vi & đóng băng hợp đồng', status: 'HOÀN THÀNH', color: 'text-[#2F6F73]', seal: '✓ ĐÃ XONG' },
                    { step: '02', title: 'Nhập nội dung & thương hiệu', desc: 'Logo, màu sắc, menu món & ảnh của bạn', status: 'ĐANG LÀM', color: 'text-[#A8412A]', seal: 'ĐANG CHẠY' },
                    { step: '03', title: 'Kiểm thử & Tối ưu Google', desc: 'Kiểm tra tốc độ trên mọi dòng điện thoại', status: 'CHỜ', color: 'text-[#6E5A4D]', seal: 'KẾ TIẾP' },
                    { step: '04', title: 'Gắn tên miền & Bàn giao', desc: 'Website chính thức hoạt động công khai', status: 'CHỜ', color: 'text-[#6E5A4D]', seal: 'HOÀN TẤT' },
                  ].map((m) => (
                    <div key={m.step} className="flex items-start gap-3.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4C3AC] bg-[#FFFDF9] font-mono text-xs font-bold text-[#3A2418] shrink-0 shadow-xs">
                        {m.step}
                      </div>
                      <div className="flex-1 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                            {m.title}
                          </h4>
                          <span className={`text-[10px] font-bold ${m.color}`}>
                            {m.seal}
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
