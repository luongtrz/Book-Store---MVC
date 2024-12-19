document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/users/review-user');
    if (response.ok) {
      const data = await response.json();
      if (data.userId) {
        document.getElementById('user-id').value = data.userId;
        document.querySelector('.add-review').style.display = 'block';
        document.getElementById('login-prompt').style.display = 'none';
      } else {
        console.error('User ID not found in response data');
      }
    } else {
      console.error('Failed to fetch user data');
      document.getElementById('login-prompt').style.display = 'block';
      document.querySelector('.add-review').style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    document.getElementById('login-prompt').style.display = 'block';
    document.querySelector('.add-review').style.display = 'none';
  }
});
