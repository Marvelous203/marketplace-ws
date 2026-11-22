import { paths } from './types.js';

export type Category =
  paths['/api/v1/public/categories']['get']['responses']['200']['content']['application/json'][number];

export type Tag =
  paths['/api/v1/public/tags']['get']['responses']['200']['content']['application/json'][number];

export type FeatureDefinition =
  paths['/api/v1/public/features']['get']['responses']['200']['content']['application/json'][number];

export type ListingSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  listingKind: string;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
  };
  seller: {
    id: string;
    name: string;
    slug: string;
    sellerType: string;
  };
  coverImage?: {
    id: string;
    url: string;
    altText: string;
    mediaType: string;
    isPrimary: boolean;
  } | null;
  tags: Tag[];
  availableFulfillmentTypes: string[];
  priceSummary?: {
    label: string;
    amountMinor: number;
    formattedPrice: string;
    currency: string;
  };
  featured: boolean;
};

export type Offer = {
  id: string;
  code: string;
  name: string;
  description: string;
  fulfillmentType: 'SOURCE_CODE' | 'MANAGED_SERVICE' | 'SAAS' | 'CUSTOM_PROJECT';
  pricingModel: 'FIXED' | 'STARTING_AT' | 'QUOTE' | 'SUBSCRIPTION';
  status: string;
  requiresConsultation: boolean;
  licenseSummary?: string;
  deliveryScope: {
    included: string[];
    excluded: string[];
    deliverables: string[];
  };
  billingInterval?: 'ONE_TIME' | 'WEEK' | 'MONTH' | 'YEAR';
  price?: {
    currency: string;
    amountMinor: number;
    formattedPrice: string;
    billingInterval: string;
  };
};

export type ListingDetail = ListingSummary & {
  description: string;
  demoUrl?: string;
  previewMode: 'EXTERNAL_LINK' | 'APPROVED_EMBED' | 'SCREENSHOTS';
  gallery: {
    id: string;
    url: string;
    altText: string;
    mediaType: string;
    isPrimary: boolean;
  }[];
  features: { key: string; label: string; value: string | boolean | number }[];
  offers: Offer[];
  publishedAt?: string;
};

export type ThreadType =
  | 'DISCUSSION'
  | 'QUESTION'
  | 'SHOWCASE'
  | 'WANTED'
  | 'ANNOUNCEMENT';

export type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  allowedThreadTypes: string[];
  threadCount: number;
};

export type ForumThread = {
  id: string;
  categorySlug: string;
  categoryName: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    badge?: 'SELLER_VERIFIED' | 'STAFF' | 'TRUSTED_MEMBER' | 'NEW_MEMBER';
  };
  threadType: ThreadType;
  title: string;
  slug: string;
  summary: string;
  bodyMd: string;
  status: string;
  pinned: boolean;
  replyCount: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  lastActivityAt: string;
  wantedDetails?: {
    goalSummary: string;
    budgetRange: string;
    budgetCurrency: string;
    targetDate?: string;
    status: string;
    proposalCount: number;
  };
  questionDetails?: {
    hasAcceptedAnswer: boolean;
  };
  showcaseDetails?: {
    relatedListingSlug?: string;
    relatedListingTitle?: string;
    coverImageUrl?: string;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Dữ liệu mẫu Fallback khi backend chưa bật server local
const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Nhà hàng & Ẩm thực', slug: 'food-beverage', description: 'Website nhà hàng, cafe, quán ăn', sortOrder: 1, isActive: true },
  { id: 'cat-fashion', name: 'Thời trang & Mỹ phẩm', slug: 'fashion-apparel', description: 'Thương mại điện tử cao cấp, lookbook', sortOrder: 2, isActive: true },
  { id: 'cat-health', name: 'Y tế & Phòng khám', slug: 'healthcare', description: 'Cổng thông tin phòng khám, đặt lịch khám', sortOrder: 3, isActive: true },
  { id: 'cat-edu', name: 'Giáo dục & Khóa học', slug: 'education', description: 'Trung tâm đào tạo, tuyển sinh trực tuyến', sortOrder: 4, isActive: true },
  { id: 'cat-hotel', name: 'Khách sạn & Nghỉ dưỡng', slug: 'hospitality', description: 'Khách sạn, homestay, booking phòng', sortOrder: 5, isActive: true },
];

