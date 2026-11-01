/**
 * SOLEVAULT — Utility Functions
 * Helper methods for formatting, DOM manipulation, security & icons
 */

const SOLEVAULT_UTILS = (function () {
  'use strict';

  // Currency Formatter
  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  });

  /**
   * Format integer number into Vietnamese currency string
   * @param {number} amount
   * @returns {string} e.g. "3.250.000 ₫"
   */
  function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0 ₫';
    }
    return currencyFormatter.format(amount);
  }

  /**
   * Escape HTML to prevent XSS attacks when rendering text
   * @param {string} str
   * @returns {string}
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Remove Vietnamese diacritics for non-accent search
   * @param {string} str
   * @returns {string}
   */
  function removeVietnameseTones(str) {
    if (!str) return '';
    str = String(str);
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/[đĐ]/g, function (match) {
      return match === 'đ' ? 'd' : 'D';
    });
    return str.toLowerCase().trim();
  }

  /**
   * Debounce helper
   * @param {Function} func
   * @param {number} delay
   * @returns {Function}
   */
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Check whether current execution context is inside /pages/ or root
   * @returns {boolean}
   */
  function isSubpage() {
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname.replace(/\\/g, '/');
    if (pathname.includes('/pages/')) return true;
    if (typeof document !== 'undefined') {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].getAttribute('src') || '';
        if (src.startsWith('../scripts/') || src.startsWith('../assets/')) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get relative fallback placeholder path based on page location
   * @returns {string}
   */
  function getFallbackImage() {
    return isSubpage()
      ? '../assets/images/placeholders/no-image.svg'
      : 'assets/images/placeholders/no-image.svg';
  }

  /**
   * Resolve product image URL/path correctly for both root and /pages/ subpages
   * @param {string} path
   * @returns {string}
   */
  function resolveProductImage(path) {
    if (!path || typeof path !== 'string' || !path.trim()) {
      return getFallbackImage();
    }
    const trimmed = path.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    const cleanPath = trimmed.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
    return isSubpage() ? '../' + cleanPath : cleanPath;
  }

  /**
   * Fallback image if external or local image fails to load
   * Supports multi-tier fallback: Primary CDN -> Local Backup Image -> Placeholder SVG -> Inline Data SVG
   * @param {HTMLImageElement} img
   */
  function handleImageError(img) {
    if (!img) return;

    // Tier 1 Fallback: Try local backup file if primary online CDN failed
    if (!img.dataset.triedLocal && img.dataset.fallbackSrc) {
      img.dataset.triedLocal = 'true';
      img.src = resolveProductImage(img.dataset.fallbackSrc);
      return;
    }

    // Tier 2 Fallback: SVG placeholder file
    if (!img.dataset.hasFailed) {
      img.dataset.hasFailed = 'true';
      img.src = getFallbackImage();
      return;
    }

    // Tier 3 Fallback: Inline Data SVG (completely offline & server-independent)
    if (!img.dataset.hasFailedFallback) {
      img.dataset.hasFailedFallback = 'true';
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23F1F5F9"><rect width="400" height="400" fill="%23F1F5F9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394A3B8" font-weight="bold">CHƯA CÓ HÌNH ẢNH</text></svg>';
    }
  }

  /**
   * Toast notification system
   * @param {string} title
   * @param {string} message
   * @param {string} type 'success' | 'error' | 'info'
   */
  function showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${escapeHTML(type)}`;

    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-message">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close" type="button" aria-label="Đóng thông báo">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    };

    closeBtn.addEventListener('click', removeToast);
    container.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(removeToast, 4000);
  }

  /**
   * Vanilla Handcrafted SVG Icons (Zero external font/icon libraries)
   * @param {string} name
   * @param {string} extraClass
   * @returns {string} SVG HTML string
   */
  function getSVG(name, extraClass = '') {
    const cls = `icon-svg ${extraClass}`.trim();
    switch (name) {
      case 'search':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
      case 'heart':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      case 'heart-fill':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      case 'cart':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
      case 'close':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      case 'menu':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      case 'chevron-down':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
      case 'check':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      case 'trash':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
      case 'filter':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`;
      case 'arrow-right':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      case 'shield-check':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`;
      case 'truck':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
      case 'package':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;
      case 'rotate-ccw':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`;
      case 'info':
        return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      default:
        return '';
    }
  }

  return {
    formatCurrency,
    escapeHTML,
    removeVietnameseTones,
    debounce,
    handleImageError,
    resolveProductImage,
    getFallbackImage,
    showToast,
    getSVG
  };
})();
