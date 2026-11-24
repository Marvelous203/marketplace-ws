'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole, MOCK_USERS } from '@/lib/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loginAsMock, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);

    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      router.push('/admin/requests');
    } else {
      setErrorMsg(res.error || 'Đăng nhập không thành công');
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setSubmitting(true);
    await loginAsMock(role);
    setSubmitting(false);
    if (role === 'guest') {
      router.push('/admin/requests'); // will show 403 screen for demonstration
    } else {
      router.push('/admin/requests');
    }
  };

  const roleDescriptions: Record<UserRole, { title: string; desc: string; icon: string; badge: string }> = {
    super_admin: {
      title: 'Super Admin',
      desc: 'Quản trị viên tối cao sàn. Có quyền phân quyền Tenant thành Admin Owner và quản lý hệ thống.',
      icon: '👑',
      badge: 'Toàn Quyền Sàn',
    },
    admin_owner: {
      title: 'Admin Owner',
      desc: 'Chủ sở hữu website cụ thể (VD: phohanoi.vn). Quản lý đơn hàng, nội dung & phân quyền sub-roles.',
      icon: '🏢',
      badge: 'Chủ Website',
    },
    tenant: {
      title: 'Tenant (Doanh Nghiệp)',
      desc: 'Doanh nghiệp đã mua/thuê giải pháp website. Có thể được Super Admin thăng cấp thành Admin Owner.',
      icon: '💼',
      badge: 'Khách Hàng SaaS',
    },
    dev_freelance: {
      title: 'Dev Freelance',
      desc: 'Developer & Seller tự do đăng giải pháp, nhận yêu cầu tùy biến và gửi báo giá.',
      icon: '💻',
      badge: 'Đối Tác Kỹ Thuật',
    },
    guest: {
      title: 'Khách Vãng Lai (Guest)',
      desc: 'Người dùng vãng lai xem diễn đàn và catalog. Bị chặn 403 khi vào trang Quản trị.',
      icon: '👤',
      badge: 'Chưa Phân Quyền',
    },
  };

  return (
    <div className="min-h-screen bg-[#120B07] text-[#FAF5EB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,165,38,0.08),transparent_60%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/marketplace" className="inline-flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-[#E0A526] shadow-[0_0_10px_#E0A526]" />
          <span className="font-serif font-black tracking-widest text-2xl uppercase text-[#FAF5EB]">
            PHỐ NGHỀ
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF5EB] tracking-tight">
          Cổng Đăng Nhập Quản Trị Hệ Thống
        </h2>
        <p className="mt-1.5 text-xs text-[#C8B8A6]">
          Phân quyền truy cập 5 Roles & Quản lý Tenant Website độc lập
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 space-y-6">
        {/* Quick Role Selection Cards */}
        <div className="bg-[#1C130D] border border-[#3A2418] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3A2418]">
            <div className="flex items-center gap-2">
              <span className="text-[#E0A526]">⚡</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF5EB]">
                Đăng Nhập Nhanh Theo Vai Trò (Testing 5 Roles)
              </h3>
            </div>
            <span className="text-[10px] text-[#8C7A6B] font-mono">1-Click Fast Auth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(roleDescriptions) as UserRole[]).map((r) => {
              const meta = roleDescriptions[r];
              const mock = MOCK_USERS[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleQuickLogin(r)}
                  disabled={submitting}
                  className="group relative p-3.5 rounded-2xl bg-[#140D08]/80 border border-[#3A2418] hover:border-[#E0A526]/50 hover:bg-[#261A12] text-left transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meta.icon}</span>
                        <span className="font-bold text-xs text-[#FAF5EB] group-hover:text-[#E0A526] transition">
                          {meta.title}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white/5 text-[#C8B8A6] border border-white/10">
                        {meta.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C7A6B] mt-1.5 line-clamp-2 leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#3A2418]/60 flex items-center justify-between text-[10px]">
                    <span className="text-[#A39281] font-mono truncate max-w-[150px]">
                      {mock.email}
                    </span>
                    <span className="font-semibold text-[#E0A526] group-hover:translate-x-0.5 transition">
                      Chọn vai trò →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standard Email / Password Form */}
        <div className="bg-[#1C130D] border border-[#3A2418] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#3A2418]">
            <span className="text-[#C8B8A6]">🔑</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF5EB]">
              Hoặc Đăng Nhập Bằng Tài Khoản Email
            </h3>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Email quản trị *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@marketplace.vn"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#140D08] border border-[#3A2418] text-[#FAF5EB] placeholder:text-[#5C4D42] focus:outline-none focus:border-[#E0A526] transition"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-neutral-300 font-medium">Mật khẩu *</label>
                <span className="text-[11px] text-[#8C7A6B]">(Mặc định: bất kỳ hoặc P@ssw0rd)</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#140D08] border border-[#3A2418] text-[#FAF5EB] placeholder:text-[#5C4D42] focus:outline-none focus:border-[#E0A526] transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-[#E0A526] hover:bg-[#C98F1D] text-[#140D08] font-bold text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Đang xác thực...' : 'Đăng Nhập Vào Hệ Thống'}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/marketplace"
            className="text-xs text-[#8C7A6B] hover:text-[#FAF5EB] underline transition"
          >
            ← Quay lại Sàn Khách Hàng Phố Nghề
          </Link>
        </div>
      </div>
    </div>
  );
}
