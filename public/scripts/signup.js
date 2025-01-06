
document.getElementById('signupForm').addEventListener('submit', function(event) {
     const password = document.getElementById('password').value;
     const confirmPassword = document.getElementById('confirm-password').value;
     const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
     const uppercasePattern = /[A-Z]/;
   
     if (password !== confirmPassword) {
       event.preventDefault();
       alert('Password incorrect');
       return;
     }
   
     if (!specialCharPattern.test(password) || !uppercasePattern.test(password)) {
       event.preventDefault();
       alert('Password must contain at least one special character and one uppercase letter');
     }
   });
