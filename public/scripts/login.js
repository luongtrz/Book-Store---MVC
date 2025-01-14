document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');
  const loginForm = document.getElementById('loginForm');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', async function (event) {
      event.preventDefault(); // Ngăn hành động mặc định của nút hoặc form
      const email = document.getElementById('email').value;
      
      try {
        const response = await fetch('/users/check-banned', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.banned) {
          document.getElementById('bannedMessage').style.display = 'block';
        } else {
          document.getElementById('bannedMessage').style.display = 'none';
          loginForm.submit(); 
        }
      } catch (error) {
        console.error('Error while checking banned status:', error);
        alert('An error occurred. Please try again later.');
      }
    });
  } else {
    console.error('Login button not found');
  }
});
