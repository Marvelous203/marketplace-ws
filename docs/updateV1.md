
# Kiến trúc Hệ thống Phối đồ Tùy chọn (Mix & Match Studio)

Tài liệu này hướng dẫn chi tiết về mặt kiến trúc phần mềm, cấu hình cơ sở dữ liệu (NestJS Backend) và kỹ thuật hiển thị giao diện (Next.js Frontend) để chuyển đổi từ cơ chế render ảnh nguyên bộ đồ (Pre-rendered single outfit) sang mô hình **Ghép lớp hình ảnh động (Dynamic Layering System)**.

---

## 1. Nguyên lý Cốt lõi & Chuẩn hóa Canvas Image

Để các món đồ rời (Áo, Quần, Áo khoác, Giày, Túi xách...) có thể khớp chuẩn xác lên cơ thể người mẫu khi thay đổi linh hoạt, hệ thống **bắt buộc** phải tuân theo chuẩn hóa hình ảnh sau:

1. **Cùng Kích thước Canvas:** Toàn bộ file ảnh của từng sản phẩm rời phải được export trên cùng một kích thước khung hình chuẩn (Ví dụ: `1360 x 2048 px`).
2. **Cố định Tọa độ (Registration Point):** Người mẫu sử dụng một tư thế cố định (Pose). Tọa độ của từng chiếc áo, chiếc quần trong file ảnh riêng lẻ phải trùng khớp hoàn toàn với vị trí trên cơ thể của người mẫu gốc.
3. **Định dạng:** Định dạng ảnh bắt buộc phải hỗ trợ kênh alpha (Transparency) như **PNG** hoặc **WebP**.

---

## 2. Hệ thống Z-Index & Phân tầng Layer (Frontend Layout)

Khung hiển thị nhân vật không còn là một thẻ `<img />` đơn lẻ mà là một container chứa nhiều lớp lớp ảnh chồng lên nhau (`position: absolute`).

### Bảng phân tầng Z-Index chuẩn:

| Layer                 | Danh mục (Category)    | Z-Index | Mô tả                                      |
| :-------------------- | :---------------------- | :------ | :------------------------------------------- |
| **Base**        | Người mẫu            | `10`  | Body trần, khuôn mặt, kiểu tóc cơ bản |
| **Bottoms**     | Quần / Váy            | `20`  | Quần jean, quần tây, chân váy           |
| **Tops**        | Áo thun / Sơ mi       | `30`  | Áo mặc bên trong                          |
| **Outerwear**   | Áo khoác              | `40`  | Blazer, áo khoác denim, cardigan           |
| **Shoes**       | Giày dép              | `50`  | Giày cao gót, sneakers, boots              |
| **Accessories** | Túi xách / Phụ kiện | `60`  | Túi xách, dây chuyền, mắt kính         |

### CSS Tham khảo:

```css
.model-container {
  position: relative;
  width: 440px;
  height: 663px;
  overflow: hidden;
}

.model-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* Định nghĩa theo Z-Index */
.layer-base      { z-index: 10; }
.layer-bottoms   { z-index: 20; }
.layer-tops      { z-index: 30; }
.layer-outerwear { z-index: 40; }
.layer-shoes     { z-index: 50; }
.layer-acc       { z-index: 60; }
```

---

## 3. Schema Cơ sở Dữ liệu (Prisma / PostgreSQL)

Mỗi món đồ rời cần lưu giữ các thông tin metadata để Frontend nhận biết được danh mục và vị trí tầng layer khi render.

