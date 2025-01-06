function togglePaymentDetails() {
    const cardDetails = document.getElementById('card-details');
    const paypalDetails = document.getElementById('paypal-details');

    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    if (selectedPayment === 'card') {
        cardDetails.classList.remove('hidden');
        paypalDetails.classList.add('hidden');
    } else if (selectedPayment === 'paypal') {
        paypalDetails.classList.remove('hidden');
        cardDetails.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    togglePaymentDetails();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is working!');
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded!");
    const submitButton = document.getElementById('submit-order');
    const warningMessage = document.getElementById('warning-message');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phoneNumber');
    const addressInput = document.getElementById('streetAddress');

    function validateProfile() {
        console.log('Name:', nameInput?.value);
        console.log('Email:', emailInput?.value);
        console.log('Phone:', phoneInput?.value);
        console.log('Address:', addressInput?.value);

        const isNameEmpty = !nameInput.value || nameInput.value.trim() === "";
        const isEmailEmpty = !emailInput.value || emailInput.value.trim() === "";
        const isPhoneEmpty = !phoneInput.value || phoneInput.value.trim() === "";
        const isAddressEmpty = !addressInput.value || addressInput.value.trim() === "";

        if (isNameEmpty || isEmailEmpty || isPhoneEmpty || isAddressEmpty) {
            console.log('Some fields are empty!');
            warningMessage.style.display = 'block'; 
            submitButton.disabled = true;
            submitButton.innerText = 'Go to profile to fill in missing fields';
            
            //set color
            submitButton.style.backgroundColor = 'gray';
        } else {
            console.log('All fields are filled!');
            warningMessage.style.display = 'none'; 
            submitButton.disabled = false; 
        }
    }

    // Chạy validate ngay khi DOM được tải
    validateProfile();
});
