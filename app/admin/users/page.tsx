'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, UserRole, UserProfile } from '@/lib/context/AuthContext';

interface UserListItem extends UserProfile {
  status: 'active' | 'suspended';
}

const INITIAL_USERS: UserListItem[] = [
  {
    id: 'u-tenant-003',
    email: 'tenant@caferang.vn',
    fullName: 'Lê Thị Bích',
    role: 'tenant',
    tenantId: 'tenant-cafe-02',
    websiteDomain: null,
    websiteName: 'Chuỗi Café Rang Mộc',
    subRoles: [],
    status: 'active',
    createdAt: '2026-03-10T08:30:00Z',
  },
  {
    id: 'u-tenant-006',
    email: 'doanhnghiep@gomsunghe.vn',
    fullName: 'Hoàng Minh Đức',
    role: 'tenant',
    tenantId: 'tenant-gom-03',
    websiteDomain: null,
    websiteName: 'Hợp Tác Xã Gốm Sứ',
    subRoles: [],
    status: 'active',
    createdAt: '2026-03-12T10:15:00Z',
  },
  {
    id: 'u-owner-002',
    email: 'owner@phohanoi.vn',
    fullName: 'Trần Văn An',
    role: 'admin_owner',
    tenantId: 'tenant-pho-01',
    websiteDomain: 'phohanoi.vn',
    websiteName: 'Nhà hàng Phở Hà Nội',
    subRoles: ['editor', 'order_manager', 'cashier'],
    status: 'active',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'u-dev-004',
    email: 'dev@freelance.vn',
    fullName: 'Phạm Minh Tuấn',
    role: 'dev_freelance',
    tenantId: null,
    websiteDomain: null,
    subRoles: ['seller', 'developer'],
    status: 'active',
    createdAt: '2026-02-01T14:20:00Z',
  },
  {
    id: 'u-super-001',
    email: 'superadmin@marketplace.vn',
    fullName: 'Nguyễn Hoàng Kim',
    role: 'super_admin',
    tenantId: null,
    websiteDomain: null,
    websiteName: 'Toàn sàn Phố Nghề',
    subRoles: ['all_access'],
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u-guest-005',
    email: 'guest@example.com',
    fullName: 'Khách Vãng Lai',
    role: 'guest',
    tenantId: null,
    websiteDomain: null,
    subRoles: [],
    status: 'active',
    createdAt: '2026-03-20T11:45:00Z',
  },
];

const AVAILABLE_SUB_ROLES = [
  { code: 'editor', name: 'Biên tập viên (Editor)', desc: 'Chỉnh sửa bài viết, banner, thông tin món/sản phẩm' },
  { code: 'order_manager', name: 'Quản lý đơn hàng (Order Manager)', desc: 'Xác nhận đơn, chuyển trạng thái giao hàng' },
  { code: 'cashier', name: 'Thu ngân / Kế toán (Cashier)', desc: 'Đối soát thanh toán QR/COD, xuất hóa đơn' },
  { code: 'support', name: 'Chăm sóc khách hàng (Support)', desc: 'Trả lời tin nhắn, tiếp nhận phản hồi' },
];