const FALLBACK_LISTINGS: ListingDetail[] = [
  {
    id: 'list-restaurant-pro',
    slug: 'restaurant-pro',
    title: 'Restaurant Pro — Mẫu Website Nhà hàng & Đặt bàn Cao cấp',
    shortDescription: 'Giao diện phong cách sang trọng, tối ưu hình ảnh món ăn, tích hợp đặt bàn giữ chỗ và thực đơn QR.',
    description: `<h3>Giải pháp toàn diện cho Nhà hàng & Chuỗi F&B</h3>
<p>Restaurant Pro được xây dựng trên công nghệ Next.js hiện đại, tối ưu tốc độ tải trang cực nhanh, đạt 98+ điểm Google PageSpeed.</p>
<h4>Tính năng nổi bật:</h4>
<ul>
  <li>Form đặt bàn thông minh tự động kiểm tra khung giờ và số khách.</li>
  <li>Thực đơn điện tử phân nhóm khai vị, món chính, đồ uống kèm giá và hình ảnh sắc nét.</li>
  <li>Kết nối Google Maps chỉ đường và nút gọi hotline tức thời.</li>
  <li>Trang giới thiệu câu chuyện đầu bếp và không gian nhà hàng.</li>
</ul>`,
    listingKind: 'BUSINESS_WEBSITE',
    status: 'PUBLISHED',
    featured: true,
    category: {
      id: 'cat-food',
      name: 'Nhà hàng & Ẩm thực',
      slug: 'food-beverage',
      description: 'Website nhà hàng, cafe, quán ăn',
      sortOrder: 1,
      isActive: true,
    },
    seller: {
      id: 'org-platform',
      name: 'Platform Studio',
      slug: 'platform',
      sellerType: 'PLATFORM',
    },
    coverImage: {
      id: 'med-rest-1',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      altText: 'Ảnh tổng quan trang chủ nhà hàng cao cấp',
      mediaType: 'IMAGE',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'med-rest-1',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        altText: 'Ảnh tổng quan trang chủ nhà hàng cao cấp',
        mediaType: 'IMAGE',
        isPrimary: true,
      },
      {
        id: 'med-rest-2',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        altText: 'Không gian bàn ăn và thực đơn sang trọng',
        mediaType: 'IMAGE',
        isPrimary: false,
      },
    ],
    tags: [
      { id: 'tag-nextjs', name: 'Next.js', slug: 'nextjs', tagGroup: 'TECH' },
      { id: 'tag-tailwind', name: 'Tailwind CSS', slug: 'tailwind', tagGroup: 'TECH' },
      { id: 'tag-booking', name: 'Đặt bàn', slug: 'booking', tagGroup: 'FEATURE' },
    ],
    features: [
      { key: 'booking_engine', label: 'Đặt bàn trực tuyến', value: true },
      { key: 'cms_admin', label: 'Quản trị bài viết & menu', value: true },
      { key: 'mobile_responsive', label: 'Chuẩn di động 100%', value: true },
    ],
    availableFulfillmentTypes: ['SOURCE_CODE', 'MANAGED_SERVICE'],
    priceSummary: {
      label: 'Từ',
      amountMinor: 3500000,
      formattedPrice: '3.500.000 ₫',
      currency: 'VND',
    },
    demoUrl: 'https://demo-restaurant.example.com',
    previewMode: 'EXTERNAL_LINK',
    offers: [
      {
        id: 'off-rest-source',
        code: 'SOURCE_CODE_LICENSE',
        name: 'Bản quyền Mã nguồn (Source Code)',
        description: 'Nhận toàn bộ source code Next.js TypeScript, database schema và tài liệu hướng dẫn tự deploy.',
        fulfillmentType: 'SOURCE_CODE',
        pricingModel: 'FIXED',
        status: 'ACTIVE',
        requiresConsultation: false,
        licenseSummary: 'Single Domain Standard Commercial License',
        deliveryScope: {
          included: ['Toàn bộ source code Next.js', 'File cấu hình Tailwind CSS', 'Tài liệu hướng dẫn cài đặt'],
          excluded: ['Cài đặt lên hosting của khách', 'Nhập liệu hình ảnh nội dung'],
          deliverables: ['Link tải file nén zip có ký số bảo mật', 'Quyền truy cập repository private'],
        },
        billingInterval: 'ONE_TIME',
        price: {
          currency: 'VND',
          amountMinor: 3500000,
          formattedPrice: '3.500.000 ₫',
          billingInterval: 'ONE_TIME',
        },
      },
      {
        id: 'off-rest-managed',
        code: 'MANAGED_DEPLOYMENT',
        name: 'Gói Triển khai Trọn gói (Managed Service)',
        description: 'Đội ngũ kỹ thuật cấu hình domain, hosting SSL, thay logo, màu sắc thương hiệu và up menu mẫu hoàn chỉnh.',
        fulfillmentType: 'MANAGED_SERVICE',
        pricingModel: 'FIXED',
        status: 'ACTIVE',
        requiresConsultation: false,
        deliveryScope: {
          included: ['Tùy biến màu sắc, logo nhận diện', 'Cài đặt domain và chứng chỉ SSL', 'Miễn phí hosting năm đầu', 'Bảo hành kỹ thuật 12 tháng'],
          excluded: ['Viết bài PR báo chí', 'Chụp ảnh món ăn tại quán'],
          deliverables: ['Website bàn giao live trên domain khách hàng', 'Tài khoản quản trị CMS'],
        },
        billingInterval: 'ONE_TIME',
        price: {
          currency: 'VND',
          amountMinor: 8500000,
          formattedPrice: '8.500.000 ₫',
          billingInterval: 'ONE_TIME',
        },
      },
    ],
  },
  {
    id: 'list-fashion-store',
    slug: 'fashion-boutique',
    title: 'Fashion Boutique — Website Thương mại Thời trang & Lookbook',
    shortDescription: 'Giao diện thương mại điện tử phong cách tối giản chuẩn quốc tế, lọc size/màu mượt mà, giỏ hàng tối ưu.',
    description: `<h3>Thiết kế dành riêng cho Thương hiệu Thời trang & Phụ kiện</h3>
<p>Website chú trọng hình ảnh thị giác cao cấp, hỗ trợ bộ sưu tập Lookbook theo mùa, giỏ hàng AJAX không tải lại trang và thanh toán quét mã QR tiện lợi.</p>`,
    listingKind: 'ECOMMERCE',
    status: 'PUBLISHED',
    featured: true,
    category: {
      id: 'cat-fashion',
      name: 'Thời trang & Mỹ phẩm',
      slug: 'fashion-apparel',
      description: 'Thương mại điện tử cao cấp, lookbook',
      sortOrder: 2,
      isActive: true,
    },
    seller: {
      id: 'org-platform',
      name: 'Platform Studio',
      slug: 'platform',
      sellerType: 'PLATFORM',
    },
    coverImage: {
      id: 'med-fash-1',
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      altText: 'Giao diện cửa hàng thời trang sang trọng',
      mediaType: 'IMAGE',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'med-fash-1',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        altText: 'Giao diện cửa hàng thời trang sang trọng',
        mediaType: 'IMAGE',
        isPrimary: true,
      },
    ],
    tags: [
      { id: 'tag-nextjs', name: 'Next.js', slug: 'nextjs', tagGroup: 'TECH' },
      { id: 'tag-ecommerce', name: 'Thương mại điện tử', slug: 'ecommerce', tagGroup: 'FEATURE' },
    ],
    features: [
      { key: 'online_payment', label: 'Tích hợp VietQR', value: true },
      { key: 'cms_admin', label: 'Quản trị sản phẩm', value: true },
      { key: 'mobile_responsive', label: 'Chuẩn di động 100%', value: true },
    ],
    availableFulfillmentTypes: ['SOURCE_CODE', 'SAAS'],
    priceSummary: {
      label: 'Từ',
      amountMinor: 450000,
      formattedPrice: '450.000 ₫/tháng',
      currency: 'VND',
    },
    demoUrl: 'https://demo-fashion.example.com',
    previewMode: 'EXTERNAL_LINK',
    offers: [
      {
        id: 'off-fash-source',
        code: 'SOURCE_CODE_LICENSE',
        name: 'Bản quyền Mã nguồn',
        description: 'Source code E-commerce Next.js đầy đủ giỏ hàng, trang sản phẩm và checkout.',
        fulfillmentType: 'SOURCE_CODE',
        pricingModel: 'FIXED',
        status: 'ACTIVE',
        requiresConsultation: false,
        licenseSummary: 'Single Commercial License',
        deliveryScope: {
          included: ['Source code frontend & backend API', 'PostgreSQL migration schema'],
          excluded: ['Cổng thanh toán riêng của khách'],
          deliverables: ['Gói source code đã ký số'],
        },
        billingInterval: 'ONE_TIME',
        price: {
          currency: 'VND',
          amountMinor: 5000000,
          formattedPrice: '5.000.000 ₫',
          billingInterval: 'ONE_TIME',
        },
      },
      {
        id: 'off-fash-saas',
        code: 'SAAS_MONTHLY',
        name: 'Thuê bao Cloud (SaaS Monthly)',
        description: 'Sử dụng trọn gói trên cloud của nền tảng, tự động cập nhật tính năng mới, miễn phí server & SSL.',
        fulfillmentType: 'SAAS',
        pricingModel: 'SUBSCRIPTION',
        status: 'ACTIVE',
        requiresConsultation: false,
        deliveryScope: {
          included: ['Hạ tầng Cloud tốc độ cao', 'Cập nhật bảo mật định kỳ', 'Hỗ trợ kỹ thuật 24/7'],
          excluded: ['Bàn giao file source code gốc'],
          deliverables: ['Tenant workspace riêng và quyền trỏ custom domain'],
        },
        billingInterval: 'MONTH',
        price: {
          currency: 'VND',
          amountMinor: 450000,
          formattedPrice: '450.000 ₫',
          billingInterval: 'MONTH',
        },
      },
    ],
  },
  {
    id: 'list-clinic-care',
    slug: 'clinic-care',
    title: 'ClinicCare — Hệ thống Website Phòng khám & Lịch hẹn Chuyên gia',
    shortDescription: 'Mẫu website phòng khám đa khoa, nha khoa, thẩm mỹ viện với hệ thống đặt hẹn bác sĩ và bảng giá y tế.',
    description: `<h3>Uy tín và Chuyên nghiệp cho Cơ sở Y tế</h3>
<p>ClinicCare mang lại cảm giác tin cậy cho bệnh nhân với hồ sơ đội ngũ y bác sĩ, chứng chỉ hành nghề, bảng giá dịch vụ minh bạch và quy trình đặt lịch khám theo chuyên khoa.</p>`,
    listingKind: 'BUSINESS_WEBSITE',
    status: 'PUBLISHED',
    featured: false,
    category: {
      id: 'cat-health',
      name: 'Y tế & Phòng khám',
      slug: 'healthcare',
      description: 'Cổng thông tin phòng khám, đặt lịch khám',
      sortOrder: 3,
      isActive: true,
    },
    seller: {
      id: 'org-platform',
      name: 'Platform Studio',
      slug: 'platform',
      sellerType: 'PLATFORM',
    },
    coverImage: {
      id: 'med-clinic-1',
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Không gian phòng khám hiện đại và bác sĩ tận tâm',
      mediaType: 'IMAGE',
      isPrimary: true,
    },
    gallery: [
      {
        id: 'med-clinic-1',
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        altText: 'Không gian phòng khám hiện đại và bác sĩ tận tâm',
        mediaType: 'IMAGE',
        isPrimary: true,
      },
    ],
    tags: [
      { id: 'tag-nextjs', name: 'Next.js', slug: 'nextjs', tagGroup: 'TECH' },
      { id: 'tag-booking', name: 'Đặt chỗ', slug: 'booking', tagGroup: 'FEATURE' },
    ],
    features: [
      { key: 'booking_engine', label: 'Đặt lịch khám theo bác sĩ', value: true },
      { key: 'mobile_responsive', label: 'Tối ưu trên điện thoại', value: true },
    ],
    availableFulfillmentTypes: ['MANAGED_SERVICE', 'CUSTOM_PROJECT'],
    priceSummary: {
      label: 'Từ',
      amountMinor: 12000000,
      formattedPrice: '12.000.000 ₫',
      currency: 'VND',
    },
    demoUrl: 'https://demo-clinic.example.com',
    previewMode: 'EXTERNAL_LINK',
    offers: [
      {
        id: 'off-clinic-mng',
        code: 'CLINIC_SETUP',
        name: 'Gói Triển khai Tiêu chuẩn Phòng khám',
        description: 'Cài đặt và cấu hình hoàn thiện hệ thống phòng khám, tối ưu chuẩn SEO địa điểm y tế.',
        fulfillmentType: 'MANAGED_SERVICE',
        pricingModel: 'FIXED',
        status: 'ACTIVE',
        requiresConsultation: false,
        deliveryScope: {
          included: ['Khởi tạo danh sách bác sĩ và dịch vụ y tế', 'Cấu hình thông báo lịch hẹn qua email'],
          excluded: ['Tích hợp bệnh án điện tử HIS/EMR của bệnh viện'],
          deliverables: ['Hệ thống hoàn thiện sẵn sàng đón bệnh nhân'],
        },
        billingInterval: 'ONE_TIME',
        price: {
          currency: 'VND',
          amountMinor: 12000000,
          formattedPrice: '12.000.000 ₫',
          billingInterval: 'ONE_TIME',
        },
      },
      {
        id: 'off-clinic-custom',
        code: 'CLINIC_ENTERPRISE',
        name: 'Giải pháp Bệnh viện Tùy biến (Custom Project)',
        description: 'Tư vấn và phát triển tích hợp sâu vào hệ thống quản lý viện, cổng thanh toán viện phí và hồ sơ bệnh án.',
        fulfillmentType: 'CUSTOM_PROJECT',
        pricingModel: 'QUOTE',
        status: 'ACTIVE',
        requiresConsultation: true,
        deliveryScope: {
          included: ['Khảo sát yêu cầu riêng', 'Lập Statement of Work (SOW)', 'Kiểm thử bảo mật dữ liệu y tế'],
          excluded: [],
          deliverables: ['Sản phẩm phần mềm theo hợp đồng dự án'],
        },
      },
    ],
  },
];

