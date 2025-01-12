document.addEventListener('DOMContentLoaded', () => {
     const checkoutButton = document.querySelector('.checkout-button'); // Nút "Thanh Toán"
     const notification = document.querySelector('.checkout-notification'); // Phần tử thông báo
   
     // Gọi API để kiểm tra trạng thái giỏ hàng
     fetch('/users/cart/check-status')
       .then(response => response.json())
       .then(data => {
         if (data.canCheckout) {
           // Nếu giỏ hàng có sản phẩm, kích hoạt nút "Thanh Toán"
           checkoutButton.href = '/users/payment'; // Gán link thanh toán
           checkoutButton.style.pointerEvents = 'auto'; // Cho phép click
           checkoutButton.classList.remove('opacity-50'); // Xóa trạng thái mờ (nếu có)
         } else {
           // Nếu giỏ hàng trống, vô hiệu hóa nút "Thanh Toán"
           checkoutButton.href = '#'; // Xóa link
           checkoutButton.style.pointerEvents = 'none'; // Ngăn click
           checkoutButton.classList.add('opacity-50'); // Thêm trạng thái mờ
           if (notification) {
             notification.textContent = data.message; // Hiển thị thông báo lỗi
             notification.style.display = 'block'; // Hiển thị thông báo
           }
         }
       })
       .catch(error => {
         console.error('Error checking cart status:', error);
       });
   });
   