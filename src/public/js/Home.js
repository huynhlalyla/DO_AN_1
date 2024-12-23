$(document).ready(function () {
    // Thêm class 'has-child' cho li có sub-menu
    $('.sub-menu').parent('li').addClass('has-child');
});

    // $('#toggle-sidebar').on('click', function (e) {
    //     e.preventDefault(); // 
    //     $('#overlay').toggleClass('visible');
    //     $('#sidebar').toggleClass('visible');
    // });

    // $('#overlay').click(function () {
    //     $(this).removeClass('visible');
    //     $('#sidebar').removeClass('visible');
    // });

    // document.addEventListener('click', function (event) {
    //     document.querySelectorAll('.delete-option').forEach(deleteOption => {
    //         if (!deleteOption.contains(event.target) && !deleteOption.previousElementSibling.contains(event.target)) {
    //             deleteOption.style.display = 'none';
    //         }
    //     });
    // });

// Tự động thay đổi chiều cao của textarea khi nhập nội dung
$(document).on('input', '.comment-input', function () {
    $(this).height('auto').height(this.scrollHeight); // Điều chỉnh chiều cao theo nội dung
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-button");

    // Thêm sự kiện click cho nút đăng xuất
    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            // Ngăn trình duyệt thực hiện hành động mặc định
            event.preventDefault();

            // Hiển thị thông báo xác nhận
            const userConfirmed = confirm("Bạn có muốn kết thúc phiên đăng nhập này không?");
            
            if (userConfirmed) {
                // Lưu trạng thái thông báo vào localStorage
                localStorage.setItem("logoutNotification", "Đăng xuất thành công!");

                // Chuyển hướng tới URL đăng xuất
                const logoutUrl = logoutButton.getAttribute("href");
                window.location.href = logoutUrl;
            }
        });
    }

    // Kiểm tra nếu có thông báo đăng xuất trong localStorage
    const notificationMessage = localStorage.getItem("logoutNotification");
    if (notificationMessage) {
        // Hiển thị thông báo trên trang mới
        const notification = document.createElement('div');
        notification.textContent = notificationMessage;
        notification.style.cssText = ` 
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336; /* Màu đỏ cho thông báo đăng xuất */
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 16px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(notification);

        // Xóa thông báo sau 3 giây
        setTimeout(() => {
            notification.remove();
            localStorage.removeItem("logoutNotification");
        }, 3000);
    }

    // Kiểm tra nếu có tham số "logout-success" trong URL
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('logout-success');

    if (message === 'true') {
        const notification = document.createElement('div');
        notification.textContent = "Đăng xuất thành công!";
        notification.style.cssText = ` 
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336; /* Màu đỏ cho thông báo đăng xuất */
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

            // Xóa tham số logout-success khỏi URL
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }, 3000);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');

    if (message === 'login-success') {
        const notification = document.createElement('div');
        notification.textContent = "Đăng nhập thành công!";
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

document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('#main-menu li a');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Xóa lớp 'active' khỏi tất cả các liên kết
            menuLinks.forEach(link => link.classList.remove('active'));

            // Thêm lớp 'active' vào phần tử được click
            e.target.classList.add('active');
        });
    });

    // Duy trì trạng thái 'active' khi tải lại trang
    const currentPath = window.location.pathname;

    menuLinks.forEach(link => {
        // Kiểm tra nếu href chính xác khớp với currentPath
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('edit-form');
    const confirmSaveModal = document.getElementById('confirmSaveModal');
    const confirmCancelModal = document.getElementById('confirmCancelModal');
    const editModal = document.getElementById('editModal');

    // Open edit modal and populate form with post data
    document.querySelectorAll('.edit-post').forEach(button => {
        button.addEventListener('click', function() {
            const postRow = button.closest('tr');
            const postId = postRow.getAttribute('data-id');
            const postTitle = postRow.querySelector('.title').textContent;
            const postContent = postRow.querySelector('.content').textContent;
            const industryName = postRow.querySelector('.additional-info').textContent;

            document.getElementById('edit-title').value = postTitle;
            document.getElementById('edit-content').value = postContent;
            document.getElementById('edit-category').value = industryName;

            editModal.style.display = 'block';
        });
    });

    // Close modal on cancel or clicking close icon
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            editModal.style.display = 'none';
            confirmSaveModal.style.display = 'none';
            confirmCancelModal.style.display = 'none';
        });
    });

    // Handle Save Confirmation
    document.getElementById('save-edit').addEventListener('click', function(event) {
        event.preventDefault();
        confirmSaveModal.style.display = 'block';
    });

    document.getElementById('confirm-save').addEventListener('click', function() {
        // Get form data including file
        const formData = new FormData(editForm);
        
        // You can log the file and form data here
        console.log("Form data to submit:", formData);

        // Here you can send the form data to the server using an AJAX request
        // For now, we'll just close the modal and simulate a save
        console.log("Changes have been saved.");
        confirmSaveModal.style.display = 'none';
        editForm.submit(); // Submit the form
    });

    document.getElementById('cancel-save').addEventListener('click', function() {
        confirmSaveModal.style.display = 'none';
    });

    // Handle Cancel Confirmation
    document.getElementById('cancel-edit').addEventListener('click', function(event) {
        event.preventDefault();
        confirmCancelModal.style.display = 'block';
    });

    document.getElementById('confirm-cancel').addEventListener('click', function() {
        confirmCancelModal.style.display = 'none';
        editModal.style.display = 'none';
    });

    document.getElementById('cancel-cancel').addEventListener('click', function() {
        confirmCancelModal.style.display = 'none';
    });

    // Handle form submission
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Collect all form data including the file
        const formData = new FormData(editForm);
        
        // You can access file data via formData.get('file')
        const updatedTitle = formData.get('title');
        const updatedContent = formData.get('content');
        const updatedCategory = formData.get('category');
        const updatedFile = formData.get('file'); // File data
        
        console.log('Updating post:', updatedTitle, updatedContent, updatedCategory, updatedFile);
        
        // You can now send the FormData (which includes the file) to the server using an AJAX request
    });
});

