# BẢNG KIỂM THỬ THỦ CÔNG (MANUAL TEST CHECKLIST)
## DỰ ÁN: SOLEVAULT — PREMIUM SNEAKER STORE

Bảng checklist kiểm thử chi tiết phục vụ nghiệm thu các chức năng frontend của website bán giày sneaker SOLEVAULT.

---

### A. ĐIỀU HƯỚNG & CẤU TRÚC TRANG (NAVIGATION)

| STT | Trường hợp kiểm thử (Test Case) | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---:|
| A1 | Logo thương hiệu điều hướng về trang chủ | Nhấp vào logo SOLEVAULT từ bất kỳ trang nào (`pages/*.html`) | Chuyển hướng chính xác về `index.html`, không lỗi 404 | ĐẠT |
| A2 | Liên kết menu chính trên Desktop | Lần lượt nhấp: "Trang chủ", "Mới về", "Sneakers", "Ưu đãi", "Về chúng tôi" | Mở đúng trang tương ứng, lớp `.active` được gắn vào tab đang mở | ĐẠT |
| A3 | Dropdown danh sách thương hiệu | Rê chuột (hover) hoặc bấm Tab vào "Thương hiệu" | Menu mở mượt mà hiển thị 8 thương hiệu; nhấp từng hiệu lọc đúng sản phẩm | ĐẠT |
| A4 | Đóng dropdown bằng phím Escape | Mở menu "Thương hiệu" rồi nhấn phím `Escape` trên bàn phím | Menu lập tức đóng lại, không che khuất nội dung | ĐẠT |
| A5 | Menu di động (Mobile Drawer) | Nhấp nút hamburger trên màn hình nhỏ | Drawer trượt từ bên trái ra, body khóa cuộn (`no-scroll`), bấm 'X' hoặc Escape đóng lại mượt | ĐẠT |
| A6 | Kiểm tra toàn bộ liên kết chân trang (Footer) | Nhấp lần lượt tất cả các link tại Footer | 100% các file HTML con tồn tại và điều hướng đúng đường dẫn tương đối | ĐẠT |

---

### B. TÌM KIẾM SẢN PHẨM (SEARCH ENGINE)

| STT | Trường hợp kiểm thử | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---:|
| B1 | Mở Search Overlay | Bấm vào biểu tượng kính lúp trên Header | Overlay phủ mờ hiển thị, ô input tự động được focus | ĐẠT |
| B2 | Tìm kiếm theo tên sản phẩm | Nhập từ khóa: "Jordan", "Samba", "Vomero" | Hiển thị tức thì các kết quả khớp kèm ảnh đại diện, thương hiệu và đơn giá | ĐẠT |
| B3 | Tìm kiếm tiếng Việt không dấu | Nhập "chay bo" hoặc "trang" hoặc "den" | Thuật toán chuẩn hóa diacritics tìm đúng "Running" hoặc phối màu đen/trắng | ĐẠT |
| B4 | Tìm kiếm theo mã SKU | Nhập "DZ5485-612" hoặc "B75806" | Tìm chính xác sản phẩm tương ứng mã SKU | ĐẠT |
| B5 | Tìm từ khóa không tồn tại | Nhập chuỗi ngẫu nhiên "xyz123456" | Hiển thị thông báo "Không tìm thấy sản phẩm nào cho từ khóa..." | ĐẠT |
| B6 | Phím tắt Escape & Nút xóa từ khóa | Nhấn nút 'X' để xóa text; nhấn phím Escape để đóng overlay | Input được làm trống; overlay đóng lại ngay lập tức | ĐẠT |
| B7 | Nhấn Enter gửi tìm kiếm | Nhập từ khóa và bấm phím Enter | Chuyển hướng đến `pages/products.html?q=...` với danh sách kết quả được lọc | ĐẠT |

---

### C. BỘ LỌC & SẮP XẾP SẢN PHẨM (CATALOG FILTER & SORT)

