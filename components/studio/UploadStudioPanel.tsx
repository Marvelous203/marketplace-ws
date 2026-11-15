'use client';

import React, { useState, useRef } from 'react';
import { formatVND } from '@/lib/utils/format';
import { showToast } from './Toast';

type UploadMode = 'piece' | 'outfit';

type PieceType = 'top' | 'bottom' | 'dress' | 'shoes' | 'acc';

interface UploadedPiece {
  id: string;
  name: string;
  type: PieceType;
  thumbnailUrl: string;
  layerUrl: string;
  zIndex: number;
  priceVND: number;
  color?: string;
}

const PIECE_TYPES: { id: PieceType; label: string; zIndex: number }[] = [
  { id: 'top', label: 'Áo (Top)', zIndex: 30 },
  { id: 'bottom', label: 'Quần / Chân váy (Bottom)', zIndex: 20 },
  { id: 'dress', label: 'Đầm / Váy liền (Dress)', zIndex: 25 },
  { id: 'shoes', label: 'Giày / Dép (Shoes)', zIndex: 50 },
  { id: 'acc', label: 'Phụ kiện / Túi (Accessory)', zIndex: 60 },
];

export default function UploadStudioPanel() {
  const [mode, setMode] = useState<UploadMode>('piece');
  const [loading, setLoading] = useState(false);

  // Form State: Piece
  const [pieceName, setPieceName] = useState('');
  const [pieceType, setPieceType] = useState<PieceType>('top');
  const [piecePrice, setPiecePrice] = useState(850000);
  const [pieceColor, setPieceColor] = useState('Đen (Black)');
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [layerFile, setLayerFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [layerPreview, setLayerPreview] = useState<string | null>(null);

  // Form State: Outfit
  const [outfitName, setOutfitName] = useState('');
  const [outfitThumbFile, setOutfitThumbFile] = useState<File | null>(null);
  const [outfitThumbPreview, setOutfitThumbPreview] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(15);
  const [selectedPieceIds, setSelectedPieceIds] = useState<string[]>([
    'p-top-01',
    'p-bot-01',
  ]);

  // List of uploaded items for preview
  const [uploadedPieces, setUploadedPieces] = useState<UploadedPiece[]>([]);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const layerInputRef = useRef<HTMLInputElement>(null);
  const outfitThumbRef = useRef<HTMLInputElement>(null);

  // Handle Piece Thumbnail select
  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbFile(file);
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  // Handle Piece Layer select
  const handleLayerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLayerFile(file);
      setLayerPreview(URL.createObjectURL(file));
    }
  };

  // Handle Outfit Cover select
  const handleOutfitThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOutfitThumbFile(file);
      setOutfitThumbPreview(URL.createObjectURL(file));
    }
  };

  // Submit Scenario A: Upload Piece
  const handleSubmitPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pieceName.trim()) {
      showToast('Vui lòng nhập tên món đồ');
      return;
    }

    setLoading(true);
    const zIndex =
      PIECE_TYPES.find((p) => p.id === pieceType)?.zIndex || 30;

    try {
      const formData = new FormData();
      formData.append('name', pieceName.trim());
      formData.append('type', pieceType);
      formData.append('priceVND', String(piecePrice));
      if (pieceColor) formData.append('color', pieceColor);
      if (thumbFile) formData.append('thumbnail', thumbFile);
      if (layerFile) formData.append('layer', layerFile);

      const res = await fetch('http://localhost:3001/api/products/upload-piece', {
        method: 'POST',
        body: formData,
      });

      let pieceData: UploadedPiece;
      if (res.ok) {
        pieceData = await res.json();
      } else {
        // Fallback local mock object
        pieceData = {
          id: `piece-${Date.now()}`,
          name: pieceName.trim(),
          type: pieceType,
          thumbnailUrl: thumbPreview || '/models/base-character.jpg',
          layerUrl: layerPreview || '/models/base-character.jpg',
          zIndex,
          priceVND: piecePrice,
          color: pieceColor,
        };
      }

      setUploadedPieces((prev) => [pieceData, ...prev]);
      showToast(`Đã tải lên món đồ: ${pieceData.name}`);

      // Reset form
      setPieceName('');
      setThumbFile(null);
      setLayerFile(null);
      setThumbPreview(null);
      setLayerPreview(null);
    } catch {
      // Local fallback for offline mode
      const fallbackPiece: UploadedPiece = {
        id: `piece-${Date.now()}`,
        name: pieceName.trim(),
        type: pieceType,
        thumbnailUrl: thumbPreview || '/models/base-character.jpg',
        layerUrl: layerPreview || '/models/base-character.jpg',
        zIndex,
        priceVND: piecePrice,
        color: pieceColor,
      };
      setUploadedPieces((prev) => [fallbackPiece, ...prev]);
      showToast(`Đã lưu cục bộ: ${fallbackPiece.name}`);
    } finally {
      setLoading(false);
    }
  };

  // Submit Scenario B: Upload Outfit Preset
  const handleSubmitOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfitName.trim()) {
      showToast('Vui lòng nhập tên Outfit');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', outfitName.trim());
      formData.append('pieceIds', JSON.stringify(selectedPieceIds));
      formData.append('discountPercent', String(discountPercent));
      if (outfitThumbFile) formData.append('thumbnail', outfitThumbFile);

      const res = await fetch('http://localhost:3001/api/products/upload-outfit', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await res.json();
      }
      showToast(`Đã lưu Outfit combo: ${outfitName}`);
      setOutfitName('');
      setOutfitThumbFile(null);
      setOutfitThumbPreview(null);
    } catch {
      showToast(`Đã lưu Outfit combo cục bộ: ${outfitName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#fff',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div className="vh">
        <h3>Upload Studio</h3>
        <span>Tải trang phục hoặc outfit mới</span>
      </div>

      {/* Mode Switcher */}
      <div className="opts" style={{ marginBottom: '14px' }}>
        <button
          className={`opt ${mode === 'piece' ? 'on' : ''}`}
          onClick={() => setMode('piece')}
        >
          Kịch bản A: Đồ lẻ (Piece)
        </button>
        <button
          className={`opt ${mode === 'outfit' ? 'on' : ''}`}
          onClick={() => setMode('outfit')}
        >
          Kịch bản B: Set Outfit (Combo)
        </button>
      </div>

      {/* Scenario A: Single Piece Form */}
      {mode === 'piece' && (
        <form onSubmit={handleSubmitPiece} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
              Tên món đồ
            </label>
            <input
              type="text"
              required
              placeholder="VD: Áo Thun Baby Tee Cropped"
              value={pieceName}
              onChange={(e) => setPieceName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
              Phân loại (Type & Auto Z-Index)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {PIECE_TYPES.map((pt) => {
                const isSelected = pieceType === pt.id;
                return (
                  <button
                    type="button"
                    key={pt.id}
                    onClick={() => setPieceType(pt.id)}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)',
                      border: isSelected ? '1px solid #fff' : '1px solid var(--line)',
                      boxShadow: isSelected ? 'var(--glow)' : 'none',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      fontSize: '11px',
                      textAlign: 'left',
                      color: isSelected ? '#fff' : 'var(--ink-2)',
                    }}
                  >
                    {pt.label} <span style={{ opacity: 0.6 }}>· z:{pt.zIndex}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
                Giá VND
              </label>
              <input
                type="number"
                step="50000"
                value={piecePrice}
                onChange={(e) => setPiecePrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--ink-3)', marginTop: '2px', display: 'block' }}>
                {formatVND(piecePrice)}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
                Màu sắc
              </label>
              <input
                type="text"
                placeholder="VD: Trắng / Đen"
                value={pieceColor}
                onChange={(e) => setPieceColor(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* File Uploads: Thumbnail & Layer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {/* Thumbnail 300x300 */}
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
                Ảnh Thumbnail (300×300)
              </label>
              <div
                onClick={() => thumbInputRef.current?.click()}
                style={{
                  height: '84px',
                  border: '1px dashed var(--line)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: thumbPreview ? `url(${thumbPreview}) center/cover no-repeat` : 'rgba(255,255,255,0.04)',
                }}
              >
                {!thumbPreview && <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>+ Chọn ảnh vuông</span>}
              </div>
              <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbSelect} />
            </div>

            {/* Layer 1360x2048 PNG */}
            <div>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
                Layer Trong Suốt (1360×2048)
              </label>
              <div
                onClick={() => layerInputRef.current?.click()}
                style={{
                  height: '84px',
                  border: '1px dashed var(--line)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: layerPreview ? `url(${layerPreview}) center/contain no-repeat` : 'rgba(255,255,255,0.04)',
                }}
              >
                {!layerPreview && <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>+ Chọn PNG layer</span>}
              </div>
              <input ref={layerInputRef} type="file" accept="image/png,image/webp" style={{ display: 'none' }} onChange={handleLayerSelect} />
            </div>
          </div>

          <button
            type="submit"
            className="outl solid"
            disabled={loading}
            style={{
              height: '42px',
              marginTop: '6px',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 600,
            }}
          >
            {loading ? 'Đang tải lên...' : 'Tải Lên Món Đồ Lẻ (Upload Piece)'}
          </button>
        </form>
      )}

      {/* Scenario B: Outfit Preset Form */}
      {mode === 'outfit' && (
        <form onSubmit={handleSubmitOutfit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
              Tên Set Outfit
            </label>
            <input
              type="text"
              required
              placeholder="VD: Summer Streetwear Set"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '4px' }}>
              Ảnh Bìa Set Đồ (Outfit Cover)
            </label>
            <div
              onClick={() => outfitThumbRef.current?.click()}
              style={{
                height: '90px',
                border: '1px dashed var(--line)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: outfitThumbPreview ? `url(${outfitThumbPreview}) center/cover no-repeat` : 'rgba(255,255,255,0.04)',
              }}
            >
              {!outfitThumbPreview && <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>+ Chọn ảnh cover set đồ</span>}
            </div>
            <input ref={outfitThumbRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleOutfitThumbSelect} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-3)', marginBottom: '4px' }}>
              <span>Chiết khấu Combo</span>
              <b style={{ color: '#fff' }}>{discountPercent}% OFF</b>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={discountPercent}
              style={{ '--p': `${((discountPercent - 5) / 25) * 100}%` } as React.CSSProperties}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-3)', display: 'block', marginBottom: '6px' }}>
              Món đồ trong Set (Piece IDs)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['p-top-01', 'p-bot-01', 'p-dress-01', 'p-shoes-01', 'p-acc-01'].map((pid) => {
                const isSelected = selectedPieceIds.includes(pid);
                return (
                  <button
                    type="button"
                    key={pid}
                    onClick={() => {
                      setSelectedPieceIds((prev) =>
                        prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]
                      );
                    }}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                      border: isSelected ? '1px solid #fff' : '1px solid var(--line)',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      color: isSelected ? '#fff' : 'var(--ink-2)',
                    }}
                  >
                    {pid} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="outl solid"
            disabled={loading}
            style={{
              height: '42px',
              marginTop: '6px',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 600,
            }}
          >
            {loading ? 'Đang lưu...' : 'Lưu Set Outfit (Create Outfit Preset)'}
          </button>
        </form>
      )}

      {/* Uploaded History Preview */}
      {uploadedPieces.length > 0 && (
        <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
          <div className="lab" style={{ margin: '0 0 8px' }}>
            Món đồ mới tải lên ({uploadedPieces.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {uploadedPieces.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--line)',
                  fontSize: '12px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: `url(${p.thumbnailUrl}) center/cover no-repeat`,
                    border: '1px solid var(--line)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                    {p.type.toUpperCase()} · z:{p.zIndex} · {formatVND(p.priceVND)}
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Đã chọn mặc thử: ${p.name}`)}
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--line)',
                    background: 'rgba(255,255,255,0.1)',
                  }}
                >
                  Mặc thử
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
