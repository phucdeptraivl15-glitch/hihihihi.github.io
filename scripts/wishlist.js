/**
 * SOLEVAULT — Wishlist Module
 * Renders dedicated wishlist view and synchronizes favorited items
 */

const SOLEVAULT_WISHLIST = (function () {
  'use strict';

  function initWishlistPage() {
    const container = document.getElementById('wishlist-products-grid');
    const countEl = document.getElementById('wishlist-count-display');
    if (!container) return; // Not on wishlist.html

    function renderWishlistItems() {
      const ids = SOLEVAULT_STORAGE.getWishlist();
      const products = ids
        .map(id => SOLEVAULT_DATA.getProductById(id))
        .filter(Boolean);

      if (countEl) {
        countEl.textContent = `${products.length} sản phẩm`;
      }

      if (products.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; margin: 40px auto; max-width: 600px;">
            <div class="empty-state-icon">${SOLEVAULT_UTILS.getSVG('heart', 'icon-svg-lg')}</div>
            <h2 class="empty-state-title">Danh sách yêu thích trống</h2>
            <p class="empty-state-text">
              Bạn chưa lưu mẫu sneaker nào vào danh sách yêu thích. Hãy bấm vào biểu tượng trái tim trên các sản phẩm để lưu lại xem sau.
            </p>
            <a href="products.html" class="btn btn-primary btn-lg">Khám phá sneaker ngay</a>
          </div>
        `;
        return;
      }

      container.innerHTML = products.map(SOLEVAULT_PRODUCTS_PAGE.createProductCardHTML).join('');
      SOLEVAULT_PRODUCTS_PAGE.bindWishlistButtons(container);
    }

    renderWishlistItems();
    window.addEventListener('wishlist-updated', renderWishlistItems);
  }

  return {
    initWishlistPage,
    toggle: (id) => SOLEVAULT_STORAGE.toggleWishlist(id),
    has: (id) => SOLEVAULT_STORAGE.isInWishlist(id),
    getWishlist: () => SOLEVAULT_STORAGE.getWishlist()
  };
})();