| STT | Trường hợp kiểm thử | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---:|
| C1 | Lọc theo 1 hoặc nhiều thương hiệu | Chọn checkbox "Nike" và "Adidas" | Grid chỉ hiển thị sản phẩm của Nike và Adidas; số lượng kết quả cập nhật đúng | ĐẠT |
| C2 | Lọc theo kích cỡ (Size Pill) | Bấm vào size 40 EU | Chỉ các sản phẩm có size 40 còn hàng (`stock > 0`) mới xuất hiện | ĐẠT |
| C3 | Lọc sản phẩm đang giảm giá (Sale) | Tích chọn "Đang giảm giá" | Chỉ hiển thị các mẫu có `isOnSale: true` và có nhãn giảm % | ĐẠT |
| C4 | Kết hợp đa bộ lọc đồng thời | Chọn Brand "New Balance" + Size 40 + Giảm giá | Kết quả giao của 3 điều kiện được tính toán chính xác | ĐẠT |
| C5 | Xóa từng thẻ lọc (Active Tag Pills) | Nhấn nút 'x' trên tag "Hiệu: Nike" | Bộ lọc bỏ chọn thương hiệu Nike và làm mới danh sách tức thời | ĐẠT |
| C6 | Nút "Đặt lại tất cả" (Clear All) | Nhấp "Đặt lại tất cả" trên Sidebar | Mọi checkbox và size pill được uncheck; URL quay về mặc định | ĐẠT |
| C7 | Sắp xếp giá: Thấp đến cao | Chọn "Giá: Thấp đến cao" trong dropdown | Sản phẩm được sắp xếp tăng dần theo giá bán VND | ĐẠT |
| C8 | Sắp xếp giá: Cao đến thấp | Chọn "Giá: Cao đến thấp" trong dropdown | Sản phẩm được sắp xếp giảm dần theo giá bán VND | ĐẠT |
| C9 | Đồng bộ trạng thái với URL parameters | Reload lại trang `products.html?brand=Nike&sale=1` | Các ô checkbox tự động được tick sẵn và danh sách hiển thị đúng ngay khi load | ĐẠT |
| C10 | Trạng thái bộ lọc không có kết quả | Chọn đồng thời các tiêu chí không có mẫu chung | Hiển thị Empty State lịch sự kèm nút "Đặt lại bộ lọc" | ĐẠT |

---

### D. TRANG CHI TIẾT SẢN PHẨM (PRODUCT DETAIL & SIZING)

| STT | Trường hợp kiểm thử | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---:|
| D1 | Mở sản phẩm hợp lệ | Mở `product-detail.html?id=sv001` | Hiển thị đầy đủ ảnh, tên, thương hiệu, giá, mô tả, tồn kho và accordion | ĐẠT |
| D2 | Mở ID không tồn tại | Mở `product-detail.html?id=khong-co` | Hiển thị thông báo thân thiện "Không tìm thấy sản phẩm" kèm nút về trang chủ | ĐẠT |
| D3 | Gallery chuyển đổi ảnh | Nhấp vào các thumbnail phụ | Ảnh chính đổi mượt mà sang góc chụp tương ứng; thumbnail có viền active | ĐẠT |
| D4 | Chọn size còn hàng | Bấm chọn size 40 EU | Nút chuyển sang nền đen chữ trắng, nhãn hiển thị "Size đã chọn: 40 EU" | ĐẠT |
| D5 | Biến thể hết hàng (Sold out variant) | Rê chuột vào size có stock = 0 (ví dụ size 41 của sv001) | Nút bị gạch ngang mờ, có thuộc tính disabled, không thể nhấp chọn | ĐẠT |
| D6 | Bấm "Thêm vào giỏ" khi CHƯA chọn size | Bấm trực tiếp nút "Thêm vào giỏ hàng" | Xuất hiện cảnh báo màu đỏ yêu cầu chọn size, toast thông báo bật lên | ĐẠT |
| D7 | Tăng giảm số lượng (Quantity stepper) | Bấm '+' và '-' | Số lượng thay đổi từ 1 đến mức tồn kho tối đa của size đã chọn | ĐẠT |
| D8 | Thêm vào giỏ hàng thành công | Chọn size 40, số lượng 1, bấm "Thêm vào giỏ" | Toast thành công hiển thị, số lượng badge Header tăng, Mini-cart tự mở | ĐẠT |
| D9 | Yêu thích tại trang chi tiết | Bấm nút "YÊU THÍCH" | Chuyển thành "ĐÃ YÊU THÍCH" với trái tim màu cam, đồng bộ sang wishlist | ĐẠT |

