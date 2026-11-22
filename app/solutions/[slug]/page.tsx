import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import MarketplaceNavbar from '@/components/marketplace/Navbar';
import OfferSelectorClient from '@/components/marketplace/OfferSelectorClient';
import { fetchListingBySlug } from '@/lib/api/marketplace';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await fetchListingBySlug(slug);
  if (!listing) return { title: 'Không tìm thấy giải pháp | Phố Nghề' };

  return {
    title: `${listing.title} — Chi tiết & Bóc tách Gói Triển Khai | Phố Nghề`,
    description: listing.shortDescription,
  };
}

async function SolutionDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const listing = await fetchListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const primaryImage =
    listing.gallery.find((g) => g.isPrimary) || listing.gallery[0];

  // Chú thích đánh số minh họa trực quan trên ảnh demo
  const demoCallouts = [
    { num: 1, title: 'Thực đơn & Giỏ gọi món', desc: 'Tối ưu hình ảnh, phân loại danh mục món ăn mượt mà' },
    { num: 2, title: 'Form Đặt bàn & Giữ chỗ', desc: 'Chọn ngày giờ, số lượng khách và nhận xác nhận tự động' },
    { num: 3, title: 'Thực đơn điện tử mã QR', desc: 'Quét tại bàn xem món trên điện thoại không cần cài app' },
    { num: 4, title: 'Chỉ đường & Gọi nhanh', desc: 'Tích hợp Google Maps và nút liên hệ Zalo / Hotline' },
  ];

  return (
    <>
      {/* Breadcrumb Phố nghề */}
      <nav className="border-b border-[#E8DECE] bg-[#FFFDF9] px-4 py-3 sm:px-6 lg:px-8" aria-label="Đường dẫn">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-[#6E5A4D]">
          <Link href="/" className="hover:text-[#A8412A]">
            Phố Nghề
          </Link>
          <span>/</span>
          <Link
            href={`/marketplace?category=${listing.category.slug}`}
            className="hover:text-[#A8412A]"
          >
            {listing.category.name}
          </Link>
          <span>/</span>
          <span className="truncate font-semibold text-[#3A2418]">
            {listing.title}
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TIÊU ĐỀ GIẢI PHÁP & HUY HIỆU */}
        <div className="pb-8 border-b border-[#E8DECE]">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="stamp-tag text-[#2F6F73] border-[#2F6F73]">
              {listing.category.name}
            </span>
            <span className="chop-seal">DEMO ĐÃ KIỂM</span>
            <span className="chop-seal-green">SELLER XÁC MINH</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-[#3A2418] leading-tight">
            {listing.title}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#6E5A4D] max-w-3xl leading-relaxed">
            {listing.shortDescription}
          </p>
        </div>

        {/* 1. KHUNG DEMO ĐẶT ĐẦU TIÊN (LỚN & TRỰC QUAN) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#A8412A]">
                KHUNG XEM TRƯỚC
              </span>
              <span className="font-serif text-base font-bold text-[#3A2418]">
                Bản xem thử giao diện thực tế
              </span>
            </div>
            <a
              href={`https://preview.webmarket.vn/${listing.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#A8412A] hover:underline inline-flex items-center gap-1"
            >
              <span>Mở tab xem toàn màn hình</span>
              <span>↗</span>
            </a>
          </div>

          {/* Device Frame lớn với thanh URL browser */}
          <div className="device-frame">
            <div className="device-bar flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="device-dot bg-[#A8412A]"></span>
                <span className="device-dot bg-[#E0A526]"></span>
                <span className="device-dot bg-[#2F6F73]"></span>
              </div>
              <div className="rounded-xs bg-[#FAF5EB] border border-[#E8DECE] px-4 py-0.5 text-center">
                <span className="font-mono text-xs text-[#6E5A4D]">
                  https://preview.webmarket.vn/{listing.slug}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#6E5A4D]">
                Tốc độ: 0.8s
              </div>
            </div>

            {/* Container ảnh Demo với các điểm chú thích đánh số */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#FAF5EB]">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.altText || listing.title}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#6E5A4D]">
                  Chưa có ảnh demo
                </div>
              )}

              {/* Các điểm chú thích đánh số (Annotated callout pins) */}
              <div className="absolute top-[20%] left-[15%] group/pin cursor-pointer">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A8412A] font-serif text-xs font-bold text-[#FAF5EB] shadow-lg ring-2 ring-[#FAF5EB] animate-pulse">
                  1
                </span>
                <div className="absolute left-8 top-0 hidden w-48 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-2.5 text-xs text-[#3A2418] shadow-md group-hover/pin:block z-20">
                  <span className="font-bold block text-[#A8412A]">① {demoCallouts[0].title}</span>
                  <span className="text-[11px] text-[#6E5A4D]">{demoCallouts[0].desc}</span>
                </div>
              </div>

              <div className="absolute top-[40%] right-[25%] group/pin cursor-pointer">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A8412A] font-serif text-xs font-bold text-[#FAF5EB] shadow-lg ring-2 ring-[#FAF5EB]">
                  2
                </span>
                <div className="absolute right-8 top-0 hidden w-48 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-2.5 text-xs text-[#3A2418] shadow-md group-hover/pin:block z-20">
                  <span className="font-bold block text-[#A8412A]">② {demoCallouts[1].title}</span>
                  <span className="text-[11px] text-[#6E5A4D]">{demoCallouts[1].desc}</span>
                </div>
              </div>

              <div className="absolute bottom-[25%] left-[30%] group/pin cursor-pointer">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A8412A] font-serif text-xs font-bold text-[#FAF5EB] shadow-lg ring-2 ring-[#FAF5EB]">
                  3
                </span>
                <div className="absolute left-8 bottom-0 hidden w-48 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-2.5 text-xs text-[#3A2418] shadow-md group-hover/pin:block z-20">
                  <span className="font-bold block text-[#A8412A]">③ {demoCallouts[2].title}</span>
                  <span className="text-[11px] text-[#6E5A4D]">{demoCallouts[2].desc}</span>
                </div>
              </div>

              <div className="absolute bottom-[20%] right-[15%] group/pin cursor-pointer">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A8412A] font-serif text-xs font-bold text-[#FAF5EB] shadow-lg ring-2 ring-[#FAF5EB]">
                  4
                </span>
                <div className="absolute right-8 bottom-0 hidden w-48 rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-2.5 text-xs text-[#3A2418] shadow-md group-hover/pin:block z-20">
                  <span className="font-bold block text-[#A8412A]">④ {demoCallouts[3].title}</span>
                  <span className="text-[11px] text-[#6E5A4D]">{demoCallouts[3].desc}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dải giải thích các điểm đánh số tương ứng với tính năng */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {demoCallouts.map((c) => (
              <div
                key={c.num}
                className="flex items-start gap-2.5 rounded-lg border border-[#E8DECE] bg-[#FFFDF9] p-3 text-xs"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A8412A] font-serif text-[11px] font-bold text-[#FAF5EB] shrink-0 mt-0.5">
                  {c.num}
                </span>
                <div>
                  <h4 className="font-serif font-bold text-[#3A2418]">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-[#6E5A4D] mt-0.5">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. BỐ CỤC CHÍNH: NỘI DUNG (8 COLS) + CỘT THÔNG SỐ CỐ ĐỊNH (4 COLS) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: CÁC GÓI OFFERS (TAB) & CHI TIẾT TÍNH NĂNG (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Bộ chọn Gói Thương mại dạng TAB */}
            <OfferSelectorClient
              offers={listing.offers}
              listingSlug={listing.slug}
              listingTitle={listing.title}
            />

            {/* Danh sách Tính năng Kỹ thuật chuẩn mực */}
            <div className="rounded-xl border border-[#E8DECE] bg-[#FFFDF9] p-6 shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[#3A2418] mb-4">
                Đặc Tính & Chuẩn Mực Kỹ Thuật
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.features.map((feat) => (
                  <div
                    key={feat.key}
                    className="flex items-start gap-3 rounded-lg border border-[#E8DECE] bg-[#FAF5EB] p-3.5"
                  >
                    <span className="text-[#2F6F73] font-bold text-sm">✓</span>
                    <div>
                      <h4 className="font-serif text-xs font-bold text-[#3A2418]">
                        {feat.label}
                      </h4>
                      <p className="text-[11px] text-[#6E5A4D] mt-0.5">
                        {String(feat.value)}
                      </p>
                      <span className="mt-1 inline-block font-mono text-[10px] text-[#6E5A4D] bg-[#FFFDF9] px-1.5 py-0.5 rounded-xs border border-[#E8DECE]">
                        {feat.key}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CỘT THÔNG SỐ CỐ ĐỊNH (STICKY SIDEBAR SPECS - 4 cols) */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Hộp Thông số Kỹ thuật & Bàn giao */}
            <div className="rounded-xl border border-[#E8DECE] bg-[#FFFDF9] p-5 shadow-xs">
              <h4 className="font-serif text-base font-bold text-[#3A2418] pb-3 border-b border-[#E8DECE] flex items-center justify-between">
                <span>Thông số Bàn giao</span>
                <span className="chop-seal">CHÍNH HÃNG</span>
              </h4>

              <dl className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#FAF5EB]">
                  <dt className="text-[#6E5A4D]">Thời gian bàn giao:</dt>
                  <dd className="font-bold text-[#3A2418]">2 – 3 ngày làm việc</dd>
                </div>

                <div className="flex justify-between py-1 border-b border-[#FAF5EB]">
                  <dt className="text-[#6E5A4D]">Công nghệ sử dụng:</dt>
                  <dd className="font-bold text-[#3A2418]">Next.js 16 + NestJS</dd>
                </div>

                <div className="flex justify-between py-1 border-b border-[#FAF5EB]">
                  <dt className="text-[#6E5A4D]">Hiệu năng Lighthouse:</dt>
                  <dd className="font-bold text-[#2F6F73]">98 / 100 (Google)</dd>
                </div>

                <div className="flex justify-between py-1 border-b border-[#FAF5EB]">
                  <dt className="text-[#6E5A4D]">Bảo hành kỹ thuật:</dt>
                  <dd className="font-bold text-[#3A2418]">12 tháng miễn phí</dd>
                </div>

                <div className="flex justify-between py-1">
                  <dt className="text-[#6E5A4D]">Đơn vị phát triển:</dt>
                  <dd className="font-bold text-[#A8412A]">
                    {listing.seller.name}
                  </dd>
                </div>
              </dl>

              {/* Cam kết ba không */}
              <div className="mt-5 pt-4 border-t border-[#E8DECE] space-y-2 text-[11px] text-[#6E5A4D]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#2F6F73] font-bold">✓</span>
                  <span>Bàn giao toàn bộ quyền quản trị</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#2F6F73] font-bold">✓</span>
                  <span>Không phí duy trì ẩn, giá bất biến</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#2F6F73] font-bold">✓</span>
                  <span>Hướng dẫn quản trị 1-kèm-1</span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="mt-6 space-y-2.5">
                <Link
                  href={`/request-project?listing=${listing.slug}`}
                  className="btn-ink-primary w-full text-center text-xs py-2.5"
                >
                  Nhờ tư vấn giải pháp này →
                </Link>
                <Link
                  href="/marketplace"
                  className="btn-ink-secondary w-full text-center text-xs py-2"
                >
                  ← Trở lại danh mục giải pháp
                </Link>
              </div>
            </div>

            {/* Thông tin Seller xác minh */}
            <div className="rounded-xl border border-[#E8DECE] bg-[#FAF5EB] p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-[#D4C3AC] bg-[#FFFDF9] flex items-center justify-center font-serif text-base font-bold text-[#3A2418]">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#3A2418]">
                    {listing.seller.name}
                  </h4>
                  <span className="chop-seal-green text-[10px]">
                    SELLER ĐÃ XÁC MINH
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#6E5A4D] leading-relaxed">
                Đơn vị đối tác đã xác thực danh tính doanh nghiệp và năng lực lập trình trên nền tảng Phố Nghề.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#A8412A] border-t-transparent"></div>
              <p className="mt-4 font-serif text-sm text-[#6E5A4D]">
                Đang tải thông tin giải pháp...
              </p>
            </div>
          }
        >
          <SolutionDetailContent paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}
