'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface IndustryTheme {
  id: string;
  name: string;
  icon: string;
  slug: string;
  defaultStoreName: string;
  tagline: string;
  accentColor: string;
  accentBg: string;
  demoImage: string;
  features: string[];
  startingPrice: string;
  slugTarget: string;
  navItems: string[];
  ctaButton: string;
  heroHeadline: string;
  licenseType: string;
}

const INDUSTRIES: IndustryTheme[] = [
  {
    id: 'food',
    name: 'Nhà hàng & Cafe',
    icon: '🏮',
    slug: 'food-beverage',
    defaultStoreName: 'Tiệm Cà Phê Mộc',
    tagline: 'Cà phê rang mộc & Thực đơn món ăn gia truyền',
    accentColor: '#A8412A',
    accentBg: 'rgba(168, 65, 42, 0.08)',
    demoImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    features: ['Thực đơn QR tại bàn', 'Đặt bàn giữ chỗ ngày giờ', 'Tốc độ 0.8s'],
    startingPrice: '3.500.000 ₫',
    slugTarget: 'restaurant-pro',
    navItems: ['Trang chủ', 'Thực đơn', 'Đặt bàn'],
    ctaButton: 'Đặt bàn ngay',
    heroHeadline: 'Hương Vị Mộc Mạc · Không Gian Ấm Cúng',
    licenseType: 'TRỌN GÓI',
  },
  {
    id: 'fashion',
    name: 'Thời trang & May mặc',
    icon: '🧵',
    slug: 'fashion-apparel',
    defaultStoreName: 'Boutique May Đo An Nhiên',
    tagline: 'Thời trang linen thủ công & Bộ sưu tập tối giản',
    accentColor: '#3A2418',
    accentBg: 'rgba(58, 36, 24, 0.08)',
    demoImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    features: ['Lookbook bộ sưu tập', 'Chọn size/màu mượt', 'Giỏ hàng tức thì'],
    startingPrice: '450.000 ₫ / th',
    slugTarget: 'fashion-boutique',
    navItems: ['Bộ sưu tập', 'Lookbook', 'Giỏ hàng (2)'],
    ctaButton: 'Khám phá BST',
    heroHeadline: 'Chất Liệu Tự Nhiên · Tôn Vinh Vóc Dáng',
    licenseType: 'THUÊ BAO CLOUD',
  },
  {
    id: 'health',
    name: 'Spa & Phòng khám',
    icon: '🌿',
    slug: 'healthcare',
    defaultStoreName: 'Phòng Khám Nha Khoa Tâm Đức',
    tagline: 'Chăm sóc nụ cười & Đặt lịch hẹn chuyên gia',
    accentColor: '#2F6F73',
    accentBg: 'rgba(47, 111, 115, 0.08)',
    demoImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    features: ['Lịch khám bác sĩ', 'Bảng giá dịch vụ rõ ràng', 'Tư vấn Zalo'],
    startingPrice: '12.000.000 ₫',
    slugTarget: 'clinic-care',
    navItems: ['Dịch vụ', 'Bác sĩ', 'Đặt lịch hẹn'],
    ctaButton: 'Đặt lịch tư vấn',
    heroHeadline: 'Chăm Sóc Tận Tâm · Nụ Cười Khỏe Đẹp',
    licenseType: 'TRỌN GÓI',
  },
  {
    id: 'estate',
    name: 'Kiến trúc & Bất động sản',
    icon: '📐',
    slug: 'corporate',
    defaultStoreName: 'Công Ty Thiết Kế An Gia',
    tagline: 'Kiến tạo không gian sống & Hồ sơ năng lực',
    accentColor: '#E0A526',
    accentBg: 'rgba(224, 165, 38, 0.08)',
    demoImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: ['Trưng bày dự án 360', 'Thu thập khách VIP', 'Hồ sơ năng lực'],
    startingPrice: '15.000.000 ₫',
    slugTarget: 'restaurant-pro',
    navItems: ['Dự án tiêu biểu', 'Hồ sơ năng lực', 'Báo giá'],
    ctaButton: 'Nhận tư vấn VIP',
    heroHeadline: 'Kiến Trúc Đương Đại · Nâng Tầm Không Gian',
    licenseType: 'MÃ NGUỒN GỐC',
  },
];

