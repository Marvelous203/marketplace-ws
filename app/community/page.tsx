import Link from 'next/link';
import { Suspense } from 'react';
import MarketplaceNavbar from '@/components/marketplace/Navbar';
import {
  fetchForumCategories,
  fetchForumThreads,
  ThreadType,
} from '@/lib/api/marketplace';

export const metadata = {
  title: 'Diễn đàn Phố Nghề & Bảng Ghim Cần Giải Pháp',
  description:
    'Không gian trao đổi kỹ thuật website, hỏi đáp, chia sẻ sản phẩm hoàn thành và bảng ghim các phiếu yêu cầu tìm đối tác làm website (Request Board).',
};

async function CommunityContent({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    type?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const categories = await fetchForumCategories();
  const { items: threads, total } = await fetchForumThreads({
    category: params.category,
    threadType: params.type as ThreadType,
    q: params.q,
  });

  const threadTypes = [
    { label: 'Tất cả chủ đề', value: '', color: 'border-[#3A2418] text-[#3A2418]' },
    { label: '🎯 Cần giải pháp', value: 'WANTED', color: 'border-[#A8412A] text-[#A8412A]' },
    { label: '❓ Hỏi đáp kỹ thuật', value: 'QUESTION', color: 'border-[#2F6F73] text-[#2F6F73]' },
    { label: '🚀 Khoe sản phẩm', value: 'SHOWCASE', color: 'border-[#E0A526] text-[#E0A526]' },
    { label: '💬 Thảo luận nghề web', value: 'DISCUSSION', color: 'border-[#3A2418] text-[#3A2418]' },
  ];

  const getThreadBadge = (type: string) => {
    switch (type) {
      case 'WANTED':
        return { label: 'Cần giải pháp', stampClass: 'text-[#A8412A] border-[#A8412A]' };
      case 'QUESTION':
        return { label: 'Hỏi đáp', stampClass: 'text-[#2F6F73] border-[#2F6F73]' };
      case 'SHOWCASE':
        return { label: 'Khoe sản phẩm', stampClass: 'text-[#E0A526] border-[#E0A526]' };
      default:
        return { label: 'Thảo luận', stampClass: 'text-[#3A2418] border-[#3A2418]' };
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner Phố nghề */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DECE] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="chop-seal">DIỄN ĐÀN PHỐ NGHỀ</span>
            <span className="font-mono text-xs font-bold text-[#6E5A4D]">
              KẾT NỐI DOANH NGHIỆP & SELLER
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2418]">
            Diễn Đàn Kỹ Thuật & Bảng Ghim Cần Giải Pháp
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6E5A4D] max-w-2xl leading-relaxed">
            Trao đổi chuyên môn, hỏi đáp về công nghệ website và kết nối nhu cầu làm website thực tế. Khách hàng ghim phiếu tìm giải pháp; các Seller xác minh gửi proposal so sánh trực tiếp.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/request-project"
            className="btn-ink-primary text-xs py-2.5 px-4"
          >
            + Ghim Phiếu Yêu Cầu Mới
          </Link>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DECE] pb-6">
        {/* Thread Type Tabs dạng Con tem */}
        <div className="flex flex-wrap items-center gap-2">
          {threadTypes.map((type) => {
            const isSelected = (params.type || '') === type.value;
            const queryParams = new URLSearchParams();
            if (params.category) queryParams.set('category', params.category);
            if (type.value) queryParams.set('type', type.value);
            if (params.q) queryParams.set('q', params.q);

            return (
              <Link
                key={type.value}
                href={`/community?${queryParams.toString()}`}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#3A2418] text-[#FAF5EB] shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6E5A4D] border border-[#E8DECE] hover:text-[#3A2418] hover:border-[#D4C3AC]'
                }`}
              >
                {type.label}
              </Link>
            );
          })}
        </div>

        {/* Search Input */}
        <form
          method="GET"
          action="/community"
          className="flex items-center gap-2 rounded-md border border-[#D4C3AC] bg-[#FFFDF9] px-3 py-1.5 shadow-2xs"
        >
          <span className="text-[#6E5A4D] text-xs">🔍</span>
          <input
            type="text"
            name="q"
            defaultValue={params.q || ''}
            placeholder="Tìm theo chủ đề, ngành nghề..."
            className="w-48 sm:w-60 bg-transparent text-xs text-[#3A2418] outline-none placeholder:text-[#6E5A4D]"
          />
          {params.category && (
            <input type="hidden" name="category" value={params.category} />
          )}
          {params.type && (
            <input type="hidden" name="type" value={params.type} />
          )}
        </form>
      </div>

      {/* Main Forum Grid: Danh sách chủ đề / Bảng ghim + Sidebar thông tin */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main List Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {threads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D4C3AC] bg-[#FFFDF9] p-12 text-center">
              <span className="text-3xl">📭</span>
              <h3 className="mt-3 font-serif text-lg font-bold text-[#3A2418]">
                Không tìm thấy chủ đề thảo luận nào
              </h3>
              <p className="mt-1 text-xs text-[#6E5A4D]">
                Hãy là người đầu tiên mở chủ đề hoặc ghim phiếu yêu cầu mới.
              </p>
            </div>
          ) : (
            threads.map((thread) => {
              const badge = getThreadBadge(thread.threadType);
              const isWanted = thread.threadType === 'WANTED';

              return (
                <article
                  key={thread.id}
                  id={thread.id}
                  className={`rounded-xl border bg-[#FFFDF9] p-6 shadow-xs transition-all ${
                    isWanted
                      ? 'border-[#A8412A]/40 bg-[#FFFDF9] ring-1 ring-[#A8412A]/10'
                      : 'border-[#E8DECE]'
                  }`}
                >
                  {/* Header bài viết */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`stamp-tag ${badge.stampClass}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-[#6E5A4D]">
                        trong <strong>{thread.categoryName}</strong>
                      </span>
                      {isWanted && (
                        <span className="chop-seal text-[10px]">
                          ĐANG NHẬN PROPOSAL
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#6E5A4D]">
                      {new Date(thread.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Tiêu đề & Nội dung theo chế độ đọc cột chuẩn mực */}
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#3A2418] hover:text-[#A8412A] transition-colors">
                    <Link href={`#${thread.id}`}>
                      {thread.title}
                    </Link>
                  </h2>

                  <div className="mt-3 text-xs sm:text-sm text-[#3A2418] leading-relaxed max-w-2xl font-normal">
                    {thread.summary || thread.bodyMd}
                  </div>

                  {/* NẾU LÀ "CẦN GIẢI PHÁP": HIỂN THỊ CÁC PROPOSAL CỦA SELLER XẾP CẠNH NHAU ĐỂ SO SÁNH */}
                  {isWanted && (
                    <div className="mt-5 rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] p-4">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DECE]">
                        <h4 className="font-serif text-xs font-bold text-[#3A2418] flex items-center gap-1.5">
                          <span>📋</span>
                          <span>Đề xuất từ Seller xác minh (Side-by-Side Comparison)</span>
                        </h4>
                        <span className="text-[11px] font-bold text-[#2F6F73]">
                          {thread.wantedDetails?.proposalCount || thread.replyCount} đề xuất đã gửi
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Proposal 1 */}
                        <div className="rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-3 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-xs font-bold text-[#3A2418]">
                              Platform Studio
                            </span>
                            <span className="chop-seal-green text-[9px]">XÁC MINH</span>
                          </div>
                          <div className="mt-2 text-xs font-bold text-[#A8412A]">
                            12.500.000 ₫ · Bàn giao 3 ngày
                          </div>
                          <p className="text-[11px] text-[#6E5A4D] mt-1 line-clamp-2">
                            Dùng mẫu Restaurant Pro tiêu chuẩn, may đo thêm kết nối máy in nhiệt & Zalo ZNS.
                          </p>
                        </div>

                        {/* Proposal 2 */}
                        <div className="rounded-md border border-[#E8DECE] bg-[#FFFDF9] p-3 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-xs font-bold text-[#3A2418]">
                              Mộc Media Tech
                            </span>
                            <span className="chop-seal-green text-[9px]">XÁC MINH</span>
                          </div>
                          <div className="mt-2 text-xs font-bold text-[#A8412A]">
                            14.000.000 ₫ · Bàn giao 5 ngày
                          </div>
                          <p className="text-[11px] text-[#6E5A4D] mt-1 line-clamp-2">
                            Thiết kế giao diện riêng theo phong cách Đông Dương cổ điển, hỗ trợ chụp ảnh menu tận nơi.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* REACTION THEO NGỮ CẢNH: Hữu ích · Đã dùng thử · Cần thêm demo */}
                  <div className="mt-5 pt-4 border-t border-[#E8DECE] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#3A2418]/10 flex items-center justify-center font-bold text-[10px] text-[#3A2418]">
                        {thread.author.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#3A2418]">
                        {thread.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-[#E8DECE] bg-[#FAF5EB] px-2.5 py-1 text-xs text-[#3A2418] hover:border-[#2F6F73] hover:text-[#2F6F73] transition-colors"
                      >
                        💡 Hữu ích (8)
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-[#E8DECE] bg-[#FAF5EB] px-2.5 py-1 text-xs text-[#3A2418] hover:border-[#A8412A] hover:text-[#A8412A] transition-colors"
                      >
                        🧪 Đã dùng thử (3)
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-[#E8DECE] bg-[#FAF5EB] px-2.5 py-1 text-xs text-[#3A2418] hover:border-[#E0A526] hover:text-[#E0A526] transition-colors"
                      >
                        🔍 Cần thêm demo (5)
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Sidebar Thông tin & Ghi chú bên lề (Marginalia - 4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Hộp Quy ước Diễn đàn */}
          <div className="rounded-xl border border-[#E8DECE] bg-[#FFFDF9] p-5 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-[#3A2418] pb-3 border-b border-[#E8DECE] flex items-center justify-between">
              <span>Quy Ước Phố Nghề</span>
              <span className="chop-seal">CHÂN THÀNH</span>
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-[#6E5A4D]">
              <li className="flex items-start gap-2">
                <span className="text-[#A8412A] font-bold">•</span>
                <span><strong>Minh bạch chi phí:</strong> Mọi đề xuất gửi cho khách phải có phạm vi và giá rõ ràng.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A8412A] font-bold">•</span>
                <span><strong>Không spam / chèo kéo:</strong> Tôn trọng không gian thảo luận chuyên môn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A8412A] font-bold">•</span>
                <span><strong>Bảo chứng Seller:</strong> Chỉ các Seller đã xác minh mới được gửi proposal báo giá.</span>
              </li>
            </ul>
          </div>

          {/* Phân loại các gian phố */}
          <div className="rounded-xl border border-[#E8DECE] bg-[#FAF5EB] p-5">
            <h3 className="font-serif text-sm font-bold text-[#3A2418] mb-3">
              Chuyên Mục Thảo Luận
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/community?category=${cat.slug}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-[#FFFDF9] transition-colors text-xs text-[#3A2418]"
                >
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-[#6E5A4D] font-mono text-[11px] bg-[#FAF5EB] px-2 py-0.5 rounded-xs border border-[#E8DECE]">
                    {cat.threadCount} bài
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    type?: string;
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
                Đang chuẩn bị bảng ghim diễn đàn...
              </p>
            </div>
          }
        >
          <CommunityContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
