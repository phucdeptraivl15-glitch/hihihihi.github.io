/**
 * SOLEVAULT — Shopping Cart Module
 * Supports both Mini-Cart Drawer (all pages) and Full Cart View (pages/cart.html)
 */

const SOLEVAULT_CART_MODULE = (function () {
  'use strict';

  function getPathPrefix() {
    return window.location.pathname.includes('/pages/') ? '' : 'pages/';
  }

  /**
   * Render Mini Cart Drawer content
   */
  function renderMiniCart() {
    const drawerContainer = document.getElementById('cart-drawer-items-list') || document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal-val') || document.getElementById('cart-drawer-total');
    const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');
    const emptyNotice = document.getElementById('cart-drawer-empty-state');
    const footerArea = document.getElementById('cart-drawer-footer');

    if (!drawerContainer) return;

    const cart = SOLEVAULT_STORAGE.getCart();
    const prefix = getPathPrefix();

    if (cart.length === 0) {
      if (emptyNotice) {
        drawerContainer.innerHTML = '';
        emptyNotice.style.display = 'block';
      } else {
        drawerContainer.innerHTML = `
          <div class="empty-state" style="padding: 40px 10px;">
            <div class="empty-state-icon">
              <svg class="icon-svg icon-svg-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
            <h3 class="empty-state-title" style="font-size: 1.1rem;">Giỏ hàng của bạn đang trống</h3>
            <p class="empty-state-text" style="font-size: 13px;">Hãy chọn những đôi sneaker yêu thích để thêm vào giỏ.</p>
            <a href="${prefix}products.html" class="btn btn-primary btn-sm">Xem tất cả sneaker</a>
          </div>
        `;
      }
      if (footerArea) footerArea.style.display = 'none';
      return;
    }

    if (emptyNotice) emptyNotice.style.display = 'none';
    if (footerArea) footerArea.style.display = 'block';

    let subtotal = 0;

    const itemsHTML = cart
      .map(item => {
        const product = SOLEVAULT_DATA.getProductById(item.productId);
        if (!product) return '';

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        const detailUrl = `${prefix}product-detail.html?id=${encodeURIComponent(product.id)}`;

        const rawPrimary = (product.images && product.images[0]) || '';
        const rawLocal = product.localImage || (product.images && product.images[1]) || '';
        const primaryImg = SOLEVAULT_UTILS.resolveProductImage(rawPrimary);
        const fallbackImg = rawLocal ? SOLEVAULT_UTILS.resolveProductImage(rawLocal) : '';

        return `
          <div class="cart-item" data-product-id="${item.productId}" data-size="${item.size}">
            <img src="${SOLEVAULT_UTILS.escapeHTML(primaryImg)}" data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}" alt="${SOLEVAULT_UTILS.escapeHTML(product.name)}" class="cart-item-img" onerror="SOLEVAULT_UTILS.handleImageError(this)"/>
            <div class="cart-item-details">
              <div class="cart-item-brand">${SOLEVAULT_UTILS.escapeHTML(product.brand)}</div>
              <div class="cart-item-name">
                <a href="${detailUrl}">${SOLEVAULT_UTILS.escapeHTML(product.name)}</a>
              </div>
              <div class="cart-item-variant">Size: <strong>${item.size} EU</strong></div>
              <div class="cart-item-price">${SOLEVAULT_UTILS.formatCurrency(product.price)}</div>
              <div class="cart-item-actions">
                <div class="qty-stepper">
                  <button type="button" class="qty-btn btn-mini-minus" data-pid="${item.productId}" data-size="${item.size}" aria-label="Giảm số lượng">-</button>
                  <input type="number" class="qty-input" value="${item.quantity}" readonly aria-label="Số lượng"/>
                  <button type="button" class="qty-btn btn-mini-plus" data-pid="${item.productId}" data-size="${item.size}" aria-label="Tăng số lượng">+</button>
                </div>
                <button type="button" class="cart-item-remove btn-mini-remove" data-pid="${item.productId}" data-size="${item.size}">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    drawerContainer.innerHTML = itemsHTML;

    if (subtotalEl) {
      subtotalEl.textContent = SOLEVAULT_UTILS.formatCurrency(subtotal);
    }

    // Ensure links inside cart drawer point to correct relative path
    const checkoutLink = document.querySelector('#cart-drawer a[href*="checkout.html"]');
    if (checkoutLink) checkoutLink.href = `${prefix}checkout.html`;
    const cartLink = document.querySelector('#cart-drawer a[href*="cart.html"]');
    if (cartLink) cartLink.href = `${prefix}cart.html`;
    const emptyShopLink = document.querySelector('#cart-drawer-empty-state a[href*="products.html"]');
    if (emptyShopLink) emptyShopLink.href = `${prefix}products.html`;

    // Bind item actions in drawer
    drawerContainer.querySelectorAll('.btn-mini-minus').forEach(btn => {
      btn.addEventListener('click', function () {
        const pid = this.getAttribute('data-pid');
        const size = Number(this.getAttribute('data-size'));
        const item = cart.find(i => i.productId === pid && Number(i.size) === size);
        if (item) {
          if (item.quantity > 1) {
            SOLEVAULT_STORAGE.updateCartItemQty(pid, size, item.quantity - 1);
          } else {
            SOLEVAULT_STORAGE.removeCartItem(pid, size);
          }
        }
      });
    });

    drawerContainer.querySelectorAll('.btn-mini-plus').forEach(btn => {
      btn.addEventListener('click', function () {
        const pid = this.getAttribute('data-pid');
        const size = Number(this.getAttribute('data-size'));
        const item = cart.find(i => i.productId === pid && Number(i.size) === size);
        if (item) {
          SOLEVAULT_STORAGE.updateCartItemQty(pid, size, item.quantity + 1);
        }
      });
    });

    drawerContainer.querySelectorAll('.btn-mini-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        const pid = this.getAttribute('data-pid');
        const size = Number(this.getAttribute('data-size'));
        SOLEVAULT_STORAGE.removeCartItem(pid, size);
      });
    });
  }

  /**
   * Render Dedicated Cart Page (pages/cart.html)
   */
  function initCartPage() {
    const pageContainer = document.getElementById('cart-page-view');
    if (!pageContainer) return; // Not on cart.html

    function renderFullCart() {
      const cart = SOLEVAULT_STORAGE.getCart();

      if (cart.length === 0) {
        pageContainer.innerHTML = `
          <div class="empty-state" style="margin: 40px auto; max-width: 600px;">
            <div class="empty-state-icon">${SOLEVAULT_UTILS.getSVG('cart', 'icon-svg-lg')}</div>
            <h2 class="empty-state-title">Giỏ hàng của bạn đang trống</h2>
            <p class="empty-state-text">
              Hãy khám phá ngay các bộ sưu tập sneaker mới nhất và chọn cho mình một phong cách ưng ý.
            </p>
            <a href="products.html" class="btn btn-primary btn-lg">Khám phá sneaker ngay</a>
          </div>
        `;
        return;
      }

      let subtotal = 0;

      const itemsRowsHTML = cart
        .map(item => {
          const product = SOLEVAULT_DATA.getProductById(item.productId);
          if (!product) return '';

          const itemTotal = product.price * item.quantity;
          subtotal += itemTotal;
          const detailUrl = `product-detail.html?id=${encodeURIComponent(product.id)}`;

          const rawPrimary = (product.images && product.images[0]) || '';
          const rawLocal = product.localImage || (product.images && product.images[1]) || '';
          const primaryImg = SOLEVAULT_UTILS.resolveProductImage(rawPrimary);
          const fallbackImg = rawLocal ? SOLEVAULT_UTILS.resolveProductImage(rawLocal) : '';

          return `
            <div class="cart-item" style="padding: 16px 0;" data-item-pid="${item.productId}" data-item-size="${item.size}">
              <img src="${SOLEVAULT_UTILS.escapeHTML(primaryImg)}" data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}" alt="${SOLEVAULT_UTILS.escapeHTML(product.name)}" class="cart-item-img" style="width: 90px; height: 90px;" onerror="SOLEVAULT_UTILS.handleImageError(this)"/>
              <div class="cart-item-details">
                <div class="cart-item-brand">${SOLEVAULT_UTILS.escapeHTML(product.brand)}</div>
                <h3 class="cart-item-name" style="font-size: 1rem; margin-bottom: 4px;">
                  <a href="${detailUrl}">${SOLEVAULT_UTILS.escapeHTML(product.name)}</a>
                </h3>
                <div class="cart-item-variant">Size: <strong>${item.size} EU</strong> • SKU: ${product.sku}</div>
                <div class="cart-item-price">${SOLEVAULT_UTILS.formatCurrency(product.price)}</div>
                
                <div class="cart-item-actions" style="margin-top: 12px;">
                  <div class="qty-stepper">
                    <button type="button" class="qty-btn btn-page-minus" data-pid="${item.productId}" data-size="${item.size}" aria-label="Giảm số lượng">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" readonly aria-label="Số lượng"/>
                    <button type="button" class="qty-btn btn-page-plus" data-pid="${item.productId}" data-size="${item.size}" aria-label="Tăng số lượng">+</button>
                  </div>
                  <div style="font-weight: bold; font-size: 1rem;">
                    Thành tiền: <span style="color: var(--color-accent);">${SOLEVAULT_UTILS.formatCurrency(itemTotal)}</span>
                  </div>
                  <button type="button" class="cart-item-remove btn-page-remove" data-pid="${item.productId}" data-size="${item.size}">
                    ${SOLEVAULT_UTILS.getSVG('trash', 'icon-svg-sm')} Xóa
                  </button>
                </div>
              </div>
            </div>
          `;
        })
        .join('');

      const shippingFee = subtotal >= SOLEVAULT_CONFIG.freeShippingThreshold ? 0 : SOLEVAULT_CONFIG.shippingFeeDemo;
      const grandTotal = subtotal + shippingFee;

      pageContainer.innerHTML = `
        <div class="cart-layout">
          <!-- Cart Items Left Column -->
          <div class="cart-table-wrap">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 16px;">
              <h2 style="font-size: 1.25rem;">Danh sách sản phẩm (${cart.length})</h2>
              <button type="button" class="cart-item-remove" id="cart-page-clear-btn" style="color: var(--color-error);">
                Xóa tất cả
              </button>
            </div>
            <div class="cart-items-container">
              ${itemsRowsHTML}
            </div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <a href="products.html" class="btn btn-outline">
                &larr; Tiếp tục chọn giày
              </a>
              <span class="text-muted" style="font-size: 12px;">
                * Giá đã bao gồm thuế tiêu chuẩn (Bản thử nghiệm)
              </span>
            </div>
          </div>

          <!-- Order Summary Right Column -->
          <div class="cart-order-summary">
            <h2 style="font-size: 1.25rem; margin-bottom: 16px; border-bottom: 1px solid var(--color-border); padding-bottom: 12px;">
              Tóm tắt đơn hàng
            </h2>

            <div class="summary-row">
              <span class="text-muted">Tạm tính:</span>
              <span style="font-weight: bold;">${SOLEVAULT_UTILS.formatCurrency(subtotal)}</span>
            </div>

            <div class="summary-row">
              <span class="text-muted">Phí vận chuyển COD demo:</span>
              <span>
                ${shippingFee === 0 ? '<strong style="color: var(--color-success);">Miễn phí</strong>' : SOLEVAULT_UTILS.formatCurrency(shippingFee)}
              </span>
            </div>

            ${shippingFee > 0 ? `
              <div class="form-hint" style="color: var(--color-accent); margin-bottom: 12px;">
                Mua thêm ${SOLEVAULT_UTILS.formatCurrency(SOLEVAULT_CONFIG.freeShippingThreshold - subtotal)} để được miễn phí giao hàng!
              </div>
            ` : ''}

            <div class="summary-row total-row">
              <span>Tổng thanh toán dự kiến:</span>
              <span style="font-size: 1.35rem; color: var(--color-accent);">${SOLEVAULT_UTILS.formatCurrency(grandTotal)}</span>
            </div>

            <div style="margin-top: 20px;">
              <a href="checkout.html" class="btn btn-primary btn-full btn-lg">
                Tiến hành thanh toán COD demo &rarr;
              </a>
            </div>

            <div style="margin-top: 16px; padding: 12px; background-color: var(--color-bg); border-radius: var(--radius-xs); font-size: 12px; color: var(--color-muted); line-height: 1.5;">
              ${SOLEVAULT_UTILS.getSVG('shield-check', 'icon-svg-sm')} Thanh toán khi nhận hàng (COD Demo). Được kiểm tra giày trước khi trả tiền.
            </div>
          </div>
        </div>
      `;

      // Bind button events on cart page
      pageContainer.querySelectorAll('.btn-page-minus').forEach(btn => {
        btn.addEventListener('click', function () {
          const pid = this.getAttribute('data-pid');
          const size = Number(this.getAttribute('data-size'));
          const item = cart.find(i => i.productId === pid && Number(i.size) === size);
          if (item) {
            if (item.quantity > 1) {
              SOLEVAULT_STORAGE.updateCartItemQty(pid, size, item.quantity - 1);
            } else {
              SOLEVAULT_STORAGE.removeCartItem(pid, size);
            }
          }
        });
      });

      pageContainer.querySelectorAll('.btn-page-plus').forEach(btn => {
        btn.addEventListener('click', function () {
          const pid = this.getAttribute('data-pid');
          const size = Number(this.getAttribute('data-size'));
          const item = cart.find(i => i.productId === pid && Number(i.size) === size);
          if (item) {
            SOLEVAULT_STORAGE.updateCartItemQty(pid, size, item.quantity + 1);
          }
        });
      });

      pageContainer.querySelectorAll('.btn-page-remove').forEach(btn => {
        btn.addEventListener('click', function () {
          const pid = this.getAttribute('data-pid');
          const size = Number(this.getAttribute('data-size'));
          SOLEVAULT_STORAGE.removeCartItem(pid, size);
        });
      });

      const clearAllBtn = document.getElementById('cart-page-clear-btn');
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
          if (confirm('Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng không?')) {
            SOLEVAULT_STORAGE.clearCart();
          }
        });
      }
    }

    renderFullCart();

    // Re-render when cart updates
    window.addEventListener('cart-updated', renderFullCart);
  }

  // Listen to storage events to keep mini cart synchronized
  window.addEventListener('cart-updated', renderMiniCart);

  // Public unified cart interface for tests and external scripts
  const cartInterface = {
    renderMiniCart,
    initCartPage,
    getCart: () => SOLEVAULT_STORAGE.getCart(),
    clearCart: () => SOLEVAULT_STORAGE.clearCart(),
    addToCart: (pid, size, qty = 1) => {
      const res = SOLEVAULT_STORAGE.addToCart(pid, size, qty);
      return res && res.success === true;
    },
    getItemCount: () => SOLEVAULT_STORAGE.getCartCount(),
    updateQuantity: (pid, size, qty) => SOLEVAULT_STORAGE.updateCartItemQty(pid, size, qty),
    removeFromCart: (pid, size) => SOLEVAULT_STORAGE.removeCartItem(pid, size),
    getSubtotal: () => {
      const cart = SOLEVAULT_STORAGE.getCart();
      return cart.reduce((sum, item) => {
        const p = SOLEVAULT_DATA.getProductById(item.productId);
        return sum + (p ? p.price * item.quantity : 0);
      }, 0);
    }
  };

  return cartInterface;
})();

const SOLEVAULT_CART = SOLEVAULT_CART_MODULE;
if (typeof window !== 'undefined') {
  window.SOLEVAULT_CART = SOLEVAULT_CART_MODULE;
}
