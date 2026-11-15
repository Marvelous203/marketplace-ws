'use client';

import React, { useState, useRef } from 'react';
import type { LayerCategory, LayerProduct } from '@/lib/hooks/useOutfitLayers';
import { CATEGORY_Z_INDEX } from '@/lib/hooks/useOutfitLayers';

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: LayerProduct) => void;
}

const CATEGORIES: { id: LayerCategory; label: string }[] = [
  { id: 'TOP', label: 'Tops (Áo thun / Sơ mi / Tank)' },
  { id: 'BOTTOM', label: 'Bottoms (Quần / Chân váy)' },
  { id: 'DRESS', label: 'Dresses (Váy liền / Đầm)' },
  { id: 'OUTERWEAR', label: 'Outerwear (Áo khoác / Blazer)' },
  { id: 'SHOES', label: 'Shoes (Giày dép / Boots)' },
  { id: 'ACCESSORY', label: 'Accessories (Phụ kiện / Túi xách)' },
];

export function ProductUploadModal({ isOpen, onClose, onSuccess }: ProductUploadModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<LayerCategory>('TOP');
  const [priceVND, setPriceVND] = useState(950000);
  const [color, setColor] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên món đồ');
      return;
    }
    if (!imageFile) {
      setError('Vui lòng tải lên file ảnh lớp trong suốt (Transparent PNG/WebP)');
      return;
    }

    setLoading(true);
    setError(null);

    const layerZIndex = CATEGORY_Z_INDEX[category];

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', category);
      formData.append('layerZIndex', String(layerZIndex));
      formData.append('priceVND', String(priceVND));
      if (color.trim()) formData.append('color', color.trim());
      formData.append('image', imageFile);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else {
        // Fallback: use main image as thumbnail too
        formData.append('thumbnail', imageFile);
      }

      let newProduct: LayerProduct;

      try {
        const response = await fetch('http://localhost:3001/api/products/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          newProduct = {
            id: data.id || `up-${Date.now()}`,
            name: data.name || name,
            category: (data.category as LayerCategory) || category,
            layerZIndex: data.layerZIndex || layerZIndex,
            imageUrl: data.imageUrl.startsWith('http')
              ? data.imageUrl
              : `http://localhost:3001${data.imageUrl}`,
            thumbnailUrl: data.thumbnailUrl
              ? data.thumbnailUrl.startsWith('http')
                ? data.thumbnailUrl
                : `http://localhost:3001${data.thumbnailUrl}`
              : imagePreview!,
            price: Number(data.priceVND || data.price || priceVND),
            color: data.color || color,
            excludes: category === 'DRESS' ? ['TOP', 'BOTTOM'] : undefined,
          };
        } else {
          throw new Error('Upload failed on server');
        }
      } catch (backendErr) {
        console.warn('Backend upload API offline or failed, using local blob asset:', backendErr);
        // Fallback for instant client-side testing
        newProduct = {
          id: `local-up-${Date.now()}`,
          name: name.trim(),
          category,
          layerZIndex,
          imageUrl: imagePreview!,
          thumbnailUrl: thumbnailPreview || imagePreview!,
          price: Number(priceVND),
          color: color.trim() || undefined,
          excludes: category === 'DRESS' ? ['TOP', 'BOTTOM'] : undefined,
        };
      }

      onSuccess(newProduct);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi tải lên';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-serif font-bold tracking-tight">Tải Lên Món Đồ Mới (Custom Layer)</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ghép trang phục tức thì vào người mẫu trên Canvas Dynamic Layering
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Tên món đồ *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cropped Denim Vest"
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Phân loại (Category) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LayerCategory)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Giá bán (VND) *</label>
              <input
                type="number"
                min="0"
                step="50000"
                value={priceVND}
                onChange={(e) => setPriceVND(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Màu sắc</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="VD: Vintage Blue, Indigo"
                className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Main Transparent PNG */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Ảnh layer trong suốt * (1360×2048)
              </label>
              <input
                type="file"
                ref={imageInputRef}
                accept="image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <div
                onClick={() => imageInputRef.current?.click()}
                className="h-28 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 bg-neutral-800/40 flex flex-col items-center justify-center p-2 cursor-pointer transition overflow-hidden text-center"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-24 object-contain"
                  />
                ) : (
                  <div className="text-neutral-400 text-center">
                    <svg className="w-6 h-6 mx-auto mb-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[11px]">Chọn file PNG trong suốt</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Thumbnail Menu (360×360)
              </label>
              <input
                type="file"
                ref={thumbInputRef}
                accept="image/png,image/jpeg,image/webp"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <div
                onClick={() => thumbInputRef.current?.click()}
                className="h-28 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 bg-neutral-800/40 flex flex-col items-center justify-center p-2 cursor-pointer transition overflow-hidden text-center"
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumb Preview"
                    className="max-h-24 object-contain"
                  />
                ) : (
                  <div className="text-neutral-400 text-center">
                    <svg className="w-6 h-6 mx-auto mb-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-[11px]">Tùy chọn (Tự sinh từ ảnh gốc)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-white text-neutral-900 font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Đang tải lên...' : 'Thêm & Mặc Thử Ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
