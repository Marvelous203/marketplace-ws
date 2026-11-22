'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MarketplaceNavbar from '@/components/marketplace/Navbar';

export default function RequestProjectPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 5;

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [answers, setAnswers] = useState({
    title: '',
    industry: 'food-beverage',
    goal: 'booking',
    features: ['cms', 'responsive'] as string[],
    budget: '15-30',
    timeline: '1_MONTH',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    notes: '',
  });

  const toggleFeature = (id: string) => {
    if (answers.features.includes(id)) {
      setAnswers((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f !== id),
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        features: [...prev.features, id],
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let randomSuffix = '';
      for (let i = 0; i < 6; i++) {
        randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const refCode = `WMR-${randomSuffix}`;

      setSubmittedCode(refCode);
      setSubmitting(false);
    }, 700);
  };

  // SVG Bản phác thảo được vẽ dần theo từng câu hỏi
  const renderSketchProgress = () => {
    const progress = (currentQuestion / totalQuestions) * 100;

    return (
      <div className="rounded-xl border border-[#D4C3AC] bg-[#FAF5EB] p-4 text-center">
        <div className="flex items-center justify-between text-xs text-[#6E5A4D] mb-2 font-mono">
          <span>BẢN PHÁC THẢO DỰ ÁN</span>
          <span>{currentQuestion} / {totalQuestions} CÂU HỎI ({Math.round(progress)}%)</span>
        </div>

        {/* Khung bản vẽ kỹ thuật / blueprint SVG */}
        <div className="relative h-20 w-full overflow-hidden rounded-md border border-[#E8DECE] bg-[#FFFDF9] flex items-center justify-center p-2">
          <svg className="w-full h-full" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Lưới grid bản vẽ */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#FAF5EB" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="40" x2="300" y2="40" stroke="#FAF5EB" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="100" y1="0" x2="100" y2="60" stroke="#FAF5EB" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="200" y1="0" x2="200" y2="60" stroke="#FAF5EB" strokeWidth="1" strokeDasharray="3 3" />

            {/* Bước 1: Nét móng và mặt đất */}
            <line x1="20" y1="50" x2="280" y2="50" stroke="#3A2418" strokeWidth="2" />
            {currentQuestion >= 1 && (
              <rect x="40" y="45" width="220" height="5" fill="#A8412A" opacity="0.3" />
            )}

            {/* Bước 2: Cột vách và khung nhà */}
            {currentQuestion >= 2 && (
              <>
                <line x1="60" y1="50" x2="60" y2="25" stroke="#3A2418" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="240" y1="50" x2="240" y2="25" stroke="#3A2418" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="60" y1="25" x2="240" y2="25" stroke="#3A2418" strokeWidth="1.5" />
              </>
            )}

            {/* Bước 3: Mái nhà ngói & các ô cửa sổ (tính năng) */}
            {currentQuestion >= 3 && (
              <>
                <path d="M 50 25 L 150 10 L 250 25 Z" fill="#A8412A" opacity="0.15" stroke="#A8412A" strokeWidth="1.5" />
                <rect x="80" y="30" width="25" height="15" stroke="#2F6F73" strokeWidth="1" fill="#FAF5EB" />
                <rect x="120" y="30" width="25" height="15" stroke="#2F6F73" strokeWidth="1" fill="#FAF5EB" />
                <rect x="160" y="30" width="25" height="15" stroke="#2F6F73" strokeWidth="1" fill="#FAF5EB" />
                <rect x="200" y="30" width="25" height="15" stroke="#2F6F73" strokeWidth="1" fill="#FAF5EB" />
              </>
            )}

            {/* Bước 4: Cửa chính & biển hiệu */}
            {currentQuestion >= 4 && (
              <>
                <rect x="135" y="30" width="30" height="20" stroke="#E0A526" strokeWidth="1.5" fill="#FAF5EB" />
                <line x1="150" y1="30" x2="150" y2="50" stroke="#E0A526" strokeWidth="1" />
              </>
            )}

            {/* Bước 5: Cờ cắm nóc nhà - Hoàn tất */}
            {currentQuestion >= 5 && (
              <>
                <line x1="150" y1="10" x2="150" y2="2" stroke="#A8412A" strokeWidth="1.5" />
                <path d="M 150 2 L 165 5 L 150 8 Z" fill="#A8412A" />
              </>
            )}
          </svg>
        </div>

        {/* Thanh mực kẻ chỉ */}
        <div className="mt-3 w-full bg-[#E8DECE] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#A8412A] h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  if (submittedCode) {
    return (
      <div className="min-h-screen bg-[#FAF5EB] flex flex-col">
        <MarketplaceNavbar />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-8 sm:p-10 text-center shadow-md">
            <span className="chop-seal text-base py-1 px-3">
              ĐÃ TIẾP NHẬN BẢN PHÁC THẢO
            </span>

            <h1 className="mt-6 font-serif text-3xl font-bold text-[#3A2418]">
              Gửi Yêu Cầu Thành Công!
            </h1>

            <p className="mt-3 text-sm text-[#6E5A4D] leading-relaxed">
              Bản phác thảo website của bạn đã được chuyển tới bàn làm việc của đội ngũ kỹ sư phụ trách gian phố{' '}
              <strong className="text-[#3A2418]">
                {answers.industry === 'food-beverage'
                  ? 'Phố Ẩm thực'
                  : answers.industry === 'fashion-apparel'
                  ? 'Phố May mặc'
                  : answers.industry === 'healthcare'
                  ? 'Phố Y dược'
                  : 'Phố Doanh nghiệp'}
              </strong>.
            </p>

            {/* Mã Tra Cứu Bảo Mật WMR-XXXX */}
            <div className="mt-8 rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] p-6 text-center">
              <span className="font-mono text-xs font-bold uppercase text-[#6E5A4D] tracking-wider block">
                MÃ TRA CỨU DUY NHẤT CỦA BẠN
              </span>
              <div className="mt-2 font-mono text-3xl sm:text-4xl font-black text-[#A8412A] tracking-widest">
                {submittedCode}
              </div>
              <p className="mt-3 text-xs text-[#6E5A4D] leading-relaxed max-w-md mx-auto">
                Chúng tôi đã gửi email xác nhận kèm đường dẫn tra cứu tiến độ báo giá tới{' '}
                <strong className="text-[#3A2418]">{answers.contactEmail}</strong>. Kỹ sư phụ trách sẽ liên hệ lại qua số{' '}
                <strong className="text-[#3A2418]">{answers.contactPhone}</strong> trong vòng 4 giờ làm việc.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/marketplace"
                className="btn-ink-primary text-xs py-2.5 px-5"
              >
                Tiếp tục xem các giải pháp khác →
              </Link>
              <Link
                href="/"
                className="btn-ink-secondary text-xs py-2.5 px-5"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col">
      <MarketplaceNavbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        {/* Bản phác thảo được vẽ dần trên đầu form */}
        {renderSketchProgress()}

        {/* Khung câu hỏi dạng Hội thoại mộc mạc */}
        <div className="mt-8 rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-6 sm:p-10 shadow-xs relative">
          <form onSubmit={handleSubmit}>
            {/* CÂU HỎI 1: Ngành nghề */}
            {currentQuestion === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A8412A]">
                    CÂU HỎI 01 / 05
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                    Chào bạn, bạn muốn làm website cho lĩnh vực kinh doanh nào?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D]">
                    Hãy cho chúng tôi biết tên quán, thương hiệu hoặc lĩnh vực bạn đang kinh doanh.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] mb-1.5">
                    Tên dự án hoặc tên thương hiệu của bạn:
                  </label>
                  <input
                    type="text"
                    required
                    value={answers.title}
                    onChange={(e) => setAnswers({ ...answers, title: e.target.value })}
                    placeholder="Ví dụ: Tiệm Bánh Nhà Bông, Quán Cà Phê Mộc, Nha Khoa Tâm Đức..."
                    className="w-full rounded-md border border-[#D4C3AC] bg-[#FAF5EB] p-3 text-sm text-[#3A2418] outline-none focus:border-[#A8412A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] mb-1.5">
                    Chọn gian phố phù hợp nhất:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'food-beverage', label: '🏮 Phố Ẩm thực & Cafe', desc: 'Nhà hàng, quán ăn, trà sữa, thực đơn QR' },
                      { id: 'fashion-apparel', label: '🧵 Phố May mặc & Thời trang', desc: 'Cửa hàng quần áo, phụ kiện, lookbook' },
                      { id: 'healthcare', label: '🌿 Phố Y dược & Sức khỏe', desc: 'Phòng khám, nha khoa, spa thẩm mỹ' },
                      { id: 'corporate', label: '📐 Phố Doanh nghiệp & Dịch vụ', desc: 'Hồ sơ năng lực, kiến trúc, công nghệ' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setAnswers({ ...answers, industry: opt.id })}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                          answers.industry === opt.id
                            ? 'border-[#A8412A] bg-[#A8412A]/5 shadow-xs'
                            : 'border-[#E8DECE] bg-[#FAF5EB]/50 hover:bg-[#FAF5EB]'
                        }`}
                      >
                        <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                          {opt.label}
                        </h4>
                        <p className="text-[11px] text-[#6E5A4D] mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CÂU HỎI 2: Mục tiêu cốt lõi */}
            {currentQuestion === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A8412A]">
                    CÂU HỎI 02 / 05
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                    Mục tiêu quan trọng nhất của website là gì?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D]">
                    Điều gì giúp trang web này mang lại hiệu quả rõ rệt nhất cho công việc kinh doanh của bạn?
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'booking', title: 'Nhận đặt bàn, đặt lịch hẹn trực tuyến', desc: 'Khách chọn ngày giờ, số lượng người và nhận xác nhận tự động qua SMS/Zalo' },
                    { id: 'ecommerce', title: 'Bán hàng trực tiếp & thu tiền', desc: 'Khách xem sản phẩm, chọn size màu, bỏ vào giỏ hàng và thanh toán mã QR' },
                    { id: 'branding', title: 'Khẳng định uy tín thương hiệu & Hồ sơ năng lực', desc: 'Trình diễn không gian, giải thưởng, bảng giá và thu thập thông tin khách VIP' },
                    { id: 'leadgen', title: 'Tư vấn & Báo giá khách hàng B2B', desc: 'Form nhận yêu cầu chi tiết, chuyển thẳng thông báo về điện thoại của chủ quán' },
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setAnswers({ ...answers, goal: g.id })}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        answers.goal === g.id
                          ? 'border-[#A8412A] bg-[#A8412A]/5 shadow-xs'
                          : 'border-[#E8DECE] bg-[#FAF5EB]/50 hover:bg-[#FAF5EB]'
                      }`}
                    >
                      <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                        {g.title}
                      </h4>
                      <p className="text-xs text-[#6E5A4D] mt-1">
                        {g.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CÂU HỎI 3: Tính năng cần có */}
            {currentQuestion === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A8412A]">
                    CÂU HỎI 03 / 05
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                    Những tính năng nào bạn muốn có sẵn ngay từ đầu?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D]">
                    Bạn có thể tick chọn nhiều mục. Kỹ sư của chúng tôi sẽ bóc tách chi phí từng mục để bạn quyết định.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'cms', name: 'Quản trị nội dung & hình ảnh (CMS)', note: 'Tự thay đổi món ăn / sản phẩm dễ dàng' },
                    { id: 'responsive', name: 'Hiển thị chuẩn Mobile / Tablet', note: 'Vuốt chạm mượt mà trên điện thoại' },
                    { id: 'qr_menu', name: 'Thực đơn điện tử QR tại bàn', note: 'Quét mã là xem menu không cần cài app' },
                    { id: 'booking_sys', name: 'Hệ thống đặt hẹn / giữ chỗ', note: 'Quản lý lịch hẹn theo thời gian thực' },
                    { id: 'vietqr', name: 'Thanh toán quét mã VietQR tự động', note: 'Tiền về thẳng tài khoản ngân hàng' },
                    { id: 'zalo_chat', name: 'Tích hợp nút Chat Zalo & Hotline', note: 'Khách bấm gọi hoặc nhắn tin ngay' },
                    { id: 'multilang', name: 'Hỗ trợ song ngữ (Việt - Anh)', note: 'Phục vụ khách nước ngoài du lịch' },
                    { id: 'seo_opt', name: 'Tối ưu chuẩn tìm kiếm Google (SEO)', note: 'Dễ dàng lên top Google Maps & Search' },
                  ].map((feat) => {
                    const isChecked = answers.features.includes(feat.id);
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-[#2F6F73] bg-[#2F6F73]/5 shadow-xs'
                            : 'border-[#E8DECE] bg-[#FAF5EB]/50 hover:bg-[#FAF5EB]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="h-4 w-4 accent-[#2F6F73]"
                          />
                          <span className="font-serif text-xs font-bold text-[#3A2418]">
                            {feat.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6E5A4D] mt-1 pl-6">
                          {feat.note}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CÂU HỎI 4: Ngân sách & Tiến độ */}
            {currentQuestion === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A8412A]">
                    CÂU HỎI 04 / 05
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                    Bạn dự trù mức ngân sách và thời hạn như thế nào?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D]">
                    Chúng tôi sẽ đề xuất phương án tối ưu nhất trong khoảng dự toán của bạn, cam kết không phát sinh.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] mb-2">
                    Khoảng ngân sách dự kiến:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'under-5', label: 'Dưới 5 triệu', desc: 'Mua bản quyền mã nguồn hoặc thuê bao SaaS' },
                      { id: '5-15', label: '5 – 15 triệu', desc: 'Triển khai trọn gói theo mẫu chuẩn' },
                      { id: '15-30', label: '15 – 30 triệu', desc: 'Trọn gói chuyên nghiệp có may đo tính năng' },
                      { id: 'above-30', label: 'Trên 30 triệu', desc: 'Dự án may đo toàn diện theo yêu cầu riêng' },
                    ].map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setAnswers({ ...answers, budget: b.id })}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                          answers.budget === b.id
                            ? 'border-[#E0A526] bg-[#E0A526]/10 shadow-xs'
                            : 'border-[#E8DECE] bg-[#FAF5EB]/50 hover:bg-[#FAF5EB]'
                        }`}
                      >
                        <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                          {b.label}
                        </h4>
                        <p className="text-[11px] text-[#6E5A4D] mt-0.5">
                          {b.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] mb-1.5">
                    Thời hạn bạn mong muốn website bắt đầu chạy:
                  </label>
                  <select
                    value={answers.timeline}
                    onChange={(e) => setAnswers({ ...answers, timeline: e.target.value })}
                    className="w-full rounded-md border border-[#D4C3AC] bg-[#FAF5EB] p-2.5 text-xs text-[#3A2418] outline-none"
                  >
                    <option value="ASAP">Càng sớm càng tốt (trong vòng 3-5 ngày)</option>
                    <option value="2_WEEKS">Trong vòng 2 tuần tới</option>
                    <option value="1_MONTH">Trong vòng 1 tháng tới</option>
                    <option value="FLEXIBLE">Linh hoạt, ưu tiên chất lượng</option>
                  </select>
                </div>
              </div>
            )}

            {/* CÂU HỎI 5: Thông tin liên hệ */}
            {currentQuestion === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A8412A]">
                    CÂU HỎI 05 / 05
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                    Tuyệt vời! Chúng tôi nên liên hệ trao đổi cụ thể với ai?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D]">
                    Kỹ sư trưởng gian phố sẽ gửi bản phác thảo sơ bộ và gọi điện trao đổi ngắn để chuẩn bị báo giá chính thức.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3A2418] mb-1">
                      Họ và tên của bạn: *
                    </label>
                    <input
                      type="text"
                      required
                      value={answers.contactName}
                      onChange={(e) => setAnswers({ ...answers, contactName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-md border border-[#D4C3AC] bg-[#FAF5EB] p-2.5 text-xs text-[#3A2418] outline-none focus:border-[#A8412A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3A2418] mb-1">
                      Số điện thoại / Zalo: *
                    </label>
                    <input
                      type="tel"
                      required
                      value={answers.contactPhone}
                      onChange={(e) => setAnswers({ ...answers, contactPhone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full rounded-md border border-[#D4C3AC] bg-[#FAF5EB] p-2.5 text-xs text-[#3A2418] outline-none focus:border-[#A8412A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] mb-1">
                    Email nhận báo giá: *
                  </label>
                  <input
                    type="email"
                    required
                    value={answers.contactEmail}
                    onChange={(e) => setAnswers({ ...answers, contactEmail: e.target.value })}
                    placeholder="email@cuahangcuaban.vn"
                    className="w-full rounded-md border border-[#D4C3AC] bg-[#FAF5EB] p-2.5 text-xs text-[#3A2418] outline-none focus:border-[#A8412A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2418] mb-1">
                    Ghi chú thêm về mong muốn của bạn (nếu có):
                  </label>
                  <textarea
                    rows={3}
                    value={answers.notes}
                    onChange={(e) => setAnswers({ ...answers, notes: e.target.value })}
                    placeholder="Ví dụ: Chúng tôi có sẵn logo và menu món ăn, cần tư vấn thêm về máy in hóa đơn..."
                    className="w-full rounded-md border border-[#D4C3AC] bg-[#FAF5EB] p-2.5 text-xs text-[#3A2418] outline-none focus:border-[#A8412A]"
                  />
                </div>
              </div>
            )}

            {/* Điều hướng Trước / Tiếp / Hoàn tất */}
            <div className="mt-8 pt-5 border-t border-[#E8DECE] flex items-center justify-between">
              {currentQuestion > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-ink-secondary text-xs py-2 px-4"
                >
                  ← Quay lại câu trước
                </button>
              ) : (
                <div />
              )}

              {currentQuestion < totalQuestions ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-ink-primary text-xs py-2 px-5 ml-auto"
                >
                  <span>Tiếp tục</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-ink-primary text-xs py-2 px-6 ml-auto"
                >
                  {submitting ? 'Đang gửi bản phác thảo...' : 'Hoàn tất & Cấp mã WMR →'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