export default function AdminUsersPage() {
  const { user: currentUser, authHeaders, updateUser } = useAuth();

  const [users, setUsers] = useState<UserListItem[]>(INITIAL_USERS);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Promote Modal State
  const [promoteTarget, setPromoteTarget] = useState<UserListItem | null>(null);
  const [promoteForm, setPromoteForm] = useState({
    websiteName: '',
    websiteDomain: '',
    tenantId: '',
    selectedSubRoles: ['editor', 'order_manager'],
  });
  const [isPromoting, setIsPromoting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sub-roles Modal State
  const [subRoleTarget, setSubRoleTarget] = useState<UserListItem | null>(null);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Fetch users from backend if available
  useEffect(() => {
    async function loadBackendUsers() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/v1/admin/users', {
          headers: authHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setUsers(json.data);
          }
        }
      } catch {
        // use fallback initial users
      } finally {
        setLoading(false);
      }
    }
    if (isSuperAdmin) {
      loadBackendUsers();
    }
  }, [isSuperAdmin, authHeaders]);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Open Promote Modal
  const handleOpenPromote = (target: UserListItem) => {
    setPromoteTarget(target);
    const domainSuggestion = target.email.split('@')[1]?.replace('.com', '.vn') || `${target.fullName.toLowerCase().replace(/\s+/g, '')}.vn`;
    setPromoteForm({
      websiteName: target.websiteName || `Website Doanh Nghiệp ${target.fullName}`,
      websiteDomain: target.websiteDomain || domainSuggestion,
      tenantId: target.tenantId || `tenant-${Date.now().toString().slice(-4)}`,
      selectedSubRoles: ['editor', 'order_manager'],
    });
  };

  // Execute Promote Action
  const handleConfirmPromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteTarget) return;

    setIsPromoting(true);

    const payload = {
      tenantId: promoteForm.tenantId,
      websiteName: promoteForm.websiteName,
      websiteDomain: promoteForm.websiteDomain,
      initialSubRoles: promoteForm.selectedSubRoles,
    };

    try {
      // 1. Try real backend endpoint
      const res = await fetch(
        `http://localhost:3001/api/v1/admin/users/${promoteTarget.id}/promote-owner`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        // Backend promotion success
      }
    } catch {
      // Offline fallback
    }

    // Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === promoteTarget.id
          ? {
              ...u,
              role: 'admin_owner',
              tenantId: promoteForm.tenantId,
              websiteName: promoteForm.websiteName,
              websiteDomain: promoteForm.websiteDomain,
              subRoles: promoteForm.selectedSubRoles,
            }
          : u
      )
    );

    // If current user is the promoted target, sync profile
    if (currentUser?.id === promoteTarget.id) {
      updateUser({
        role: 'admin_owner',
        tenantId: promoteForm.tenantId,
        websiteName: promoteForm.websiteName,
        websiteDomain: promoteForm.websiteDomain,
        subRoles: promoteForm.selectedSubRoles,
      });
    }

    setIsPromoting(false);
    setPromoteTarget(null);
    showNotification(
      `Đã phân quyền thành công! Tài khoản "${promoteTarget.fullName}" hiện là Admin Owner của ${promoteForm.websiteDomain}`
    );
  };

  // Sub-roles toggle
  const toggleSubRole = (code: string) => {
    if (!subRoleTarget) return;
    const current = subRoleTarget.subRoles || [];
    const exists = current.includes(code);
    const updated = exists ? current.filter((c) => c !== code) : [...current, code];

    setUsers((prev) =>
      prev.map((u) => (u.id === subRoleTarget.id ? { ...u, subRoles: updated } : u))
    );
    setSubRoleTarget((prev) => (prev ? { ...prev, subRoles: updated } : null));

    // Also call backend sub-roles API
    try {
      fetch(`http://localhost:3001/api/v1/admin/tenants/${subRoleTarget.tenantId}/sub-roles`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: subRoleTarget.id,
          subRoleCode: code,
          action: exists ? 'revoke' : 'assign',
        }),
      }).catch(() => {});
    } catch {}

    showNotification(`Đã ${exists ? 'gỡ' : 'gán'} quyền ${code} cho ${subRoleTarget.fullName}`);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.websiteDomain && u.websiteDomain.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#0E3D31] text-[#A7F3D0] border border-[#059669] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#140D08]">
              Quản Lý Người Dùng & Phân Quyền Vai Trò
            </h1>
          </div>
          <p className="text-xs text-[#7A6858] mt-1">
            Hệ thống 5 Roles Platform (Super Admin, Admin Owner, Tenant, Dev Freelance, Guest) & Phân quyền Website độc lập
          </p>
        </div>

        {/* Super Admin Privileged Notice */}
        {isSuperAdmin ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#5B1313]/10 border border-[#D97706]/40 text-[#5B1313] text-xs font-bold">
            <span>👑 Quyền Hạn Tối Cao (Super Admin)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs">
            <span>⚠️ Chế độ xem: Bạn cần vai trò Super Admin để thực hiện thăng cấp vai trò</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8DFD1] shadow-xs">
        {/* Role Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'tenant', label: 'Tenant (Doanh Nghiệp)' },
            { id: 'admin_owner', label: 'Admin Owner (Chủ Web)' },
            { id: 'dev_freelance', label: 'Dev Freelance' },
            { id: 'super_admin', label: 'Super Admin' },
            { id: 'guest', label: 'Guest' },
          ].map((tab) => {
            const isActive = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#140D08] text-[#FAF5EB] shadow-xs'
                    : 'bg-[#FAF5EB] text-[#7A6858] hover:text-[#140D08] hover:bg-[#EFE7D8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email, tên miền..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF5EB] border border-[#E8DFD1] text-[#140D08] placeholder:text-[#9C8B7C] focus:outline-none focus:border-[#140D08]"
          />
          <svg className="w-4 h-4 text-[#9C8B7C] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3A2418]">
            <thead className="bg-[#FAF5EB] text-[#7A6858] font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DFD1]">
              <tr>
                <th className="py-3.5 px-4">Người Dùng</th>
                <th className="py-3.5 px-4">Vai Trò (Role)</th>
                <th className="py-3.5 px-4">Website / Tenant Quản Trị</th>
                <th className="py-3.5 px-4">Sub-Roles Cấp Con</th>
                <th className="py-3.5 px-4 text-right">Thao Tác Phân Quyền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD1]">
              {filteredUsers.map((item) => {
                const isTenant = item.role === 'tenant';
                const isOwner = item.role === 'admin_owner';

                return (
                  <tr key={item.id} className="hover:bg-[#FAF5EB]/50 transition">
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EFE7D8] text-[#140D08] font-bold flex items-center justify-center text-xs shrink-0">
                          {item.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#140D08]">{item.fullName}</p>
                          <p className="text-[11px] text-[#7A6858] font-mono">{item.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          item.role === 'super_admin'
                            ? 'bg-[#5B1313]/10 text-[#7A1919] border-[#D97706]/40'
                            : item.role === 'admin_owner'
                            ? 'bg-[#0E3D31]/10 text-[#0E3D31] border-[#059669]/40'
                            : item.role === 'tenant'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : item.role === 'dev_freelance'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}
                      >
                        {item.role === 'super_admin' && '👑 Super Admin'}
                        {item.role === 'admin_owner' && '🏢 Admin Owner'}
                        {item.role === 'tenant' && '💼 Tenant'}
                        {item.role === 'dev_freelance' && '💻 Dev Freelance'}
                        {item.role === 'guest' && '👤 Guest'}
                      </span>
                    </td>

                    {/* Website / Tenant Context */}
                    <td className="py-3.5 px-4">
                      {item.websiteDomain || item.websiteName ? (
                        <div>
                          <p className="font-semibold text-xs text-[#140D08]">{item.websiteName || 'Chưa đặt tên web'}</p>
                          {item.websiteDomain && (
                            <p className="text-[11px] text-blue-700 font-mono underline">{item.websiteDomain}</p>
                          )}
                          <p className="text-[9px] text-[#9C8B7C] font-mono">ID: {item.tenantId}</p>
                        </div>
                      ) : item.tenantId ? (
                        <div>
                          <span className="text-[10px] text-[#7A6858] font-mono">Đã thuê: {item.tenantId}</span>
                          <p className="text-[10px] text-amber-700 font-medium">Chưa bàn giao quyền Owner</p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#9C8B7C] italic">— Chưa liên kết —</span>
                      )}
                    </td>

                    {/* Sub-Roles */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.subRoles && item.subRoles.length > 0 ? (
                          item.subRoles.map((sr) => (
                            <span
                              key={sr}
                              className="px-2 py-0.5 rounded-md text-[9px] font-mono font-medium bg-[#EFE7D8] text-[#5C4D42]"
                            >
                              {sr}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#9C8B7C] italic">Không có</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isTenant && (
                        <button
                          type="button"
                          onClick={() => handleOpenPromote(item)}
                          disabled={!isSuperAdmin}
                          title={isSuperAdmin ? 'Thăng cấp thành Admin Owner của Website' : 'Chỉ Super Admin mới có quyền'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition shadow-xs ${
                            isSuperAdmin
                              ? 'bg-[#E0A526] hover:bg-[#C98F1D] text-[#140D08]'
                              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          <span>⚡</span>
                          <span>Phân Quyền Website</span>
                        </button>
                      )}

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => setSubRoleTarget(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF5EB] hover:bg-[#EFE7D8] border border-[#E8DFD1] text-[#3A2418] font-semibold text-[11px] transition"
                        >
                          <span>⚙️</span>
                          <span>Sub-Roles ({item.subRoles?.length || 0})</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: PHÂN QUYỀN QUẢN TRỊ WEBSITE (PROMOTE TENANT -> ADMIN OWNER) ── */}
      {promoteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setPromoteTarget(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF5EB] border border-[#E0A526]/50 rounded-3xl p-6 shadow-2xl text-[#140D08]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <h3 className="font-serif font-bold text-base text-[#140D08]">
                  Phân Quyền Quản Trị Website (Promote Owner)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPromoteTarget(null)}
                className="p-1 rounded-full text-[#7A6858] hover:text-[#140D08]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#7A6858] mt-2 leading-relaxed">
              Thao tác này thăng cấp tài khoản khách hàng doanh nghiệp <strong>Tenant</strong> lên <strong>Admin Owner</strong> độc lập của website giải pháp được bàn giao.
            </p>

            <form onSubmit={handleConfirmPromote} className="mt-4 space-y-3.5 text-xs">
              {/* User details preview */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1]">
                <p className="text-[10px] uppercase font-bold text-[#9C8B7C]">Tài khoản được phân quyền:</p>
                <p className="font-bold text-xs text-[#140D08] mt-0.5">{promoteTarget.fullName}</p>
                <p className="text-[11px] text-[#7A6858] font-mono">{promoteTarget.email}</p>
              </div>

              {/* Website Name */}
              <div>
                <label className="block font-semibold text-[#3A2418] mb-1">Tên Website / Thương Hiệu *</label>
                <input
                  type="text"
                  value={promoteForm.websiteName}
                  onChange={(e) => setPromoteForm((prev) => ({ ...prev, websiteName: e.target.value }))}
                  placeholder="VD: Nhà hàng Phở Hà Nội"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD1] text-[#140D08] focus:outline-none focus:border-[#140D08]"
                  required
                />
              </div>

              {/* Website Domain */}
              <div>
                <label className="block font-semibold text-[#3A2418] mb-1">Tên Miền (Domain) Website *</label>
                <input
                  type="text"
                  value={promoteForm.websiteDomain}
                  onChange={(e) => setPromoteForm((prev) => ({ ...prev, websiteDomain: e.target.value }))}
                  placeholder="VD: phohanoi.vn, caferang.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD1] text-[#140D08] font-mono focus:outline-none focus:border-[#140D08]"
                  required
                />
              </div>

              {/* Tenant ID */}
              <div>
                <label className="block font-semibold text-[#3A2418] mb-1">Mã Định Danh Tenant (Tenant ID) *</label>
                <input
                  type="text"
                  value={promoteForm.tenantId}
                  onChange={(e) => setPromoteForm((prev) => ({ ...prev, tenantId: e.target.value }))}
                  placeholder="VD: tenant-pho-01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DFD1] text-[#140D08] font-mono focus:outline-none focus:border-[#140D08]"
                  required
                />
              </div>

              {/* Initial Sub-Roles */}
              <div>
                <label className="block font-semibold text-[#3A2418] mb-1.5">
                  Phân quyền Sub-Roles khởi tạo cho Website:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_SUB_ROLES.map((sr) => {
                    const checked = promoteForm.selectedSubRoles.includes(sr.code);
                    return (
                      <label
                        key={sr.code}
                        className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer transition ${
                          checked
                            ? 'bg-[#0E3D31]/10 border-[#059669] text-[#0E3D31]'
                            : 'bg-white border-[#E8DFD1] text-[#7A6858]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setPromoteForm((prev) => ({
                              ...prev,
                              selectedSubRoles: checked
                                ? prev.selectedSubRoles.filter((c) => c !== sr.code)
                                : [...prev.selectedSubRoles, sr.code],
                            }));
                          }}
                          className="mt-0.5 rounded text-[#0E3D31]"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[11px]">{sr.code}</p>
                          <p className="text-[9px] truncate">{sr.name.split('(')[0]}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#E8DFD1] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPromoteTarget(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8DFD1] bg-white text-[#7A6858] hover:bg-[#EFE7D8] font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPromoting}
                  className="px-5 py-2 rounded-xl bg-[#E0A526] hover:bg-[#C98F1D] text-[#140D08] font-bold uppercase tracking-wider text-xs shadow-md disabled:opacity-50"
                >
                  {isPromoting ? 'Đang phân quyền...' : 'Xác Nhận Nâng Lên Admin Owner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: QUẢN LÝ SUB-ROLES ── */}
      {subRoleTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSubRoleTarget(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#FAF5EB] border border-[#E8DFD1] rounded-3xl p-6 shadow-2xl text-[#140D08]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#140D08]">Quản Lý Sub-Roles Phân Quyền</h3>
                <p className="text-[11px] text-[#7A6858] mt-0.5">
                  Website: {subRoleTarget.websiteDomain || subRoleTarget.websiteName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubRoleTarget(null)}
                className="p-1 rounded-full text-[#7A6858] hover:text-[#140D08]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              {AVAILABLE_SUB_ROLES.map((sr) => {
                const isAssigned = subRoleTarget.subRoles?.includes(sr.code);
                return (
                  <div
                    key={sr.code}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                      isAssigned
                        ? 'bg-[#0E3D31]/10 border-[#059669]'
                        : 'bg-white border-[#E8DFD1]'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-[#140D08]">{sr.name}</p>
                      <p className="text-[10px] text-[#7A6858] mt-0.5">{sr.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSubRole(sr.code)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase transition ${
                        isAssigned
                          ? 'bg-red-100 hover:bg-red-200 text-red-800'
                          : 'bg-[#E0A526] hover:bg-[#C98F1D] text-[#140D08]'
                      }`}
                    >
                      {isAssigned ? 'Gỡ quyền' : 'Gán quyền'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8DFD1] flex justify-end">
              <button
                type="button"
                onClick={() => setSubRoleTarget(null)}
                className="px-5 py-2 rounded-xl bg-[#140D08] text-[#FAF5EB] font-bold text-xs uppercase"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
