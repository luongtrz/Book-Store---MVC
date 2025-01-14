document.getElementById('password').addEventListener('input', function () {
  const password = this.value;
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  const uppercasePattern = /[A-Z]/;
  const passwordError = document.getElementById('passwordError');

  if (!specialCharPattern.test(password)) {
    passwordError.textContent = 'Password must contain at least one special character.';
    passwordError.style.display = 'block';
  } else if (!uppercasePattern.test(password)) {
    passwordError.textContent = 'Password must contain at least one uppercase letter.';
    passwordError.style.display = 'block';
  } else {
    passwordError.textContent = '';
    passwordError.style.display = 'none';
  }
});

document.getElementById('confirm-password').addEventListener('input', function () {
  const confirmPassword = this.value;
  const password = document.getElementById('password').value;
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  if (confirmPassword !== password) {
    confirmPasswordError.textContent = 'Passwords do not match.';
    confirmPasswordError.style.display = 'block';
  } else {
    confirmPasswordError.textContent = '';
    confirmPasswordError.style.display = 'none';
  }
});

document.getElementById('signupForm').addEventListener('submit', function (event) {
  const passwordError = document.getElementById('passwordError').textContent;
  const confirmPasswordError = document.getElementById('confirmPasswordError').textContent;

  if (passwordError || confirmPasswordError) {
    event.preventDefault(); 
    alert('Please fix the errors in the form before submitting.');
  }
});


const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function () {
        const email = this.value;
        let feedback = document.getElementById('emailError');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'emailError';
            emailInput.parentNode.appendChild(feedback);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            feedback.textContent = 'Please enter a valid email address';
            feedback.style.display = 'block';
            return;
        }

        fetch('/users/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
            .then(response => response.json())
            .then(data => {
              if (data.exists) {
                feedback.textContent = 'Email already exists';
                feedback.classList.add('text-red-500'); 
                feedback.style.display = 'block';
              } else {
                  feedback.textContent = '';
                  feedback.classList.remove('text-red-500'); 
                  feedback.style.display = 'none';
              }
            })
            .catch(error => {
                console.error('Error checking email:', error);
                feedback.textContent = 'An error occurred. Please try again.';
                feedback.style.display = 'block';
            });
    });
}

const signUpForm = document.getElementById('signupForm');
if (signUpForm) {
  console.log('signup form exists');
    signUpForm.addEventListener('submit', function (event) {
        const feedback = document.getElementById('emailError');

        if (feedback && feedback.style.display === 'block' && feedback.textContent === 'Email already exists') {
            event.preventDefault();
            alert('Please use a different email address');
        }
    });
}
