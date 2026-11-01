/**
 * SOLEVAULT — Main Application Orchestrator
 * Sticky header, drawer navigation, cart/wishlist badge synchronization, modals & page router
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileDrawer();
    initCartDrawer();
    initBrandsDropdown();
    initBadgeCounts();
    initGlobalBackdrop();
    initActiveNavHighlight();

    // Initialize modules if available
    if (typeof SOLEVAULT_SEARCH !== 'undefined') {
      SOLEVAULT_SEARCH.initSearch();
    }
    if (typeof SOLEVAULT_FORMS !== 'undefined') {
      SOLEVAULT_FORMS.initForms();
    }
    if (typeof SOLEVAULT_PRODUCTS_PAGE !== 'undefined') {
      SOLEVAULT_PRODUCTS_PAGE.initCatalog();
    }
    if (typeof SOLEVAULT_DETAIL_PAGE !== 'undefined') {
      SOLEVAULT_DETAIL_PAGE.initDetail();
    }
    if (typeof SOLEVAULT_CART_MODULE !== 'undefined') {
      SOLEVAULT_CART_MODULE.initCartPage();
    }
    if (typeof SOLEVAULT_WISHLIST !== 'undefined') {
      SOLEVAULT_WISHLIST.initWishlistPage();
    }
    if (typeof SOLEVAULT_CHECKOUT !== 'undefined') {
      SOLEVAULT_CHECKOUT.initCheckout();
    }
    if (typeof SOLEVAULT_ORDER_SUCCESS !== 'undefined') {
      SOLEVAULT_ORDER_SUCCESS.initOrderSuccess();
    }

    // Homepage specific initializers
    initHomepageGrids();
  });

  /**
   * Sticky Header Scroll Effect
   */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /**
   * Mobile Navigation Drawer
   */
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');
    const backdrop = document.getElementById('site-backdrop');

    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.classList.add('no-scroll');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Escape closes mobile drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  /**
   * Mini-Cart Drawer
   */
  function initCartDrawer() {
    const openBtns = document.querySelectorAll('.cart-toggle-btn');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('cart-drawer-close');
    const backdrop = document.getElementById('site-backdrop');

    if (!drawer) return;

    function openCart() {
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('active');
      document.body.classList.add('no-scroll');
      if (typeof SOLEVAULT_CART_MODULE !== 'undefined') {
        SOLEVAULT_CART_MODULE.renderMiniCart();
      }
    }

    function closeCart() {
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }

    openBtns.forEach(btn => btn.addEventListener('click', openCart));
    if (closeBtn) closeBtn.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeCart();
      }
    });
  }

  /**
   * Desktop Brands Dropdown Escape & Outside Click Handlers
   */
  function initBrandsDropdown() {
    const dropdownItem = document.querySelector('.nav-item.has-dropdown');
    if (!dropdownItem) return;

    const dropdownMenu = dropdownItem.querySelector('.dropdown-menu');

    document.addEventListener('click', (e) => {
      if (!dropdownItem.contains(e.target) && dropdownMenu) {
        dropdownMenu.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownMenu) {
        dropdownMenu.classList.remove('is-open');
      }
    });
  }

  /**
   * Global Backdrop Click Closes All Drawers
   */
  function initGlobalBackdrop() {
    const backdrop = document.getElementById('site-backdrop');
    if (!backdrop) return;

    backdrop.addEventListener('click', () => {
      const mobileDrawer = document.getElementById('mobile-drawer');
      const cartDrawer = document.getElementById('cart-drawer');
      const filterSidebar = document.getElementById('catalog-filter-sidebar');

      if (mobileDrawer) mobileDrawer.classList.remove('is-open');
      if (cartDrawer) cartDrawer.classList.remove('is-open');
      if (filterSidebar) filterSidebar.classList.remove('is-open');

      backdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

  /**
   * Synchronize Cart & Wishlist Badge Numbers in Header
   */
  function initBadgeCounts() {
    function updateBadges() {
      const cartCount = SOLEVAULT_STORAGE.getCartCount();
      const wishlistCount = SOLEVAULT_STORAGE.getWishlist().length;

      document.querySelectorAll('.badge-cart-count').forEach(el => {
        el.textContent = cartCount;
        el.style.display = cartCount > 0 ? 'inline-flex' : 'none';
      });

      document.querySelectorAll('.badge-wishlist-count').forEach(el => {
        el.textContent = wishlistCount;
        el.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
      });
    }

    updateBadges();
    window.addEventListener('cart-updated', updateBadges);
    window.addEventListener('wishlist-updated', updateBadges);
    window.addEventListener('demo-data-cleared', updateBadges);
  }

  /**
   * Highlight Active Nav Link
   */
  function initActiveNavHighlight() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (
        (path.endsWith('index.html') || path.endsWith('/')) &&
        (href === 'index.html' || href === '../index.html' || href === './')
      ) {
        link.classList.add('active');
      } else if (href.includes('products.html') && path.includes('products.html')) {
        // Check if sale or new arrivals specifically
        const urlParams = new URLSearchParams(window.location.search);
        if (href.includes('sale=1') && urlParams.get('sale') === '1') {
          link.classList.add('active');
        } else if (href.includes('new=1') && urlParams.get('new') === '1') {
          link.classList.add('active');
        } else if (!href.includes('?') && !urlParams.toString()) {
          link.classList.add('active');
        }
      } else if (href.includes('about.html') && path.includes('about.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Homepage Specific Dynamic Grids
   */
  function initHomepageGrids() {
    const newArrivalsGrid = document.getElementById('home-new-arrivals-grid');
    const trendingGrid = document.getElementById('home-trending-grid');

    if (newArrivalsGrid) {
      const newItems = SOLEVAULT_DATA.getProducts({ isNew: true }).slice(0, 4);
      newArrivalsGrid.innerHTML = newItems.map(SOLEVAULT_PRODUCTS_PAGE.createProductCardHTML).join('');
      SOLEVAULT_PRODUCTS_PAGE.bindWishlistButtons(newArrivalsGrid);
    }

    if (trendingGrid) {
      const trendingItems = SOLEVAULT_DATA.raw.filter(p => p.isFeatured).slice(0, 4);
      trendingGrid.innerHTML = trendingItems.map(SOLEVAULT_PRODUCTS_PAGE.createProductCardHTML).join('');
      SOLEVAULT_PRODUCTS_PAGE.bindWishlistButtons(trendingGrid);
    }
  }
})();
