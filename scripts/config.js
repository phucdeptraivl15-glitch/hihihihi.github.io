/**
 * SOLEVAULT — Configuration
 * Centralized Settings for SOLEVAULT Sneaker Store
 */

const SOLEVAULT_CONFIG = {
  storeName: 'SOLEVAULT',
  tagline: 'FIND YOUR NEXT ICON.',
  taglineVN: 'Không chỉ là một đôi giày. Đó là dấu ấn của bạn.',
  currency: 'VND',
  locale: 'vi-VN',
  shippingFeeDemo: 35000, // 35,000 VNĐ
  freeShippingThreshold: 3000000, // Miễn phí giao hàng từ 3,000,000 VNĐ
  announcementText: 'SOLEVAULT DEMO STORE — KHÁM PHÁ BỘ SƯU TẬP SNEAKER PREMIUM 2026',
  demoNotice: 'Website phục vụ mục đích trình diễn giao diện frontend. Mọi đơn hàng đều ở trạng thái demo và chưa được gửi về hệ thống quản trị thực tế.',
  contact: {
    address: '128 Đường Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh (Địa chỉ demo)',
    phone: '0909 123 456 (Số hotline demo)',
    email: 'support@solevault-demo.vn (Email demo)',
    openingHours: '09:00 - 21:30 (Thứ 2 - Chủ Nhật)'
  },
  brands: [
    'Nike',
    'Adidas',
    'New Balance',
    'ASICS',
    'Converse',
    'Puma',
    'Vans',
    'Reebok'
  ],
  categories: [
    'Lifestyle',
    'Running',
    'Basketball',
    'Retro',
    'Skate/Streetwear'
  ],
  shoeSizes: [38, 39, 40, 41, 42, 43, 44, 45],
  STORAGE_KEYS: {
    CART: 'solevault_cart_demo_v1',
    WISHLIST: 'solevault_wishlist_demo_v1',
    ORDER: 'solevault_latest_order_demo_v1'
  }
};

// Freeze config object to prevent accidental mutation
if (typeof Object.freeze === 'function') {
  Object.freeze(SOLEVAULT_CONFIG);
  Object.freeze(SOLEVAULT_CONFIG.STORAGE_KEYS);
  Object.freeze(SOLEVAULT_CONFIG.contact);
  Object.freeze(SOLEVAULT_CONFIG.brands);
  Object.freeze(SOLEVAULT_CONFIG.categories);
  Object.freeze(SOLEVAULT_CONFIG.shoeSizes);
}
