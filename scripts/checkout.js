/**
 * SOLEVAULT — Checkout Engine (COD Demo)
 * Validates checkout form, computes order snapshot, and transfers to order-success.html
 */

const SOLEVAULT_CHECKOUT = (function () {
  'use strict';

  function initCheckout() {
    const checkoutForm = document.getElementById('checkout-form');
    const summaryContainer = document.getElementById('checkout-summary-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');
    const submitBtn = document.getElementById('checkout-submit-btn');

    if (!checkoutForm) return; // Not on checkout.html

    const cart = SOLEVAULT_STORAGE.getCart();

    // Check if cart is empty
    if (cart.length === 0) {
      const container = document.getElementById('checkout-page-container');
      if (container) {
        container.innerHTML = `
          <div class="empty-state" style="margin: 60px auto; max-width: 600px;">
            <div class="empty-state-icon">${SOLEVAULT_UTILS.getSVG('cart', 'icon-svg-lg')}</div>
            <h2 class="empty-state-title">Giỏ hàng của bạn đang trống</h2>
            <p class="empty-state-text">
              Bạn không thể thanh toán khi chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <a href="products.html" class="btn btn-primary btn-lg">Quay lại mua sắm</a>
          </div>
        `;
      }
      return;
    }

    // Render Order Summary
    let subtotal = 0;
    const summaryItemsHTML = cart
      .map(item => {
        const product = SOLEVAULT_DATA.getProductById(item.productId);
        if (!product) return '';

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const rawPrimary = (product.images && product.images[0]) || '';
        const rawLocal = product.localImage || (product.images && product.images[1]) || '';
        const primaryImg = SOLEVAULT_UTILS.resolveProductImage(rawPrimary);
        const fallbackImg = rawLocal ? SOLEVAULT_UTILS.resolveProductImage(rawLocal) : '';

        return `
          <div style="display: flex; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
            <img src="${SOLEVAULT_UTILS.escapeHTML(primaryImg)}" data-fallback-src="${SOLEVAULT_UTILS.escapeHTML(fallbackImg)}" alt="${SOLEVAULT_UTILS.escapeHTML(product.name)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-xs);" onerror="SOLEVAULT_UTILS.handleImageError(this)"/>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 13px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${SOLEVAULT_UTILS.escapeHTML(product.name)}
              </div>
              <div style="font-size: 11px; color: var(--color-muted);">
                Size: ${item.size} EU × ${item.quantity}
              </div>
            </div>
            <div style="font-size: 13px; font-weight: bold; color: var(--color-text);">
              ${SOLEVAULT_UTILS.formatCurrency(itemTotal)}
            </div>
          </div>
        `;
      })
      .join('');

    if (summaryContainer) summaryContainer.innerHTML = summaryItemsHTML;

    const shippingFee = subtotal >= SOLEVAULT_CONFIG.freeShippingThreshold ? 0 : SOLEVAULT_CONFIG.shippingFeeDemo;
    const grandTotal = subtotal + shippingFee;

    if (subtotalEl) subtotalEl.textContent = SOLEVAULT_UTILS.formatCurrency(subtotal);
    if (shippingEl) {
      shippingEl.innerHTML = shippingFee === 0 ? '<strong style="color: var(--color-success);">Miễn phí</strong>' : SOLEVAULT_UTILS.formatCurrency(shippingFee);
    }
    if (totalEl) totalEl.textContent = SOLEVAULT_UTILS.formatCurrency(grandTotal);

    // Form Field Elements
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const emailInput = document.getElementById('checkout-email');
    const cityInput = document.getElementById('checkout-city');
    const districtInput = document.getElementById('checkout-district');
    const addressInput = document.getElementById('checkout-address');
    const noteInput = document.getElementById('checkout-note');

    // Validation Helper
    function setError(input, errorElId, message) {
      const errEl = document.getElementById(errorElId);
      if (errEl) {
        errEl.textContent = message;
        errEl.style.display = message ? 'block' : 'none';
      }
      if (input) {
        input.classList.toggle('is-invalid', !!message);
      }
    }

    // Submit Handler
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        setError(nameInput, 'err-checkout-name', 'Vui lòng nhập họ và tên người nhận (ít nhất 2 ký tự).');
        isValid = false;
      } else {
        setError(nameInput, 'err-checkout-name', '');
      }

      // Validate Phone (Vietnam 10-digit mobile phone regex)
      const phoneVal = phoneInput ? phoneInput.value.trim().replace(/\s+/g, '') : '';
      const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
      if (!phoneVal) {
        setError(phoneInput, 'err-checkout-phone', 'Vui lòng nhập số điện thoại nhận hàng.');
        isValid = false;
      } else if (!phoneRegex.test(phoneVal)) {
        setError(phoneInput, 'err-checkout-phone', 'Số điện thoại không hợp lệ (Ví dụ hợp lệ: 0909123456).');
        isValid = false;
      } else {
        setError(phoneInput, 'err-checkout-phone', '');
      }

      // Validate Email (optional, but if filled must be valid)
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (emailVal) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          setError(emailInput, 'err-checkout-email', 'Địa chỉ email không đúng định dạng.');
          isValid = false;
        } else {
          setError(emailInput, 'err-checkout-email', '');
        }
      } else {
        setError(emailInput, 'err-checkout-email', '');
      }

      // Validate City
      const cityVal = cityInput ? cityInput.value.trim() : '';
      if (!cityVal) {
        setError(cityInput, 'err-checkout-city', 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố.');
        isValid = false;
      } else {
        setError(cityInput, 'err-checkout-city', '');
      }

      // Validate District
      const districtVal = districtInput ? districtInput.value.trim() : '';
      if (!districtVal) {
        setError(districtInput, 'err-checkout-district', 'Vui lòng nhập Quận/Huyện.');
        isValid = false;
      } else {
        setError(districtInput, 'err-checkout-district', '');
      }

      // Validate Street Address
      const addressVal = addressInput ? addressInput.value.trim() : '';
      if (!addressVal || addressVal.length < 5) {
        setError(addressInput, 'err-checkout-address', 'Vui lòng nhập địa chỉ nhận hàng chi tiết (số nhà, tên đường).');
        isValid = false;
      } else {
        setError(addressInput, 'err-checkout-address', '');
      }

      if (!isValid) {
        // Scroll to first invalid field
        const firstError = checkoutForm.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Double check cart is still populated
      const currentCart = SOLEVAULT_STORAGE.getCart();
      if (currentCart.length === 0) {
        SOLEVAULT_UTILS.showToast('LỖI', 'Giỏ hàng đã bị xóa trước khi gửi.', 'error');
        return;
      }

      // Set Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="loading-spinner"></span>
          <span>ĐANG TẠO ĐƠN HÀNG DEMO...</span>
        `;
      }

      // Generate random unique demo Order ID
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const orderId = `SV-${datePart}-${randomPart}`;

      // Assemble Order Snapshot
      const orderSnapshot = {
        orderId,
        createdAt: new Date().toISOString(),
        paymentMethod: 'COD',
        subtotal,
        shippingFee,
        total: grandTotal,
        customer: {
          fullName: nameVal,
          phone: phoneVal,
          email: emailVal || 'Không cung cấp',
          address: addressVal,
          district: districtVal,
          city: cityVal,
          note: noteInput ? noteInput.value.trim() : ''
        },
        items: currentCart.map(item => {
          const product = SOLEVAULT_DATA.getProductById(item.productId);
          return {
            productId: item.productId,
            name: product ? product.name : 'Sneaker',
            brand: product ? product.brand : '',
            sku: product ? product.sku : '',
            size: item.size,
            quantity: item.quantity,
            price: product ? product.price : 0,
            image: product && product.images ? product.images[0] : ''
          };
        })
      };

      // Save Order snapshot in sessionStorage & clear cart
      setTimeout(() => {
        SOLEVAULT_STORAGE.saveOrderDemo(orderSnapshot);
        SOLEVAULT_STORAGE.clearCart();

        // Redirect to order-success.html
        window.location.href = `order-success.html?orderId=${encodeURIComponent(orderId)}`;
      }, 700);
    });
  }

  return {
    initCheckout
  };
})();