---

### E. GIỎ HÀNG (MINI-CART DRAWER & CART PAGE)

| STT | Trường hợp kiểm thử | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---:|
| E1 | Cùng mẫu giày nhưng KHÁC size | Thêm sv001 size 40, sau đó thêm sv001 size 42 | Hai sản phẩm được tách thành 2 dòng riêng biệt (không gộp nhầm size) | ĐẠT |
| E2 | Cùng mẫu giày và CÙNG size | Thêm sv001 size 40 thêm 1 lần nữa | Dòng sản phẩm được cộng dồn số lượng thành 2 | ĐẠT |
| E3 | Tăng / giảm số lượng trong giỏ | Nhấp '+' hoặc '-' tại dòng sản phẩm | Thành tiền dòng và tổng tiền đơn hàng cập nhật tự động bằng số nguyên VND | ĐẠT |
| E4 | Xóa sản phẩm khỏi giỏ | Bấm nút "Xóa" tại một dòng giày | Dòng sản phẩm biến mất, tổng tiền tính lại, badge Header giảm | ĐẠT |
| E5 | Đóng mở Mini-cart Drawer | Bấm nút giỏ hàng trên header, bấm 'X' để đóng | Drawer trượt từ bên phải mượt mà, backdrop hoạt động chuẩn | ĐẠT |
| E6 | Làm trống giỏ hàng | Xóa hết sản phẩm trên trang `pages/cart.html` | Hiển thị Empty State "Giỏ hàng của bạn đang trống" kèm nút "Khám phá sneaker" | ĐẠT |
| E7 | Miễn phí vận chuyển demo | Thêm sản phẩm có tổng tiền >= 3.000.000 VNĐ | Phí giao hàng chuyển thành "Miễn phí (0 ₫)" | ĐẠT |
| E8 | Lưu trữ bền bỉ sau khi Reload | F5 lại trình duyệt | Toàn bộ sản phẩm trong giỏ vẫn giữ nguyên từ localStorage | ĐẠT |

---

### F. THANH TOÁN COD DEMO & XÁC NHẬN ĐƠN HÀNG

| STT | Trường hợp kiểm thử | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|:---:|:---|:---|:---|:---:|
| F1 | Truy cập checkout khi giỏ hàng trống | Xóa giỏ hàng rồi mở `pages/checkout.html` | Chặn form đặt hàng và hiển thị thông báo giỏ trống kèm nút quay lại | ĐẠT |
| F2 | Bỏ trống các trường bắt buộc | Nhấn "Xác nhận tạo đơn hàng demo" khi chưa điền form | Hiển thị thông báo lỗi màu đỏ sát từng ô nhập (Họ tên, SĐT, Địa chỉ) | ĐẠT |
| F3 | Nhập số điện thoại sai định dạng | Nhập "12345" hoặc "abc" vào ô số điện thoại | Báo lỗi định dạng số điện thoại Việt Nam (yêu cầu 10 chữ số hợp lệ) | ĐẠT |
| F4 | Điền form hợp lệ và gửi đơn | Điền tên, SĐT 0909123456, địa chỉ và bấm Gửi | Nút chuyển sang trạng thái Loading (Spinner), tạo mã đơn `SV-YYYYMMDD-XXXX` | ĐẠT |
| F5 | Chuyển hướng sang Order Success | Tự động chuyển đến `pages/order-success.html?orderId=...` | Hiển thị mã đơn hàng, bảng tóm tắt sản phẩm, họ tên, địa chỉ nhận hàng | ĐẠT |
| F6 | Kiểm tra thông báo minh bạch bắt buộc | Đọc phần ghi chú trên trang hoàn tất | Xuất hiện dòng chữ chuẩn: *"Đơn hàng demo đã được tạo trên trình duyệt. Cửa hàng chưa nhận được đơn hàng này vì website chưa được kết nối backend."* | ĐẠT |
| F7 | Kiểm tra giỏ hàng sau khi đặt đơn | Xem lại biểu tượng giỏ hàng trên Header | Giỏ hàng đã được tự động làm sạch (0 sản phẩm) | ĐẠT |
| F8 | Nút "Xóa dữ liệu đơn hàng demo" | Bấm nút xóa dữ liệu demo trên trang thành công | Dữ liệu sessionStorage bị xóa sạch và người dùng được đưa về trang chủ an toàn | ĐẠT |

