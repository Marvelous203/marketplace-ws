'use client';

import { useState, useCallback } from 'react';

export type PieceType = 'top' | 'bottom' | 'dress' | 'shoes' | 'acc';

export interface Piece {
  id: string;
  name: string;
  type: PieceType;
  thumbnailUrl: string;
  layerUrl: string; // Transparent image 1360x2048
  zIndex: number;
  priceVND: number;
  color?: string;
  excludes?: PieceType[];
}

export interface Outfit {
  id: string;
  name: string;
  thumbnailUrl: string;
  pieceIds: string[];
  discountPercent?: number;
  createdAt?: string;
}

// Backward compatibility types
export type LayerCategory = 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY';
export interface LayerProduct {
  id: string;
  name: string;
  category: LayerCategory;
  layerZIndex: number;
  imageUrl: string;
  thumbnailUrl: string;
  price: number;
  color?: string;
  excludes?: LayerCategory[];
}
export type CurrentOutfitState = Partial<Record<LayerCategory, LayerProduct | null>>;

export const TYPE_Z_INDEX: Record<PieceType, number> = {
  bottom: 20,
  dress: 25,
  top: 30,
  shoes: 50,
  acc: 60,
};

export const CATEGORY_Z_INDEX: Record<LayerCategory, number> = {
  BOTTOM: 20,
  DRESS: 25,
  TOP: 30,
  OUTERWEAR: 40,
  SHOES: 50,
  ACCESSORY: 60,
};

// Seed pieces
export const INITIAL_PIECES: Piece[] = [
  {
    id: 'piece-top-1',
    name: 'Ribbed Crop Tank',
    type: 'top',
    zIndex: 30,
    priceVND: 950000,
    color: 'Charcoal',
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=360&q=85',
  },
  {
    id: 'piece-top-2',
    name: 'Half-Zip Sweatshirt',
    type: 'top',
    zIndex: 30,
    priceVND: 1850000,
    color: 'Oat',
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png&w=360&q=85',
  },
  {
    id: 'piece-bot-1',
    name: 'Washed Denim Maxi Skirt',
    type: 'bottom',
    zIndex: 20,
    priceVND: 2400000,
    color: 'Light wash',
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=360&q=85',
  },
  {
    id: 'piece-bot-2',
    name: 'Wide Sweatpants',
    type: 'bottom',
    zIndex: 20,
    priceVND: 1700000,
    color: 'Oat',
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png&w=360&q=85',
  },
  {
    id: 'piece-dre-1',
    name: 'Satin Slip Midi Dress',
    type: 'dress',
    zIndex: 25,
    priceVND: 4500000,
    color: 'Sage',
    excludes: ['top', 'bottom'],
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034735_3d9fb69e-b4e0-49f7-a2d4-e592bd616c27.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034735_3d9fb69e-b4e0-49f7-a2d4-e592bd616c27.png&w=360&q=85',
  },
  {
    id: 'piece-sho-1',
    name: 'Knee-High Leather Boots',
    type: 'shoes',
    zIndex: 50,
    priceVND: 5250000,
    color: 'Black',
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=360&q=85',
  },
  {
    id: 'piece-acc-1',
    name: 'Leather Belt',
    type: 'acc',
    zIndex: 60,
    priceVND: 1050000,
    color: 'Black',
    layerUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=1200&q=85',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=360&q=85',
  },
];

export const INITIAL_OUTFITS: Outfit[] = [
  {
    id: 'outfit-1',
    name: 'Denim Classic Chic',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034542_a6430ecf-9862-412c-8ef6-5745115bd78c.png&w=360&q=85',
    pieceIds: ['piece-top-1', 'piece-bot-1', 'piece-sho-1', 'piece-acc-1'],
    discountPercent: 15,
  },
  {
    id: 'outfit-2',
    name: 'Cloud Lounge Set',
    thumbnailUrl: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261112_034738_73282737-acc8-41e9-a822-96c663e27b6c.png&w=360&q=85',
    pieceIds: ['piece-top-2', 'piece-bot-2'],
    discountPercent: 10,
  },
];