// Fallback Forum Data
const FALLBACK_FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: 'fcat-wanted',
    name: 'Cần giải pháp (Request Board)',
    slug: 'wanted',
    description: 'Nơi người cần làm website đăng yêu cầu để Seller xác minh gửi proposal',
    sortOrder: 1,
    allowedThreadTypes: ['WANTED'],
    threadCount: 8,
  },
  {
    id: 'fcat-qa',
    name: 'Hỏi đáp Kỹ thuật (Q&A)',
    slug: 'qa',
    description: 'Giải đáp thắc mắc về Next.js, NestJS, Tailwind, SEO, tối ưu tốc độ',
    sortOrder: 2,
    allowedThreadTypes: ['QUESTION', 'DISCUSSION'],
    threadCount: 15,
  },
  {
    id: 'fcat-showcase',
    name: 'Khoe sản phẩm (Showcase)',
    slug: 'showcase',
    description: 'Giới thiệu các dự án website hoàn thành, chia sẻ link demo thực tế',
    sortOrder: 3,
    allowedThreadTypes: ['SHOWCASE'],
    threadCount: 12,
  },
  {
    id: 'fcat-general',
    name: 'Thảo luận Chung',
    slug: 'general',
    description: 'Trao đổi kinh nghiệm freelancer, báo giá, hợp đồng và quản trị dự án web',
    sortOrder: 4,
    allowedThreadTypes: ['DISCUSSION'],
    threadCount: 20,
  },
];

