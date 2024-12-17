document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/books/review-user');
    if (response.ok) {
      const data = await response.json();
      document.getElementById('user-id').value = data.userId;
      document.querySelector('.add-review').style.display = 'block';
    } else {
      document.getElementById('login-prompt').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
});
