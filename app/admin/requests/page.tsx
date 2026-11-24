'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContactSnapshot {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface BudgetSnapshot {
  minMinor?: number;
  maxMinor?: number;
  currency: string;
  flexibility?: string;
}

interface InternalNote {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

interface RequestActivity {
  id: string;
  actor: string;
  activityType: string;
  fromStatus?: string;
  toStatus?: string;
  reason?: string;
  summary: string;
  createdAt: string;
}

interface QuoteRequest {
  id: string;
  referenceCode: string;
  title: string;
  solutionType: string;
  industryCategoryId?: string;
  goal: string;
  budget: BudgetSnapshot;
  targetDate?: string;
  status: string;
  priority: string;
  assignedToName?: string;
  contactSnapshot: ContactSnapshot;
  requirementsSnapshot: {
    estimatedPages?: string;
    features: string[];
  };
  submittedAt: string;
  internalNotes?: InternalNote[];
  activities?: RequestActivity[];
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<QuoteRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchKw, setSearchKw] = useState('');

  // Transition form state
  const [nextStatus, setNextStatus] = useState('');
  const [transitionReason, setTransitionReason] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  // Note form state
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Load requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/v1/admin/quote-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.items || []);
        if (selectedReq) {
          const updated = (data.items || []).find((r: QuoteRequest) => r.id === selectedReq.id);
          if (updated) setSelectedReq(updated);
        }
      }
    } catch {
      // Fallback mock requests
      setRequests([
        {
          id: 'req-001-phoco',
          referenceCode: 'WMR-K78P',
          title: 'Website cho Nhà hàng Cơm Niêu Phố Cổ',
          solutionType: 'BUSINESS_WEBSITE',
          industryCategoryId: 'food-beverage',
          goal: 'Nhận đặt bàn trước giờ cao điểm, xem thực đơn qua mã QR.',
          budget: { minMinor: 15000000, maxMinor: 30000000, currency: 'VND' },
          status: 'QUOTATION_SENT',
          priority: 'HIGH',
          assignedToName: 'Nguyễn Văn Minh',
          contactSnapshot: {
            name: 'Trần Đình Trọng',
            email: 'trong.comnieu@example.com',
            phone: '0903123456',
            company: 'Cơm Niêu Phố Cổ',
          },
          requirementsSnapshot: { features: ['CMS', 'BOOKING', 'QR_MENU'] },
          submittedAt: '2026-11-20T08:30:00Z',
          internalNotes: [
            {
              id: 'n1',
              authorName: 'Nguyễn Văn Minh',
              body: 'Khách yêu cầu thêm phân quyền cho 2 chi nhánh.',
              createdAt: '2026-11-20T09:15:00Z',
            },
          ],
          activities: [
            {
              id: 'a1',
              actor: 'Khách hàng',
              activityType: 'CREATED',
              summary: 'Khởi tạo yêu cầu',
              createdAt: '2026-11-20T08:30:00Z',
            },
          ],
        },
        {
          id: 'req-002-tamduc',
          referenceCode: 'WMR-M49X',
          title: 'Hệ thống Đặt lịch Nha Khoa Tâm Đức',
          solutionType: 'HEALTHCARE_PORTAL',
          industryCategoryId: 'healthcare',
          goal: 'Bệnh nhân tra cứu lịch khám bác sĩ chuyên khoa và đặt lịch.',
          budget: { minMinor: 12000000, maxMinor: 25000000, currency: 'VND' },
          status: 'NEW',
          priority: 'NORMAL',
          contactSnapshot: {
            name: 'Bác sĩ Lê Thị Mai',
            email: 'mai.nhakhoa@example.com',
            phone: '0918765432',
            company: 'Nha Khoa Tâm Đức',
          },
          requirementsSnapshot: { features: ['CMS', 'DOCTOR_SCHEDULE'] },
          submittedAt: '2026-11-22T14:10:00Z',
          internalNotes: [],
          activities: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSelectRequest = async (req: QuoteRequest) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/quote-requests/${req.id}`);
      if (res.ok) {
        const full = await res.json();
        setSelectedReq(full);
        return;
      }
    } catch {}
    setSelectedReq(req);
  };

  const handleTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !nextStatus || !transitionReason) return;
    setTransitioning(true);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/quote-requests/${selectedReq.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toStatus: nextStatus,
          reason: transitionReason,
          actor: 'Quản trị viên',
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedReq(updated);
        setNextStatus('');
        setTransitionReason('');
        await fetchRequests();
      } else {
        const err = await res.json();
        alert(err.message || 'Lỗi chuyển trạng thái');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setTransitioning(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !newNote.trim()) return;
    setSavingNote(true);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/quote-requests/${selectedReq.id}/internal-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: newNote.trim(),
          authorName: 'Quản trị viên',
        }),
      });

      if (res.ok) {
        setNewNote('');
        // Tải lại chi tiết
        const detailRes = await fetch(`http://localhost:3001/api/v1/admin/quote-requests/${selectedReq.id}`);
        if (detailRes.ok) {
          const full = await detailRes.json();
          setSelectedReq(full);
        }
      }
    } catch {
      alert('Lỗi lưu ghi chú');
    } finally {
      setSavingNote(false);
    }
  };

  // Format tiền tệ VND
  const formatMoney = (minor?: number) => {
    if (!minor) return 'Chưa rõ';
    return (minor).toLocaleString('vi-VN') + ' ₫';
  };

  // Status Badge Map
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="chop-seal bg-amber-50 text-[#A8412A] border-[#A8412A]">MỚI TIẾP NHẬN</span>;
      case 'TRIAGED':
        return <span className="stamp-tag text-[#E0A526] border-[#E0A526]">ĐÃ PHÂN LOẠI</span>;
      case 'IN_REVIEW':
        return <span className="stamp-tag text-[#2F6F73] border-[#2F6F73]">ĐANG THẨM ĐỊNH</span>;
      case 'QUOTATION_SENT':
        return <span className="chop-seal-green">ĐÃ GỬI BÁO GIÁ</span>;
      case 'CONVERTED':
        return <span className="chop-seal bg-emerald-50 text-emerald-700 border-emerald-700">ĐÃ CHỐT HỢP ĐỒNG</span>;
      case 'CLOSED_LOST':
        return <span className="stamp-tag text-stone-500 border-stone-400">ĐÃ ĐÓNG</span>;
      default:
        return <span className="stamp-tag">{status}</span>;
    }
  };

  // Lọc
  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchKw) {
      const kw = searchKw.toLowerCase();
      return (
        r.referenceCode.toLowerCase().includes(kw) ||
        r.title.toLowerCase().includes(kw) ||
        r.contactSnapshot.name.toLowerCase().includes(kw) ||
        r.contactSnapshot.email.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto text-[#3A2418]">
      <div className="space-y-6">
        {/* Breadcrumb & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DECE] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6E5A4D] font-mono mb-1">
              <span>BÀN LÀM VIỆC NỘI BỘ</span>
              <span>/</span>
              <span className="font-bold text-[#A8412A]">TIẾP NHẬN YÊU CẦU DỰ ÁN</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
              Hàng đợi Yêu cầu Dự án (Request Inbox)
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequests}
              className="btn-ink-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔄</span>
              <span>Làm mới</span>
            </button>
            <Link href="/request-project" className="btn-ink-primary text-xs py-2 px-3.5">
              <span>+ Tạo phiếu yêu cầu mẫu</span>
            </Link>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
          <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-4 shadow-2xs">
            <span className="text-xs font-mono uppercase text-[#6E5A4D] block mb-1">Tổng hồ sơ</span>
            <span className="font-serif text-2xl font-black text-[#3A2418]">{requests.length}</span>
          </div>
          <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-4 shadow-2xs">
            <span className="text-xs font-mono uppercase text-[#6E5A4D] block mb-1">Cần xử lý gấp</span>
            <span className="font-serif text-2xl font-black text-[#A8412A]">
              {requests.filter((r) => r.status === 'NEW' || r.status === 'TRIAGED').length}
            </span>
          </div>
          <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-4 shadow-2xs">
            <span className="text-xs font-mono uppercase text-[#6E5A4D] block mb-1">Đang khảo sát</span>
            <span className="font-serif text-2xl font-black text-[#2F6F73]">
              {requests.filter((r) => r.status === 'IN_REVIEW' || r.status === 'WAITING_CUSTOMER').length}
            </span>
          </div>
          <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-4 shadow-2xs">
            <span className="text-xs font-mono uppercase text-[#6E5A4D] block mb-1">Đã chốt hợp đồng</span>
            <span className="font-serif text-2xl font-black text-[#3A2418]">
              {requests.filter((r) => r.status === 'CONVERTED' || r.status === 'CLOSED_WON').length}
            </span>
          </div>
        </div>

        {/* Thanh công cụ Tìm kiếm & Bộ lọc */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'NEW', label: 'Mới nhận' },
              { id: 'TRIAGED', label: 'Đã phân loại' },
              { id: 'IN_REVIEW', label: 'Đang thẩm định' },
              { id: 'QUOTATION_SENT', label: 'Đã gửi báo giá' },
              { id: 'CONVERTED', label: 'Đã chốt' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#3A2418] text-[#FAF5EB] shadow-xs'
                    : 'bg-[#FFFDF9] border border-[#E8DECE] text-[#6E5A4D] hover:border-[#D4C3AC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              placeholder="Tìm mã WMR, tên khách, tiêu đề..."
              className="w-full rounded-lg border border-[#D4C3AC] bg-[#FFFDF9] px-3.5 py-1.5 text-xs text-[#3A2418] placeholder:text-[#6E5A4D] outline-none focus:border-[#A8412A]"
            />
            {searchKw && (
              <button
                onClick={() => setSearchKw('')}
                className="absolute right-2.5 top-1.5 text-xs text-[#6E5A4D] hover:text-[#A8412A]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Khung nội dung chính: Bảng danh sách & Slide-over chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột trái: Bảng danh sách yêu cầu (7 hoặc 12 cols) */}
          <div className={`${selectedReq ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
            <div className="rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DECE] bg-[#FAF5EB]/70 font-mono text-[11px] text-[#6E5A4D] uppercase">
                    <th className="py-3 px-4">Mã tra cứu</th>
                    <th className="py-3 px-4">Khách hàng & Doanh nghiệp</th>
                    <th className="py-3 px-4">Dự án & Mục tiêu</th>
                    <th className="py-3 px-4">Ngân sách</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DECE]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#6E5A4D]">
                        Đang tải danh sách hồ sơ...
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#6E5A4D]">
                        Không có yêu cầu nào phù hợp điều kiện lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr
                        key={req.id}
                        onClick={() => handleSelectRequest(req)}
                        className={`hover:bg-[#FAF5EB]/50 transition-colors cursor-pointer ${
                          selectedReq?.id === req.id ? 'bg-[#FAF5EB] font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#A8412A]">
                          {req.referenceCode}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#3A2418]">{req.contactSnapshot.name}</div>
                          <div className="text-[11px] text-[#6E5A4D]">{req.contactSnapshot.company || req.contactSnapshot.phone || req.contactSnapshot.email}</div>
                        </td>
                        <td className="py-3 px-4 max-w-[200px]">
                          <div className="truncate font-semibold text-[#3A2418]">{req.title}</div>
                          <div className="truncate text-[11px] text-[#6E5A4D]">{req.goal}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          {formatMoney(req.budget.minMinor)} – {formatMoney(req.budget.maxMinor)}
                        </td>
                        <td className="py-3 px-4">
                          {renderStatusBadge(req.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            className="text-[#A8412A] font-bold hover:underline"
                          >
                            Chi tiết →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cột phải: Slide-over Hồ sơ chi tiết (5 cols) */}
          {selectedReq && (
            <div className="lg:col-span-5 rounded-xl border border-[#D4C3AC] bg-[#FFFDF9] p-5 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8DECE] pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#A8412A] block">
                    HỒ SƠ #{selectedReq.referenceCode}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#3A2418] leading-tight">
                    {selectedReq.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="text-xs text-[#6E5A4D] hover:text-[#A8412A] p-1 cursor-pointer"
                  title="Đóng chi tiết"
                >
                  ✕ Đóng
                </button>
              </div>

              {/* Thông tin khách hàng */}
              <div className="rounded-lg bg-[#FAF5EB] p-3 text-xs space-y-1.5 border border-[#E8DECE]">
                <div className="font-mono text-[10px] uppercase font-bold text-[#6E5A4D]">
                  Liên hệ người mua:
                </div>
                <div className="font-bold text-[#3A2418]">{selectedReq.contactSnapshot.name}</div>
                <div className="text-[#6E5A4D]">📧 {selectedReq.contactSnapshot.email}</div>
                {selectedReq.contactSnapshot.phone && (
                  <div className="text-[#6E5A4D]">📞 {selectedReq.contactSnapshot.phone}</div>
                )}
                {selectedReq.contactSnapshot.company && (
                  <div className="text-[#6E5A4D]">🏢 {selectedReq.contactSnapshot.company}</div>
                )}
                {selectedReq.assignedToName && (
                  <div className="pt-1 text-[#2F6F73] font-semibold border-t border-[#D4C3AC]/40 mt-1">
                    👤 Phụ trách: {selectedReq.assignedToName}
                  </div>
                )}
              </div>

              {/* Mục tiêu & Tính năng */}
              <div className="text-xs space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-[#6E5A4D] block">
                  Mục tiêu kinh doanh:
                </span>
                <p className="text-[#3A2418] leading-relaxed italic bg-[#FAF5EB]/50 p-2.5 rounded-xs border border-[#E8DECE]">
                  &quot;{selectedReq.goal}&quot;
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedReq.requirementsSnapshot.features?.map((f, i) => (
                    <span key={i} className="stamp-tag text-[10px] text-[#3A2418] border-[#D4C3AC]">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Liên kết Báo giá & Hợp đồng */}
              <div className="rounded-lg border border-[#E0A526]/50 bg-[#FFFDF9] p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#E0A526] uppercase">
                    BÁO GIÁ ĐÍNH KÈM
                  </span>
                  <Link
                    href={`/quotations/quote-001`}
                    className="font-bold text-[#A8412A] hover:underline"
                    target="_blank"
                  >
                    Xem mẫu Báo giá #quote-001 ↗
                  </Link>
                </div>
                <p className="text-[11px] text-[#6E5A4D]">
                  Phiên bản báo giá v1 đã lập 18.000.000 ₫ (bàn giao mã nguồn + thực đơn QR).
                </p>
              </div>

              {/* Form chuyển trạng thái có kiểm soát qua State Machine */}
              <form onSubmit={handleTransition} className="rounded-lg border border-[#D4C3AC] p-3.5 space-y-3 bg-[#FAF5EB]/40">
                <span className="font-mono text-[10px] uppercase font-bold text-[#3A2418] block">
                  Chuyển trạng thái quy trình (State Machine):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-[#6E5A4D] block mb-1">Hiện tại:</label>
                    {renderStatusBadge(selectedReq.status)}
                  </div>
                  <div>
                    <label className="text-[10px] text-[#6E5A4D] block mb-1">Chuyển sang:</label>
                    <select
                      value={nextStatus}
                      onChange={(e) => setNextStatus(e.target.value)}
                      className="w-full rounded-md border border-[#D4C3AC] bg-[#FFFDF9] px-2 py-1 text-xs outline-none"
                      required
                    >
                      <option value="">-- Chọn trạng thái --</option>
                      <option value="TRIAGED">TRIAGED (Đã phân loại)</option>
                      <option value="IN_REVIEW">IN_REVIEW (Đang thẩm định)</option>
                      <option value="WAITING_CUSTOMER">WAITING_CUSTOMER (Chờ khách)</option>
                      <option value="QUOTATION_SENT">QUOTATION_SENT (Đã gửi báo giá)</option>
                      <option value="CONVERTED">CONVERTED (Đã chốt hợp đồng)</option>
                      <option value="CLOSED_LOST">CLOSED_LOST (Từ chối / Hủy)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#6E5A4D] block mb-1">Lý do thay đổi trạng thái:</label>
                  <input
                    type="text"
                    value={transitionReason}
                    onChange={(e) => setTransitionReason(e.target.value)}
                    placeholder="Ví dụ: Đã họp thẩm định phạm vi kỹ thuật với đối tác..."
                    className="w-full rounded-md border border-[#D4C3AC] bg-[#FFFDF9] px-2.5 py-1.5 text-xs outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={transitioning || !nextStatus || !transitionReason}
                  className="w-full btn-ink-primary text-xs py-1.5 cursor-pointer disabled:opacity-50"
                >
                  {transitioning ? 'Đang chuyển...' : 'Xác nhận Chuyển Trạng Thái'}
                </button>
              </form>

              {/* Ghi chú nội bộ (Internal Notes) */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase font-bold text-[#6E5A4D] block">
                  Trao đổi nội bộ Staff ({selectedReq.internalNotes?.length || 0}):
                </span>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedReq.internalNotes && selectedReq.internalNotes.length > 0 ? (
                    selectedReq.internalNotes.map((note) => (
                      <div key={note.id} className="rounded-md border border-[#E8DECE] bg-[#FAF5EB] p-2 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-[#6E5A4D] mb-0.5">
                          <span className="font-bold text-[#3A2418]">{note.authorName}</span>
                          <span>{new Date(note.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[#3A2418]">{note.body}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-[#6E5A4D] italic">Chưa có ghi chú nội bộ nào.</div>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ghi chú nội bộ bí mật (khách không thấy)..."
                    className="flex-1 rounded-md border border-[#D4C3AC] bg-[#FFFDF9] px-2.5 py-1.5 text-xs outline-none"
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !newNote.trim()}
                    className="btn-ink-secondary text-xs px-3 cursor-pointer disabled:opacity-50"
                  >
                    Lưu
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
