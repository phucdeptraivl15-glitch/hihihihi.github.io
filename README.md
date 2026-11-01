# SOLEVAULT — PREMIUM SNEAKER STORE
> **"FIND YOUR NEXT ICON — Không chỉ là một đôi giày. Đó là dấu ấn của bạn."**

SOLEVAULT là một website thương mại điện tử đa trang (Multi-page E-Commerce) chuyên kinh doanh giày sneaker cao cấp và phong cách streetwear hiện đại. Dự án được phát triển theo tiêu chuẩn kỹ thuật thuần khiết: **100% HTML5, CSS3 và Vanilla JavaScript thuần**, hoàn toàn không sử dụng bất kỳ thư viện, bundle tool hay framework ngoài nào.

---

## 1. TỔNG QUAN DỰ ÁN & CÔNG NGHỆ

- **Tên dự án:** SOLEVAULT — Premium Sneaker Store
- **Ngôn ngữ giao diện:** Tiếng Việt (VN)
- **Tiền tệ:** Việt Nam Đồng (VNĐ) — sử dụng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` và tính toán hoàn toàn bằng số nguyên VND.
- **Quy mô danh mục:** 100 mẫu sneaker cao cấp đa dạng (Nike: 25, Adidas: 20, New Balance: 17, ASICS: 11, Converse: 9, Vans: 9, Puma: 5, Reebok: 4) với hình ảnh tương ứng theo đúng từng kiểu dáng (silhouette) và dòng giày.
- **Phương thức thanh toán:** COD Demo (Thanh toán khi nhận hàng thử nghiệm).
- **Công nghệ cốt lõi:**
  - **HTML5:** Semantic markup (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`), biểu mẫu với Constraint Validation API.
  - **CSS3:** Design Tokens qua CSS Custom Properties, Flexbox, CSS Grid đa tầng, Keyframe animations mượt mà, hỗ trợ `prefers-reduced-motion` và `media queries` từ 320px đến 1440px.
  - **Vanilla JavaScript:** DOM API, `localStorage`, `sessionStorage`, `URLSearchParams`, xử lý chuỗi tiếng Việt không dấu (`String.normalize`), chống XSS bằng hàm lọc chuỗi HTML an toàn.
  - **Biểu tượng (Icons):** 100% SVG thuần tự thiết kế, không phụ thuộc font bên ngoài.
  - **Frameworks:** **KHÔNG SỬ DỤNG** (Không React, Vue, Angular, jQuery, Bootstrap, Tailwind, npm hay webpack).

---

