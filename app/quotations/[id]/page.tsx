'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MarketplaceNavbar from '@/components/marketplace/Navbar';

interface QuotationLine {
  id: string;
  lineType: string;
  description: string;
  quantity: number;
  unit: string;
  unitPriceMinor: number;
  discountMinor: number;
  lineTotalMinor: number;
}

interface PaymentMilestone {
  label: string;
  percent: number;
  amountMinor?: number;
}

interface QuotationVersion {
  id: string;
  versionNumber: number;
  status: string;
  currency: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  validUntil: string;
  sentAt?: string;
  acceptedAt?: string;
  acceptedByName?: string;
  acceptedNote?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  scopeSnapshot: {
    deliverables: string[];
    included: string[];
    excluded: string[];
    assumptions?: string[];
  };
  termsSnapshot: {
    paymentSchedule: PaymentMilestone[];
    warrantyDays: number;
    supportSummary: string;
    termsVersion: string;
  };
  lines: QuotationLine[];
}

interface Quotation {
  id: string;
  quoteRequestId: string;
  sellerName: string;
  customerName: string;
  customerEmail: string;
  currentVersionNumber: number;
  status: string;
  currentVersion: QuotationVersion;
}

function QuotationViewContent() {
  const params = useParams();
  const quoteId = (params?.id as string) || 'quote-001';

  const [quote, setQuote] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signerNote, setSignerNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/v1/quotations/${quoteId}`);
      if (res.ok) {
        const data = await res.json();
        setQuote(data);
        setSignerName(data.customerName || '');
      } else {
        throw new Error('Không thể tải dữ liệu báo giá');
      }
    } catch {
      // Fallback data
      setQuote({
        id: 'quote-001',
        quoteRequestId: 'req-003-quoted',
        sellerName: 'Platform Studio & Nghệ Nhân Web',
        customerName: 'Trần Đình Trọng',
        customerEmail: 'trong.comnieu@example.com',
        currentVersionNumber: 1,
        status: 'SENT',
        currentVersion: {
          id: 'qv-001',
          versionNumber: 1,
          status: 'SENT',
          currency: 'VND',
          subtotalMinor: 18000000,
          discountMinor: 0,
          taxMinor: 0,
          totalMinor: 18000000,
          validUntil: '2026-12-31T23:59:59Z',
          sentAt: '2026-11-21T10:30:00Z',
          scopeSnapshot: {
            deliverables: [
              'Website responsive đa thiết bị chuẩn Phố Nghề',
              'Trang quản trị thực đơn và nhận đặt bàn',
              'Tích hợp tạo mã QR đặt tại từng bàn',
            ],
            included: [
              'Thiết kế giao diện độc quyền mộc mạc',
              'Cài đặt tên miền và lưu trữ cloud 12 tháng',
              'Bàn giao toàn bộ mã nguồn Next.js & NestJS',
            ],
            excluded: ['Chi phí chụp ảnh món ăn chuyên nghiệp', 'Nội dung bài viết tự biên soạn'],
            assumptions: ['Khách hàng cung cấp hình ảnh logo và bảng giá món ăn'],
          },
          termsSnapshot: {
            paymentSchedule: [
              { label: 'Đặt cọc khởi động dự án (50%)', percent: 50, amountMinor: 9000000 },
              { label: 'Nghiệm thu và bàn giao (50%)', percent: 50, amountMinor: 9000000 },
            ],
            warrantyDays: 30,
            supportSummary: 'Hỗ trợ kỹ thuật trực tiếp qua Zalo/Hotline trong suốt thời gian bảo hành.',
            termsVersion: 'QUOTE-TERMS-1.0',
          },
          lines: [
            {
              id: 'line-01',
              lineType: 'SERVICE',
              description: 'Phát triển website đặt món & thực đơn QR chuẩn Phố Nghề',
              quantity: 1,
              unit: 'GÓI',
              unitPriceMinor: 18000000,
              discountMinor: 0,
              lineTotalMinor: 18000000,
            },
          ],
        },
      });
      setSignerName('Trần Đình Trọng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [quoteId]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !signerName.trim()) return;
    setActionLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/quotations/${quote.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotationVersionId: quote.currentVersion.id,
          acceptanceName: signerName.trim(),
          acceptanceNote: signerNote.trim() || 'Tôi đồng ý với phạm vi và chi phí nêu trên.',
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setQuote(updated);
        setShowAcceptModal(false);
        setSuccessMsg('Chúc mừng! Bạn đã chấp thuận báo giá thành công. Hệ thống đã tiến hành khởi tạo hợp đồng dịch vụ.');
      } else {
        const err = await res.json();
        alert(err.message || 'Lỗi khi chấp thuận');
      }
    } catch {
      alert('Không thể kết nối máy chủ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !rejectionReason.trim()) return;
    setActionLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/quotations/${quote.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quotationVersionId: quote.currentVersion.id,
          rejectionReason: rejectionReason.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setQuote(updated);
        setShowRejectModal(false);
      } else {
        const err = await res.json();
        alert(err.message || 'Lỗi khi từ chối');
      }
    } catch {
      alert('Không thể kết nối máy chủ');
    } finally {
      setActionLoading(false);
    }
  };

  const formatVND = (minor?: number) => {
    if (!minor) return '0 ₫';
    return minor.toLocaleString('vi-VN') + ' ₫';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5EB] flex items-center justify-center text-[#6E5A4D] font-serif">
        Đang tải hồ sơ báo giá chính thức...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#FAF5EB] p-8 text-center text-[#3A2418]">
        Không tìm thấy báo giá yêu cầu.
      </div>
    );
  }

  const isAccepted = quote.currentVersion.status === 'ACCEPTED';
  const isRejected = quote.currentVersion.status === 'REJECTED';
  const isPending = quote.currentVersion.status === 'SENT';

  return (
    <div className="min-h-screen bg-[#FAF5EB] text-[#3A2418]">
      <MarketplaceNavbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner thông báo thành công */}
        {successMsg && (
          <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-2xs flex items-center gap-3">
            <span className="text-base">🎉</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* TỜ TRÌNH BÁO GIÁ CHÍNH THỨC DẠNG ẤN BẢN TRUYỀN THỐNG */}
        <div className="relative rounded-2xl border-2 border-[#D4C3AC] bg-[#FFFDF9] p-6 sm:p-10 shadow-lg overflow-hidden">
          {/* Họa tiết hạt mộc */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3A2418_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Dấu Triện Đã Duyệt ở góc phải */}
          {isAccepted && (
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 pointer-events-none">
              <div className="border-3 border-[#A8412A] text-[#A8412A] p-2.5 rounded-sm font-serif font-black text-center tracking-widest text-xs uppercase rotate-[-6deg] shadow-xs bg-[#FFFDF9]/90">
                <div className="border border-dashed border-[#A8412A] p-1.5">
                  <div className="text-[13px]">ĐÃ CHẤP THUẬN</div>
                  <div className="text-[9px] font-mono mt-0.5">NGÀY: {new Date(quote.currentVersion.acceptedAt || '').toLocaleDateString('vi-VN')}</div>
                  <div className="text-[9px] font-mono">{quote.currentVersion.acceptedByName}</div>
                </div>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 pointer-events-none">
              <div className="border-2 border-stone-500 text-stone-600 p-2 rounded-sm font-mono font-bold text-center tracking-widest text-xs uppercase rotate-[-6deg] shadow-xs bg-[#FFFDF9]">
                ĐÃ TỪ CHỐI
              </div>
            </div>
          )}

          {/* Header Báo giá */}
          <div className="border-b border-[#E8DECE] pb-6 mb-8 flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#A8412A] uppercase">
                  BÁO GIÁ DỰ ÁN #{quote.id}
                </span>
                <span className="stamp-tag text-[10px] text-[#2F6F73] border-[#2F6F73]">
                  PHIÊN BẢN V{quote.currentVersionNumber}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A2418]">
                Báo Giá May Đo & Phạm Vi Triển Khai
              </h1>
              <p className="text-xs text-[#6E5A4D] mt-1">
                Lập bởi: <strong className="text-[#3A2418]">{quote.sellerName}</strong> · Đơn vị bảo chứng chất lượng
              </p>
            </div>

            <div className="text-right text-xs space-y-1 font-mono">
              <div className="text-[#6E5A4D]">Ngày gửi: {new Date(quote.currentVersion.sentAt || '').toLocaleDateString('vi-VN')}</div>
              <div className="text-[#A8412A] font-bold">
                Hiệu lực đến: {new Date(quote.currentVersion.validUntil).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {/* Thông tin Khách hàng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-[#E8DECE] bg-[#FAF5EB] p-4 text-xs mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#6E5A4D] block mb-1">
                ĐƠN VỊ YÊU CẦU:
              </span>
              <div className="font-serif text-sm font-bold text-[#3A2418]">{quote.customerName}</div>
              <div className="text-[#6E5A4D]">{quote.customerEmail}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#6E5A4D] block mb-1">
                HỒ SƠ GỐC:
              </span>
              <div className="font-mono font-bold text-[#A8412A]">Mã tham chiếu #{quote.quoteRequestId}</div>
              <div className="text-[11px] text-[#6E5A4D]">Cam kết không phát sinh chi phí ngoài phạm vi</div>
            </div>
          </div>

          {/* Bảng hạng mục công việc (Line Items) */}
          <div className="mb-8">
            <h3 className="font-serif text-base font-bold text-[#3A2418] mb-3 flex items-center gap-2">
              <span>1. Chi tiết Hạng mục & Chi phí Thực hiện</span>
            </h3>
            <div className="rounded-lg border border-[#D4C3AC] overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DECE] bg-[#FAF5EB] font-mono text-[11px] text-[#6E5A4D] uppercase">
                    <th className="py-2.5 px-3">STT</th>
                    <th className="py-2.5 px-3">Hạng mục công việc</th>
                    <th className="py-2.5 px-3 text-center">ĐVT</th>
                    <th className="py-2.5 px-3 text-center">Số lượng</th>
                    <th className="py-2.5 px-3 text-right">Đơn giá</th>
                    <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DECE]">
                  {quote.currentVersion.lines.map((line, idx) => (
                    <tr key={line.id} className="hover:bg-[#FAF5EB]/40">
                      <td className="py-3 px-3 font-mono text-[#6E5A4D]">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#3A2418]">{line.description}</div>
                        <div className="text-[10px] text-[#6E5A4D] uppercase font-mono">{line.lineType}</div>
                      </td>
                      <td className="py-3 px-3 text-center text-[#6E5A4D]">{line.unit}</td>
                      <td className="py-3 px-3 text-center font-mono">{line.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatVND(line.unitPriceMinor)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#3A2418]">
                        {formatVND(line.lineTotalMinor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#3A2418] bg-[#FAF5EB]/60 font-bold">
                    <td colSpan={4} className="py-3 px-3 text-right uppercase text-[#6E5A4D]">
                      Tổng giá trị hợp đồng trọn gói (VND):
                    </td>
                    <td colSpan={2} className="py-3 px-3 text-right font-serif text-lg text-[#A8412A]">
                      {formatVND(quote.currentVersion.totalMinor)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Phạm vi công việc: Bao gồm vs Không bao gồm */}
          <div className="mb-8">
            <h3 className="font-serif text-base font-bold text-[#3A2418] mb-3">
              2. Phạm vi Công việc Cam kết (Scope Boundary)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#2F6F73]/40 bg-[#FFFDF9] p-4 text-xs space-y-2">
                <span className="font-mono text-xs font-bold text-[#2F6F73] uppercase flex items-center gap-1.5">
                  <span>✓</span>
                  <span>Phạm vi BAO GỒM trong gói:</span>
                </span>
                <ul className="space-y-1.5 text-[#3A2418] pl-2">
                  {quote.currentVersion.scopeSnapshot.included?.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#2F6F73] font-bold">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#A8412A]/40 bg-[#FFFDF9] p-4 text-xs space-y-2">
                <span className="font-mono text-xs font-bold text-[#A8412A] uppercase flex items-center gap-1.5">
                  <span>✕</span>
                  <span>Phạm vi KHÔNG BAO GỒM:</span>
                </span>
                <ul className="space-y-1.5 text-[#6E5A4D] pl-2">
                  {quote.currentVersion.scopeSnapshot.excluded?.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#A8412A] font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tiến độ thanh toán (Payment Milestones) */}
          <div className="mb-8">
            <h3 className="font-serif text-base font-bold text-[#3A2418] mb-3">
              3. Tiến độ Thanh toán theo Cột mốc
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quote.currentVersion.termsSnapshot.paymentSchedule?.map((m, idx) => (
                <div key={idx} className="rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] p-3 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#3A2418]">{m.label}</div>
                    <div className="text-[11px] text-[#6E5A4D]">Tỷ lệ: {m.percent}%</div>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#A8412A]">
                    {formatVND(m.amountMinor)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Điều khoản bảo hành */}
          <div className="rounded-xl border border-[#E8DECE] bg-[#FAF5EB] p-4 text-xs text-[#6E5A4D] mb-8 space-y-1">
            <div className="font-bold text-[#3A2418]">🛡️ Cam kết Bảo hành & Hỗ trợ kỹ thuật:</div>
            <div>Bảo hành trọn vẹn trong <strong>{quote.currentVersion.termsSnapshot.warrantyDays} ngày</strong> kể từ khi bàn giao.</div>
            <div>{quote.currentVersion.termsSnapshot.supportSummary}</div>
          </div>

          {/* Khu vực nút hành động Duyệt Báo giá */}
          {isPending && (
            <div className="border-t border-[#E8DECE] pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#6E5A4D]">
                Bằng việc bấm Chấp thuận, bạn đồng ý với phạm vi và điều khoản dịch vụ phiên bản{' '}
                <strong className="text-[#3A2418]">{quote.currentVersion.termsSnapshot.termsVersion}</strong>.
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="btn-ink-secondary text-xs py-2.5 px-4 cursor-pointer"
                >
                  ✕ Yêu cầu điều chỉnh
                </button>
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="btn-ink-primary text-xs py-2.5 px-6 shadow-sm cursor-pointer"
                >
                  ✓ Chấp thuận Báo giá này
                </button>
              </div>
            </div>
          )}

          {isAccepted && (
            <div className="border-t border-[#E8DECE] pt-6 flex items-center justify-between text-xs">
              <div className="text-[#2F6F73] font-semibold">
                ✓ Báo giá này đã được chấp thuận vào lúc {new Date(quote.currentVersion.acceptedAt || '').toLocaleString('vi-VN')}.
              </div>
              <Link href="/marketplace" className="btn-ink-secondary text-xs py-2 px-4">
                ← Về kho giải pháp
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* MODAL CHẤP THUẬN BÁO GIÁ */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3A2418]/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-[#D4C3AC] bg-[#FFFDF9] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DECE] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2418]">
                Xác nhận Chấp thuận Báo giá #{quote.id}
              </h3>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="text-xs text-[#6E5A4D] hover:text-[#A8412A]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAccept} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3A2418] mb-1">
                  Họ tên người đại diện ký duyệt:
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] px-3 py-2 text-xs text-[#3A2418] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2418] mb-1">
                  Ghi chú hoặc lời nhắn kèm theo (tùy chọn):
                </label>
                <textarea
                  value={signerNote}
                  onChange={(e) => setSignerNote(e.target.value)}
                  rows={2}
                  placeholder="Ví dụ: Tôi đồng ý tiến hành và yêu cầu bổ sung hợp đồng bản cứng..."
                  className="w-full rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] px-3 py-2 text-xs text-[#3A2418] outline-none"
                />
              </div>

              <div className="rounded-lg bg-[#FAF5EB] p-3 text-[11px] text-[#6E5A4D] border border-[#E8DECE]">
                Sau khi xác nhận, yêu cầu của bạn sẽ chuyển sang trạng thái <strong>ĐÃ CHỐT (CONVERTED)</strong> và quản trị viên sẽ gửi liên kết thanh toán đợt 1.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAcceptModal(false)}
                  className="btn-ink-secondary text-xs py-2 px-3"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !signerName.trim()}
                  className="btn-ink-primary text-xs py-2 px-5 disabled:opacity-50"
                >
                  {actionLoading ? 'Đang xử lý...' : 'Xác nhận Chấp thuận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TỪ CHỐI BÁO GIÁ */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3A2418]/60 backdrop-blur-2xs p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-[#D4C3AC] bg-[#FFFDF9] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DECE] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2418]">
                Từ chối hoặc Yêu cầu Thay đổi
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-xs text-[#6E5A4D] hover:text-[#A8412A]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3A2418] mb-1">
                  Lý do từ chối hoặc cần điều chỉnh:
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Cần giảm chi phí hạng mục hosting, hoặc bổ sung thêm tính năng thanh toán..."
                  className="w-full rounded-lg border border-[#D4C3AC] bg-[#FAF5EB] px-3 py-2 text-xs text-[#3A2418] outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="btn-ink-secondary text-xs py-2 px-3"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="btn-ink-primary text-xs py-2 px-4 disabled:opacity-50"
                >
                  {actionLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotationViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF5EB] flex items-center justify-center font-serif text-[#6E5A4D]">
          Đang tải hồ sơ báo giá...
        </div>
      }
    >
      <QuotationViewContent />
    </Suspense>
  );
}