const FALLBACK_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thr-1',
    categorySlug: 'wanted',
    categoryName: 'Cần giải pháp (Request Board)',
    author: {
      id: 'u-1',
      name: 'Trần Minh Quân',
      username: 'quan.tran',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      badge: 'TRUSTED_MEMBER',
    },
    threadType: 'WANTED',
    title: 'Cần tìm Studio thiết kế website bán lẻ Đồng hồ cơ khí cao cấp (Next.js + VietQR)',
    slug: 'can-thiet-ke-web-dong-ho-cao-cap',
    summary: 'Cần website có giao diện Dark theme sang trọng, xem ảnh 360 độ mặt đồng hồ, giỏ hàng thanh toán VietQR tự động, bàn giao cả source code.',
    bodyMd: `Chúng tôi đang phát triển thương hiệu đồng hồ cơ khí tại TP.HCM. Cần tìm đối tác có kinh nghiệm:
- Yêu cầu: Giao diện chuẩn mực cao cấp, tối ưu Core Web Vitals.
- Tính năng: Xem ảnh chi tiết, bộ lọc theo thương hiệu/bộ máy, thanh toán quét mã QR.
- Ngân sách: 15.000.000 - 25.000.000 VND.
- Thời hạn: Hoàn thành trong 3 tuần.`,
    status: 'PUBLISHED',
    pinned: true,
    replyCount: 5,
    viewCount: 342,
    likeCount: 18,
    createdAt: 'Vừa xong',
    lastActivityAt: '10 phút trước',
    wantedDetails: {
      goalSummary: 'Website đồng hồ cơ khí Dark Theme, thanh toán VietQR',
      budgetRange: '15.000.000 - 25.000.000 ₫',
      budgetCurrency: 'VND',
      targetDate: '2026-12-15',
      status: 'OPEN',
      proposalCount: 4,
    },
  },
  {
    id: 'thr-2',
    categorySlug: 'qa',
    categoryName: 'Hỏi đáp Kỹ thuật (Q&A)',
    author: {
      id: 'u-2',
      name: 'Lê Hoàng Nam',
      username: 'nam.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      badge: 'SELLER_VERIFIED',
    },
    threadType: 'QUESTION',
    title: 'Cách tối ưu LCP và Core Web Vitals cho Next.js 16 trên Cloudflare Pages đạt 99 điểm?',
    slug: 'toi-uu-lcp-core-web-vitals-nextjs-16',
    summary: 'Chia sẻ kinh nghiệm nạp font cục bộ, tối ưu thẻ ảnh responsive và thiết lập cache-control header để tránh layout shift.',
    bodyMd: `Chia sẻ kinh nghiệm tối ưu LCP Next.js 16 trên Edge Network...`,
    status: 'PUBLISHED',
    pinned: false,
    replyCount: 14,
    viewCount: 890,
    likeCount: 45,
    createdAt: 'Hôm qua',
    lastActivityAt: '2 giờ trước',
    questionDetails: {
      hasAcceptedAnswer: true,
    },
  },
  {
    id: 'thr-3',
    categorySlug: 'showcase',
    categoryName: 'Khoe sản phẩm (Showcase)',
    author: {
      id: 'u-platform',
      name: 'Platform Official',
      username: 'platform.team',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      badge: 'STAFF',
    },
    threadType: 'SHOWCASE',
    title: 'Ra mắt giải pháp Restaurant Pro v1.1: Đặt bàn thông minh & Thực đơn QR cho chuỗi F&B',
    slug: 'showcase-restaurant-pro-v1',
    summary: 'Demo thực tế giải pháp website nhà hàng hoàn chỉnh đã xuất bản trên sàn WebMarket với 2 gói: Bán source code và Triển khai trọn gói.',
    bodyMd: `Demo thực tế giải pháp Restaurant Pro v1.1...`,
    status: 'PUBLISHED',
    pinned: false,
    replyCount: 8,
    viewCount: 620,
    likeCount: 32,
    createdAt: '2 ngày trước',
    lastActivityAt: '1 giờ trước',
    showcaseDetails: {
      relatedListingSlug: 'restaurant-pro',
      relatedListingTitle: 'Restaurant Pro — Mẫu Website Nhà hàng & Đặt bàn Cao cấp',
      coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    id: 'thr-4',
    categorySlug: 'wanted',
    categoryName: 'Cần giải pháp (Request Board)',
    author: {
      id: 'u-3',
      name: 'Nguyễn Thu Trang',
      username: 'trang.clinic',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      badge: 'NEW_MEMBER',
    },
    threadType: 'WANTED',
    title: 'Cần website Phòng khám Nha khoa thẩm mỹ tích hợp bảng giá và đặt hẹn bác sĩ',
    slug: 'can-website-nha-khoa-ai-smile',
    summary: 'Tìm đối tác agency triển khai website nha khoa thẩm mỹ, yêu cầu có bảng giá dịch vụ rõ ràng, form tư vấn và kết nối Zalo OA.',
    bodyMd: `Nha khoa cần xây dựng trang web mới hướng đến khách hàng phân khúc trung & cao cấp...`,
    status: 'PUBLISHED',
    pinned: false,
    replyCount: 3,
    viewCount: 210,
    likeCount: 7,
    createdAt: 'Hôm qua',
    lastActivityAt: '3 giờ trước',
    wantedDetails: {
      goalSummary: 'Website nha khoa thẩm mỹ đặt hẹn online',
      budgetRange: '10.000.000 - 18.000.000 ₫',
      budgetCurrency: 'VND',
      targetDate: '2026-12-25',
      status: 'OPEN',
      proposalCount: 3,
    },
  },
  {
    id: 'thr-5',
    categorySlug: 'general',
    categoryName: 'Thảo luận Chung',
    author: {
      id: 'u-4',
      name: 'Đặng Tuấn Anh',
      username: 'tuananh.dev',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      badge: 'SELLER_VERIFIED',
    },
    threadType: 'DISCUSSION',
    title: 'Kinh nghiệm lập hợp đồng và Snapshot phạm vi công việc tránh phát sinh vô tận với khách hàng',
    slug: 'kinh-nghiem-lap-hop-dong-va-snapshot-pham-vi-web',
    summary: 'Chia sẻ các điều khoản "Bao gồm" và "Không bao gồm" chuẩn mực trong Statement of Work (SOW) giúp Freelancer và Agency tự bảo vệ quyền lợi.',
    bodyMd: `Làm web sợ nhất là scope creep...`,
    status: 'PUBLISHED',
    pinned: false,
    replyCount: 22,
    viewCount: 1150,
    likeCount: 68,
    createdAt: '2 ngày trước',
    lastActivityAt: 'Hôm qua',
  },
];

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/public/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchListings(query: {
  category?: string;
  tag?: string;
  fulfillment?: string;
  pricing?: string;
  q?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  items: ListingSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const params = new URLSearchParams();
    if (query.category) params.set('category', query.category);
    if (query.tag) params.set('tag', query.tag);
    if (query.fulfillment) params.set('fulfillment', query.fulfillment);
    if (query.pricing) params.set('pricing', query.pricing);
    if (query.q) params.set('q', query.q);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));

    const res = await fetch(`${API_BASE_URL}/v1/public/listings?${params.toString()}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch listings');
    return await res.json();
  } catch {
    let items = [...FALLBACK_LISTINGS];
    if (query.category) {
      items = items.filter((l) => l.category.slug === query.category);
    }
    if (query.fulfillment) {
      items = items.filter((l) =>
        l.availableFulfillmentTypes.includes(query.fulfillment as any),
      );
    }
    if (query.q) {
      const qLower = query.q.toLowerCase().trim();
      items = items.filter(
        (l) =>
          l.title.toLowerCase().includes(qLower) ||
          l.shortDescription.toLowerCase().includes(qLower),
      );
    }
    return {
      items,
      total: items.length,
      page: 1,
      limit: 24,
      totalPages: 1,
    };
  }
}

export async function fetchListingBySlug(
  slug: string,
): Promise<ListingDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/public/listings/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch listing');
    return await res.json();
  } catch {
    const found = FALLBACK_LISTINGS.find((l) => l.slug === slug);
    return found || null;
  }
}

export async function fetchForumCategories(): Promise<ForumCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/public/community/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch forum categories');
    return await res.json();
  } catch {
    return FALLBACK_FORUM_CATEGORIES;
  }
}

export async function fetchForumThreads(query: {
  category?: string;
  threadType?: string;
  q?: string;
  limit?: number;
} = {}): Promise<{ items: ForumThread[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (query.category) params.set('category', query.category);
    if (query.threadType) params.set('threadType', query.threadType);
    if (query.q) params.set('q', query.q);
    if (query.limit) params.set('limit', String(query.limit));

    const res = await fetch(`${API_BASE_URL}/v1/public/community/threads?${params.toString()}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('Failed to fetch forum threads');
    return await res.json();
  } catch {
    let items = [...FALLBACK_FORUM_THREADS];
    if (query.category) {
      items = items.filter((t) => t.categorySlug === query.category);
    }
    if (query.threadType) {
      items = items.filter((t) => t.threadType === query.threadType);
    }
    if (query.q) {
      const qLower = query.q.toLowerCase().trim();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(qLower) ||
          t.summary.toLowerCase().includes(qLower),
      );
    }
    const limit = query.limit || 20;
    return {
      items: items.slice(0, limit),
      total: items.length,
    };
  }
}