export default function StorefrontHero() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryTheme>(INDUSTRIES[0]);
  const [storeNameInput, setStoreNameInput] = useState('Tiệm Cà Phê Mộc');
  const [shutterOpened, setShutterOpened] = useState(false);
  const [popKey, setPopKey] = useState(0);

  // Trigger mở cửa cuốn sau khi component mount & đọc query param nếu có
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const indParam = params.get('industry');
      if (indParam) {
        const found = INDUSTRIES.find((i) => i.id === indParam || i.slug === indParam);
        if (found) {
          setSelectedIndustry(found);
          setStoreNameInput(found.defaultStoreName);
        }
      }
    }
    const timer = setTimeout(() => {
      setShutterOpened(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter input chống spam / xss / từ ngữ không hợp lệ
  const sanitizeInput = (text: string) => {
    return text.replace(/[<>"{}[\]]/g, '').slice(0, 36);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreNameInput(sanitizeInput(e.target.value));
  };

  // Chọn ngành kinh doanh: Cập nhật ngành, tự động đổi tên tiệm sang ngành đó và kích hoạt hiệu ứng pop
  const handleSelectIndustry = (ind: IndustryTheme) => {
    setSelectedIndustry(ind);
    setStoreNameInput(ind.defaultStoreName);
    setPopKey((prev) => prev + 1);
  };

  // Tên cửa hàng hiển thị trực tiếp lên biển hiệu & mockup
  const displayedStoreName = storeNameInput.trim() || selectedIndustry.defaultStoreName;

  return (
    <section className="relative overflow-hidden border-b border-[#E8DECE] bg-[#FAF5EB] py-12 lg:py-18">
      {/* Texture hạt gạo mộc mạc */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3A2418_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ═══════════════════════════════════════════════════════ */}
          {/* CỘT TRÁI (6 COLS): GÕ TÊN CỬA HÀNG & CHỌN NGÀNH */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-6">
            {/* Nhãn giới thiệu phong cách mộc */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4C3AC] bg-[#FFFDF9] px-3.5 py-1 text-xs font-semibold text-[#6E5A4D] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#A8412A]"></span>
              <span>Ý tưởng A: Trực quan hóa Website Doanh Nghiệp</span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3A2418] leading-[1.25] tracking-tight">
              Gõ tên cửa hàng,{' '}
              <span className="text-[#A8412A] underline decoration-wavy decoration-[#A8412A]/40 underline-offset-4">
                thấy ngay website
              </span>{' '}
              của bạn trong 3 giây.
            </h1>

            {/* Lời dẫn thân mật */}
            <p className="text-sm sm:text-base text-[#6E5A4D] leading-relaxed">
              Không cần tưởng tượng mơ hồ. Hãy chọn ngành và nhập tên tiệm, biển hiệu gỗ treo sẽ lập tức đổi tên và khung giao diện website mẫu bên cạnh phản ánh chuẩn xác màu sắc, tính năng thực tế.
            </p>

            {/* Khung nhập tên cửa hàng tương tác */}
            <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-4 sm:p-5 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A2418] mb-1.5 flex items-center justify-between">
                  <span>Tên cửa hàng / Thương hiệu của bạn:</span>
                  <span className="font-mono text-[11px] text-[#6E5A4D] font-normal">
                    {storeNameInput.length}/36 ký tự
                  </span>
                </label>
                <div className="relative flex items-center rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] px-3.5 py-2.5 focus-within:border-[#A8412A] focus-within:ring-1 focus-within:ring-[#A8412A] transition-all">
                  <span className="text-base mr-2 text-[#A8412A]">✍️</span>
                  <input
                    type="text"
                    value={storeNameInput}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Tiệm Cà Phê Mộc, May Đo An Nhiên, Nha Khoa Tâm Đức..."
                    className="w-full bg-transparent text-sm font-serif font-bold text-[#3A2418] outline-none placeholder:font-sans placeholder:text-xs placeholder:font-normal placeholder:text-[#6E5A4D]"
                  />
                  {storeNameInput && (
                    <button
                      type="button"
                      onClick={() => setStoreNameInput('')}
                      className="text-xs text-[#6E5A4D] hover:text-[#A8412A] px-1.5 cursor-pointer"
                      title="Xóa tên"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Dải chip chọn ngành (Phố nghề) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E5A4D] mb-2">
                  Chọn ngành kinh doanh để xem website tương ứng:
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => {
                    const isSelected = selectedIndustry.id === ind.id;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => handleSelectIndustry(ind)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#3A2418] bg-[#3A2418] text-[#FAF5EB] shadow-xs scale-102 ring-2 ring-[#3A2418]/20'
                            : 'border-[#E8DECE] bg-[#FFFDF9] text-[#6E5A4D] hover:border-[#D4C3AC] hover:text-[#3A2418]'
                        }`}
                      >
                        <span>{ind.icon}</span>
                        <span>{ind.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Các nút hành động chính */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href={`/solutions/${selectedIndustry.slugTarget}?brand=${encodeURIComponent(displayedStoreName)}`}
                className="btn-ink-primary text-xs py-3 px-5"
              >
                <span>Khám phá trọn gói cho &quot;{displayedStoreName}&quot;</span>
                <span>→</span>
              </Link>
              <Link
                href={`/request-project?brand=${encodeURIComponent(displayedStoreName)}&industry=${selectedIndustry.slug}`}
                className="btn-ink-secondary text-xs py-3 px-4"
              >
                <span>+ Báo giá may đo theo ý</span>
              </Link>
            </div>

            {/* Bộ tem cam kết minh bạch */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6E5A4D] pt-2">
              <div className="flex items-center gap-1.5">
                <span className="chop-seal text-[10px]">DEMO ĐÃ KIỂM</span>
                <span>Thấy trước website thật</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="chop-seal-green text-[10px]">SELLER XÁC MINH</span>
                <span>Bàn giao & bảo hành 12 tháng</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CỘT PHẢI (6 COLS): MẶT TIỀN CỬA HIỆU & MOCKUP CÁ NHÂN HÓA */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 relative">
            {/* 1. MÁI HIÊN PHỐ NGHỀ (MƯỢN TỪ HƯỚNG C) */}
            <div className="relative mx-auto max-w-xl z-20">
              <div className="awning-roof h-8 sm:h-10 rounded-t-lg relative flex items-center justify-between px-6">
                {/* Đèn lồng treo hai góc mái hiên */}
                <div className="absolute -bottom-3 left-4 flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-[#3A2418]"></div>
                  <div
                    className="w-4 h-5 rounded-full border border-[#3A2418] shadow-xs flex items-center justify-center text-[8px] text-white transition-colors duration-300"
                    style={{ backgroundColor: selectedIndustry.accentColor }}
                  >
                    🏮
                  </div>
                </div>
                <div className="absolute -bottom-3 right-4 flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-[#3A2418]"></div>
                  <div
                    className="w-4 h-5 rounded-full border border-[#3A2418] shadow-xs flex items-center justify-center text-[8px] text-white transition-colors duration-300"
                    style={{ backgroundColor: selectedIndustry.accentColor }}
                  >
                    🏮
                  </div>
                </div>
              </div>
              <div className="awning-scallop w-full"></div>

              {/* 2. BIỂN HIỆU TREO TIỆM (SIGNBOARD GÕ TÊN ĐỔI THEO THỜI GIAN THỰC + POP ANIMATION) */}
              <div
                key={`signboard-${selectedIndustry.id}-${popKey}`}
                className="signboard-pop-anim mx-auto max-w-sm -mt-2 relative z-30"
              >
                {/* Hai sợi xích đồng treo biển */}
                <div className="flex justify-between px-10 -mb-1">
                  <div className="w-1 h-3.5 bg-[#A8412A] rounded-xs border-x border-[#3A2418] shadow-xs"></div>
                  <div className="w-1 h-3.5 bg-[#A8412A] rounded-xs border-x border-[#3A2418] shadow-xs"></div>
                </div>

                {/* Tấm biển gỗ sơn mài */}
                <div
                  className="rounded-md border-2 bg-[#FFFDF9] p-2.5 text-center shadow-md relative overflow-hidden group transition-all duration-300"
                  style={{ borderColor: selectedIndustry.accentColor }}
                >
                  <div
                    className="border border-dashed py-1.5 px-3 rounded-xs bg-[#FAF5EB]/60 transition-colors duration-300"
                    style={{ borderColor: `${selectedIndustry.accentColor}55` }}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <span className="text-[11px]">{selectedIndustry.icon}</span>
                      <span
                        className="text-[10px] uppercase font-mono tracking-widest font-bold"
                        style={{ color: selectedIndustry.accentColor }}
                      >
                        {selectedIndustry.name}
                      </span>
                    </div>
                    <h3
                      className="font-serif text-base sm:text-lg font-black truncate tracking-tight transition-all"
                      style={{ color: selectedIndustry.accentColor }}
                    >
                      {displayedStoreName}
                    </h3>
                    <p className="text-[9px] text-[#6E5A4D] truncate italic mt-0.5">
                      {selectedIndustry.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. KHUNG MOCKUP WEBSITE BÊN DƯỚI (MƯỢN CHUYỂN ĐỘNG CỬA CUỐN MỞ LÊN + POP ANIMATION) */}
            <div
              key={`mockup-${selectedIndustry.id}-${popKey}`}
              className="mockup-pop-anim mx-auto max-w-xl -mt-4 pt-4 relative z-10"
            >
              <div className="device-frame shadow-xl relative overflow-hidden border-[#D4C3AC]">
                {/* LỚP CỬA CUỐN KÉO LÊN KHI VÀO TRANG (HƯỚNG B - 1 LẦN, 1.2S) */}
                <div
                  className={`absolute inset-0 z-40 bg-[#3A2418] flex flex-col justify-between p-6 ${
                    shutterOpened ? 'shutter-opening' : ''
                  }`}
                  aria-hidden="true"
                >
                  <div className="flex items-center justify-between border-b border-[#FAF5EB]/20 pb-3">
                    <span className="font-serif text-xs font-bold text-[#FAF5EB]">
                      PHỐ NGHỀ · MỞ GIAN HÀNG
                    </span>
                    <span className="chop-seal text-[9px] border-[#FAF5EB] text-[#FAF5EB]">
                      SẴN SÀNG
                    </span>
                  </div>
                  {/* Các thanh nan cửa cuốn cách điệu */}
                  <div className="space-y-2 py-4">
                    <div className="h-2 w-full bg-[#FAF5EB]/10 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-[#FAF5EB]/10 rounded-full"></div>
                    <div className="h-2 w-5/6 bg-[#FAF5EB]/10 rounded-full"></div>
                  </div>
                  <div className="text-center font-serif text-xs text-[#FAF5EB]/80 italic">
                    Đang mở cửa tiệm của bạn...
                  </div>
                </div>

                {/* Thanh trình duyệt browser bar */}
                <div className="device-bar flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="device-dot bg-[#A8412A]"></span>
                    <span className="device-dot bg-[#E0A526]"></span>
                    <span className="device-dot bg-[#2F6F73]"></span>
                  </div>
                  <div className="rounded-xs bg-[#FAF5EB] border border-[#E8DECE] px-3 py-0.5 max-w-[220px] truncate text-center">
                    <span className="font-mono text-[10px] text-[#6E5A4D]">
                      https://{displayedStoreName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cuahang'}.webmarket.vn
                    </span>
                  </div>
                  <div className="font-mono text-[9px] text-[#6E5A4D]">0.8s</div>
                </div>

                {/* Giao diện website bên trong phản ánh tên & ngành */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FAF5EB]">
                  {/* Ảnh cover thật từ listing */}
                  <Image
                    src={selectedIndustry.demoImage}
                    alt={displayedStoreName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top hover-scroll-img"
                  />

                  {/* Lớp Header Overlay gắn tên thương hiệu khách gõ */}
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-[#3A2418]/95 via-[#3A2418]/70 to-transparent p-4 z-20">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-sm font-serif text-xs font-bold text-white shadow-xs transition-colors duration-300"
                          style={{ backgroundColor: selectedIndustry.accentColor }}
                        >
                          {displayedStoreName.charAt(0) || selectedIndustry.icon}
                        </span>
                        <div>
                          <span className="font-serif text-xs sm:text-sm font-bold text-white block leading-none">
                            {displayedStoreName}
                          </span>
                          <span className="text-[9px] text-white/80 block mt-0.5">
                            {selectedIndustry.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/90">
                        {selectedIndustry.navItems.map((item, idx) => (
                          <span key={idx} className="bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-xs">
                            {item}
                          </span>
                        ))}
                        <span
                          className="px-2.5 py-0.5 rounded-xs font-bold text-white shadow-xs transition-colors duration-300"
                          style={{ backgroundColor: selectedIndustry.accentColor }}
                        >
                          {selectedIndustry.ctaButton}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thẻ Hero mini nổi giữa trang mô phỏng website thật */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
                    <div className="bg-[#FFFDF9]/92 backdrop-blur-xs border border-[#E8DECE] p-3 sm:p-4 rounded-lg text-center max-w-[280px] shadow-lg">
                      <span
                        className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs mb-1.5"
                        style={{ backgroundColor: selectedIndustry.accentBg, color: selectedIndustry.accentColor }}
                      >
                        {selectedIndustry.icon} {selectedIndustry.name}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-[#3A2418] leading-tight mb-2">
                        {selectedIndustry.heroHeadline}
                      </h4>
                      <div
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xs text-[10px] font-bold text-white shadow-xs"
                        style={{ backgroundColor: selectedIndustry.accentColor }}
                      >
                        <span>{selectedIndustry.ctaButton}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge tem minh chứng cố định góc */}
                  <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span className="chop-seal bg-[#FFFDF9]/95 shadow-sm text-[9px]">
                      DEMO ĐÃ KIỂM
                    </span>
                    <span
                      className="stamp-tag text-[9px] bg-[#FFFDF9]/95 shadow-sm font-mono font-bold"
                      style={{
                        color: selectedIndustry.accentColor,
                        borderColor: selectedIndustry.accentColor,
                      }}
                    >
                      {selectedIndustry.startingPrice}
                    </span>
                  </div>

                  {/* Nhãn chú thích hình minh họa bắt buộc */}
                  <div className="absolute bottom-2.5 right-2.5 z-20 rounded-xs bg-[#3A2418]/85 px-2 py-0.5 text-[9px] text-[#FAF5EB] font-sans">
                    * Hình minh họa trực quan giao diện thật
                  </div>
                </div>

                {/* Footer chân mockup: Tính năng có sẵn theo ngành */}
                <div className="bg-[#FFFDF9] p-3 border-t border-[#E8DECE] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#6E5A4D] uppercase">Đã bao gồm:</span>
                    {selectedIndustry.features.map((feat, i) => (
                      <span key={i} className="text-[11px] text-[#3A2418] font-medium bg-[#FAF5EB] px-2 py-0.5 rounded-xs border border-[#E8DECE]">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/solutions/${selectedIndustry.slugTarget}`}
                    className="text-[11px] font-bold hover:underline"
                    style={{ color: selectedIndustry.accentColor }}
                  >
                    Xem chi tiết gói →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
