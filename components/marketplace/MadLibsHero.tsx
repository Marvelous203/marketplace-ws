'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MadLibsHeroProps {
  onFilterChange?: (filters: { industry: string; goal: string; budget: string }) => void;
}

export default function MadLibsHero({ onFilterChange }: MadLibsHeroProps) {
  const [industry, setIndustry] = useState('food-beverage');
  const [goal, setGoal] = useState('booking');
  const [budget, setBudget] = useState('15-30');

  const industryOptions = [
    { value: 'food-beverage', label: 'nhà hàng & ẩm thực', defaultGoal: 'booking' },
    { value: 'fashion-apparel', label: 'thời trang & may mặc', defaultGoal: 'ecommerce' },
    { value: 'healthcare', label: 'y tế & phòng khám', defaultGoal: 'appointment' },
    { value: 'corporate', label: 'doanh nghiệp & dịch vụ', defaultGoal: 'leadgen' },
  ];

  const goalOptions: Record<string, { value: string; label: string }[]> = {
    'food-beverage': [
      { value: 'booking', label: 'nhận đặt bàn & thực đơn QR' },
      { value: 'delivery', label: 'gọi món giao tận nơi' },
      { value: 'brand', label: 'quảng bá không gian cao cấp' },
    ],
    'fashion-apparel': [
      { value: 'ecommerce', label: 'bán hàng lookbook & giỏ hàng mượt' },
      { value: 'mixmatch', label: 'trải nghiệm phối đồ visual' },
      { value: 'catalog', label: 'trưng bày bộ sưu tập mùa mới' },
    ],
    healthcare: [
      { value: 'appointment', label: 'đặt lịch khám bác sĩ & tư vấn' },
      { value: 'pricing', label: 'bảng giá & tra cứu dịch vụ' },
      { value: 'clinic-tour', label: 'giới thiệu cơ sở vật chất' },
    ],
    corporate: [
      { value: 'leadgen', label: 'thu hút khách hàng doanh nghiệp B2B' },
      { value: 'portfolio', label: 'trình diễn hồ sơ năng lực & dự án' },
      { value: 'recruitment', label: 'tuyển dụng & văn hóa công ty' },
    ],
  };

  const budgetOptions = [
    { value: 'under-5', label: 'dưới 5 triệu (Mã nguồn / SaaS)' },
    { value: '5-15', label: '5 – 15 triệu (Triển khai tiêu chuẩn)' },
    { value: '15-30', label: '10 – 30 triệu (Trọn gói chuyên nghiệp)' },
    { value: 'above-30', label: 'trên 30 triệu (Thiết kế may đo riêng)' },
  ];

  const currentGoals = goalOptions[industry] || goalOptions['food-beverage'];

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInd = e.target.value;
    setIndustry(newInd);
    const newGoals = goalOptions[newInd] || [];
    const newGoal = newGoals[0]?.value || 'booking';
    setGoal(newGoal);
    onFilterChange?.({ industry: newInd, goal: newGoal, budget });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGoal = e.target.value;
    setGoal(newGoal);
    onFilterChange?.({ industry, goal: newGoal, budget });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBudget = e.target.value;
    setBudget(newBudget);
    onFilterChange?.({ industry, goal, budget: newBudget });
  };

  return (
    <section className="relative overflow-hidden border-b border-[#E8DECE] bg-[#FAF5EB] py-14 lg:py-20">
      {/* Texture nét cọ chìm mộc mạc */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3A2418_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Nhãn giới thiệu phong cách mộc */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4C3AC] bg-[#FFFDF9] px-3.5 py-1 text-xs font-semibold text-[#6E5A4D] shadow-xs mb-6">
          <span className="h-2 w-2 rounded-full bg-[#A8412A]"></span>
          <span>Sàn Giải pháp Website theo phong cách Phố nghề Việt</span>
        </div>

        {/* Câu điền chỗ trống tương tác (Mad Libs Hero) */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-[#3A2418] leading-[1.35] tracking-tight">
          Tôi cần website cho{' '}
          <span className="inline-block relative my-1">
            <select
              value={industry}
              onChange={handleIndustryChange}
              className="appearance-none font-serif font-bold text-[#A8412A] bg-[#FFFDF9] border-b-2 border-dashed border-[#A8412A] px-3 py-1 pr-7 rounded-sm shadow-xs cursor-pointer hover:bg-[#F5EFE3] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A8412A]"
            >
              {industryOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="font-sans text-sm text-[#3A2418]">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#A8412A]">
              ▾
            </span>
          </span>{' '}
          để{' '}
          <span className="inline-block relative my-1">
            <select
              value={goal}
              onChange={handleGoalChange}
              className="appearance-none font-serif font-bold text-[#2F6F73] bg-[#FFFDF9] border-b-2 border-dashed border-[#2F6F73] px-3 py-1 pr-7 rounded-sm shadow-xs cursor-pointer hover:bg-[#F5EFE3] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2F6F73]"
            >
              {currentGoals.map((opt) => (
                <option key={opt.value} value={opt.value} className="font-sans text-sm text-[#3A2418]">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2F6F73]">
              ▾
            </span>
          </span>
          , với ngân sách{' '}
          <span className="inline-block relative my-1">
            <select
              value={budget}
              onChange={handleBudgetChange}
              className="appearance-none font-serif font-bold text-[#E0A526] bg-[#FFFDF9] border-b-2 border-dashed border-[#E0A526] px-3 py-1 pr-7 rounded-sm shadow-xs cursor-pointer hover:bg-[#F5EFE3] transition-colors focus:outline-none focus:ring-1 focus:ring-[#E0A526]"
            >
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="font-sans text-sm text-[#3A2418]">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#E0A526]">
              ▾
            </span>
          </span>
          .
        </h1>

        {/* Lời dẫn mộc mạc */}
        <p className="mt-5 mx-auto max-w-2xl text-base text-[#6E5A4D] font-normal leading-relaxed">
          Không cần biết thuật ngữ lập trình. Xem demo thật, biết rõ phạm vi bàn giao, giá cả minh bạch không phát sinh và nhận hỗ trợ trực tiếp từ đối tác kỹ thuật.
        </p>

        {/* Nút hành động */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href={`/marketplace?category=${industry}`}
            className="btn-ink-primary"
          >
            <span>Xem các giải pháp phù hợp</span>
            <span>→</span>
          </Link>
          <Link
            href="/request-project"
            className="btn-ink-secondary"
          >
            <span>+ Yêu cầu thiết kế riêng theo ý</span>
          </Link>
        </div>

        {/* Con dấu cam kết ba không */}
        <div className="mt-10 pt-6 border-t border-[#E8DECE] flex flex-wrap items-center justify-center gap-6 text-xs text-[#6E5A4D]">
          <div className="flex items-center gap-1.5">
            <span className="chop-seal">DEMO ĐÃ KIỂM</span>
            <span>Xem trước trải nghiệm thực tế</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="chop-seal-green">SELLER XÁC MINH</span>
            <span>Đối tác cam kết bàn giao & bảo hành</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="stamp-tag text-[#A8412A]">GIÁ BẤT BIẾN</span>
            <span>Hợp đồng rõ ràng, không phát sinh</span>
          </div>
        </div>
      </div>
    </section>
  );
}
