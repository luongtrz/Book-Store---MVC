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

<<<<<<< HEAD
=======
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

>>>>>>> origin/mvc



