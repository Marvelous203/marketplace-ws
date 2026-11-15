
2. Cấu trúc Dữ liệu (Database / State)
   TypeScript
   // 1. Dữ liệu Món đồ lẻ
   interface Piece {
   id: string;
   type: 'top' | 'bottom' | 'dress' | 'shoes' | 'acc';
   thumbnailUrl: string;
   layerUrl: string; // Ảnh trong suốt 1360x2048
   zIndex: number;
   }

// 2. Dữ liệu Outfit (Preset)
interface Outfit {
  id: string;
  name: string;
  thumbnailUrl: string; // Ảnh nguyên set để hiện ở menu
  pieceIds: string[];   // Chỉ lưu mảng ID các món đồ: ['ao-caro-1', 'quan-jean-2', 'giay-3']
}
3. Xử lý Logic Code trên Next.js (React State)
Tạo một State Object (Dictionary) để quản lý từng lớp (layer) trang phục.

TypeScript
import { useState } from 'react';

export default function StylingStudio() {
  // State lưu trữ trang phục đang mặc theo từng phân loại (slot)
  const [equipped, setEquipped] = useState<Record<string, Piece | null>>({
    top: null,
    bottom: null,
    dress: null,
    shoes: null,
    acc: null,
  });

  // HÀM 1: Mặc Đồ Lẻ
  const equipPiece = (piece: Piece) => {
    setEquipped((prev) => {
      const newState = { ...prev, [piece.type]: piece };

      // Logic xung đột (Clipping Rules)
      if (piece.type === 'dress') {
        newState.top = null;
        newState.bottom = null;
      } else if (piece.type === 'top' || piece.type === 'bottom') {
        newState.dress = null;
      }

      return newState;
    });
  };

  // HÀM 2: Mặc Nguyên Outfit (Set)
  // Nhận vào danh sách các Pieces đã được query từ mảng outfit.pieceIds
  const equipOutfit = (outfitPieces: Piece[]) => {
    const newState = {
      top: null, bottom: null, dress: null, shoes: null, acc: null
    };

    // Gắn từng món trong set vào đúng slot của nó
    outfitPieces.forEach(piece => {
      newState[piece.type] = piece;
    });

    setEquipped(newState);
  };

  return (
    



      {/* KHỐI RENDER NHÂN VẬT (TRÁI) 

*/}
      
        {/* Layer 0: Nhân vật Base */}
        <img 
          src="/base-character.webp" 
          className="absolute inset-0 w-full h-full object-contain z-0" 
        />

        {/* Layer 1 -> N: Render các món đồ đang mặc dựa theo Z-Index */}
        {Object.values(equipped).map((piece) => {
          if (!piece) return null;
          return (
            <img
              key={piece.id}
              src={piece.layerUrl}
              style={{ zIndex: piece.zIndex }}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            />
          );
        })}
      

      {/* KHỐI ĐIỀU KHIỂN MENU (PHẢI) */}
      *


 *);
}
Tại sao cách tiếp cận này tối ưu nhất?*

Dung lượng siêu nhẹ: Bạn không bị trùng lặp ảnh. Mặc Outfit thực chất chỉ là hành động vòng lặp forEach gán nhiều layerUrl cùng một lúc.

Tương tác linh hoạt: Người dùng có thể click vào Outfit số 1 (gồm áo sơ mi caro + quần jean). Ngay sau đó, họ click sang tab "Tops" và chọn một cái áo thun trắng. Hàm equipPiece sẽ tự động ghi đè cái áo thun trắng lên slot top, giữ nguyên cái quần jean, tạo ra một set đồ custom hoàn hảo mà không cần viết thêm code phức tạp.
