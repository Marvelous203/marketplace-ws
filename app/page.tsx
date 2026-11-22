import Link from 'next/link';
import { Suspense } from 'react';
import MarketplaceNavbar from '@/components/marketplace/Navbar';
import MadLibsHero from '@/components/marketplace/MadLibsHero';
import PictureWallSolutions, { ListingItemData } from '@/components/marketplace/PictureWallSolutions';
import ScrollytellingSection from '@/components/marketplace/ScrollytellingSection';
import {
  fetchCategories,
  fetchListings,
  fetchForumThreads,
} from '@/lib/api/marketplace';

export const metadata = {
  title: 'Phố Nghề — Sàn Giải pháp Website Tiêu chuẩn & Diễn đàn Kỹ thuật',
  description:
    'Sàn giải pháp website phong cách Phố nghề: Mua bản quyền mã nguồn, thuê trọn gói hoặc thuê bao Cloud SaaS. Bóc tách phạm vi minh bạch, giá bất biến, demo đã kiểm.',
};

async function HomePageContent() {
  const [categories, listingsResult, forumResult] = await Promise.all([
    fetchCategories(),
    fetchListings({ limit: 6 }),
    fetchForumThreads({ limit: 6 }),
  ]);

  const listings: ListingItemData[] = listingsResult.items as ListingItemData[];
  const threads = forumResult.items;
  const wantedThreads = threads.filter((t) => t.threadType === 'WANTED');

  // Danh mục phong cách Mục lục Phố nghề
  const streetDirectory = [
    {
      id: 'cat-food',
      name: 'Phố Ẩm Thực & Cafe',
      slug: 'food-beverage',
      icon: '🏮',
      desc: 'Website nhà hàng, cafe, quán ăn cao cấp, thực đơn QR & đặt bàn trực tuyến.',
      count: '12 giải pháp',
    },
    {
      id: 'cat-fashion',
      name: 'Phố May Mặc & Thời Trang',
      slug: 'fashion-apparel',
      icon: '🧵',
      desc: 'Cửa hàng trực tuyến, lookbook bộ sưu tập, chọn phân loại size/màu mượt mà.',
      count: '8 giải pháp',
    },
    {
      id: 'cat-health',
      name: 'Phố Y Dược & Sức Khỏe',
      slug: 'healthcare',
      icon: '🌿',
      desc: 'Hệ thống phòng khám đa khoa, nha khoa, spa thẩm mỹ & đặt lịch khám chuyên gia.',
      count: '6 giải pháp',
    },
    {
      id: 'cat-corp',
      name: 'Phố Doanh Nghiệp & Kiến Trúc',
      slug: 'corporate',
      icon: '📐',
      desc: 'Trang giới thiệu công ty, hồ sơ năng lực, trình diễn dự án bất động sản & nội thất.',
      count: '10 giải pháp',
    },
  ];

  return (
    <>
      {/* 1. HERO TƯƠNG TÁC ĐIỀN CHỖ TRỐNG (MAD LIBS HERO) */}
      <MadLibsHero />

      {/* 2. MỤC LỤC LỚN CÁC PHỐ NGHỀ (STREET DIRECTORY INDEX) */}
      <section className="border-b border-[#E8DECE] bg-[#FFFDF9] py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8DECE]">
            <div>
              <span className="font-mono text-xs font-bold text-[#A8412A] tracking-wider uppercase">
                MỤC LỤC CÁC NGÀNH NGHỀ
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                Dạo quanh các Gian Phố Nghề
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-[#3A2418] hover:text-[#A8412A] hover-draw-line inline-flex items-center gap-1"
            >
              <span>Xem đầy đủ danh mục</span>
              <span>→</span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {streetDirectory.map((street) => (
              <Link
                key={street.id}
                href={`/marketplace?category=${street.slug}`}
                className="group relative rounded-xl border border-[#E8DECE] bg-[#FAF5EB] p-5 shadow-xs transition-all hover:bg-[#FFFDF9] hover:border-[#D4C3AC] hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{street.icon}</span>
                  <span className="font-mono text-[11px] font-semibold text-[#6E5A4D] bg-[#FFFDF9] border border-[#E8DECE] px-2 py-0.5 rounded-xs">
                    {street.count}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3A2418] group-hover:text-[#A8412A] transition-colors">
                  {street.name}
                </h3>
                <p className="mt-2 text-xs text-[#6E5A4D] leading-relaxed">
                  {street.desc}
                </p>
                <div className="mt-4 pt-3 border-t border-[#E8DECE]/80 flex items-center text-xs font-bold text-[#A8412A] group-hover:translate-x-1 transition-transform">
                  <span>Ghé phố này</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TƯỜNG TRANH GIẢI PHÁP (ASYMMETRICAL PICTURE WALL) */}
      <section className="border-b border-[#E8DECE] bg-[#FAF5EB] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E8DECE]">
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="chop-seal">BẢO CHỨNG CHẤT LƯỢNG</span>
                <span className="font-mono text-xs font-bold text-[#6E5A4D]">
                  TUYỂN TẬP TIÊU BIỂU
                </span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#3A2418]">
                Tường Tranh Giải Pháp Đã Kiểm Định
              </h2>
              <p className="mt-2 text-sm text-[#6E5A4D] max-w-2xl leading-relaxed">
                Rê chuột lên ảnh để cuộn xem trang thật. Bấm vào từng mẫu để xem bảng bóc tách phạm vi chi tiết (Bao gồm, Không bao gồm, Giấy phép bản quyền).
              </p>
            </div>
            <Link
              href="/marketplace"
              className="btn-ink-secondary text-xs py-2 px-4 shrink-0"
            >
              <span>Xem tất cả {listings.length}+ mẫu</span>
              <span>→</span>
            </Link>
          </div>

          {/* Render Picture Wall with hover-scroll & device frame */}
          <PictureWallSolutions listings={listings} />
        </div>
      </section>

      {/* 4. SCROLLYTELLING "CÁCH HOẠT ĐỘNG" (5 BƯỚC THEO KỊCH BẢN) */}
      <ScrollytellingSection />

      {/* 5. BẢNG GHIM CẦN GIẢI PHÁP & DIỄN ĐÀN (WANTED PINBOARD) */}
      <section id="wanted-board" className="border-b border-[#E8DECE] bg-[#FAF5EB] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8DECE] mb-10">
            <div>
              <span className="font-mono text-xs font-bold text-[#A8412A] tracking-wider uppercase">
                BẢNG GHIM PHIẾU YÊU CẦU
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#3A2418]">
                Doanh Nghiệp Đang Cần Giải Pháp
              </h2>
              <p className="mt-2 text-sm text-[#6E5A4D]">
                Nơi khách hàng ghim phiếu tìm giải pháp phù hợp. Các Seller xác minh gửi đề xuất (proposal) trực tiếp.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/community?type=WANTED"
                className="btn-ink-secondary text-xs py-2 px-3.5"
              >
                Xem toàn bộ bảng ghim
              </Link>
              <Link
                href="/request-project"
                className="btn-ink-primary text-xs py-2 px-3.5"
              >
                + Ghim phiếu mới
              </Link>
            </div>
          </div>

          {/* Lưới các Phiếu Ghim Thẻ Kraft (Pinboard Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wantedThreads.map((thread) => (
              <div
                key={thread.id}
                className="pin-card p-5 flex flex-col justify-between"
              >
                {/* Đinh ghim trang trí */}
                <span className="pin-card-thumbtack"></span>

                <div>
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <span className="stamp-tag text-[#A8412A] border-[#A8412A]">
                      CẦN GIẢI PHÁP
                    </span>
                    <span className="text-[11px] font-mono text-[#6E5A4D]">
                      {new Date(thread.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#3A2418] hover:text-[#A8412A] transition-colors">
                    <Link href={`/community#${thread.id}`}>
                      {thread.title}
                    </Link>
                  </h3>

                  <p className="mt-2.5 text-xs text-[#6E5A4D] line-clamp-3 leading-relaxed">
                    {thread.summary || thread.bodyMd}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8DECE] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#E0A526]/20 border border-[#E0A526] flex items-center justify-center text-[10px] font-bold text-[#3A2418]">
                      {thread.author.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-[#3A2418]">
                      {thread.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-[#2F6F73]">
                    <span>💬 {thread.replyCount} Đề xuất</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PLATFORM FOOTER PHONG CÁCH PHỐ NGHỀ */}
      <footer className="bg-[#FFFDF9] border-t border-[#E8DECE] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm border-1.5 border-[#A8412A] bg-[#A8412A]/10 text-[#A8412A] font-serif font-black text-base shadow-xs">
                  Phố
                </span>
                <span className="font-serif text-xl font-bold tracking-tight text-[#3A2418]">
                  PHỐ NGHỀ
                </span>
                <span className="chop-seal ml-2">ĐÃ KIỂM</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-[#6E5A4D] max-w-md leading-relaxed">
                Nền tảng Sàn giao dịch Giải pháp Website Tiêu chuẩn và Diễn đàn Kỹ thuật cho doanh nghiệp Việt. Minh bạch phạm vi bóc tách, giá bất biến và bảo đảm chất lượng.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="stamp-tag text-[#2F6F73] border-[#2F6F73]">
                  MÃ NGUỒN CHUẨN
                </span>
                <span className="stamp-tag text-[#3A2418] border-[#3A2418]">
                  TRIỂN KHAI TRỌN GÓI
                </span>
                <span className="stamp-tag text-[#E0A526] border-[#E0A526]">
                  CLOUD SAAS
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-serif text-sm font-bold text-[#3A2418] mb-3">
                Gian Phố Nghề
              </h4>
              <ul className="space-y-2 text-xs text-[#6E5A4D]">
                <li>
                  <Link href="/marketplace?category=food-beverage" className="hover:text-[#A8412A]">
                    Phố Ẩm thực & Nhà hàng
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace?category=fashion-apparel" className="hover:text-[#A8412A]">
                    Phố May mặc & Thời trang
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace?category=healthcare" className="hover:text-[#A8412A]">
                    Phố Y tế & Phòng khám
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace?category=corporate" className="hover:text-[#A8412A]">
                    Phố Doanh nghiệp & Dịch vụ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-serif text-sm font-bold text-[#3A2418] mb-3">
                Cộng đồng & Trợ giúp
              </h4>
              <ul className="space-y-2 text-xs text-[#6E5A4D]">
                <li>
                  <Link href="/community" className="hover:text-[#A8412A]">
                    Diễn đàn Kỹ thuật
                  </Link>
                </li>
                <li>
                  <Link href="/community?type=WANTED" className="hover:text-[#A8412A]">
                    Bảng Cần giải pháp
                  </Link>
                </li>
                <li>
                  <Link href="/request-project" className="hover:text-[#A8412A]">
                    Gửi yêu cầu thiết kế riêng
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-serif text-sm font-bold text-[#3A2418] mb-3">
                Cam kết Phố Nghề
              </h4>
              <p className="text-xs text-[#6E5A4D] leading-relaxed">
                Mọi giải pháp trên sàn đều qua quy trình kiểm thử 3 lớp: Kiểm tra cấu trúc code, đánh giá hiệu năng Lighthouse và xác thực tư cách Seller đối tác.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="chop-seal-green">100% BẢO CHỨNG</span>
                <span className="text-xs text-[#6E5A4D]">Không phát sinh chi phí</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#E8DECE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E5A4D]">
            <p>© 2026 Phố Nghề Platform. Xây dựng theo tiêu chuẩn Web Solution Marketplace v1.1.</p>
            <p className="font-serif italic">Mộc mạc · Minh bạch · Bền bỉ</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF5EB] flex flex-col">
      <MarketplaceNavbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#A8412A] border-t-transparent"></div>
              <p className="mt-4 font-serif text-sm text-[#6E5A4D]">
                Đang chuẩn bị các gian hàng Phố Nghề...
              </p>
            </div>
          }
        >
          <HomePageContent />
        </Suspense>
      </main>
    </div>
  );
}
