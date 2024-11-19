document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Lấy dữ liệu từ form
    const fullName = document.getElementById("fullName").value;
    console.log(fullName);

    const email = document.getElementById("email").value;
    console.log(email);

    const password = document.getElementById("password").value;
    console.log(password);

    try {
        const response = await fetch("http://127.0.0.1:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullName, email, password })
           
        });
        
        const result = await response.json();

        console.log(result); // In ra nội dung JSON đã giải mã

        const messageElement = document.getElementById("message");
        
        if (response.ok) {
            messageElement.textContent = result.message; // Đăng ký thành công
            messageElement.style.color = "green";
            messageElement.innerHTML = "Đăng ký thành công! <a href='signin.html' class=\"text-red-700\" >Đăng nhập ngay</a>";
        } else {
            messageElement.textContent = result.message; // Email đã tồn tại hoặc lỗi khác
            messageElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.textContent = "Có lỗi xảy ra.";
        messageElement.style.color = "red";
    }
});
