'use client';

import React from 'react';
import Link from 'next/link';

export interface ComparisonItem {
  id: string;
  slug: string;
  title: string;
  priceFormatted: string;
  coverImage?: string;
}

interface ComparisonDrawerProps {
  items: ComparisonItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function ComparisonDrawer({
  items,
  onRemove,
  onClear,
}: ComparisonDrawerProps) {
  if (items.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#D4C3AC] bg-[#FFFDF9]/95 backdrop-blur-md shadow-2xl transition-all duration-300 ease-out"
      role="region"
      aria-label="Khay so sánh giải pháp"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#A8412A] text-xs font-bold text-[#FAF5EB]">
            {items.length}
          </span>
          <div>
            <h4 className="font-serif text-sm font-bold text-[#3A2418]">
              Khay so sánh giải pháp website
            </h4>
            <p className="text-xs text-[#6E5A4D]">
              {items.length < 2
                ? 'Chọn thêm ít nhất 1 giải pháp nữa để mở bảng so sánh chi tiết'
                : `Đã chọn ${items.length} giải pháp sẵn sàng đối chiếu thông số & chi phí`}
            </p>
          </div>
        </div>

        {/* Selected Items Previews */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-center gap-2 rounded-md border border-[#E8DECE] bg-[#FAF5EB] px-2.5 py-1.5 text-xs shadow-xs"
            >
              <div className="flex flex-col">
                <span className="max-w-[130px] truncate font-semibold text-[#3A2418]">
                  {item.title}
                </span>
                <span className="text-[11px] font-bold text-[#A8412A]">
                  {item.priceFormatted}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="ml-1 text-[#6E5A4D] hover:text-[#A8412A] text-sm p-0.5"
                title="Bỏ giải pháp này"
                aria-label={`Bỏ ${item.title}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[#6E5A4D] hover:text-[#3A2418] hover:underline px-2 py-1"
          >
            Xóa hết
          </button>
          <Link
            href={`/solutions/${items[0]?.slug}?compare=${items.map((i) => i.slug).join(',')}`}
            className={`btn-ink-primary text-xs py-2 px-4 ${
              items.length < 2 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <span>So sánh chi tiết</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
