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

