/**
 * SOLEVAULT — Form Handlers (Contact & Newsletter)
 * Provides client-side validation with transparent demo confirmation
 */

const SOLEVAULT_FORMS = (function () {
  'use strict';

  function initForms() {
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const messageInput = document.getElementById('contact-message');
        const statusBox = document.getElementById('contact-form-status');

        let isValid = true;

        if (!nameInput || !nameInput.value.trim()) {
          isValid = false;
          if (nameInput) nameInput.classList.add('is-invalid');
        } else {
          nameInput.classList.remove('is-invalid');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          if (emailInput) emailInput.classList.add('is-invalid');
        } else {
          emailInput.classList.remove('is-invalid');
        }

        if (!messageInput || messageInput.value.trim().length < 10) {
          isValid = false;
          if (messageInput) messageInput.classList.add('is-invalid');
        } else {
          messageInput.classList.remove('is-invalid');
        }

        if (!isValid) {
          SOLEVAULT_UTILS.showToast('LỖI BIỂU MẪU', 'Vui lòng kiểm tra lại các trường bắt buộc.', 'error');
          return;
        }

        // Show transparent feedback
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="background-color: var(--color-success-bg); border: 1px solid var(--color-success-border); color: var(--color-success); padding: 14px; border-radius: var(--radius-sm); margin-top: 16px; font-size: 13px; line-height: 1.5;">
              <strong>GỬI THÀNH CÔNG (DEMO FRONTEND):</strong><br/>
              Tin nhắn của bạn đã được kiểm tra hợp lệ trên trình duyệt. Lưu ý rằng tin nhắn chưa được chuyển đến máy chủ email thực tế do website chưa kết nối backend.
            </div>
          `;
        }

        SOLEVAULT_UTILS.showToast(
          'GỬI THÀNH CÔNG (DEMO)',
          'Nội dung liên hệ đã được ghi nhận ở phía client.',
          'success'
        );

        contactForm.reset();
      });
    }

    // Newsletter Form Handler
    const newsletterForms = document.querySelectorAll('.newsletter-form, .footer-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input) return;

        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          SOLEVAULT_UTILS.showToast('EMAIL KHÔNG HỢP LỆ', 'Vui lòng nhập đúng định dạng email.', 'error');
          input.focus();
          return;
        }

        SOLEVAULT_UTILS.showToast(
          'ĐĂNG KÝ BẢN TIN (DEMO)',
          `Email "${email}" đã được ghi nhận ở bản demo frontend. Chưa gửi về máy chủ thật.`,
          'success'
        );
        input.value = '';
      });
    });
  }

  return {
    initForms
  };
})();
