// Domloader

document.addEventListener('DOMContentLoaded', () => {
    fetchCartItemCount();
});

async function fetchCartItemCount() {
    try {
        const response = await fetch('/users/cart/countCart');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateCartIcon(data.count);
    } catch (error) {
        console.error('Error fetching cart item count:', error);
    }
}

function updateCartIcon(count) {
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        const countElement = document.createElement('span');
        countElement.textContent = count;
        countElement.className = 'absolute left-0 top-0 bg-red-500 text-white rounded-full flex items-center justify-center text-sm';
        countElement.style.width = '1.5rem'; 
        countElement.style.height = '1.5rem';
        cartButton.appendChild(countElement);
    }
}