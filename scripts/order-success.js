/**
 * SOLEVAULT — Order Success Page Logic
 * Renders verified demo receipt with honest disclaimers and cleanup controls
 */

const SOLEVAULT_ORDER_SUCCESS = (function () {
  'use strict';

  function initOrderSuccess() {
    const container = document.getElementById('order-success-view');
    if (!container) return; // Not on order-success.html

    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    const order = SOLEVAULT_STORAGE.getOrderDemo();

    // If order session missing or does not match URL param
    if (!order || (orderIdParam && order.orderId !== orderIdParam)) {
      container.innerHTML = `
        <div class="order-success-card" style="margin: 60px auto;">
          <div class="empty-state-icon">${SOLEVAULT_UTILS.getSVG('info', 'icon-svg-lg')}</div>
          <h1 class="empty-state-title">Không tìm thấy thông tin đơn hàng</h1>
          <p class="empty-state-text">
            Không có đơn hàng demo nào được lưu trên trình duyệt của bạn hoặc phiên làm việc đã hết hạn.
          </p>
          <div style="display: flex; justify-content: center; gap: 12px; margin-top: 20px;">
            <a href="../index.html" class="btn btn-outline">Về trang chủ</a>
            <a href="products.html" class="btn btn-primary">Khám phá sneaker</a>
          </div>
        </div>
      `;
      return;
    }

    const itemsHTML = order.items
      .map(
        item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--color-border); font-size: 13px;">
          <div style="text-align: left;">
            <div style="font-weight: bold;">${SOLEVAULT_UTILS.escapeHTML(item.name)}</div>
            <div style="color: var(--color-muted); font-size: 11px;">Size: ${item.size} EU • Số lượng: ${item.quantity}</div>
          </div>
          <div style="font-weight: bold;">${SOLEVAULT_UTILS.formatCurrency(item.price * item.quantity)}</div>
        </div>
      `
      )
      .join('');

    container.innerHTML = `
      <div class="order-success-card fade-in">
        <div class="order-success-badge">
          ${SOLEVAULT_UTILS.getSVG('check', 'icon-svg-lg')}
        </div>

        <span class="section-kicker">Hoàn tất đặt hàng demo</span>
        <h1 style="font-size: 1.85rem; margin-bottom: 8px;">ĐẶT HÀNG THÀNH CÔNG (DEMO)</h1>
        <p style="color: var(--color-muted); font-size: 14px;">
          Cảm ơn bạn đã trải nghiệm website SOLEVAULT. Mã đơn hàng demo của bạn là:
        </p>

        <div class="order-id-display">
          ${SOLEVAULT_UTILS.escapeHTML(order.orderId)}
        </div>

        <!-- Mandatory Transparent Disclaimer -->
        <div class="order-demo-disclaimer-box">
          <strong>LƯU Ý QUAN TRỌNG:</strong>
          <p style="margin-top: 4px;">
            "Đơn hàng demo đã được tạo trên trình duyệt. Cửa hàng chưa nhận được đơn hàng này vì website chưa được kết nối backend."
          </p>
          <p style="margin-top: 4px; font-size: 11px; opacity: 0.85;">
            Không có nhân viên nào sẽ gọi điện xác nhận và không có kiện hàng thật nào được gửi đi. Bạn có thể tự do kiểm thử quy trình mua sắm.
          </p>
        </div>

        <!-- Order Summary Receipt -->
        <div style="background-color: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 20px; margin-bottom: 24px; text-align: left;">
          <h2 style="font-size: 14px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
            Thông tin người nhận (Bản lưu cục bộ)
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 16px;">
            <div><strong>Họ tên:</strong> ${SOLEVAULT_UTILS.escapeHTML(order.customer.fullName)}</div>
            <div><strong>Số điện thoại:</strong> ${SOLEVAULT_UTILS.escapeHTML(order.customer.phone)}</div>
            <div style="grid-column: span 2;"><strong>Địa chỉ nhận:</strong> ${SOLEVAULT_UTILS.escapeHTML(order.customer.address)}, ${SOLEVAULT_UTILS.escapeHTML(order.customer.district)}, ${SOLEVAULT_UTILS.escapeHTML(order.customer.city)}</div>
            <div><strong>Phương thức:</strong> COD (Thanh toán khi nhận hàng demo)</div>
            ${order.customer.note ? `<div style="grid-column: span 2;"><strong>Ghi chú:</strong> ${SOLEVAULT_UTILS.escapeHTML(order.customer.note)}</div>` : ''}
          </div>

          <h2 style="font-size: 14px; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
            Sản phẩm đã chọn
          </h2>
          <div style="margin-bottom: 16px;">
            ${itemsHTML}
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span style="color: var(--color-muted);">Tạm tính:</span>
            <span>${SOLEVAULT_UTILS.formatCurrency(order.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span style="color: var(--color-muted);">Phí vận chuyển COD demo:</span>
            <span>${order.shippingFee === 0 ? 'Miễn phí' : SOLEVAULT_UTILS.formatCurrency(order.shippingFee)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; padding-top: 8px; border-top: 1px solid var(--color-border);">
            <span>Tổng cộng:</span>
            <span style="color: var(--color-accent);">${SOLEVAULT_UTILS.formatCurrency(order.total)}</span>
          </div>
        </div>

        <!-- Action Controls -->
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <a href="products.html" class="btn btn-primary btn-lg">
            Tiếp tục khám phá sneaker
          </a>
          <button type="button" class="btn btn-outline" id="clear-demo-order-btn">
            Xóa dữ liệu đơn hàng demo
          </button>
        </div>
      </div>
    `;

    const clearBtn = document.getElementById('clear-demo-order-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Bạn muốn xóa thông tin đơn hàng demo này khỏi trình duyệt?')) {
          SOLEVAULT_STORAGE.clearAllDemoData();
          SOLEVAULT_UTILS.showToast('ĐÃ XÓA', 'Dữ liệu đơn hàng demo đã được dọn sạch.', 'info');
          setTimeout(() => {
            window.location.href = '../index.html';
          }, 800);
        }
      });
    }
  }

  return {
    initOrderSuccess
  };
})();