```prisma
enum Category {
  TOP
  BOTTOM
  DRESS
  OUTERWEAR
  SHOES
  ACCESSORY
}

model Product {
  id           String    @id @default(uuid())
  name         String    // Ví dụ: "Ribbed Crop Tank"
  category     Category
  layerZIndex  Int       // Giá trị Z-index tương ứng (ví dụ: 30)
  imageUrl     String    // Đường dẫn ảnh Transparent PNG/WebP (1360x2048)
  thumbnailUrl String    // Đường dẫn ảnh icon hiển thị ở menu chọn đồ (360x360)
  price        Decimal   @db.Decimal(10, 2)
  color        String?   // "Charcoal", "White", etc.
  
  // Danh sách các loại sản phẩm sẽ tự động bị gỡ ra khi mặc món này (Logic Exclude)
  excludes     Category[] @default([])

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

---

## 4. Xử lý Backend Upload (NestJS)

Backend cần chấp nhận 2 file khi upload một sản phẩm thời trang:

1. `image`: Ảnh tách lớp trong suốt kích thước chuẩn.
2. `thumbnail`: Ảnh thu nhỏ phục vụ menu chọn đồ.

### DTO (Data Transfer Object)

```typescript
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(Category)
  category: Category;

  @IsNumber()
  layerZIndex: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  color?: string;
}
```

### Controller Upload Example:

```typescript
@Post('upload')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
)
async uploadProduct(
  @UploadedFiles() files: { image?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  @Body() dto: CreateProductDto,
) {
  return this.productsService.createProduct(dto, files.image[0], files.thumbnail[0]);
}
```

---

## 5. Quản lý State & Logic Render phía Next.js

### State Management:

```typescript
export interface CurrentOutfitState {
  TOP?: Product | null;
  BOTTOM?: Product | null;
  DRESS?: Product | null;
  OUTERWEAR?: Product | null;
  SHOES?: Product | null;
  ACCESSORY?: Product | null;
}

const [outfit, setOutfit] = useState<CurrentOutfitState>({
  TOP: null,
  BOTTOM: null,
  DRESS: null,
  OUTERWEAR: null,
  SHOES: null,
  ACCESSORY: null,
});
```

### Logic Xử lý Xung đột Trang phục (Clipping / Excludes Logic):

Khi người dùng chọn một món đồ (ví dụ: Váy liền thân `DRESS`), hệ thống phải tự động gỡ các món đồ thuộc loại `TOP` và `BOTTOM` ra khỏi người mẫu.

```typescript
const selectProduct = (product: Product) => {
  setOutfit((prev) => {
    const nextState = { ...prev };

    // 1. Kiểm tra nếu món đồ này bị loại trừ bởi các thuộc tính excludes
    if (product.excludes && product.excludes.length > 0) {
      product.excludes.forEach((catToExclude) => {
        nextState[catToExclude] = null;
      });
    }

    // 2. Nếu chọn DRESS, tự động loại bỏ TOP và BOTTOM
    if (product.category === 'DRESS') {
      nextState.TOP = null;
      nextState.BOTTOM = null;
    }

    // 3. Nếu chọn TOP hoặc BOTTOM, tự động gỡ DRESS ra
    if (product.category === 'TOP' || product.category === 'BOTTOM') {
      nextState.DRESS = null;
    }

    // Toggle: Nếu bấm lại chính món đang mặc thì tháo ra, ngược lại thì thay món mới
    nextState[product.category] =
      prev[product.category]?.id === product.id ? null : product;

    return nextState;
  });
};
```

### Render Component:

```tsx
<div className="model-container">
  {/* Base Layer: Người mẫu gốc */}
  <img src="/models/base-model.webp" className="model-layer layer-base" alt="Model Base" />

  {/* Các tầng phục trang ghép động */}
  {outfit.BOTTOM && (
    <img src={outfit.BOTTOM.imageUrl} className="model-layer layer-bottoms" alt={outfit.BOTTOM.name} />
  )}
  {outfit.DRESS && (
    <img src={outfit.DRESS.imageUrl} className="model-layer layer-bottoms" alt={outfit.DRESS.name} />
  )}
  {outfit.TOP && (
    <img src={outfit.TOP.imageUrl} className="model-layer layer-tops" alt={outfit.TOP.name} />
  )}
  {outfit.OUTERWEAR && (
    <img src={outfit.OUTERWEAR.imageUrl} className="model-layer layer-outerwear" alt={outfit.OUTERWEAR.name} />
  )}
  {outfit.SHOES && (
    <img src={outfit.SHOES.imageUrl} className="model-layer layer-shoes" alt={outfit.SHOES.name} />
  )}
  {outfit.ACCESSORY && (
    <img src={outfit.ACCESSORY.imageUrl} className="model-layer layer-acc" alt={outfit.ACCESSORY.name} />
  )}
</div>
```

---

## 6. Tóm tắt Luồng Hoạt động (Workflow)

```
[Admin Portal] --(Upload 2 file & Metadata)--> [NestJS API] --(Save File & DB)--> [S3 / PostgreSQL]
                                                                                        |
[Next.js App] <--(Fetch Catalog List & Asset URLs)--------------------------------------+
      |
[User Mix & Match] --(Click Item)--> [Trigger Logic Excludes] --(Update React State)--> [Render Layer Stacked]
```
