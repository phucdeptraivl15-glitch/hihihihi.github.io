/**
 * SOLEVAULT — Search Engine & Overlay Logic
 * Instant debounced search with Vietnamese diacritics support & keyboard navigation
 */

const SOLEVAULT_SEARCH = (function () {
  'use strict';

  function initSearch() {
    const overlay = document.getElementById('search-overlay');
    const openBtn = document.getElementById('search-toggle-btn');
    const closeBtn = document.getElementById('search-close-btn');
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const resultsContainer = document.getElementById('search-live-results');
    const defaultSuggestions = document.getElementById('search-default-suggestions');

    if (!overlay || !input) return;

    /**
     * Open search overlay
     */
    function openSearch() {
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      setTimeout(() => input.focus(), 100);
    }

    /**
     * Close search overlay
     */
    function closeSearch() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    if (openBtn) openBtn.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    // Close on overlay backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSearch();
      }
    });

    // Keyboard navigation: Escape closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeSearch();
      }
    });

    // Clear search input
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('active');
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (defaultSuggestions) defaultSuggestions.style.display = 'block';
        input.focus();
      });
    }

    // Live search debounced handler
    const handleInput = SOLEVAULT_UTILS.debounce(function () {
      const query = input.value.trim();

      if (clearBtn) {
        clearBtn.classList.toggle('active', query.length > 0);
      }

      if (query.length === 0) {
        if (resultsContainer) resultsContainer.innerHTML = '';
        if (defaultSuggestions) defaultSuggestions.style.display = 'block';
        return;
      }

      if (defaultSuggestions) defaultSuggestions.style.display = 'none';

      // Perform matching
      const matches = SOLEVAULT_DATA.getProducts({ query }).slice(0, 6);
      renderLiveResults(resultsContainer, matches, query);
    }, 250);

    input.addEventListener('input', handleInput);

    // Form submit or Enter key -> redirect to products.html?q=...
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
          window.location.href = `${prefix}products.html?q=${encodeURIComponent(query)}`;
        }
      });
    }

    // Popular suggestion pills click
    document.querySelectorAll('.search-tag-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const tag = this.getAttribute('data-search-tag') || this.textContent.trim();
        input.value = tag;
        input.dispatchEvent(new Event('input'));
      });
    });
  }

  /**
   * Render matched sneaker items
   */
  function renderLiveResults(container, products, query) {
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--color-muted);">
          <p>Không tìm thấy sản phẩm nào cho từ khóa "<strong>${SOLEVAULT_UTILS.escapeHTML(query)}</strong>".</p>
        </div>
      `;
      return;
    }

    const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';

    const itemsHTML = products
      .map(p => {
        const detailUrl = `${prefix}product-detail.html?id=${encodeURIComponent(p.id)}`;
        const rawPrimary = (p.images && p.images[0]) || '';
        const rawLocal = p.localImage || (p.images && p.images[1]) || '';
        const primaryImg = SOLEVAULT_UTILS.resolveProductImage(rawPrimary);
        const fallbackImg = rawLocal ? SOLEVAULT_UTILS.resolveProductImage(rawLocal) : '';

        return `
          <a href="${detailUrl}" class="search-item-row">
            <img src="${SOLEVAULT_UTILS.escapeHTML(primaryImg)}" data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}" alt="${SOLEVAULT_UTILS.escapeHTML(p.name)}" class="search-item-thumb" onerror="SOLEVAULT_UTILS.handleImageError(this)"/>
            <div class="search-item-info">
              <div class="search-item-brand">${SOLEVAULT_UTILS.escapeHTML(p.brand)}</div>
              <div class="search-item-name">${SOLEVAULT_UTILS.escapeHTML(p.name)}</div>
              <div class="search-item-price">${SOLEVAULT_UTILS.formatCurrency(p.price)}</div>
            </div>
            <div style="color: var(--color-light-muted);">${SOLEVAULT_UTILS.getSVG('arrow-right', 'icon-svg-sm')}</div>
          </a>
        `;
      })
      .join('');

    container.innerHTML = `
      <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: var(--color-muted); letter-spacing: 0.08em;">
          Gợi ý phù hợp (${products.length})
        </span>
        <a href="${prefix}products.html?q=${encodeURIComponent(query)}" style="font-size: 12px; color: var(--color-accent); font-weight: bold;">
          Xem tất cả &rarr;
        </a>
      </div>
      <div class="search-items-list">
        ${itemsHTML}
      </div>
    `;
  }

  function executeSearch(query) {
    const resultsContainer = document.getElementById('search-live-results');
    const defaultSuggestions = document.getElementById('search-default-suggestions');
    if (defaultSuggestions) defaultSuggestions.style.display = 'none';
    const matches = SOLEVAULT_DATA.getProducts({ query }).slice(0, 6);
    renderLiveResults(resultsContainer, matches, query);
    return matches;
  }

  return {
    initSearch,
    executeSearch
  };
})();
