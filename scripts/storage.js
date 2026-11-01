/**
 * SOLEVAULT — Client Storage Layer
 * Resilient wrapper around localStorage & sessionStorage with in-memory fallbacks
 */

const SOLEVAULT_STORAGE = (function () {
  'use strict';

  const CART_KEY = 'solevault_cart_demo_v1';
  const WISHLIST_KEY = 'solevault_wishlist_demo_v1';
  const ORDER_KEY = 'solevault_latest_order_demo_v1';

  // In-memory fallback if localStorage is disabled or corrupted
  const memoryStorage = {
    [CART_KEY]: [],
    [WISHLIST_KEY]: [],
    [ORDER_KEY]: null
  };

  /**
   * Check if storage type is accessible without throwing
   * @param {string} type 'localStorage' | 'sessionStorage'
   */
  function isStorageSupported(type) {
    try {
      const storage = window[type];
      const testKey = '__sv_test__';
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasLocalStorage = isStorageSupported('localStorage');
  const hasSessionStorage = isStorageSupported('sessionStorage');

  /* ===================================================
     CART OPERATIONS
     =================================================== */

  /**
   * Retrieve cart items from storage
   * @returns {Array<{productId: string, size: number, variantId: string, quantity: number}>}
   */
  function getCart() {
    if (!hasLocalStorage) {
      return memoryStorage[CART_KEY];
    }
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      // Validate each cart item against product data to prevent stale/corrupt items
      return parsed.filter(item => {
        if (!item || typeof item !== 'object') return false;
        if (!item.productId || !item.size || !item.variantId) return false;
        if (typeof item.quantity !== 'number' || isNaN(item.quantity) || item.quantity <= 0) return false;

        // Ensure product actually exists in data catalog
        const product = SOLEVAULT_DATA.getProductById(item.productId);
        return product !== null;
      });
    } catch (e) {
      console.warn('SOLEVAULT: Lỗi đọc giỏ hàng từ localStorage. Khôi phục giỏ trống.', e);
      return [];
    }
  }

  /**
   * Save cart items to storage
   * @param {Array} items
   */
  function saveCart(items) {
    const validItems = Array.isArray(items) ? items : [];
    memoryStorage[CART_KEY] = validItems;

    if (hasLocalStorage) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(validItems));
      } catch (e) {
        console.warn('SOLEVAULT: Không thể ghi giỏ hàng vào localStorage.', e);
      }
    }
    dispatchStorageEvent('cart-updated', validItems);
  }

  /**
   * Add item to cart or increment quantity if same product & size exists
   * @param {string} productId
   * @param {number} size
   * @param {number} quantity
   * @returns {{success: boolean, message: string}}
   */
  function addToCart(productId, size, quantity = 1) {
    const product = SOLEVAULT_DATA.getProductById(productId);
    if (!product) {
      return { success: false, message: 'Không tìm thấy sản phẩm.' };
    }

    const numSize = Number(size);
    const variant = product.variants.find(v => Number(v.size) === numSize);
    if (!variant) {
      return { success: false, message: 'Size không hợp lệ.' };
    }

    if (variant.stock <= 0) {
      return { success: false, message: `Size ${numSize} hiện đã hết hàng.` };
    }

    const cart = getCart();
    const existingIndex = cart.findIndex(
      item => item.productId === productId && Number(item.size) === numSize
    );

    const safeQty = Math.max(1, Number(quantity) || 1);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = currentQty + safeQty;

      if (newQty > variant.stock) {
        return {
          success: false,
          message: `Số lượng vượt quá tồn kho demo (Còn ${variant.stock} đôi size ${numSize}).`
        };
      }
      cart[existingIndex].quantity = newQty;
    } else {
      if (safeQty > variant.stock) {
        return {
          success: false,
          message: `Số lượng vượt quá tồn kho demo (Còn ${variant.stock} đôi size ${numSize}).`
        };
      }
      cart.push({
        productId: product.id,
        size: numSize,
        variantId: variant.variantId,
        quantity: safeQty,
        addedAt: Date.now()
      });
    }

    saveCart(cart);
    return {
      success: true,
      message: `Đã thêm ${product.name} (Size ${numSize}) vào giỏ hàng.`
    };
  }

  /**
   * Update quantity of a specific item
   * @param {string} productId
   * @param {number} size
   * @param {number} newQuantity
   */
  function updateCartItemQty(productId, size, newQuantity) {
    const product = SOLEVAULT_DATA.getProductById(productId);
    if (!product) return;

    const numSize = Number(size);
    const variant = product.variants.find(v => Number(v.size) === numSize);
    if (!variant) return;

    const cart = getCart();
    const index = cart.findIndex(
      item => item.productId === productId && Number(item.size) === numSize
    );

    if (index > -1) {
      const safeQty = Math.max(1, Math.min(newQuantity, variant.stock));
      cart[index].quantity = safeQty;
      saveCart(cart);
    }
  }

  /**
   * Remove a specific item from cart
   * @param {string} productId
   * @param {number} size
   */
  function removeCartItem(productId, size) {
    const numSize = Number(size);
    const cart = getCart();
    const filtered = cart.filter(
      item => !(item.productId === productId && Number(item.size) === numSize)
    );
    saveCart(filtered);
  }

  /**
   * Clear entire cart
   */
  function clearCart() {
    saveCart([]);
  }

  /**
   * Get total number of distinct units in cart
   * @returns {number}
   */
  function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  /* ===================================================
     WISHLIST OPERATIONS
     =================================================== */

  /**
   * Get wishlist product IDs
   * @returns {string[]}
   */
  function getWishlist() {
    if (!hasLocalStorage) {
      return memoryStorage[WISHLIST_KEY];
    }
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(id => SOLEVAULT_DATA.getProductById(id) !== null);
    } catch (e) {
      return [];
    }
  }

  /**
   * Save wishlist to storage
   * @param {string[]} ids
   */
  function saveWishlist(ids) {
    const validIds = Array.from(new Set(ids.filter(Boolean)));
    memoryStorage[WISHLIST_KEY] = validIds;

    if (hasLocalStorage) {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(validIds));
      } catch (e) {
        console.warn('SOLEVAULT: Lỗi lưu wishlist vào localStorage.', e);
      }
    }
    dispatchStorageEvent('wishlist-updated', validIds);
  }

  /**
   * Toggle item in wishlist
   * @param {string} productId
   * @returns {boolean} true if added, false if removed
   */
  function toggleWishlist(productId) {
    const list = getWishlist();
    const exists = list.includes(productId);
    let updated;

    if (exists) {
      updated = list.filter(id => id !== productId);
    } else {
      updated = [...list, productId];
    }

    saveWishlist(updated);
    return !exists;
  }

  /**
   * Check if a product is in wishlist
   * @param {string} productId
   * @returns {boolean}
   */
  function isInWishlist(productId) {
    return getWishlist().includes(productId);
  }

  /* ===================================================
     ORDER DEMO SNAPSHOT (sessionStorage)
     =================================================== */

  /**
   * Save order demo snapshot for order-success.html
   * @param {Object} orderData
   */
  function saveOrderDemo(orderData) {
    memoryStorage[ORDER_KEY] = orderData;
    if (hasSessionStorage) {
      try {
        sessionStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
      } catch (e) {
        console.warn('SOLEVAULT: Lỗi lưu đơn hàng vào sessionStorage.', e);
      }
    }
  }

  /**
   * Retrieve order demo snapshot
   * @returns {Object|null}
   */
  function getOrderDemo() {
    if (hasSessionStorage) {
      try {
        const raw = sessionStorage.getItem(ORDER_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        return memoryStorage[ORDER_KEY];
      }
    }
    return memoryStorage[ORDER_KEY];
  }

  /**
   * Clear all demo storage data (Cart, Wishlist, Order)
   */
  function clearAllDemoData() {
    clearCart();
    saveWishlist([]);
    memoryStorage[ORDER_KEY] = null;
    if (hasSessionStorage) {
      try {
        sessionStorage.removeItem(ORDER_KEY);
      } catch (e) {}
    }
    dispatchStorageEvent('demo-data-cleared', null);
  }

  /**
   * Dispatch custom DOM event to synchronize tabs or UI components
   */
  function dispatchStorageEvent(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch (e) {}
  }

  function get(key) {
    if (!key) return null;
    if (hasLocalStorage) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return memoryStorage[key] || null;
      }
    }
    return memoryStorage[key] || null;
  }

  function set(key, value) {
    if (!key) return;
    memoryStorage[key] = value;
    if (hasLocalStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {}
    }
  }

  function remove(key) {
    if (!key) return;
    delete memoryStorage[key];
    if (hasLocalStorage) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    }
  }

  return {
    get,
    set,
    remove,
    getCart,
    saveCart,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    getCartCount,
    getWishlist,
    saveWishlist,
    toggleWishlist,
    isInWishlist,
    saveOrderDemo,
    getOrderDemo,
    clearAllDemoData
  };
})();
