document.addEventListener('DOMContentLoaded', function () {
    // Gọi sự kiện cho các nút khi trang đã sẵn sàng
    attachEventListeners();
});

function attachEventListeners() {
    // Đăng ký sự kiện cho các nút khi trang load
    document.querySelectorAll('.minus-btn, .plus-btn').forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteButtonClick);
    });
}

function handleButtonClick(event) {
    event.preventDefault();
    console.log('Button clicked');
    const input = this.parentElement.querySelector('input[name="amount"]');
    let amount = parseInt(input.value);
    if (this.classList.contains('minus-btn')) {
        amount = Math.max(1, amount - 1);
    } else {
        amount += 1;
    }
    input.value = amount;

    const bookId = this.getAttribute('data-book-id');
    updateCart(bookId, amount, input);
}

const updateCart = async (bookId, amount) => {
    try {
        const response = await fetch(`/users/cart/update/${bookId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });
        let updatedCart = await response.json();
        updateCartUI(updatedCart.newCart);
        fetchCartItemCount();
    } catch (error) {
        console.error('Error:', error);
    }
};

const updateCartUI = (updatedCart) => {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear current cart items

    const cartItems = updatedCart.cartItems;
    cartItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('border-t');
        
        tr.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex items-center space-x-4">
                    <img src="${item.Book.image}" alt="${item.Book.title}"
                        class="w-20 h-20 object-cover rounded-lg shadow-md">
                    <div>
                        <h3 class="text-lg font-medium">${item.Book.title}</h3>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-gray-600">
                <span class="text-primary font-medium">${item.Book.price} ₫</span>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center">
                    <button class="minus-btn text-primary font-medium px-2" data-book-id="${item.Book.id}">-</button>
                    <input type="number" name="amount" value="${item.amount}" min="1" class="text-center border rounded w-16 h-10">
                    <button class="plus-btn text-primary font-medium px-2" data-book-id="${item.Book.id}">+</button>
                </div>
            </td>
            <td class="py-4 px-6 text-gray-600">
                <span class="text-primary font-medium">${item.total} ₫</span>
            </td>

            <!-- Cột Delete -->
            <td class="py-4 px-6">
                <button class="delete-btn text-red-500" data-book-id="${item.Book.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr); // Add new row
    });

    // Update the total payment amount
    const totalPaymentElement = document.getElementById('total-payment');
    totalPaymentElement.textContent = `Total Payment (${cartItems.length} Products): ${updatedCart.cartTotal} VND`;

    // Đăng ký lại sự kiện click cho các nút + và -
    attachEventListeners();
};

const handleDeleteButtonClick = async (event) => {
    event.preventDefault();
    const bookId = event.target.getAttribute('data-book-id');
    try {
        const response = await fetch(`/users/cart/remove/${bookId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const updatedCart = await response.json();
        updateCartUI(updatedCart.newCart, updatedCart.cartTotal);
    } catch (error) {
        console.error('Error:', error);
    }
};
