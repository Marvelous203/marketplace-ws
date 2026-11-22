import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Phố Nghề — Sàn Giải pháp Website Tiêu chuẩn & Diễn đàn Kỹ thuật',
  description:
    'Nền tảng mua bản quyền mã nguồn website, thuê trọn gói và đăng ký Cloud SaaS. Giao diện mộc mạc, minh bạch chi phí, bảo chứng chất lượng cho doanh nghiệp Việt.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${lora.variable}`}>
      <body className="bg-[#FAF5EB] text-[#3A2418] antialiased selection:bg-[#E0A526]/30 selection:text-[#3A2418]">
        {children}
      </body>
    </html>
  );
}
