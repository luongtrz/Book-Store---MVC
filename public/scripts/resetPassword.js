// public/scripts/resetPassword.js

document.getElementById('formChangePassword').addEventListener('submit', function(event) {
     const password = document.getElementById('new-password').value;
     const confirmPassword = document.getElementById('confirm-password').value;
     const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
     const uppercasePattern = /[A-Z]/;
   
     if (password !== confirmPassword) {
       event.preventDefault();
       alert('New password and confirm password do not match.');
       return;
     }
   
     if (!specialCharPattern.test(password) || !uppercasePattern.test(password)) {
       event.preventDefault();
       alert('Password must contain at least one special character and one uppercase letter.');
     }
});
