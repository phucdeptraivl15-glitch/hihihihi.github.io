/**
 * SOLEVAULT — Product Detail Page Logic
 * Gallery image switcher, size variant selector, quantity stepper, cart & wishlist integration
 */

const SOLEVAULT_DETAIL_PAGE = (function () {
  'use strict';

  function initDetail() {
    const detailContainer = document.getElementById('product-detail-view');
    if (!detailContainer) return; // Not on product-detail.html

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
      renderNotFound(detailContainer, 'Không có mã sản phẩm trong đường dẫn.');
      return;
    }

    const product = SOLEVAULT_DATA.getProductById(productId);
    if (!product) {
      renderNotFound(detailContainer, `Không tìm thấy sản phẩm với mã "${SOLEVAULT_UTILS.escapeHTML(productId)}".`);
      return;
    }

    // Set dynamic page title
    document.title = `${product.name} — SOLEVAULT`;

    // State for user selection
    let selectedSize = null;
    let selectedQuantity = 1;

    // Render full detail page layout
    renderProductDetail(detailContainer, product);

    // Bind Gallery thumbnail click & keydown
    const mainImg = document.getElementById('detail-main-img');
    const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');

    thumbBtns.forEach((btn, index) => {
      const handleSwitch = () => {
        const targetSrc = btn.getAttribute('data-img-src');
        if (mainImg && targetSrc) {
          mainImg.src = targetSrc;
          thumbBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        }
      };

      btn.addEventListener('click', handleSwitch);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSwitch();
        }
      });
    });

    // Bind Size Selection
    const sizeBtns = document.querySelectorAll('.size-btn:not(:disabled)');
    const selectedSizeLabel = document.getElementById('selected-size-label');

    sizeBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const sizeNum = Number(this.getAttribute('data-size'));
        selectedSize = sizeNum;

        sizeBtns.forEach(b => b.classList.remove('is-active'));
        this.classList.add('is-active');

        if (selectedSizeLabel) {
          selectedSizeLabel.textContent = `Size đã chọn: ${sizeNum} EU`;
        }

        // Reset quantity to 1 when switching size
        selectedQuantity = 1;
        const qtyInput = document.getElementById('detail-qty-input');
        if (qtyInput) qtyInput.value = 1;

        // Hide validation error if previously shown
        const sizeError = document.getElementById('detail-size-error');
        if (sizeError) sizeError.style.display = 'none';
      });
    });

    // Bind Quantity Stepper
    const qtyInput = document.getElementById('detail-qty-input');
    const qtyMinus = document.getElementById('detail-qty-minus');
    const qtyPlus = document.getElementById('detail-qty-plus');

    const getMaxStockForSelectedSize = () => {
      if (!selectedSize) return product.stock;
      const v = product.variants.find(varItem => Number(varItem.size) === selectedSize);
      return v ? v.stock : 1;
    };

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener('click', () => {
        if (selectedQuantity > 1) {
          selectedQuantity--;
          qtyInput.value = selectedQuantity;
        }
      });

      qtyPlus.addEventListener('click', () => {
        const max = getMaxStockForSelectedSize();
        if (selectedQuantity < max) {
          selectedQuantity++;
          qtyInput.value = selectedQuantity;
        } else {
          SOLEVAULT_UTILS.showToast('TỒN KHO GIỚI HẠN', `Chỉ còn ${max} sản phẩm cho size này.`, 'info');
        }
      });

      qtyInput.addEventListener('change', () => {
        let val = parseInt(qtyInput.value, 10);
        const max = getMaxStockForSelectedSize();
        if (isNaN(val) || val < 1) val = 1;
        if (val > max) {
          val = max;
          SOLEVAULT_UTILS.showToast('TỒN KHO GIỚI HẠN', `Chỉ còn ${max} sản phẩm.`, 'info');
        }
        selectedQuantity = val;
        qtyInput.value = val;
      });
    }

    // Bind "Add to Cart" Button
    const addToCartBtn = document.getElementById('detail-add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        if (!selectedSize) {
          const sizeError = document.getElementById('detail-size-error');
          if (sizeError) {
            sizeError.style.display = 'block';
            sizeError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          SOLEVAULT_UTILS.showToast('CHỌN SIZE', 'Vui lòng chọn size giày trước khi thêm vào giỏ hàng.', 'error');
          return;
        }

        const res = SOLEVAULT_STORAGE.addToCart(product.id, selectedSize, selectedQuantity);
        if (res.success) {
          SOLEVAULT_UTILS.showToast('THÊM GIỎ HÀNG THÀNH CÔNG', res.message, 'success');
          // Open mini-cart drawer to show item
          const cartDrawer = document.getElementById('cart-drawer');
          const backdrop = document.getElementById('site-backdrop');
          if (cartDrawer && backdrop) {
            cartDrawer.classList.add('is-open');
            backdrop.classList.add('active');
            document.body.classList.add('no-scroll');
            if (typeof SOLEVAULT_CART_MODULE !== 'undefined') {
              SOLEVAULT_CART_MODULE.renderMiniCart();
            }
          }
        } else {
          SOLEVAULT_UTILS.showToast('KHÔNG THỂ THÊM', res.message, 'error');
        }
      });
    }

    // Bind Detail Wishlist Button
    const wishlistBtn = document.getElementById('detail-wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        const isNowSaved = SOLEVAULT_STORAGE.toggleWishlist(product.id);
        wishlistBtn.classList.toggle('btn-accent', isNowSaved);
        wishlistBtn.classList.toggle('btn-outline', !isNowSaved);
        wishlistBtn.innerHTML = `
          ${SOLEVAULT_UTILS.getSVG(isNowSaved ? 'heart-fill' : 'heart')}
          <span>${isNowSaved ? 'ĐÃ YÊU THÍCH' : 'THÊM VÀO YÊU THÍCH'}</span>
        `;
        SOLEVAULT_UTILS.showToast(
          isNowSaved ? 'ĐÃ LƯU YÊU THÍCH' : 'ĐÃ BỎ YÊU THÍCH',
          `${product.name} đã được cập nhật vào danh sách yêu thích.`,
          isNowSaved ? 'success' : 'info'
        );
      });
    }

    // Render Related Products
    const relatedContainer = document.getElementById('related-products-grid');
    if (relatedContainer) {
      const related = SOLEVAULT_DATA.getRelatedProducts(product.id, 4);
      relatedContainer.innerHTML = related.map(SOLEVAULT_PRODUCTS_PAGE.createProductCardHTML).join('');
      SOLEVAULT_PRODUCTS_PAGE.bindWishlistButtons(relatedContainer);
    }
  }

  /**
   * Render HTML for Product Detail view
   */
  function renderProductDetail(container, product) {
    const isWishlisted = SOLEVAULT_STORAGE.isInWishlist(product.id);
    const rawPrimary = (product.images && product.images[0]) || '';
    const rawLocal = product.localImage || (product.images && product.images[1]) || '';
    const primaryImg = SOLEVAULT_UTILS.resolveProductImage(rawPrimary);
    const fallbackImg = rawLocal ? SOLEVAULT_UTILS.resolveProductImage(rawLocal) : '';

    // Collect distinct gallery images (avoid duplicate thumbnail of local fallback)
    let galleryList = [primaryImg];
    if (product.images && product.images.length > 2) {
      for (let i = 2; i < product.images.length; i++) {
        const u = product.images[i];
        if (u && !u.endsWith('.svg')) {
          galleryList.push(SOLEVAULT_UTILS.resolveProductImage(u));
        }
      }
    }
    const resolvedImages = galleryList;
    const mainImage = resolvedImages[0] || SOLEVAULT_UTILS.getFallbackImage();

    // Badges calculation
    let badgeHTML = '';
    if (product.stock <= 0) {
      badgeHTML = `<span class="badge badge-soldout">Hết hàng</span>`;
    } else if (product.isNew) {
      badgeHTML = `<span class="badge badge-new">New Release</span>`;
    }

    // Price calculation
    let priceHTML = `<span class="product-detail-price">${SOLEVAULT_UTILS.formatCurrency(product.price)}</span>`;
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      priceHTML += `
        <span class="price-original">${SOLEVAULT_UTILS.formatCurrency(product.originalPrice)}</span>
        <span class="badge badge-sale">-${discount}%</span>
      `;
    }

    // Thumbs HTML (only if multiple angles exist)
    const thumbsHTML = resolvedImages.length > 1
      ? resolvedImages
        .map((img, i) => `
          <button 
            type="button" 
            class="gallery-thumb-btn ${i === 0 ? 'is-active' : ''}" 
            data-img-src="${SOLEVAULT_UTILS.escapeHTML(img)}"
            aria-label="Xem ảnh góc nhìn ${i + 1}"
          >
            <img src="${SOLEVAULT_UTILS.escapeHTML(img)}" alt="${SOLEVAULT_UTILS.escapeHTML(product.name)} thumbnail ${i + 1}" class="gallery-thumb-img" onerror="SOLEVAULT_UTILS.handleImageError(this)"/>
          </button>
        `)
        .join('')
      : '';

    // Size variant buttons
    const sizesHTML = product.variants
      .map(v => {
        const isSoldOut = v.stock <= 0;
        return `
          <button 
            type="button" 
            class="size-btn ${isSoldOut ? 'is-disabled' : ''}" 
            data-size="${v.size}"
            ${isSoldOut ? 'disabled aria-disabled="true"' : ''}
            title="${isSoldOut ? `Size ${v.size} (Hết hàng)` : `Size ${v.size} (Còn ${v.stock} đôi)`}"
          >
            ${v.size} EU
          </button>
        `;
      })
      .join('');

    // Tag list
    const tagsHTML = product.tags
      .map(t => `<span class="badge badge-new" style="background-color: var(--color-bg); color: var(--color-text); border: 1px solid var(--color-border);">${SOLEVAULT_UTILS.escapeHTML(t)}</span>`)
      .join(' ');

    container.innerHTML = `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="../index.html">Trang chủ</a>
        <span class="breadcrumbs-separator">/</span>
        <a href="products.html">Sneakers</a>
        <span class="breadcrumbs-separator">/</span>
        <a href="products.html?category=${encodeURIComponent(product.category)}">${SOLEVAULT_UTILS.escapeHTML(product.category)}</a>
        <span class="breadcrumbs-separator">/</span>
        <span class="breadcrumbs-current" aria-current="page">${SOLEVAULT_UTILS.escapeHTML(product.name)}</span>
      </nav>

      <div class="product-detail-layout">
        <!-- Gallery Column -->
        <div class="product-gallery">
          <div class="gallery-main-wrap">
            <img 
              id="detail-main-img" 
              src="${SOLEVAULT_UTILS.escapeHTML(mainImage)}" 
              data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}"
              alt="${SOLEVAULT_UTILS.escapeHTML(product.name)}" 
              class="gallery-main-img"
              onerror="SOLEVAULT_UTILS.handleImageError(this)"
            />
          </div>
          <div class="gallery-thumbs">
            ${thumbsHTML}
          </div>
        </div>

        <!-- Product Info Column -->
        <div class="product-info-col">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div class="product-detail-brand">${SOLEVAULT_UTILS.escapeHTML(product.brand)}</div>
            <div>${badgeHTML}</div>
          </div>

          <h1 class="product-detail-title">${SOLEVAULT_UTILS.escapeHTML(product.name)}</h1>

          <div class="product-detail-sku">
            Mã SKU: <strong>${SOLEVAULT_UTILS.escapeHTML(product.sku)}</strong> • Phân loại: <strong>${SOLEVAULT_UTILS.escapeHTML(product.category)}</strong>
          </div>

          <div class="product-detail-pricing">
            ${priceHTML}
          </div>

          <p class="product-detail-desc">${SOLEVAULT_UTILS.escapeHTML(product.description)}</p>

          <!-- Size Selection Section -->
          <div class="size-select-section">
            <div class="size-select-header">
              <span class="form-label" style="margin-bottom: 0;">Chọn kích cỡ (EU) <span class="required">*</span></span>
              <a href="size-guide.html" target="_blank" class="size-guide-trigger" rel="noopener">Bảng quy đổi size</a>
            </div>
            <div id="selected-size-label" class="form-hint" style="margin-bottom: 10px;">Chưa chọn size</div>
            <div class="size-select-grid">
              ${sizesHTML}
            </div>
            <div id="detail-size-error" class="form-error" style="display: none; margin-top: 8px;">
              ${SOLEVAULT_UTILS.getSVG('info', 'icon-svg-sm')} Vui lòng chọn size giày bạn muốn đặt.
            </div>
          </div>

          <!-- Quantity Stepper -->
          <div class="form-group">
            <label for="detail-qty-input" class="form-label">Số lượng</label>
            <div class="qty-stepper">
              <button type="button" class="qty-btn" id="detail-qty-minus" aria-label="Giảm số lượng">-</button>
              <input type="number" id="detail-qty-input" class="qty-input" value="1" min="1" max="99" aria-label="Số lượng sản phẩm"/>
              <button type="button" class="qty-btn" id="detail-qty-plus" aria-label="Tăng số lượng">+</button>
            </div>
          </div>

          <!-- Purchase Action Buttons -->
          <div class="purchase-row">
            <button 
              type="button" 
              class="btn btn-primary btn-lg" 
              id="detail-add-to-cart-btn"
              ${product.stock <= 0 ? 'disabled' : ''}
            >
              ${SOLEVAULT_UTILS.getSVG('cart')}
              <span>${product.stock <= 0 ? 'TẠM HẾT HÀNG' : 'THÊM VÀO GIỎ HÀNG'}</span>
            </button>
            <button 
              type="button" 
              class="btn ${isWishlisted ? 'btn-accent' : 'btn-outline'} btn-lg" 
              id="detail-wishlist-btn"
              aria-label="Thêm vào danh sách yêu thích"
            >
              ${SOLEVAULT_UTILS.getSVG(isWishlisted ? 'heart-fill' : 'heart')}
              <span>${isWishlisted ? 'ĐÃ YÊU THÍCH' : 'YÊU THÍCH'}</span>
            </button>
          </div>

          <!-- Demo Disclaimer Box -->
          <div class="detail-demo-notice">
            <strong>LƯU Ý DEMO:</strong> Website hiện đang hoạt động ở chế độ Demo Frontend. Đơn hàng sẽ được xử lý mô phỏng thanh toán COD khi nhận hàng, không yêu cầu thẻ tín dụng hay dữ liệu thanh toán thật.
          </div>

          <!-- Product Details Accordion -->
          <div class="accordion">
            <div class="accordion-item is-open">
              <button type="button" class="accordion-header" aria-expanded="true">
                <span>Chất liệu & Đặc điểm thiết kế</span>
                <span class="accordion-icon">${SOLEVAULT_UTILS.getSVG('chevron-down')}</span>
              </button>
              <div class="accordion-content" style="max-height: 300px;">
                <div class="accordion-body">
                  <p>Màu sắc phối: ${SOLEVAULT_UTILS.escapeHTML(product.colors.join(' / '))}.</p>
                  <p>Phong cách: Thích hợp cho trang phục thường ngày, dạo phố, phong cách streetwear hoặc thể thao cá tính.</p>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
                    ${tagsHTML}
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <button type="button" class="accordion-header" aria-expanded="false">
                <span>Chính sách giao hàng & Đổi size demo</span>
                <span class="accordion-icon">${SOLEVAULT_UTILS.getSVG('chevron-down')}</span>
              </button>
              <div class="accordion-content">
                <div class="accordion-body">
                  <p>Miễn phí giao hàng COD cho đơn hàng từ 3.000.000 VNĐ. Khách hàng được quyền kiểm tra sản phẩm trước khi thanh toán cho nhân viên giao vận.</p>
                  <p>Hỗ trợ đổi size trong vòng 07 ngày nếu sản phẩm chưa qua sử dụng và còn nguyên tem hộp.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind Accordion headers
    container.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', function () {
        const item = this.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isOpen = item.classList.contains('is-open');

        if (isOpen) {
          item.classList.remove('is-open');
          this.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = null;
        } else {
          item.classList.add('is-open');
          this.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * Render Not Found view when ID is invalid
   */
  function renderNotFound(container, message) {
    container.innerHTML = `
      <div class="empty-state" style="margin: 60px auto; max-width: 600px;">
        <div class="empty-state-icon">${SOLEVAULT_UTILS.getSVG('info', 'icon-svg-lg')}</div>
        <h2 class="empty-state-title">Không tìm thấy sản phẩm</h2>
        <p class="empty-state-text">${SOLEVAULT_UTILS.escapeHTML(message)}</p>
        <div style="display: flex; justify-content: center; gap: 12px;">
          <a href="../index.html" class="btn btn-outline">Về trang chủ</a>
          <a href="products.html" class="btn btn-primary">Xem tất cả sneaker</a>
        </div>
      </div>
    `;
  }

  return {
    initDetail
  };
})();
