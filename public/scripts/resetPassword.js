// public/scripts/resetPassword.js

document.getElementById('formReset').addEventListener('submit', function(event) {
     const password = document.getElementById('password').value;
     const confirmPassword = document.getElementById('confirm-password').value;
     const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
     const uppercasePattern = /[A-Z]/;
   
     if (password !== confirmPassword) {
       event.preventDefault();
       alert('Mật khẩu và xác nhận mật khẩu không khớp.');
       return;
     }
   
     if (!specialCharPattern.test(password) || !uppercasePattern.test(password)) {
       event.preventDefault();
       alert('Mật khẩu phải chứa ít nhất một ký tự đặc biệt và một chữ cái viết hoa.');
     }
});
