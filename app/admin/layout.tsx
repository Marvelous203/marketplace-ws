'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/context/AuthContext';

const ROLE_BADGE_STYLES: Record<UserRole, { label: string; badgeClass: string; icon: string }> = {
  super_admin: {
    label: 'Super Admin Toàn Sàn',
    badgeClass: 'bg-[#5B1313] text-[#FDE68A] border-[#D97706]/40',
    icon: '👑',
  },
  admin_owner: {
    label: 'Chủ Website (Admin Owner)',
    badgeClass: 'bg-[#0E3D31] text-[#A7F3D0] border-[#059669]/40',
    icon: '🏢',
  },
  tenant: {
    label: 'Doanh Nghiệp (Tenant)',
    badgeClass: 'bg-[#1E3A5F] text-[#BFDBFE] border-[#3B82F6]/40',
    icon: '💼',
  },
  dev_freelance: {
    label: 'Developer Đối Tác',
    badgeClass: 'bg-[#3B1F5C] text-[#E9D5FF] border-[#8B5CF6]/40',
    icon: '💻',
  },
  guest: {
    label: 'Khách Vãng Lai',
    badgeClass: 'bg-[#262626] text-[#D4D4D4] border-[#525252]/40',
    icon: '👤',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, loginAsMock } = useAuth();

  const isLoginPage = pathname === '/admin/login';

  // If on login page, render clean standalone layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#120B07] text-[#FAF5EB]">{children}</div>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#140D08] flex items-center justify-center text-[#FAF5EB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#E0A526] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#C8B8A6]">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect or prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#140D08] flex items-center justify-center p-4 text-[#FAF5EB]">
        <div className="max-w-md w-full bg-[#1C130D] border border-[#3A2418] rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#E0A526]/10 text-[#E0A526] flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-serif font-bold text-[#FAF5EB]">Yêu cầu Đăng nhập</h2>
          <p className="text-xs text-[#C8B8A6] leading-relaxed">
            Bạn cần đăng nhập bằng tài khoản quản trị để truy cập vào phân hệ Quản trị Hệ thống.
          </p>
          <Link
            href="/admin/login"
            className="inline-block w-full py-3 rounded-xl bg-[#E0A526] hover:bg-[#C98F1D] text-[#140D08] font-bold text-xs uppercase tracking-wider transition shadow-lg"
          >
            Đến Trang Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  // 403 Forbidden for guest users
  if (user.role === 'guest') {
    return (
      <div className="min-h-screen bg-[#140D08] flex items-center justify-center p-4 text-[#FAF5EB]">
        <div className="max-w-lg w-full bg-[#1C130D] border border-red-900/60 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 flex items-center justify-center mx-auto text-3xl">
            ⛔
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-900/40 text-red-300 border border-red-700/40">
              403 Forbidden
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#FAF5EB] mt-3">Truy Cập Bị Từ Chối</h2>
            <p className="text-xs text-[#C8B8A6] mt-2 leading-relaxed">
              Tài khoản hiện tại của bạn là <strong className="text-white">Khách Vãng Lai (guest)</strong>. Bạn không có quyền truy cập vào phân hệ Quản trị Sàn hoặc Quản trị Website.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-[#3A2418] text-left text-xs space-y-2">
            <p className="font-semibold text-[#E0A526]">💡 Chuyển đổi nhanh vai trò để kiểm thử:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => loginAsMock('super_admin')}
                className="px-3 py-1.5 rounded-lg bg-[#5B1313] hover:bg-[#781B1B] text-[#FDE68A] font-semibold text-[11px] border border-[#D97706]/40 transition"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => loginAsMock('admin_owner')}
                className="px-3 py-1.5 rounded-lg bg-[#0E3D31] hover:bg-[#165A48] text-[#A7F3D0] font-semibold text-[11px] border border-[#059669]/40 transition"
              >
                🏢 Admin Owner
              </button>
              <button
                type="button"
                onClick={() => loginAsMock('tenant')}
                className="px-3 py-1.5 rounded-lg bg-[#1E3A5F] hover:bg-[#284E7D] text-[#BFDBFE] font-semibold text-[11px] border border-[#3B82F6]/40 transition"
              >
                💼 Tenant
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/login"
              className="flex-1 py-2.5 rounded-xl border border-[#3A2418] text-xs font-semibold text-[#FAF5EB] hover:bg-[#261A12] transition"
            >
              Đăng Nhập Khác
            </Link>
            <Link
              href="/marketplace"
              className="flex-1 py-2.5 rounded-xl bg-[#E0A526] hover:bg-[#C98F1D] text-[#140D08] font-bold text-xs uppercase tracking-wider transition"
            >
              Về Sàn Phố Nghề
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roleMeta = ROLE_BADGE_STYLES[user.role] || ROLE_BADGE_STYLES.tenant;
  const isSuperAdmin = user.role === 'super_admin';
  const isAdminOwner = user.role === 'admin_owner';

  return (
    <div className="min-h-screen bg-[#140D08] text-[#FAF5EB] flex">
      {/* ── DEDICATED ADMIN SIDEBAR (SƠN MÀI TỐI GIẢN) ── */}
      <aside className="w-64 bg-[#1C130D] border-r border-[#3A2418] flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#3A2418]/80">
          <Link href="/admin/requests" className="block">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0A526] shadow-[0_0_8px_#E0A526]" />
              <span className="font-serif font-black tracking-widest text-lg uppercase text-[#FAF5EB]">
                PHỐ NGHỀ
              </span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#E0A526] mt-1">
              {isSuperAdmin ? 'TỔNG QUẢN TRỊ TOÀN SÀN' : isAdminOwner ? 'HỆ THỐNG QUẢN TRỊ WEBSITE' : 'KHÔNG GIAN DOANH NGHIỆP'}
            </p>
          </Link>

          {/* Tenant Website Context Badge */}
          {isAdminOwner && user.websiteName && (
            <div className="mt-4 p-2.5 rounded-xl bg-[#0E3D31]/40 border border-[#059669]/30 text-left">
              <p className="text-[10px] text-[#A7F3D0] uppercase tracking-wider font-semibold">
                🌐 Website Quản Trị
              </p>
              <p className="text-xs font-bold text-[#FAF5EB] truncate mt-0.5">{user.websiteName}</p>
              {user.websiteDomain && (
                <p className="text-[10px] text-[#C8B8A6] font-mono truncate">{user.websiteDomain}</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-none text-xs">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B]">
            Quản Lý Nghiệp Vụ
          </div>

          {/* Yêu cầu báo giá */}
          <Link
            href="/admin/requests"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition ${
              pathname.startsWith('/admin/requests')
                ? 'bg-[#E0A526]/15 text-[#E0A526] border border-[#E0A526]/30 font-semibold'
                : 'text-[#C8B8A6] hover:bg-[#261A12] hover:text-[#FAF5EB]'
            }`}
          >
            <span className="text-base">📋</span>
            <span>Yêu Cầu Báo Giá</span>
          </Link>

          {/* Quản lý User & Phân quyền (Highlight for Super Admin) */}
          <Link
            href="/admin/users"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition ${
              pathname.startsWith('/admin/users')
                ? 'bg-[#E0A526]/15 text-[#E0A526] border border-[#E0A526]/30 font-semibold'
                : 'text-[#C8B8A6] hover:bg-[#261A12] hover:text-[#FAF5EB]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">👥</span>
              <span>Quản Lý Users & Roles</span>
            </div>
            {isSuperAdmin && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#5B1313] text-[#FDE68A] border border-[#D97706]/40">
                Super
              </span>
            )}
          </Link>

          <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B]">
            Hệ Thống Phố Nghề
          </div>

          <Link
            href="/marketplace"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#C8B8A6] hover:bg-[#261A12] hover:text-[#FAF5EB] transition"
          >
            <span className="text-base">🏪</span>
            <span>Về Sàn Khách Hàng</span>
          </Link>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-[#3A2418] bg-[#140D08]/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#FAF5EB] truncate">{user.fullName}</p>
              <p className="text-[10px] text-[#8C7A6B] truncate">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-[#C8B8A6] hover:text-red-400 hover:bg-[#261A12] transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleMeta.badgeClass}`}
            >
              <span>{roleMeta.icon}</span>
              <span>{roleMeta.label}</span>
            </span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF5EB] text-[#3A2418]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#1C130D] border-b border-[#3A2418] px-6 flex items-center justify-between shadow-sm select-none">
          <div className="flex items-center gap-4 text-xs text-[#C8B8A6]">
            <span className="font-semibold text-[#FAF5EB]">Bảng Điều Khiển Quản Trị</span>
            <span>/</span>
            <span className="text-[#E0A526] font-medium capitalize">
              {pathname.replace('/admin/', '').replace('/', ' - ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Role Switcher for Testing */}
            <div className="hidden lg:flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-[#3A2418]">
              <span className="text-[10px] text-[#8C7A6B] px-2 font-mono uppercase">Role Test:</span>
              {(['super_admin', 'admin_owner', 'tenant', 'dev_freelance'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => loginAsMock(r)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    user.role === r
                      ? 'bg-[#E0A526] text-[#140D08]'
                      : 'text-[#C8B8A6] hover:text-[#FAF5EB]'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#3A2418]">
              <div className="w-8 h-8 rounded-full bg-[#E0A526]/20 border border-[#E0A526]/40 text-[#E0A526] flex items-center justify-center font-bold text-xs">
                {user.fullName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-[#FAF5EB] leading-none">{user.fullName}</p>
                <p className="text-[10px] text-[#8C7A6B] mt-0.5 font-mono">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
