let bookPrice = document.getElementById("book-price").innerText;
bookPrice = parseInt(bookPrice.replace(/\D/g, ''), 10);

function updateTotalPrice(quantity, bookPrice) {
  console.log(bookPrice + " bookPrice");
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
    console.log(quantity + " quantity");
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

async function addToCart(event) {
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

    createFlyingDot(event);
    fetchCartItemCount();
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Error adding to cart');
  }
};

function createFlyingDot(event) {
  const dot = document.createElement('div');
  dot.style.position = 'absolute';
  dot.style.width = '20px';
  dot.style.height = '20px';
  dot.style.backgroundColor = 'red';
  dot.style.borderRadius = '50%';
  dot.style.boxShadow = '0 0 10px 5px rgba(255, 0, 0, 0.5)';
  dot.style.pointerEvents = 'none';
  dot.style.left = `${event.clientX+window.scrollX}px`;
  dot.style.top = `${event.clientY+window.scrollY}px`;
  dot.style.zIndex = 1000;
  dot.style.backgroundColor = 'red'; 
  dot.style.border = '3px solid yellow'; 
  dot.style.zIndex = 9999; 


  document.body.appendChild(dot);

  const targetX = window.innerWidth - 100;
  const targetY = window.innerHeight - 100; 

  console.log('Dot starts at:', event.clientX, event.clientY);
  console.log('Dot ends at:', targetX, targetY);

  dot.animate(
    [
      { transform: 'translate(0, 0)', opacity: 1 },
      { transform: `translate(${(targetX - event.clientX) / 2}px, ${(targetY - event.clientY) / 2}px)`, opacity: 0.8 },
      { transform: `translate(${targetX - event.clientX}px, ${targetY - event.clientY}px)`, opacity: 0.5 },
    ],
    {
      duration: 1000,
      easing: 'ease-in-out',
    }
  ).onfinish = () => {
    dot.remove();
  };
}


document.getElementById('add-cart').addEventListener('click', addToCart);

document.addEventListener('DOMContentLoaded', async () => {
  const bookId = document.getElementById('book-id').value;
  const reviewsContainer = document.getElementById('reviews-container');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');
  const totalPagesSpan = document.getElementById('total-pages');
  const averageRatingSpan = document.getElementById('average-rating');
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
      totalPagesSpan.textContent = data.totalPages;
      prevPageButton.disabled = page === 1;
      nextPageButton.disabled = page === data.totalPages;
      averageRatingSpan.textContent = data.averageRating.toFixed(1);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const submitReview = async () => {
    const comment = document.getElementById('review-comment').value;
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    if (!comment || !ratingElement) {
      alert('Please fill in both the comment and rating.');
      return;
    }
    const rating = ratingElement.value;
    const userId = document.getElementById('user-id').value;
    console.log('Submitting review:', { comment, rating, userId });
    try {
      const response = await fetch(`/books/${bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment, rating, userId })
      });
      if (response.ok) {
        document.getElementById('review-comment').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;
        loadReviews(currentPage);
      } else {
        const errorText = await response.text();
        console.error('Error submitting review:', errorText);
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

  try {
    const response = await fetch('/users/review-user');
    if (response.ok) {
      const data = await response.json();
      document.getElementById('user-id').value = data.userId;
      document.querySelector('.add-review').style.display = 'block';
      console.log('Adding event listener to submit-review button');
      const submitReviewButton = document.getElementById('submit-review');
      if (submitReviewButton) {
        submitReviewButton.addEventListener('click', submitReview);
        console.log('Event listener added to submit-review button');
      } else {
        console.error('submit-review button not found');
      }
    } else {
      document.getElementById('login-prompt').style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }

  loadReviews(currentPage);
});