---

### G. RESPONSIVE DESIGN (KIỂM TRA ĐA MÀN HÌNH)

| STT | Kích thước kiểm tra | Thành phần cần quan sát | Đánh giá | Trạng thái |
|:---:|:---|:---|:---|:---:|
| G1 | **320px** (Màn hình siêu nhỏ) | Logo không tràn, nút bấm co giãn vừa ngón tay, không xuất hiện thanh cuộn ngang | Không vỡ layout | ĐẠT |
| G2 | **375px & 390px** (iPhone / Android) | Header cân đối, lưới sản phẩm 2 cột đều đặn, Drawer mở full dễ thao tác | Giao diện tối ưu | ĐẠT |
| G3 | **768px** (iPad dọc / Tablet) | Nút mở bộ lọc xuất hiện thay thế cho sidebar cố định; lưới 2 cột thoáng đãng | Mượt mà | ĐẠT |
| G4 | **1024px** (iPad ngang / Laptop nhỏ) | Lưới sản phẩm chuyển thành 3 cột, hero banner cân bằng tỷ lệ hình ảnh - văn bản | Cân đối | ĐẠT |
| G5 | **1280px & 1440px** (Desktop chuẩn) | Container giới hạn tối đa 1400px căn giữa, lưới 4 cột sắc sảo, sidebar sticky | Chuẩn e-commerce | ĐẠT |

---

### H. TIÊU CHUẨN MÃ NGUỒN, BẢO MẬT & TRUY CẬP (A11Y & CODE QUALITY)

| STT | Tiêu chí đánh giá | Kết quả kiểm tra kỹ thuật | Đánh giá |
|:---:|:---|:---|:---:|
| H1 | Không dùng framework bên ngoài | 100% viết bằng HTML5 semantic, CSS3 thuần và Vanilla JavaScript | TUÂN THỦ |
| H2 | Không sử dụng `eval()` hoặc `Function()` | Không tồn tại bất kỳ đoạn mã thực thi chuỗi nguy hiểm nào | AN TOÀN |
| H3 | Chống tấn công XSS | Mọi dữ liệu do người dùng nhập hoặc truy vấn URL đều được lọc qua hàm `escapeHTML` | AN TOÀN |
| H4 | Không dùng `href="#"` giả nút | Tất cả các nút tương tác dùng `<button type="button">`, liên kết dùng thẻ `<a>` có URL thật | TUÂN THỦ |
| H5 | Thẻ ảnh có fallback dự phòng | Thuộc tính `onerror="SOLEVAULT_UTILS.handleImageError(this)"` tự sinh SVG thay thế nếu mạng lỗi | BỀN BỈ |
| H6 | Hỗ trợ phím và trợ năng (A11Y) | Có skip-link, nhãn `aria-label`, phím `Escape` đóng modal/drawer, tương phản chữ cao | ĐẠT CHUẨN |
