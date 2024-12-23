$(document).ready(function () {
    $('.eye').click(function () {
        $(this).toggleClass('open');
        $(this).children('i').toggleClass('fa-eye-slash fa-eye');

        // Tìm input trong cùng input-group
        var input = $(this).closest('.input-group').find('input');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text'); // Hiện mật khẩu
        } else {
            input.attr('type', 'password'); // Ẩn mật khẩu
        }
    });
});


const signUpBtnLink = document.querySelector('.signUpBtn-link');
const signInBtnLink = document.querySelector('.signInBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    // Kiểm tra tham số message là 'register-success'
    if (message === 'register-success') {
        const notification = document.createElement('div');
        notification.textContent = "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.";
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 16px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(notification);

        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
            notification.remove();

            // Xóa tham số message khỏi URL
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }, 3000);
    }
});
