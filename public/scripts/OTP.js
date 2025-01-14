document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
     event.preventDefault();
     // Show OTP dialog
     document.getElementById('otp-dialog').style.display = 'block';
   });

   document.getElementById('verify-otp-btn').addEventListener('click', function() {
     // Submit the form with OTP
     document.getElementById('forgot-password-form').submit();
   });