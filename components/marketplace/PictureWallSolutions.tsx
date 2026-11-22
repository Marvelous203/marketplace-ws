'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ComparisonDrawer, { ComparisonItem } from './ComparisonDrawer';

export interface ListingItemData {
  id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  category: {
    name: string;
    slug: string;
  };
  seller: {
    name: string;
    sellerType: string;
  };
  coverImage?: {
    url: string;
    altText?: string;
  };
  tags: {
    name: string;
    slug: string;
  }[];
  availableFulfillmentTypes: string[];
  priceSummary: {
    label: string;
    amountMinor: number;
    formattedPrice: string;
    currency: string;
  };
  featured?: boolean;
}

interface PictureWallSolutionsProps {
  listings: ListingItemData[];
}

export default function PictureWallSolutions({ listings }: PictureWallSolutionsProps) {
  const [compareItems, setCompareItems] = useState<ComparisonItem[]>([]);

  const toggleCompare = (item: ListingItemData) => {
    if (compareItems.some((c) => c.id === item.id)) {
      setCompareItems(compareItems.filter((c) => c.id !== item.id));
    } else {
      setCompareItems([
        ...compareItems,
        {
          id: item.id,
          slug: item.slug,
          title: item.title,
          priceFormatted: `${item.priceSummary.label} ${item.priceSummary.formattedPrice}`,
          coverImage: item.coverImage?.url,
        },
      ]);
    }
  };

  const removeCompare = (id: string) => {
    setCompareItems(compareItems.filter((c) => c.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const getFulfillmentStamp = (type: string) => {
    switch (type) {
      case 'SOURCE_CODE':
        return {
          label: 'Bản quyền Mã nguồn',
          className: 'text-[#2F6F73] border-[#2F6F73]',
        };
      case 'MANAGED_SERVICE':
        return {
          label: 'Triển khai Trọn gói',
          className: 'text-[#3A2418] border-[#3A2418]',
        };
      case 'SAAS':
        return {
          label: 'Thuê bao Cloud',
          className: 'text-[#E0A526] border-[#E0A526]',
        };
      default:
        return {
          label: 'May đo Riêng',
          className: 'text-[#A8412A] border-[#A8412A]',
        };
    }
  };

  return (
    <>
      {/* Tường tranh giải pháp - Bố cục bất đối xứng nghệ thuật */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {listings.map((item, index) => {
          const isComparing = compareItems.some((c) => c.id === item.id);
          // Layout asymmetry: card 0 takes 7 cols, card 1 takes 5 cols, card 2 takes 12 or 6 cols
          const colSpan =
            index === 0
              ? 'md:col-span-7'
              : index === 1
              ? 'md:col-span-5'
              : 'md:col-span-6 lg:col-span-4';

          const imgHeight =
            index === 0
              ? 'h-72 sm:h-84 md:h-96'
              : index === 1
              ? 'h-64 sm:h-76 md:h-84'
              : 'h-60 sm:h-72';

          return (
            <article
              key={item.id}
              className={`${colSpan} group flex flex-col rounded-xl border border-[#E8DECE] bg-[#FFFDF9] p-4 sm:p-5 shadow-xs transition-all hover:border-[#D4C3AC] hover:shadow-md`}
            >
              {/* Thẻ thiết bị với thanh browser thu nhỏ */}
              <div className="device-frame">
                {/* Browser bar */}
                <div className="device-bar flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="device-dot bg-[#A8412A]/60"></span>
                    <span className="device-dot bg-[#E0A526]/60"></span>
                    <span className="device-dot bg-[#2F6F73]/60"></span>
                  </div>
                  <span className="font-mono text-[10px] text-[#6E5A4D] truncate max-w-[180px]">
                    preview.webmarket.vn/{item.slug}
                  </span>
                  <div className="w-10"></div>
                </div>

                {/* Preview Image container with hover-scroll */}
                <div className={`relative w-full ${imgHeight} overflow-hidden bg-[#FAF5EB]`}>
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage.url}
                      alt={item.coverImage.altText || item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="hover-scroll-img"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[#6E5A4D]">
                      Chưa có ảnh xem trước
                    </div>
                  )}

                  {/* Badges góc ảnh */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                    <span className="chop-seal bg-[#FFFDF9]/90 shadow-xs">
                      DEMO ĐÃ KIỂM
                    </span>
                    <span className="chop-seal-green bg-[#FFFDF9]/90 shadow-xs">
                      SELLER XÁC MINH
                    </span>
                  </div>

                  {/* Hint text hover */}
                  <div className="absolute bottom-2 right-2 rounded-sm bg-[#3A2418]/80 px-2 py-0.5 text-[10px] text-[#FAF5EB] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Rê chuột để cuộn xem trang
                  </div>
                </div>
              </div>

              {/* Thông tin giải pháp */}
              <div className="mt-4 flex flex-1 flex-col justify-between">
                <div>
                  {/* Con tem phân loại bàn giao */}
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    {item.availableFulfillmentTypes.slice(0, 2).map((ft) => {
                      const stamp = getFulfillmentStamp(ft);
                      return (
                        <span key={ft} className={`stamp-tag ${stamp.className}`}>
                          {stamp.label}
                        </span>
                      );
                    })}
                    <span className="text-xs text-[#6E5A4D] font-medium ml-auto">
                      {item.category.name}
                    </span>
                  </div>

                  {/* Tiêu đề & Mô tả */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3A2418] group-hover:text-[#A8412A] transition-colors leading-snug">
                    <Link href={`/solutions/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>

                  {item.shortDescription && (
                    <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D] line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span
                        key={t.slug}
                        className="rounded-xs bg-[#FAF5EB] border border-[#E8DECE] px-2 py-0.5 text-[10px] text-[#6E5A4D] font-medium"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer thẻ: Giá & Các hành động */}
                <div className="mt-5 pt-4 border-t border-[#E8DECE] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6E5A4D] block">
                      Chi phí trọn gói
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-[#A8412A]">
                      {item.priceSummary.label} {item.priceSummary.formattedPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(item)}
                      className={`text-xs px-2.5 py-1.5 rounded-md border transition-all ${
                        isComparing
                          ? 'border-[#A8412A] bg-[#A8412A]/10 text-[#A8412A] font-bold'
                          : 'border-[#D4C3AC] text-[#6E5A4D] hover:border-[#3A2418] hover:text-[#3A2418]'
                      }`}
                      title="Thêm vào khay so sánh giải pháp"
                    >
                      {isComparing ? '✓ Đã so sánh' : '+ So sánh'}
                    </button>

                    <Link
                      href={`/solutions/${item.slug}`}
                      className="btn-ink-primary text-xs py-1.5 px-3.5"
                    >
                      <span>Xem Demo</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Khay so sánh trượt lên khi chọn từ 1 giải pháp trở lên */}
      <ComparisonDrawer
        items={compareItems}
        onRemove={removeCompare}
        onClear={clearCompare}
      />
    </>
  );
}
