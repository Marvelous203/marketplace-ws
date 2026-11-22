'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Offer } from '@/lib/api/marketplace';

interface OfferSelectorClientProps {
  offers: Offer[];
  listingSlug: string;
  listingTitle: string;
}

export default function OfferSelectorClient({
  offers,
  listingSlug,
  listingTitle,
}: OfferSelectorClientProps) {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    offers[0]?.id || '',
  );

  const selectedOffer =
    offers.find((o) => o.id === selectedOfferId) || offers[0];

  if (!selectedOffer) {
    return (
      <div className="p-5 rounded-lg border border-[#E8DECE] bg-[#FFFDF9] text-xs text-[#6E5A4D]">
        Chưa có gói thương mại nào được cấu hình cho giải pháp này.
      </div>
    );
  }

  const getFulfillmentStamp = (type: string) => {
    switch (type) {
      case 'SOURCE_CODE':
        return {
          label: 'Bản quyền Mã nguồn',
          className: 'text-[#2F6F73] border-[#2F6F73]',
          scopeIncluded: [
            'Toàn bộ mã nguồn Next.js 16 & NestJS bản quyền vĩnh viễn',
            'Tài liệu hướng dẫn cài đặt & triển khai chi tiết (Deployment guide)',
            'Quyền tự do chỉnh sửa và mở rộng không giới hạn tính năng',
            'Cập nhật bản vá bảo mật trong 6 tháng đầu',
          ],
          scopeExcluded: [
            'Chi phí máy chủ Cloud/VPS và tên miền riêng',
            'May đo thêm tính năng ngoài phạm vi mẫu chuẩn',
          ],
          licenseNote: 'Giấy phép đơn vị (Single Project License), không bán lại mã nguồn cho bên thứ ba.',
        };
      case 'MANAGED_SERVICE':
        return {
          label: 'Triển khai Trọn gói',
          className: 'text-[#3A2418] border-[#3A2418]',
          scopeIncluded: [
            'Cài đặt hoàn chỉnh lên hosting/cloud của quý khách trong 48h',
            'Gắn logo, hình ảnh, thông tin thương hiệu & bảng giá/thực đơn',
            'Cấu hình tên miền riêng, chứng chỉ bảo mật SSL miễn phí',
            'Đào tạo nhân viên quản trị website 1-kèm-1 qua video call',
            'Bảo hành vận hành kỹ thuật 12 tháng',
          ],
          scopeExcluded: [
            'Viết bài nội dung hoặc chụp ảnh sản phẩm mới',
            'Tích hợp cổng thanh toán quốc tế ngoài danh mục',
          ],
          licenseNote: 'Gói chìa khóa trao tay (Turnkey Managed Service), khách hàng sở hữu toàn bộ dữ liệu.',
        };
      case 'SAAS':
        return {
          label: 'Thuê bao Cloud SaaS',
          className: 'text-[#E0A526] border-[#E0A526]',
          scopeIncluded: [
            'Khởi tạo website chạy ngay trong 5 phút trên hạ tầng đám mây',
            'Bao gồm hạ tầng cloud, sao lưu dữ liệu tự động hàng ngày',
            'Miễn phí băng thông và chứng chỉ bảo mật SSL',
            'Hỗ trợ kỹ thuật 24/7 trong suốt thời gian thuê bao',
          ],
          scopeExcluded: [
            'Không bàn giao mã nguồn gốc máy chủ',
            'Tùy biến mã nguồn cấp sâu (deep code customization)',
          ],
          licenseNote: 'Thuê bao linh hoạt theo tháng hoặc năm, hủy bất cứ lúc nào.',
        };
      default:
        return {
          label: 'Thiết kế May đo',
          className: 'text-[#A8412A] border-[#A8412A]',
          scopeIncluded: [
            'Khảo sát yêu cầu chi tiết và lên bản vẽ kiến trúc riêng',
            'Lập trình tính năng may đo theo đúng quy trình kinh doanh',
            'Kiểm thử UAT toàn diện và bàn giao có biên bản',
          ],
          scopeExcluded: [
            'Các yêu cầu phát sinh ngoài phạm vi phụ lục hợp đồng',
          ],
          licenseNote: 'Khách hàng sở hữu toàn bộ bản quyền trí tuệ và mã nguồn sau bàn giao.',
        };
    }
  };

  const stampInfo = getFulfillmentStamp(selectedOffer.fulfillmentType);

  return (
    <div className="rounded-xl border border-[#E8DECE] bg-[#FFFDF9] p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8DECE]">
        <div>
          <span className="font-mono text-xs font-bold text-[#A8412A] uppercase tracking-wider">
            BẢNG GIÁ & HÌNH THỨC BÀN GIAO
          </span>
          <h3 className="mt-1 font-serif text-xl font-bold text-[#3A2418]">
            Chọn Gói Triển Khai Phù Hợp
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="chop-seal">GIÁ BẤT BIẾN</span>
          <span className="chop-seal-green">HỢP ĐỒNG MINH BẠCH</span>
        </div>
      </div>

      {/* Offers dạng TAB (không xếp thành 3 cột thô cứng) */}
      <div className="mt-6 flex border-b border-[#E8DECE] overflow-x-auto gap-2">
        {offers.map((offer) => {
          const isSelected = offer.id === selectedOfferId;
          const stamp = getFulfillmentStamp(offer.fulfillmentType);

          return (
            <button
              key={offer.id}
              type="button"
              onClick={() => setSelectedOfferId(offer.id)}
              className={`pb-3 px-4 text-left border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'border-[#A8412A] text-[#3A2418] font-bold bg-[#FAF5EB]/50'
                  : 'border-transparent text-[#6E5A4D] hover:text-[#3A2418] hover:border-[#D4C3AC]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm">
                  {offer.name}
                </span>
                <span className={`stamp-tag text-[10px] ${stamp.className}`}>
                  {stamp.label}
                </span>
              </div>
              <div className="mt-1 font-serif text-xs font-bold text-[#A8412A]">
                {offer.price ? offer.price.formattedPrice : 'Báo giá riêng'}
                {offer.billingInterval === 'MONTH' && ' / tháng'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Nội dung gói được chọn */}
      <div className="mt-6 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D4C3AC]">
          <div>
            <div className="flex items-center gap-2">
              <span className={`stamp-tag ${stampInfo.className}`}>
                {stampInfo.label}
              </span>
              <span className="text-xs text-[#6E5A4D]">
                Mã gói: <code className="font-mono">{selectedOffer.id}</code>
              </span>
            </div>
            <h4 className="mt-2 font-serif text-xl font-bold text-[#3A2418]">
              {selectedOffer.name}
            </h4>
            {selectedOffer.description && (
              <p className="mt-1 text-xs text-[#6E5A4D]">
                {selectedOffer.description}
              </p>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#6E5A4D] block">
              Chi phí thanh toán
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#A8412A]">
              {selectedOffer.price ? selectedOffer.price.formattedPrice : 'Theo thỏa thuận'}
            </span>
            {selectedOffer.billingInterval === 'MONTH' && (
              <span className="text-xs text-[#6E5A4D] block">/ mỗi tháng</span>
            )}
          </div>
        </div>

        {/* Bóc tách phạm vi 2 cột: Bao gồm vs Không bao gồm */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md border border-[#D4C3AC] bg-[#FFFDF9] p-4">
            <h5 className="font-serif text-xs font-bold text-[#2F6F73] uppercase tracking-wide flex items-center gap-1.5 mb-3">
              <span>✓</span>
              <span>Phạm vi bao gồm (Included Scope)</span>
            </h5>
            <ul className="space-y-2 text-xs text-[#3A2418]">
              {stampInfo.scopeIncluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#2F6F73] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-[#D4C3AC] bg-[#FFFDF9] p-4">
            <h5 className="font-serif text-xs font-bold text-[#A8412A] uppercase tracking-wide flex items-center gap-1.5 mb-3">
              <span>✕</span>
              <span>Phạm vi không bao gồm (Excluded Scope)</span>
            </h5>
            <ul className="space-y-2 text-xs text-[#6E5A4D]">
              {stampInfo.scopeExcluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#A8412A] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giấy phép bản quyền */}
        <div className="mt-5 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-3 text-xs text-[#6E5A4D] flex items-center gap-2">
          <span className="font-bold text-[#3A2418]">Giấy phép:</span>
          <span>{stampInfo.licenseNote}</span>
        </div>

        {/* Nút hành động */}
        <div className="mt-6 pt-5 border-t border-[#D4C3AC] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#6E5A4D]">
            Cần điều chỉnh thêm tính năng?{' '}
            <Link
              href={`/request-project?listing=${listingSlug}&offer=${selectedOffer.id}`}
              className="text-[#A8412A] font-bold hover:underline"
            >
              Yêu cầu tùy biến riêng →
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/request-project?listing=${listingSlug}&offer=${selectedOffer.id}`}
              className="btn-ink-primary"
            >
              <span>Đặt triển khai gói này</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