## 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
SOLEVAULT/
│
├── index.html                   # Trang chủ (Hero, New Arrivals, Trending, Editorial, Service)
│
├── pages/                       # Các trang chức năng và nội dung riêng biệt
│   ├── products.html            # Trang danh sách sản phẩm (Bộ lọc, sắp xếp, tìm kiếm, phân trang)
│   ├── product-detail.html      # Trang chi tiết sản phẩm (Gallery ảnh, chọn size, tồn kho, thêm giỏ)
│   ├── cart.html                # Trang giỏ hàng đầy đủ (Tăng giảm số lượng, tính tổng tiền)
│   ├── checkout.html            # Trang thanh toán COD demo (Form validation tiếng Việt)
│   ├── order-success.html       # Trang xác nhận đơn hàng demo (Mã đơn, tóm tắt và cảnh báo minh bạch)
│   ├── wishlist.html            # Trang danh sách sản phẩm yêu thích
│   ├── about.html               # Trang giới thiệu câu chuyện thương hiệu
│   ├── contact.html             # Trang thông tin liên hệ và biểu mẫu gửi tin nhắn
│   ├── faq.html                 # Trang câu hỏi thường gặp dạng Accordion tương tác
│   ├── size-guide.html          # Trang hướng dẫn đo chân và bảng quy đổi size EU/US/UK/CM
│   ├── shipping-returns.html    # Trang chính sách giao hàng và đổi size 07 ngày demo
│   ├── privacy.html             # Trang chính sách dữ liệu cục bộ và nút dọn dẹp bộ nhớ
│   ├── terms.html               # Trang điều khoản sử dụng dịch vụ demo
│   └── 404.html                 # Trang báo lỗi 404 thân thiện
│
├── styles/                      # Hệ thống CSS module hóa
│   ├── tokens.css               # Design tokens (Bảng màu, typography, khoảng cách, bo góc, z-index)
│   ├── reset.css                # CSS Reset hiện đại
│   ├── global.css               # Typography, nút bấm (btn), huy hiệu (badge), toast, skip-link
│   ├── layout.css               # Header sticky, mega-dropdown, drawer di động, overlay tìm kiếm, footer
│   ├── components.css           # Thẻ sản phẩm (product-card), mini-cart drawer, stepper, accordion
│   ├── pages.css                # Layout chi tiết từng trang (Hero banner, gallery, 2-col checkout)
│   ├── animations.css           # Hiệu ứng keyframes, spinner, skeleton loader, reduced-motion
│   └── responsive.css           # Breakpoints chi tiết: 1440px, 1200px, 992px, 768px, 480px, 320px
│
├── scripts/                     # Logic JavaScript thuần
│   ├── config.js                # Cấu hình cửa hàng (Tên, hotline, phí ship demo, danh sách hãng)
│   ├── utils.js                 # Hàm tiện ích: formatCurrency, escapeHTML, removeVietnameseTones, toast, SVG
│   ├── data.js                  # Cơ sở dữ liệu 18 đôi sneaker demo đa dạng (Phương án A - Chạy mọi môi trường)
│   ├── storage.js               # Quản lý an toàn localStorage/sessionStorage với bộ nhớ đệm dự phòng
│   ├── products.js              # Bộ máy lọc đa chiều, sắp xếp và đồng bộ URLSearchParams
│   ├── product-detail.js        # Đổi ảnh gallery, chọn size kiểm tra tồn kho, tăng giảm số lượng
│   ├── search.js                # Tìm kiếm trực tiếp (Live debounced search) tiếng Việt không dấu
│   ├── cart.js                  # Xử lý giỏ hàng mini drawer và trang giỏ hàng chi tiết
│   ├── wishlist.js              # Đồng bộ danh sách yêu thích và huy hiệu đếm trên Header
│   ├── checkout.js              # Kiểm tra tính hợp lệ form COD và tạo mã đơn hàng thử nghiệm
│   ├── order-success.js         # Đọc snapshot đơn hàng từ sessionStorage và hiển thị biên nhận
│   ├── forms.js                 # Kiểm tra biểu mẫu liên hệ và đăng ký bản tin
│   └── main.js                  # Điều phối ứng dụng: Header scroll, Drawer toggle, Badges counter
│
├── data/
│   └── products.json            # Bản sao JSON chuẩn của danh mục sản phẩm (Phục vụ Phương án B)
│
├── tests/
│   └── manual-test-checklist.md # Bản checklist kiểm thử thủ công 36 kịch bản chi tiết
│
├── README.md                    # Tài liệu hướng dẫn sử dụng và phát triển (file này)
├── robots.txt                   # Cấu hình thân thiện công cụ tìm kiếm
├── sitemap.xml                  # Bản đồ website XML
└── .gitignore                   # Cấu hình loại trừ git
```

---

## 3. HƯỚNG DẪN KHỞI CHẠY WEBSITE

Website được kiến trúc theo **Phương án A (Tương thích tuyệt đối)**: Toàn bộ dữ liệu demo và logic đều được nạp qua các tệp JavaScript theo thứ tự chuẩn, giúp bạn có thể khởi chạy bằng bất kỳ cách nào mà không gặp lỗi CORS hay hạn chế bảo mật.

### Cách 1: Mở trực tiếp bằng trình duyệt (Chế độ `file://`)
1. Truy cập thư mục `SOLEVAULT/`.
2. Nhấp đúp chuột (hoặc kéo thả) file `index.html` vào bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari, Brave...).
3. Website sẽ hoạt động ngay lập tức: Xem sản phẩm, tìm kiếm, thêm vào giỏ, chọn size và tạo đơn hàng COD demo mà không cần bất kỳ phần mềm máy chủ nào!

