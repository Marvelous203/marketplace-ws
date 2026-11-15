'use client';

import React, { useState } from 'react';
import type { LayerCategory, LayerProduct, CurrentOutfitState } from '@/lib/hooks/useOutfitLayers';
import { formatVND } from '@/lib/utils/format';
import { useCart } from '@/lib/hooks/useCart';
import { ProductUploadModal } from '@/components/shop/ProductUploadModal';

interface MixMatchPanelProps {
  outfit: CurrentOutfitState;
  catalog: LayerProduct[];
  onSelectProduct: (product: LayerProduct) => void;
  onClearOutfit: () => void;
  onAddProductToCatalog: (product: LayerProduct) => void;
}

const CATEGORY_TABS: { id: LayerCategory | 'ALL'; label: string; icon: string }[] = [
  { id: 'ALL', label: 'Tất cả', icon: '✨' },
  { id: 'TOP', label: 'Áo (Tops)', icon: '👕' },
  { id: 'BOTTOM', label: 'Quần & Váy', icon: '👖' },
  { id: 'DRESS', label: 'Váy liền', icon: '👗' },
  { id: 'OUTERWEAR', label: 'Áo khoác', icon: '🧥' },
  { id: 'SHOES', label: 'Giày dép', icon: '👠' },
  { id: 'ACCESSORY', label: 'Phụ kiện', icon: '👜' },
];

export function MixMatchPanel({
  outfit,
  catalog,
  onSelectProduct,
  onClearOutfit,
  onAddProductToCatalog,
}: MixMatchPanelProps) {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<LayerCategory | 'ALL'>('ALL');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [addedAllToast, setAddedAllToast] = useState(false);

  // Filter catalog by active tab
  const filteredProducts = catalog.filter((prod) => {
    if (activeTab === 'ALL') return true;
    return prod.category === activeTab;
  });

  // Items currently worn
  const wornItems = Object.values(outfit).filter(Boolean) as LayerProduct[];
  const totalOutfitPrice = wornItems.reduce((sum, item) => sum + item.price, 0);

  // Check if 3+ items worn for 15% discount
  const hasBundleDeal = wornItems.length >= 3;
  const bundleDiscount = hasBundleDeal ? Math.round(totalOutfitPrice * 0.15) : 0;
  const finalPrice = totalOutfitPrice - bundleDiscount;

  const handleAddAllToCart = () => {
    if (wornItems.length === 0) return;

    wornItems.forEach((item) => {
      addItem({
        productId: item.id,
        name: item.name,
        priceVND: hasBundleDeal ? Math.round(item.price * 0.85) : item.price,
        size: 'M',
        color: item.color || 'Standard',
        quantity: 1,
        imageFile: item.thumbnailUrl,
        lookId: 0,
      });
    });

    setAddedAllToast(true);
    setTimeout(() => setAddedAllToast(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/90 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-neutral-100">
      {/* Header with Title & Action */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-serif font-bold tracking-tight">Mix & Match Studio</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Tự do chọn áo, quần, váy, áo khoác, giày dép & phụ kiện
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition shadow-sm cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tải Đồ Mới</span>
        </button>
      </div>

      {/* Category Tabs: Clean pills with smooth scroll */}
      <div className="py-3 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-950 font-semibold shadow-xs ring-2 ring-white/20'
                    : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Clothing Items */}
      <div className="flex-1 overflow-y-auto py-3 pr-1 scrollbar-thin">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredProducts.map((prod) => {
            const isWorn = outfit[prod.category]?.id === prod.id;

            return (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className={`group relative rounded-2xl overflow-hidden border p-2.5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isWorn
                    ? 'border-emerald-400 bg-emerald-950/20 ring-2 ring-emerald-500/40 shadow-lg'
                    : 'border-white/10 bg-neutral-800/50 hover:border-white/30 hover:bg-neutral-800/80'
                }`}
              >
                {/* Worn Badge */}
                {isWorn && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                    <span>Đang mặc</span>
                  </div>
                )}

                {/* Thumbnail */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950/70 flex items-center justify-center">
                  <img
                    src={prod.thumbnailUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="mt-2.5 text-left">
                  <p className="text-xs font-semibold text-neutral-200 truncate" title={prod.name}>
                    {prod.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-white">
                      {formatVND(prod.price)}
                    </span>
                    {prod.color && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                        {prod.color}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary & Cart Action Bar */}
      <div className="pt-3.5 border-t border-white/10 mt-1 space-y-3">
        {/* Price & Discount Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Đang chọn:</span>
            <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
              {wornItems.length} món
            </span>
            {hasBundleDeal && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                -15% trọn bộ
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            {hasBundleDeal && (
              <span className="text-xs line-through text-neutral-500 font-mono">
                {formatVND(totalOutfitPrice)}
              </span>
            )}
            <span className="text-base font-bold text-white">
              {formatVND(finalPrice)}
            </span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClearOutfit}
            disabled={wornItems.length === 0}
            className="px-4 py-2.5 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-400 hover:text-white hover:border-neutral-500 transition disabled:opacity-30 cursor-pointer"
          >
            Bỏ chọn
          </button>

          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={wornItems.length === 0}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
              addedAllToast
                ? 'bg-emerald-500 text-white'
                : wornItems.length === 0
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-white text-neutral-950 hover:bg-neutral-100 hover:shadow-md'
            }`}
          >
            {addedAllToast ? (
              <span>✓ Đã thêm vào giỏ!</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Mua cả set đồ ({wornItems.length} món)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <ProductUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={(newProduct) => {
          onAddProductToCatalog(newProduct);
          onSelectProduct(newProduct);
        }}
      />
    </div>
  );
}
