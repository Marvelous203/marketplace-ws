import Link from 'next/link';
import { Suspense } from 'react';
import MarketplaceNavbar from '@/components/marketplace/Navbar';
import PictureWallSolutions, { ListingItemData } from '@/components/marketplace/PictureWallSolutions';
import { fetchCategories, fetchListings } from '@/lib/api/marketplace';

export const metadata = {
  title: 'Kho Phố Nghề — Khám phá Giải pháp Website Tiêu chuẩn',
  description:
    'Kho giải pháp website chuyên nghiệp: Mua bản quyền mã nguồn, thuê trọn gói hoặc đăng ký Cloud SaaS. Bảo chứng chất lượng, minh bạch chi phí.',
};

async function MarketplaceContent({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    fulfillment?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await fetchCategories();
  const { items: listings, total } = await fetchListings({
    category: params.category,
    fulfillment: params.fulfillment,
    q: params.q,
  });

  const fulfillmentOptions = [
    { label: 'Tất cả hình thức', value: '' },
    { label: '📦 Bản quyền Mã nguồn', value: 'SOURCE_CODE' },
    { label: '🚀 Triển khai Trọn gói', value: 'MANAGED_SERVICE' },
    { label: '☁️ Thuê bao Cloud SaaS', value: 'SAAS' },
    { label: '⚙️ May đo theo yêu cầu', value: 'CUSTOM_PROJECT' },
  ];

  return (
    <>
      {/* Hero Section phong cách Phố nghề */}
      <section className="border-b border-[#E8DECE] bg-[#FAF5EB] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="chop-seal">KHO GIẢI PHÁP</span>
              <span className="font-mono text-xs font-bold text-[#6E5A4D]">
                TIÊU CHUẨN DOANH NGHIỆP
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2418]">
              Dạo Chợ Giải Pháp Website Doanh Nghiệp
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#6E5A4D] leading-relaxed">
              Mỗi giải pháp đều có demo đã kiểm định và bóc tách phạm vi minh bạch. Bạn có thể mua trọn bộ mã nguồn, thuê triển khai trọn gói hoặc thuê bao đám mây.
            </p>
          </div>

          {/* Search Input Box */}
          <form
            method="GET"
            action="/marketplace"
            className="mt-6 flex max-w-2xl items-center gap-2 rounded-lg border border-[#D4C3AC] bg-[#FFFDF9] p-2 shadow-xs"
          >
            <span className="pl-2 text-[#6E5A4D]">🔍</span>
            <input
              type="text"
              name="q"
              defaultValue={params.q || ''}
              placeholder="Tìm theo tên website, ngành nghề (nhà hàng, thời trang, y tế...)"
              className="flex-1 bg-transparent px-2 py-1 text-xs text-[#3A2418] outline-none placeholder:text-[#6E5A4D]"
            />
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            {params.fulfillment && (
              <input type="hidden" name="fulfillment" value={params.fulfillment} />
            )}
            <button
              type="submit"
              className="btn-ink-primary text-xs py-2 px-4 shrink-0"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Tabs Phố nghề */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#E8DECE]">
          <Link
            href={`/marketplace${params.fulfillment ? `?fulfillment=${params.fulfillment}` : ''}`}
            className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
              !params.category
                ? 'bg-[#3A2418] text-[#FAF5EB] shadow-xs'
                : 'bg-[#FFFDF9] text-[#6E5A4D] border border-[#E8DECE] hover:text-[#3A2418] hover:border-[#D4C3AC]'
            }`}
          >
            Tất cả các gian phố
          </Link>
          {categories.map((cat) => {
            const isSelected = params.category === cat.slug;
            const queryParams = new URLSearchParams();
            queryParams.set('category', cat.slug);
            if (params.fulfillment) queryParams.set('fulfillment', params.fulfillment);
            if (params.q) queryParams.set('q', params.q);

            return (
              <Link
                key={cat.id}
                href={`/marketplace?${queryParams.toString()}`}
                className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#3A2418] text-[#FAF5EB] shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6E5A4D] border border-[#E8DECE] hover:text-[#3A2418] hover:border-[#D4C3AC]'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Fulfillment Type Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6E5A4D] mr-1">Hình thức bàn giao:</span>
          {fulfillmentOptions.map((opt) => {
            const isSelected = (params.fulfillment || '') === opt.value;
            const queryParams = new URLSearchParams();
            if (params.category) queryParams.set('category', params.category);
            if (opt.value) queryParams.set('fulfillment', opt.value);
            if (params.q) queryParams.set('q', params.q);

            return (
              <Link
                key={opt.value}
                href={`/marketplace?${queryParams.toString()}`}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'border border-[#A8412A] bg-[#A8412A]/10 text-[#A8412A] font-bold'
                    : 'border border-[#E8DECE] bg-[#FFFDF9] text-[#6E5A4D] hover:text-[#3A2418] hover:border-[#D4C3AC]'
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#6E5A4D]">
          <span>
            Tìm thấy <strong>{total}</strong> giải pháp phù hợp với tiêu chí
          </span>
          <div className="flex items-center gap-2">
            <span className="chop-seal">100% ĐÃ DUYỆT</span>
          </div>
        </div>

        {/* Grid/Wall of Solutions */}
        <div className="mt-6">
          {listings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D4C3AC] bg-[#FFFDF9] p-12 text-center">
              <span className="text-3xl">🏮</span>
              <h3 className="mt-3 font-serif text-lg font-bold text-[#3A2418]">
                Chưa có giải pháp nào trong gian phố này
              </h3>
              <p className="mt-1 text-xs text-[#6E5A4D] max-w-md mx-auto">
                Bạn có thể thử tìm kiếm với từ khóa khác hoặc gửi yêu cầu thiết kế riêng cho chúng tôi.
              </p>
              <div className="mt-5">
                <Link
                  href="/request-project"
                  className="btn-ink-primary text-xs py-2 px-4"
                >
                  + Gửi Yêu Cầu Thiết Kế Riêng
                </Link>
              </div>
            </div>
          ) : (
            <PictureWallSolutions listings={listings as ListingItemData[]} />
          )}
        </div>
      </main>
    </>
  );
}

export default function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    fulfillment?: string;
    q?: string;
  }>;
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
                Đang chuẩn bị danh mục các phố...
              </p>
            </div>
          }
        >
          <MarketplaceContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