### Cách 2: Chạy qua VS Code Live Server (Khuyến nghị cho nhà phát triển)
1. Mở thư mục `SOLEVAULT/` trong Visual Studio Code.
2. Cài đặt tiện ích mở rộng **Live Server** (tác giả Ritwick Dey).
3. Nhấp chuột phải vào `index.html` và chọn **"Open with Live Server"**.
4. Website sẽ tự động mở tại địa chỉ `http://127.0.0.1:5500/index.html`.

### Cách 3: Chạy bằng máy chủ tĩnh Python đơn giản
Nếu máy tính của bạn đã cài sẵn Python:
```bash
cd SOLEVAULT
python -m http.server 8080
```
Sau đó mở trình duyệt tại `http://localhost:8080`.

---

## 4. HƯỚNG DẪN TÙY BIẾN & BẢO TRÌ

### 4.1. Cách thêm sản phẩm mới
Mở file `scripts/data.js` và thêm một đối tượng sản phẩm mới vào mảng `PRODUCTS`:
```javascript
{
  id: 'sv019',                                    // Mã định danh duy nhất (không trùng lặp)
  name: "Nike Air Max Plus 'Sunset'",             // Tên đầy đủ của sản phẩm
  brand: 'Nike',                                  // Thương hiệu (Nike, Adidas, New Balance...)
  category: 'Running',                            // Danh mục: Lifestyle, Running, Basketball, Retro, Skate/Streetwear
  type: 'Runner',                                 // Phân loại kiểu dáng
  sku: 'DX0755-600',                              // Mã SKU sản phẩm
  price: 4250000,                                 // Giá bán hiện tại (Số nguyên VND, không kèm ký tự)
  originalPrice: 4800000,                         // Giá gốc nếu đang giảm giá (hoặc null nếu không giảm)
  stock: 12,                                      // Tổng số lượng tồn kho demo
  isNew: true,                                    // Đánh dấu sản phẩm mới về (true/false)
  isFeatured: true,                               // Đánh dấu nổi bật trang chủ (true/false)
  isOnSale: true,                                 // Đánh dấu có giảm giá (true/false)
  description: 'Mô tả chi tiết về phối màu, chất liệu và phong cách...',
  colors: ['Sunset Orange', 'Black'],
  images: [
    'https://images.unsplash.com/...',            // Ảnh chính
    'https://images.unsplash.com/...'             // Ảnh góc nhìn phụ (hiển thị khi rê chuột)
  ],
  tags: ['Air Max', 'Icon', 'Sunset'],
  variants: [
    { size: 40, stock: 4, variantId: 'sv019-40' },// Biến thể theo từng size
    { size: 41, stock: 5, variantId: 'sv019-41' },
    { size: 42, stock: 0, variantId: 'sv019-42' } // stock = 0 sẽ tự động bị gạch chéo vô hiệu hóa
  ]
}
```

### 4.2. Cách thay ảnh sneaker
- Trong `scripts/data.js`, bạn chỉ cần thay đổi đường dẫn trong mảng `images` của sản phẩm đó.
- Bạn có thể dùng đường dẫn trực tuyến (URL) hoặc lưu file ảnh vào thư mục `assets/images/ten-anh.webp` rồi điền đường dẫn tương đối (Ví dụ: `../assets/images/samba-1.webp`).
- **Cơ chế dự phòng an toàn:** Nếu đường dẫn ảnh bị lỗi kết nối hoặc ảnh bị xóa, hàm `SOLEVAULT_UTILS.handleImageError(img)` sẽ tự động vẽ một hình minh họa giày sneaker SVG đẹp mắt, giữ cho website không bao giờ bị vỡ layout.

### 4.3. Cách chỉnh màu sắc chủ đạo (Design Tokens)
Mở file `styles/tokens.css` và điều chỉnh các biến CSS tại `:root`:
```css
:root {
  --color-accent: #FF5A36;       /* Màu cam nhấn chủ đạo phong cách streetwear */
  --color-accent-hover: #E24724; /* Màu khi rê chuột vào nút nhấn */
  --color-dark: #171717;         /* Màu nền tối của Hero và Footer */
  --color-bg: #F5F5F2;           /* Màu nền xám ngà ấm áp của website */
  --color-surface: #FFFFFF;      /* Màu nền trắng của các thẻ sản phẩm */
  --color-border: #E5E5E0;       /* Màu đường viền tinh tế */
}
```

