'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

function NavLinks() {
  const pathname = usePathname() || '';

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/marketplace', label: 'Kho Phố Nghề' },
    { href: '/community', label: 'Diễn đàn & Cần giải pháp' },
    { href: '/request-project', label: 'Gửi Yêu cầu Làm Web' },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1.5" aria-label="Điều hướng chính">
      {navLinks.map((link) => {
        const isActive =
          link.href === '/'
            ? pathname === '/'
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              isActive
                ? 'bg-[#E8DECE]/70 text-[#3A2418] font-bold shadow-xs'
                : 'text-[#6E5A4D] hover:bg-[#FAF5EB] hover:text-[#3A2418]'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function MarketplaceNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DECE] bg-[#FFFDF9]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Phong cách Phố nghề */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Con dấu triện đỏ logo */}
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border-1.5 border-[#A8412A] bg-[#A8412A]/10 text-[#A8412A] font-serif font-black text-base shadow-xs group-hover:bg-[#A8412A] group-hover:text-[#FAF5EB] transition-colors">
              Phố
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-[#3A2418] leading-none">
                PHỐ NGHỀ
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#6E5A4D] font-medium mt-0.5">
                Sàn Web Doanh Nghiệp
              </span>
            </div>
            <span className="chop-seal hidden sm:inline-flex ml-1">
              ĐÃ KIỂM
            </span>
          </Link>

          {/* Navigation Links */}
          <Suspense fallback={<div className="hidden md:flex w-64 h-8" />}>
            <NavLinks />
          </Suspense>
        </div>

        {/* Action Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/request-project"
            className="btn-ink-primary text-xs py-2 px-3.5"
          >
            <span className="hidden sm:inline">+ Báo giá theo yêu cầu</span>
            <span className="sm:hidden">+ Gửi yêu cầu</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
