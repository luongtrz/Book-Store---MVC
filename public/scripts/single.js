let bookPrice = document.getElementById("book-price").innerText;
bookPrice = parseInt(bookPrice.replace(/\D/g, ''), 10);

function updateTotalPrice(quantity, bookPrice) {
  console.log(bookPrice+ "bookPrice");
  totalPrice = bookPrice * quantity;
  document.getElementById("total-price").innerText = totalPrice.toLocaleString();
}

function initializeQuantityControls(bookPrice) {
  let quantityInput = document.getElementById("quantity");
  console.log(quantityInput + " quantityInput 1");
  let increaseBtn = document.getElementById("increase");
  let decreaseBtn = document.getElementById("decrease");

  // Bắt đầu với số lượng là 1
  let quantity = 1;
  updateTotalPrice(quantity, bookPrice);

  // Xử lý sự kiện tăng số lượng
  increaseBtn.addEventListener("click", () => {
    quantity++;
    console.log(quantity + "quantity")
    quantityInput.value = quantity;
    decreaseBtn.disabled = quantity <= 1;
    updateTotalPrice(quantity, bookPrice);
  });
  // Xử lý sự kiện giảm số lượng
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;
      decreaseBtn.disabled = quantity <= 1;
      updateTotalPrice(quantity, bookPrice);
    }
  });
}
// Cập nhật tổng tiền ban đầu
updateTotalPrice(1, bookPrice);
// Khởi tạo sự kiện cho các nút tăng/giảm số lượng
initializeQuantityControls(bookPrice);

window.addEventListener('load', () => {
  // Lấy tất cả các thẻ có class 'related-title'
  const titles = document.querySelectorAll('.related-title');

  // Duyệt qua từng thẻ và kiểm tra độ dài
  titles.forEach((title) => {
    const text = title.textContent.trim(); // Lấy nội dung văn bản
    if (text.length > 15) {
      title.textContent = text.slice(0, 15) + '...'; // Cắt còn 15 ký tự và thêm '...'
    }
  });
});

async function addToCart() {
  try {
    const bookId = document.getElementById('book-id').value;
    const amount = document.getElementById('quantity').value;

    console.log(bookId + " bookId");
    console.log(amount + " amount");

    const response = await fetch('/users/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ book_id: bookId, amount }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert('Added to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Error adding to cart');
  }
};

document.getElementById('add-cart').addEventListener('click', addToCart);

document.addEventListener('DOMContentLoaded', async () => {
  const bookId = document.getElementById('book-id').value;
  const userId = document.getElementById('user-id').value;
  const reviewsContainer = document.getElementById('reviews-container');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');
  let currentPage = 1;

  const loadReviews = async (page) => {
    try {
      const response = await fetch(`/books/${bookId}/reviews?page=${page}`);
      const data = await response.json();
      if (!data.reviews) {
        console.error('No reviews found in response:', data);
        return;
      }
      reviewsContainer.innerHTML = data.reviews.map(review => `
        <div class="review p-2 border-b">
          <p><strong>${review.User.username}</strong>: ${review.comment}</p>
          <p>Rating: ${review.rating}</p>
        </div>
      `).join('');
      currentPageSpan.textContent = page;
      prevPageButton.disabled = page === 1;
      nextPageButton.disabled = page === data.totalPages;
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const submitReview = async () => {
    const comment = document.getElementById('review-comment').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    try {
      const response = await fetch(`/books/${bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment, rating })
      });
      if (response.ok) {
        document.getElementById('review-comment').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;
        loadReviews(currentPage);
      } else {
        console.error('Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadReviews(currentPage);
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    loadReviews(currentPage);
  });

  if (userId) {
    document.getElementById('submit-review').addEventListener('click', submitReview);
  }

  try {
    const response = await fetch('/users/review-user');
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

  loadReviews(currentPage);
});