export function useOutfitLayers() {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [outfits, setOutfits] = useState<Outfit[]>(INITIAL_OUTFITS);

  // State lưu trữ trang phục đang mặc theo từng slot (type)
  const [equipped, setEquipped] = useState<Record<PieceType, Piece | null>>({
    top: INITIAL_PIECES[0],
    bottom: INITIAL_PIECES[2],
    dress: null,
    shoes: INITIAL_PIECES[5],
    acc: null,
  });

  // HÀM 1: Mặc Đồ Lẻ (Toggle)
  const equipPiece = useCallback((piece: Piece) => {
    setEquipped((prev) => {
      const isCurrentlyEquipped = prev[piece.type]?.id === piece.id;
      if (isCurrentlyEquipped) {
        return { ...prev, [piece.type]: null };
      }

      const newState = { ...prev, [piece.type]: piece };

      // Logic xung đột (Clipping Rules)
      if (piece.type === 'dress') {
        newState.top = null;
        newState.bottom = null;
      } else if (piece.type === 'top' || piece.type === 'bottom') {
        newState.dress = null;
      }

      if (piece.excludes && piece.excludes.length > 0) {
        piece.excludes.forEach((ex) => {
          newState[ex] = null;
        });
      }

      return newState;
    });
  }, []);

  // HÀM 2: Mặc Nguyên Outfit (Set)
  const equipOutfit = useCallback((outfitPieces: Piece[]) => {
    const newState: Record<PieceType, Piece | null> = {
      top: null,
      bottom: null,
      dress: null,
      shoes: null,
      acc: null,
    };

    outfitPieces.forEach((piece) => {
      newState[piece.type] = piece;
    });

    setEquipped(newState);
  }, []);

  const addPiece = useCallback((piece: Piece) => {
    setPieces((prev) => [piece, ...prev]);
  }, []);

  const addOutfit = useCallback((outfit: Outfit) => {
    setOutfits((prev) => [outfit, ...prev]);
  }, []);

  const clearEquipped = useCallback(() => {
    setEquipped({
      top: null,
      bottom: null,
      dress: null,
      shoes: null,
      acc: null,
    });
  }, []);

  // Backward compatibility adapters for LayerProduct
  const selectProduct = useCallback((product: LayerProduct) => {
    const pType = (product.category.toLowerCase() === 'outerwear'
      ? 'top'
      : product.category.toLowerCase() === 'accessory'
      ? 'acc'
      : product.category.toLowerCase()) as PieceType;

    equipPiece({
      id: product.id,
      name: product.name,
      type: pType,
      thumbnailUrl: product.thumbnailUrl,
      layerUrl: product.imageUrl,
      zIndex: product.layerZIndex,
      priceVND: product.price,
      color: product.color,
    });
  }, [equipPiece]);

  const wornItems = Object.values(equipped).filter(Boolean) as Piece[];
  const totalOutfitPriceVND = wornItems.reduce((sum, item) => sum + item.priceVND, 0);

  return {
    pieces,
    outfits,
    equipped,
    wornItems,
    totalOutfitPriceVND,
    equipPiece,
    equipOutfit,
    addPiece,
    addOutfit,
    clearEquipped,
    // Backward compatibility
    catalog: pieces.map((p) => ({
      id: p.id,
      name: p.name,
      category: (p.type === 'top'
        ? 'TOP'
        : p.type === 'bottom'
        ? 'BOTTOM'
        : p.type === 'dress'
        ? 'DRESS'
        : p.type === 'shoes'
        ? 'SHOES'
        : 'ACCESSORY') as LayerCategory,
      layerZIndex: p.zIndex,
      imageUrl: p.layerUrl,
      thumbnailUrl: p.thumbnailUrl,
      price: p.priceVND,
      color: p.color,
    })),
    outfit: {
      TOP: equipped.top ? {
        id: equipped.top.id,
        name: equipped.top.name,
        category: 'TOP' as LayerCategory,
        layerZIndex: equipped.top.zIndex,
        imageUrl: equipped.top.layerUrl,
        thumbnailUrl: equipped.top.thumbnailUrl,
        price: equipped.top.priceVND,
      } : null,
      BOTTOM: equipped.bottom ? {
        id: equipped.bottom.id,
        name: equipped.bottom.name,
        category: 'BOTTOM' as LayerCategory,
        layerZIndex: equipped.bottom.zIndex,
        imageUrl: equipped.bottom.layerUrl,
        thumbnailUrl: equipped.bottom.thumbnailUrl,
        price: equipped.bottom.priceVND,
      } : null,
      DRESS: equipped.dress ? {
        id: equipped.dress.id,
        name: equipped.dress.name,
        category: 'DRESS' as LayerCategory,
        layerZIndex: equipped.dress.zIndex,
        imageUrl: equipped.dress.layerUrl,
        thumbnailUrl: equipped.dress.thumbnailUrl,
        price: equipped.dress.priceVND,
      } : null,
      OUTERWEAR: null,
      SHOES: equipped.shoes ? {
        id: equipped.shoes.id,
        name: equipped.shoes.name,
        category: 'SHOES' as LayerCategory,
        layerZIndex: equipped.shoes.zIndex,
        imageUrl: equipped.shoes.layerUrl,
        thumbnailUrl: equipped.shoes.thumbnailUrl,
        price: equipped.shoes.priceVND,
      } : null,
      ACCESSORY: equipped.acc ? {
        id: equipped.acc.id,
        name: equipped.acc.name,
        category: 'ACCESSORY' as LayerCategory,
        layerZIndex: equipped.acc.zIndex,
        imageUrl: equipped.acc.layerUrl,
        thumbnailUrl: equipped.acc.thumbnailUrl,
        price: equipped.acc.priceVND,
      } : null,
    },
    selectProduct,
    clearOutfit: clearEquipped,
    addProductToCatalog: (lp: LayerProduct) => {
      const pType = (lp.category.toLowerCase() === 'outerwear'
        ? 'top'
        : lp.category.toLowerCase() === 'accessory'
        ? 'acc'
        : lp.category.toLowerCase()) as PieceType;
      addPiece({
        id: lp.id,
        name: lp.name,
        type: pType,
        thumbnailUrl: lp.thumbnailUrl,
        layerUrl: lp.imageUrl,
        zIndex: lp.layerZIndex,
        priceVND: lp.price,
        color: lp.color,
      });
    },
  };
}