### 4.4. Cách thay đổi font chữ
Trong `styles/tokens.css`, cập nhật thuộc tính `--font-body`:
```css
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 4.5. Cách sửa phí vận chuyển demo & Ngưỡng miễn phí giao hàng
Mở file `scripts/config.js` và chỉnh sửa 2 thông số:
```javascript
shippingFeeDemo: 35000,         // Phí giao hàng COD demo: 35.000 VNĐ
freeShippingThreshold: 3000000, // Miễn phí giao hàng cho đơn từ 3.000.000 VNĐ
```

### 4.6. Cách xóa dữ liệu giỏ hàng và đơn demo trên trình duyệt
- **Cách 1 (Nhanh nhất):** Truy cập trang `pages/privacy.html` và bấm nút **"XÓA TẤT CẢ DỮ LIỆU DEMO KHỎI TRÌNH DUYỆT"**.
- **Cách 2 (Trên trang xác nhận đơn):** Bấm nút **"Xóa dữ liệu đơn hàng demo"** trên `pages/order-success.html`.
- **Cách 3 (Bằng DevTools Console):** Bấm phím `F12` > mở tab **Console** và gõ lệnh:
  ```javascript
  SOLEVAULT_STORAGE.clearAllDemoData(); location.reload();
  ```

---

## 5. PHÂN ĐỊNH TÍNH NĂNG HOẠT ĐỘNG THẬT VS BẢN DEMO

Nhằm đảm bảo tính trung thực tuyệt đối, dưới đây là bảng đối chiếu rõ ràng giữa các tính năng:

### 5.1. Những chức năng hoạt động THỰC TẾ 100% trong trình duyệt
1. **Bộ lọc sản phẩm đa chiều:** Lọc đồng thời theo nhiều thương hiệu, danh mục, kích cỡ giày EU, tình trạng giảm giá và hàng còn trong kho.
2. **Sắp xếp sản phẩm:** Sắp xếp theo giá tăng dần, giá giảm dần, tên A-Z, mới nhất và mức chiết khấu cao nhất.
3. **Tìm kiếm tức thì (Live Search):** Hỗ trợ tìm kiếm theo tên, mã SKU, thương hiệu; hỗ trợ gõ tiếng Việt có dấu hoặc không dấu; có gợi ý nhanh và phím tắt Escape/Enter.
4. **Trang chi tiết sản phẩm:** Đổi ảnh gallery khi nhấp/bấm phím trên thumbnail; kiểm tra tồn kho theo từng size riêng biệt; vô hiệu hóa các size hết hàng (`stock: 0`); kiểm tra bắt buộc phải chọn size trước khi thêm vào giỏ.
5. **Giỏ hàng mini & Giỏ hàng trang:** Tách biệt chính xác các đôi cùng mẫu nhưng khác size; tăng/giảm số lượng có chặn mức trần tồn kho; tự động tính miễn phí vận chuyển nếu đạt ngưỡng 3 triệu VNĐ; tính toán bằng số nguyên VND và định dạng tiền tệ Việt Nam.
6. **Danh sách yêu thích (Wishlist):** Lưu sản phẩm yêu thích, đồng bộ tức thời số đếm huy hiệu trên Header ở mọi trang.
7. **Kiểm tra biểu mẫu (Form Validation):** Kiểm tra tên người nhận, định dạng số điện thoại di động Việt Nam (đầu số 03, 05, 07, 08, 09 gồm 10 chữ số), kiểm tra email hợp lệ, báo lỗi màu đỏ ngay cạnh ô nhập.
8. **Tạo mã đơn hàng demo:** Tạo mã đơn duy nhất định dạng `SV-YYYYMMDD-XXXX`, lưu thông tin vào `sessionStorage`, tự động làm sạch giỏ hàng và chuyển hướng sang trang thành công.
9. **Thiết kế thích ứng (Responsive):** Tối ưu hoàn hảo từ màn hình điện thoại 320px đến màn hình máy tính 1440px.

### 5.2. Những điểm chỉ mang tính chất DEMO
1. **Đơn hàng COD:** Đơn hàng được mô phỏng tạo trên trình duyệt của người dùng. Không có đơn hàng thật nào được gửi về hệ thống quản lý.
2. **Dữ liệu tồn kho:** Số lượng tồn kho là số liệu mẫu được khai báo trong `data.js`.
3. **Biểu mẫu liên hệ & Newsletter:** Dữ liệu nhập được xác thực tính hợp lệ trên trình duyệt, có thông báo thành công minh bạch nhưng chưa kết nối dịch vụ gửi email tự động (SMTP).

### 5.3. Các hạng mục cần hoàn thiện khi nâng cấp lên CỬA HÀNG THẬT
Khi đưa SOLEVAULT vào kinh doanh thương mại thực tế, bạn cần bổ sung:
1. **Hệ thống Backend (Node.js/Express, Python/FastAPI, Go hoặc PHP/Laravel):**
   - Xây dựng RESTful API hoặc GraphQL để quản lý sản phẩm, danh mục và đơn hàng tập trung.
   - Cơ sở dữ liệu quan hệ (PostgreSQL, MySQL) để lưu trữ thông tin sản phẩm và dữ liệu khách hàng an toàn.
2. **Quản lý kho hàng thời gian thực (Real-time Inventory):** Khóa tạm thời số lượng sản phẩm khi khách đang thanh toán để tránh tình trạng bán vượt tồn kho (overselling).
3. **Xác thực giá ở máy chủ:** Tính toán lại đơn giá và phí vận chuyển tại server trước khi chấp nhận đơn, không tin tưởng hoàn toàn dữ liệu gửi từ client.
4. **Tích hợp cổng giao vận:** Kết nối API của các đơn vị vận chuyển (Giao Hàng Nhanh, Viettel Post, GHTK) để tự động tạo vận đơn thu hộ COD và theo dõi hành trình (tracking).
5. **Dịch vụ thông báo tự động:** Kết nối SendGrid, Resend hoặc Twilio để gửi email/SMS xác nhận đơn hàng thực tế kèm hóa đơn điện tử.

---

## 6. HƯỚNG DẪN TRIỂN KHAI STATIC HOSTING MIỄN PHÍ

Vì website hoàn toàn là mã nguồn tĩnh không cần bước build, bạn có thể đưa lên internet miễn phí chỉ trong vài phút:

### Cách 1: Triển khai qua GitHub Pages
1. Tạo một repository mới trên GitHub (Ví dụ: `solevault-store`).
2. Tải toàn bộ mã nguồn trong thư mục `SOLEVAULT/` lên nhánh `main`.
3. Vào **Settings** của repository > chọn mục **Pages**.
4. Tại phần **Build and deployment**, chọn Branch `main` và thư mục `/ (root)`, sau đó bấm **Save**.
5. Sau 1 phút, website sẽ hoạt động trực tuyến tại địa chỉ `https://<ten-user>.github.io/solevault-store/`.

### Cách 2: Triển khai qua Netlify hoặc Vercel
- **Netlify:** Truy cập [netlify.com](https://www.netlify.com/), đăng nhập và kéo thả cả thư mục `SOLEVAULT` vào khu vực **"Drop your site folder here"**. Website sẽ có đường link trực tuyến ngay lập tức.
- **Vercel:** Chạy lệnh `vercel` trong thư mục `SOLEVAULT` hoặc kết nối với GitHub repository.

---

## 7. BẢN QUYỀN & MIỄN TRỪ TRÁCH NHIỆM

- Website **SOLEVAULT** được xây dựng phục vụ mục đích học tập, trình diễn năng lực kỹ thuật lập trình frontend và thiết kế trải nghiệm người dùng thương mại điện tử.
- Mọi nhãn hiệu (Nike, Adidas, New Balance, ASICS, Converse, Puma, Vans, Reebok) và hình ảnh sneaker minh họa thuộc quyền sở hữu trí tuệ của các thương hiệu tương ứng.
- Không sử dụng tên tuổi thương hiệu trong dự án này để tuyên bố các cam kết bảo đảm hoặc phân phối ủy quyền khi chưa có văn bản thỏa thuận kinh doanh thực tế.
