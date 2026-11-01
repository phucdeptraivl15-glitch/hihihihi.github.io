/**
 * SOLEVAULT — Catalog & Product Card Engine
 * Manages product rendering, filtering, sorting, and URL sync
 */

const SOLEVAULT_PRODUCTS_PAGE = (function () {
  'use strict';

  /**
   * Determine relative path prefix to pages/
   * If running from index.html (root), prefix is 'pages/'
   * If running from pages/*.html, prefix is ''
   */
  function getPathPrefix() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '' : 'pages/';
  }

  /**
   * Render single Product Card HTML string
   * @param {Object} product
   * @returns {string} HTML string
   */
  function createProductCardHTML(product) {
    if (!product) return '';

    const prefix = getPathPrefix();
    const isWishlisted = SOLEVAULT_STORAGE.isInWishlist(product.id);
    const detailUrl = `${prefix}product-detail.html?id=${encodeURIComponent(product.id)}`;

    // Badges calculation
    let badgesHTML = '';
    if (product.stock <= 0) {
      badgesHTML += `<span class="badge badge-soldout">Hết hàng</span>`;
    } else {
      if (product.isNew) {
        badgesHTML += `<span class="badge badge-new">New</span>`;
      }
      if (product.isOnSale && product.originalPrice && product.originalPrice > product.price) {
        const discountPercent = Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        );
        badgesHTML += `<span class="badge badge-sale">-${discountPercent}%</span>`;
      }
    }

    // Pricing calculation
    let pricingHTML = `<span class="price-current">${SOLEVAULT_UTILS.formatCurrency(product.price)}</span>`;
    if (product.originalPrice && product.originalPrice > product.price) {
      pricingHTML += `<span class="price-original">${SOLEVAULT_UTILS.formatCurrency(product.originalPrice)}</span>`;
    }

    const rawPrimary = (product.images && product.images[0]) || '';
    const rawLocal = product.localImage || (product.images && product.images[1]) || '';
    const primaryImg = SOLEVAULT_UTILS.resolveProductImage(rawPrimary);
    const fallbackImg = rawLocal ? SOLEVAULT_UTILS.resolveProductImage(rawLocal) : '';
    const secondaryImg = (product.images && product.images.length > 2) 
      ? SOLEVAULT_UTILS.resolveProductImage(product.images[2]) 
      : primaryImg;

    return `
      <article class="product-card fade-in" data-product-id="${SOLEVAULT_UTILS.escapeHTML(product.id)}">
        <div class="product-card-media">
          <div class="product-card-badges">
            ${badgesHTML}
          </div>
          <button 
            type="button" 
            class="product-card-wishlist ${isWishlisted ? 'is-active' : ''}" 
            data-wishlist-id="${SOLEVAULT_UTILS.escapeHTML(product.id)}"
            aria-label="${isWishlisted ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}"
            title="${isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}"
          >
            ${SOLEVAULT_UTILS.getSVG(isWishlisted ? 'heart-fill' : 'heart')}
          </button>
          <a href="${detailUrl}" class="product-card-link" aria-label="Xem chi tiết ${SOLEVAULT_UTILS.escapeHTML(product.name)}">
            <img 
              src="${SOLEVAULT_UTILS.escapeHTML(primaryImg)}" 
              data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}"
              alt="${SOLEVAULT_UTILS.escapeHTML(product.name)}" 
              class="product-card-img" 
              loading="lazy"
              onerror="SOLEVAULT_UTILS.handleImageError(this)"
            />
            <img 
              src="${SOLEVAULT_UTILS.escapeHTML(secondaryImg)}" 
              data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}"
              alt="${SOLEVAULT_UTILS.escapeHTML(product.name)} góc nhìn thứ hai" 
              class="product-card-img product-card-img-secondary" 
              loading="lazy"
              onerror="SOLEVAULT_UTILS.handleImageError(this)"
            />
          </a>
        </div>
        <div class="product-card-content">
          <div class="product-card-brand">${SOLEVAULT_UTILS.escapeHTML(product.brand)}</div>
          <h3 class="product-card-title">
            <a href="${detailUrl}">${SOLEVAULT_UTILS.escapeHTML(product.name)}</a>
          </h3>
          <div class="product-card-meta">
            <span>${SOLEVAULT_UTILS.escapeHTML(product.category)}</span>
            <span>•</span>
            <span>${SOLEVAULT_UTILS.escapeHTML(product.type || 'Sneaker')}</span>
          </div>
          <div class="product-card-pricing">
            ${pricingHTML}
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Bind event delegation on container for wishlist toggling
   * @param {HTMLElement} container
   */
  function bindWishlistButtons(container) {
    if (!container) return;

    container.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-wishlist-id]');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const productId = btn.getAttribute('data-wishlist-id');
      if (!productId) return;

      const product = SOLEVAULT_DATA.getProductById(productId);
      const isNowActive = SOLEVAULT_STORAGE.toggleWishlist(productId);

      btn.classList.toggle('is-active', isNowActive);
      btn.innerHTML = SOLEVAULT_UTILS.getSVG(isNowActive ? 'heart-fill' : 'heart');
      btn.setAttribute(
        'aria-label',
        isNowActive ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'
      );

      if (product) {
        SOLEVAULT_UTILS.showToast(
          isNowActive ? 'ĐÃ LƯU YÊU THÍCH' : 'ĐÃ BỎ YÊU THÍCH',
          `${product.name} đã được ${isNowActive ? 'thêm vào' : 'xóa khỏi'} danh sách yêu thích.`,
          isNowActive ? 'success' : 'info'
        );
      }
    });
  }

  /**
   * Initialize Catalog page elements & filter state
   */
  function initCatalog() {
    const grid = document.getElementById('catalog-products-grid');
    if (!grid) return; // Not on products.html

    const countEl = document.getElementById('catalog-results-count');
    const sortSelect = document.getElementById('catalog-sort-select');
    const activeTagsContainer = document.getElementById('active-filters-tags');
    const clearAllBtn = document.getElementById('filter-clear-all-btn');

    // Parse URL Query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filterState = {
      brands: urlParams.getAll('brand'),
      categories: urlParams.getAll('category'),
      sizes: urlParams.getAll('size').map(Number).filter(n => !isNaN(n)),
      isOnSale: urlParams.get('sale') === '1',
      isNew: urlParams.get('new') === '1',
      inStockOnly: urlParams.get('instock') === '1',
      sort: urlParams.get('sort') || 'newest',
      query: urlParams.get('q') || ''
    };

    if (sortSelect) {
      sortSelect.value = filterState.sort;
    }

    // Sync HTML checkboxes and size buttons with initial URL state
    syncInputsWithState(filterState);

    // Render results
    renderCatalogResults(filterState);

    // Event listener: Sorting dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        filterState.sort = this.value;
        updateURLAndRender(filterState);
      });
    }

    // Event listener: Brand Checkboxes
    document.querySelectorAll('input[name="filter-brand"]').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const val = this.value;
        if (this.checked) {
          if (!filterState.brands.includes(val)) filterState.brands.push(val);
        } else {
          filterState.brands = filterState.brands.filter(b => b !== val);
        }
        updateURLAndRender(filterState);
      });
    });

    // Event listener: Category Checkboxes
    document.querySelectorAll('input[name="filter-category"]').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const val = this.value;
        if (this.checked) {
          if (!filterState.categories.includes(val)) filterState.categories.push(val);
        } else {
          filterState.categories = filterState.categories.filter(c => c !== val);
        }
        updateURLAndRender(filterState);
      });
    });

    // Event listener: Availability / Sale Checkboxes
    const saleCheck = document.getElementById('filter-sale');
    if (saleCheck) {
      saleCheck.addEventListener('change', function () {
        filterState.isOnSale = this.checked;
        updateURLAndRender(filterState);
      });
    }

    const inStockCheck = document.getElementById('filter-instock');
    if (inStockCheck) {
      inStockCheck.addEventListener('change', function () {
        filterState.inStockOnly = this.checked;
        updateURLAndRender(filterState);
      });
    }

    // Event listener: Size Pills
    document.querySelectorAll('.size-pill-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const sizeNum = Number(this.getAttribute('data-size'));
        if (isNaN(sizeNum)) return;

        if (filterState.sizes.includes(sizeNum)) {
          filterState.sizes = filterState.sizes.filter(s => s !== sizeNum);
          this.classList.remove('is-active');
        } else {
          filterState.sizes.push(sizeNum);
          this.classList.add('is-active');
        }
        updateURLAndRender(filterState);
      });
    });

    // Event listener: Clear all filters
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function () {
        filterState.brands = [];
        filterState.categories = [];
        filterState.sizes = [];
        filterState.isOnSale = false;
        filterState.isNew = false;
        filterState.inStockOnly = false;
        filterState.query = '';
        syncInputsWithState(filterState);
        updateURLAndRender(filterState);
      });
    }

    // Mobile filter drawer open/close
    const mobileFilterBtn = document.getElementById('mobile-filter-open');
    const filterSidebar = document.getElementById('catalog-filter-sidebar');
    const mobileFilterClose = document.getElementById('mobile-filter-close');
    const backdrop = document.getElementById('site-backdrop');

    if (mobileFilterBtn && filterSidebar) {
      mobileFilterBtn.addEventListener('click', () => {
        filterSidebar.classList.add('is-open');
        if (backdrop) backdrop.classList.add('active');
        document.body.classList.add('no-scroll');
      });
    }

    const closeFilterDrawer = () => {
      if (filterSidebar) filterSidebar.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
    };

    if (mobileFilterClose) mobileFilterClose.addEventListener('click', closeFilterDrawer);
    if (backdrop) backdrop.addEventListener('click', closeFilterDrawer);

    // Enable wishlist buttons in grid
    bindWishlistButtons(grid);
  }

  /**
   * Helper to update form controls visually from current state
   */
  function syncInputsWithState(state) {
    document.querySelectorAll('input[name="filter-brand"]').forEach(cb => {
      cb.checked = state.brands.includes(cb.value);
    });

    document.querySelectorAll('input[name="filter-category"]').forEach(cb => {
      cb.checked = state.categories.includes(cb.value);
    });

    const saleCheck = document.getElementById('filter-sale');
    if (saleCheck) saleCheck.checked = state.isOnSale;

    const inStockCheck = document.getElementById('filter-instock');
    if (inStockCheck) inStockCheck.checked = state.inStockOnly;

    document.querySelectorAll('.size-pill-btn').forEach(btn => {
      const s = Number(btn.getAttribute('data-size'));
      btn.classList.toggle('is-active', state.sizes.includes(s));
    });
  }

  /**
   * Update browser URL and re-render grid
   */
  function updateURLAndRender(state) {
    const params = new URLSearchParams();

    state.brands.forEach(b => params.append('brand', b));
    state.categories.forEach(c => params.append('category', c));
    state.sizes.forEach(s => params.append('size', s));
    if (state.isOnSale) params.set('sale', '1');
    if (state.isNew) params.set('new', '1');
    if (state.inStockOnly) params.set('instock', '1');
    if (state.sort && state.sort !== 'newest') params.set('sort', state.sort);
    if (state.query) params.set('q', state.query);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    try {
      window.history.replaceState({}, '', newUrl);
    } catch (e) {}

    renderCatalogResults(state);
  }

  /**
   * Render filtered products into the catalog grid
   */
  function renderCatalogResults(state) {
    const grid = document.getElementById('catalog-products-grid');
    const countEl = document.getElementById('catalog-results-count');
    const activeTagsContainer = document.getElementById('active-filters-tags');

    if (!grid) return;

    const products = SOLEVAULT_DATA.getProducts(state);

    if (countEl) {
      countEl.textContent = `Hiển thị ${products.length} trên tổng ${SOLEVAULT_DATA.raw.length} sản phẩm`;
    }

    // Render active filter pills
    if (activeTagsContainer) {
      renderActiveFilterTags(activeTagsContainer, state);
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${SOLEVAULT_UTILS.getSVG('info', 'icon-svg-lg')}</div>
          <h3 class="empty-state-title">Không tìm thấy sneaker phù hợp</h3>
          <p class="empty-state-text">
            Rất tiếc, không có sản phẩm nào khớp với bộ lọc hoặc từ khóa bạn vừa chọn. Hãy thử xóa bớt điều kiện lọc hoặc đặt lại tất cả.
          </p>
          <button type="button" class="btn btn-outline" id="empty-state-reset-btn">
            Đặt lại bộ lọc
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('empty-state-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          const clearAllBtn = document.getElementById('filter-clear-all-btn');
          if (clearAllBtn) clearAllBtn.click();
        });
      }
      return;
    }

    grid.innerHTML = products.map(createProductCardHTML).join('');
  }

  /**
   * Render interactive active filter tags
   */
  function renderActiveFilterTags(container, state) {
    const tags = [];

    if (state.query) {
      tags.push({ label: `Tìm: "${state.query}"`, type: 'query', val: state.query });
    }
    state.brands.forEach(b => tags.push({ label: `Hiệu: ${b}`, type: 'brand', val: b }));
    state.categories.forEach(c => tags.push({ label: `Dòng: ${c}`, type: 'category', val: c }));
    state.sizes.forEach(s => tags.push({ label: `Size: ${s}`, type: 'size', val: s }));
    if (state.isOnSale) tags.push({ label: 'Đang giảm giá', type: 'sale' });
    if (state.inStockOnly) tags.push({ label: 'Còn hàng', type: 'instock' });

    if (tags.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = tags
      .map(
        tag => `
        <span class="filter-tag">
          ${SOLEVAULT_UTILS.escapeHTML(tag.label)}
          <button type="button" class="filter-tag-remove" data-remove-type="${tag.type}" data-remove-val="${tag.val || ''}" aria-label="Xóa bộ lọc ${SOLEVAULT_UTILS.escapeHTML(tag.label)}">&times;</button>
        </span>
      `
      )
      .join('');

    container.querySelectorAll('.filter-tag-remove').forEach(btn => {
      btn.addEventListener('click', function () {
        const type = this.getAttribute('data-remove-type');
        const val = this.getAttribute('data-remove-val');

        if (type === 'brand') state.brands = state.brands.filter(b => b !== val);
        if (type === 'category') state.categories = state.categories.filter(c => c !== val);
        if (type === 'size') state.sizes = state.sizes.filter(s => s !== Number(val));
        if (type === 'sale') state.isOnSale = false;
        if (type === 'instock') state.inStockOnly = false;
        if (type === 'query') state.query = '';

        syncInputsWithState(state);
        updateURLAndRender(state);
      });
    });
  }

  return {
    createProductCardHTML,
    bindWishlistButtons,
    initCatalog
  };
})();

const SOLEVAULT_CATALOG = {
  applyFilters: function (criteria) {
    return SOLEVAULT_DATA.getProducts(criteria);
  },
  sortProducts: function (list, type) {
    const arr = [...(list || SOLEVAULT_DATA.raw)];
    if (type === 'price-asc') return arr.sort((a, b) => a.price - b.price);
    if (type === 'price-desc') return arr.sort((a, b) => b.price - a.price);
    if (type === 'name-az') return arr.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    return arr;
  },
  createProductCardHTML: SOLEVAULT_PRODUCTS_PAGE.createProductCardHTML,
  initCatalog: SOLEVAULT_PRODUCTS_PAGE.initCatalog
};

if (typeof window !== 'undefined') {
  window.SOLEVAULT_CATALOG = SOLEVAULT_CATALOG;
}
