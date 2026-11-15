'use client';

import React from 'react';
import type { CurrentOutfitState, LayerCategory } from '@/lib/hooks/useOutfitLayers';
import { LOOKS, buildImageUrl } from '@/lib/data/looks';

interface LayeredModelViewerProps {
  outfit: CurrentOutfitState;
  baseModelUrl?: string;
  className?: string;
  onLayerClick?: (category: string) => void;
}

/**
 * For seed images (which are full-body captures from the 8 looks),
 * we apply tailored clip paths so that tops only display the torso,
 * bottoms only display waist-to-ankles, outerwear displays jacket, etc.
 * True transparent PNGs uploaded by users (/uploads/) have no clipping.
 */
function getLayerClipStyle(category: LayerCategory, imageUrl?: string): React.CSSProperties {
  if (!imageUrl) return {};
  if (imageUrl.includes('/uploads/')) {
    return { objectFit: 'contain' };
  }

  let clipPath: string | undefined;
  switch (category) {
    case 'TOP':
      // Upper torso (from neckline down to beltline)
      clipPath = 'polygon(0% 12%, 100% 12%, 100% 47%, 0% 47%)';
      break;
    case 'OUTERWEAR':
      // Jacket & blazer (from neckline down to mid-hip)
      clipPath = 'polygon(0% 10%, 100% 10%, 100% 55%, 0% 55%)';
      break;
    case 'BOTTOM':
      // Waistline down to ankles
      clipPath = 'polygon(0% 44%, 100% 44%, 100% 88%, 0% 88%)';
      break;
    case 'DRESS':
      // Neckline down to hemline
      clipPath = 'polygon(0% 12%, 100% 12%, 100% 88%, 0% 88%)';
      break;
    case 'SHOES':
      // Feet & ankles
      clipPath = 'polygon(0% 86%, 100% 86%, 100% 100%, 0% 100%)';
      break;
    case 'ACCESSORY':
      // Upper accessory area
      clipPath = 'polygon(15% 0%, 85% 0%, 85% 35%, 15% 35%)';
      break;
    default:
      clipPath = undefined;
  }

  return {
    clipPath,
    WebkitClipPath: clipPath,
  };
}

export function LayeredModelViewer({
  outfit,
  baseModelUrl,
  className = '',
  onLayerClick,
}: LayeredModelViewerProps) {
  // Use new clean base character model
  const baseImage = baseModelUrl || '/models/base-character.jpg';

  return (
    <div
      className={`relative w-full max-w-[460px] aspect-[2/3] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-900/50 via-neutral-950/80 to-black border border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-md select-none ${className}`}
    >
      {/* Background Studio Glow & Shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.09),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-5" />

      {/* Layer 10: Base Model (underneath) */}
      <img
        src={baseImage}
        alt="Base Model"
        className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-transform duration-500 ease-out pointer-events-none"
        crossOrigin="anonymous"
      />

      {/* Layer 20: Bottoms (Quần / Váy) */}
      {outfit.BOTTOM && (
        <div
          className="absolute inset-0 z-20 transition-all duration-300 animate-in fade-in"
          style={getLayerClipStyle('BOTTOM', outfit.BOTTOM.imageUrl)}
          onClick={() => onLayerClick?.('BOTTOM')}
        >
          <img
            src={outfit.BOTTOM.imageUrl}
            alt={outfit.BOTTOM.name}
            className="w-full h-full object-cover object-top pointer-events-none"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Layer 25: Dresses (Váy liền) */}
      {outfit.DRESS && (
        <div
          className="absolute inset-0 z-[25] transition-all duration-300 animate-in fade-in"
          style={getLayerClipStyle('DRESS', outfit.DRESS.imageUrl)}
          onClick={() => onLayerClick?.('DRESS')}
        >
          <img
            src={outfit.DRESS.imageUrl}
            alt={outfit.DRESS.name}
            className="w-full h-full object-cover object-top pointer-events-none"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Layer 30: Tops (Áo) */}
      {outfit.TOP && (
        <div
          className="absolute inset-0 z-30 transition-all duration-300 animate-in fade-in"
          style={getLayerClipStyle('TOP', outfit.TOP.imageUrl)}
          onClick={() => onLayerClick?.('TOP')}
        >
          <img
            src={outfit.TOP.imageUrl}
            alt={outfit.TOP.name}
            className="w-full h-full object-cover object-top pointer-events-none"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Layer 40: Outerwear (Áo khoác / Blazer) */}
      {outfit.OUTERWEAR && (
        <div
          className="absolute inset-0 z-40 transition-all duration-300 animate-in fade-in"
          style={getLayerClipStyle('OUTERWEAR', outfit.OUTERWEAR.imageUrl)}
          onClick={() => onLayerClick?.('OUTERWEAR')}
        >
          <img
            src={outfit.OUTERWEAR.imageUrl}
            alt={outfit.OUTERWEAR.name}
            className="w-full h-full object-cover object-top pointer-events-none"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Layer 50: Shoes (Giày) */}
      {outfit.SHOES && (
        <div
          className="absolute inset-0 z-50 transition-all duration-300 animate-in fade-in"
          style={getLayerClipStyle('SHOES', outfit.SHOES.imageUrl)}
          onClick={() => onLayerClick?.('SHOES')}
        >
          <img
            src={outfit.SHOES.imageUrl}
            alt={outfit.SHOES.name}
            className="w-full h-full object-cover object-top pointer-events-none"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Layer 60: Accessories (Túi xách / Phụ kiện) */}
      {outfit.ACCESSORY && (
        <div
          className="absolute inset-0 z-60 transition-all duration-300 animate-in fade-in"
          style={getLayerClipStyle('ACCESSORY', outfit.ACCESSORY.imageUrl)}
          onClick={() => onLayerClick?.('ACCESSORY')}
        >
          <img
            src={outfit.ACCESSORY.imageUrl}
            alt={outfit.ACCESSORY.name}
            className="w-full h-full object-cover object-top pointer-events-none"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Top Overlay Tag */}
      <div className="absolute top-4 left-4 z-70 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/70 text-white backdrop-blur-md border border-white/15 shadow-sm">
          Live Mix & Match
        </span>
      </div>

      {/* Bottom Subtle Info */}
      <div className="absolute bottom-4 inset-x-6 z-70 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 drop-shadow">
          VELL Layering Studio
        </span>
        <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 drop-shadow">
          1360 × 2048
        </span>
      </div>
    </div>
  );
}
