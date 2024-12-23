$(document).ready(function () {
    // Quản lý bài đăng
    var postToEdit = null; // Biến lưu trữ bài đăng đang chỉnh sửa
    var originalData = {}; // Lưu trữ dữ liệu gốc của bài đăng

    // Khởi tạo hiển thị cho các trường thông tin theo danh mục
    function initializeCategoryVisibility() {
        var isSpecial = $('#edit-category').val() === 'Môn chuyên ngành'; // Kiểm tra danh mục có phải "Môn chuyên ngành"
        $('#special-info').toggle(isSpecial); // Hiển thị/ẩn các thông tin chuyên ngành
        $('#edit-major').prop('required', isSpecial); // Bắt buộc điền thông tin ngành nếu là "Môn chuyên ngành"
    }

    // Điền thông tin bài đăng vào form chỉnh sửa
    function populateEditForm(postRow) {
        postToEdit = postRow; // Lưu trữ bài đăng đang được chỉnh sửa
        originalData = {
            title: postRow.find('.title').text(), // Tiêu đề
            content: postRow.find('.content').text(), // Nội dung
            category: postRow.find('.category').text(), // Danh mục
            additionalInfo: postRow.find('.additional-info').html() // Thông tin bổ sung
        };
        
        var additionalInfo = originalData.additionalInfo.split('<br>'); // Tách các dòng thông tin bổ sung
        $('#edit-title').val(originalData.title); // Gán tiêu đề vào form
        $('#edit-content').val(originalData.content); // Gán nội dung vào form
        $('#edit-category').val(originalData.category); // Gán danh mục vào form
        $('#edit-subject').val(additionalInfo[0]?.replace('Tên môn: ', '').trim()); // Gán tên môn học vào form
        $('#edit-major').val(additionalInfo[1]?.replace('Ngành: ', '').trim() || ''); // Gán ngành học vào form nếu có
        initializeCategoryVisibility(); // Cập nhật hiển thị trường thông tin
    }

    // Lưu các thay đổi sau khi chỉnh sửa bài đăng
    function saveChanges() {
        var updatedTitle = $('#edit-title').val().trim(); // Tiêu đề mới
        var updatedContent = $('#edit-content').val().trim(); // Nội dung mới
        var updatedCategory = $('#edit-category').val(); // Danh mục mới
        var updatedSubject = $('#edit-subject').val().trim(); // Tên môn mới
        var updatedAdditionalInfo = `Tên môn: ${updatedSubject}`; // Chuỗi thông tin bổ sung
        if (updatedCategory === "Môn chuyên ngành") {
            updatedAdditionalInfo += `<br>Ngành: ${$('#edit-major').val().trim()}`; // Thêm ngành học nếu là chuyên ngành
        }

        if (postToEdit) {
            postToEdit.find('.title').text(updatedTitle); // Cập nhật tiêu đề
            postToEdit.find('.content').text(updatedContent); // Cập nhật nội dung
            postToEdit.find('.category').text(updatedCategory); // Cập nhật danh mục
            postToEdit.find('.additional-info').html(updatedAdditionalInfo); // Cập nhật thông tin bổ sung
        }
        $('#editModal, #confirmSaveModal').hide(); // Đóng các modal
    }

    // Xử lý khi hủy chỉnh sửa
    function handleCancelEdit() {
        $('#editModal, #confirmCancelModal').hide(); // Đóng modal hủy
    }

    // Xử lý sự kiện khi nhấn nút chỉnh sửa bài đăng
    $('.edit-post').on('click', function () {
        populateEditForm($(this).closest('tr')); // Điền thông tin bài đăng vào form
        $('#editModal').show(); // Hiển thị modal chỉnh sửa
    });


    // Xử lý khi gửi form chỉnh sửa
    $('#edit-form').on('submit', function (e) {
        e.preventDefault(); // Ngăn hành động mặc định của form
        var category = $('#edit-category').val();
        var subject = $('#edit-subject').val().trim();
        var major = $('#edit-major').val().trim();

        // Kiểm tra thông tin đầu vào
        if ((category === 'Môn chuyên ngành' && !major) || (category === 'Môn đại cương' && !subject)) {
            alert('Vui lòng điền đầy đủ thông tin!'); // Thông báo lỗi
            return;
        }
        $('#confirmSaveModal').show(); // Hiển thị modal xác nhận lưu
    });

    // Lưu thay đổi khi nhấn xác nhận
    $('#confirm-save').on('click', saveChanges);

    // Hủy lưu thay đổi
    $('#cancel-save').on('click', function () {
        $('#confirmSaveModal').hide();
    });

    // Hủy chỉnh sửa
    $('#cancel-edit').on('click', function () {
        $('#confirmCancelModal').show();
    });

    // Xác nhận hủy chỉnh sửa
    $('#confirm-cancel').on('click', handleCancelEdit);

    // Đóng modal hủy
    $('#cancel-cancel').on('click', function () {
        $('#confirmCancelModal').hide();
    });

    // Cập nhật hiển thị các trường thông tin khi thay đổi danh mục
    $('#edit-category').on('change', initializeCategoryVisibility);

    // Đóng modal khi nhấn nút đóng
    $('.close').on('click', handleCancelEdit);

    initializeCategoryVisibility(); // Khởi tạo hiển thị

    // Chức năng tìm kiếm bài đăng
    function searchPosts() {
        const input = document.getElementById('searchInput').value.toLowerCase().trim(); // Lấy nội dung ô tìm kiếm
        const postRows = document.querySelectorAll('.post-table tbody tr'); // Các hàng bài đăng
        const noResultsMessage = document.querySelector('.no-results'); // Thông báo không có kết quả
        let hasMatches = false;

        // Lọc bài đăng dựa trên tiêu đề, ID người dùng hoặc danh mục
        postRows.forEach(post => {
            const title = post.querySelector('.title').textContent.toLowerCase();
            const userId = post.querySelector('.user-id').textContent.toLowerCase();
            const category = post.querySelector('.category').textContent.toLowerCase();

            if (title.includes(input) || userId.includes(input) || category.includes(input)) {
                post.style.display = ''; // Hiển thị bài đăng phù hợp
                hasMatches = true;
            } else {
                post.style.display = 'none'; // Ẩn bài đăng không phù hợp
            }
        });

        noResultsMessage.style.display = hasMatches ? 'none' : 'block'; // Hiển thị thông báo nếu không có kết quả
    }

    // Gắn sự kiện tìm kiếm bài đăng
    $('#searchInput').on('keyup', function () {
        searchPosts();
    });

    // Khởi tạo trạng thái hiển thị bài đăng
    searchPosts();

    // Chức năng tìm kiếm người dùng
    function searchUsers() {
        const input = document.getElementById('searchInput').value.toLowerCase().trim();
        const userItems = document.querySelectorAll('.user-item');
        const noResultsMessage = document.querySelector('.no-results');
        let hasMatches = false;

        // Lọc danh sách người dùng dựa trên tên hoặc ID
        userItems.forEach(user => {
            const username = user.querySelector('.username').textContent.toLowerCase();
            const userId = user.querySelector('.user-id').textContent.toLowerCase();

            if (username.includes(input) || userId.includes(input)) {
                user.style.display = ''; // Hiển thị người dùng phù hợp
                hasMatches = true;
            } else {
                user.style.display = 'none'; // Ẩn người dùng không phù hợp
            }
        });

        noResultsMessage.style.display = hasMatches ? 'none' : 'block'; // Hiển thị thông báo nếu không có kết quả
    }

    // Gắn sự kiện tìm kiếm cho biểu tượng kính lúp
    $('#search-icon').on('click', function () {
        searchUsers();
    });

    // Gắn sự kiện tìm kiếm khi nhập vào ô tìm kiếm
    $('#searchInput').on('keyup', function () {
        searchUsers();
    });

    // Ẩn thông báo "không có kết quả" khi tải trang
    $('.no-results').hide();
});

// $(document).ready(function() {
//     // Lắng nghe sự kiện click vào tiêu đề
//     $('.title').click(function() {
//         var fullTitle = $(this).text(); // Lấy toàn bộ tiêu đề
//         var fullContent = $(this).closest('tr').find('.content').text(); // Lấy toàn bộ nội dung của bài viết
//         var fullIndustry = $(this).closest('tr').find('.additional-info').text(); // Lấy ngành của bài viết
//         $('#modal-title').text(fullTitle); // Đưa tiêu đề vào modal
//         $('#modal-industry').text("Ngành: " + fullIndustry); // Đưa ngành vào modal
//         $('#fullContentText').text(fullContent); // Đưa nội dung vào modal
//         $('#fullContentModal').fadeIn(); // Hiển thị modal
//     });

//     // Lắng nghe sự kiện click vào nội dung
//     $('.content').click(function() {
//         var fullContent = $(this).text(); // Lấy toàn bộ nội dung
//         var fullTitle = $(this).closest('tr').find('.title').text(); // Lấy tiêu đề của bài viết
//         var fullIndustry = $(this).closest('tr').find('.additional-info').text(); // Lấy ngành của bài viết
//         $('#modal-title').text(fullTitle); // Đưa tiêu đề vào modal
//         $('#modal-industry').text("Ngành: " + fullIndustry); // Đưa ngành vào modal
//         $('#fullContentText').text(fullContent); // Đưa nội dung vào modal
//         $('#fullContentModal').fadeIn(); // Hiển thị modal
//     });

//     // Lắng nghe sự kiện click vào ngành
//     $('.additional-info').click(function() {
//         var fullIndustry = $(this).text(); // Lấy ngành của bài viết
//         var fullTitle = $(this).closest('tr').find('.title').text(); // Lấy tiêu đề của bài viết
//         var fullContent = $(this).closest('tr').find('.content').text(); // Lấy toàn bộ nội dung của bài viết
//         $('#modal-title').text(fullTitle); // Đưa tiêu đề vào modal
//         $('#modal-industry').text("Ngành: " + fullIndustry); // Đưa ngành vào modal
//         $('#fullContentText').text(fullContent); // Đưa nội dung vào modal
//         $('#fullContentModal').fadeIn(); // Hiển thị modal
//     });

//     // Đóng modal khi click vào dấu 'X'
//     $('.custom-close').click(function() {
//         $('#fullContentModal').fadeOut(); // Ẩn modal
//     });
// });
$(document).ready(function() {
    // Lắng nghe sự kiện click vào tiêu đề
    $('.title').click(function() {
        var fullTitle = $(this).text(); // Lấy toàn bộ tiêu đề
        var fullContent = $(this).closest('tr').find('.content').text(); // Lấy toàn bộ nội dung của bài viết
        var fullIndustry = $(this).closest('tr').find('.additional-info').text(); // Lấy ngành của bài viết
        var username = $(this).closest('tr').find('.user-id').text(); // Lấy username của bài viết (cập nhật class là .user-id)

        $('#modal-title').text(fullTitle); // Đưa tiêu đề vào modal
        $('#modal-industry').text("Ngành: " + fullIndustry); // Đưa ngành vào modal
        $('#fullContentText').text(fullContent); // Đưa nội dung vào modal
        $('#modal-username').text("Bài viết của: " + username); // Đưa username vào modal
        $('#fullContentModal').fadeIn(); // Hiển thị modal
    });

    // Lắng nghe sự kiện click vào nội dung
    $('.content').click(function() {
        var fullContent = $(this).text(); // Lấy toàn bộ nội dung
        var fullTitle = $(this).closest('tr').find('.title').text(); // Lấy tiêu đề của bài viết
        var fullIndustry = $(this).closest('tr').find('.additional-info').text(); // Lấy ngành của bài viết
        var username = $(this).closest('tr').find('.user-id').text(); // Lấy username của bài viết (cập nhật class là .user-id)

        $('#modal-title').text(fullTitle); // Đưa tiêu đề vào modal
        $('#modal-industry').text("Ngành: " + fullIndustry); // Đưa ngành vào modal
        $('#fullContentText').text(fullContent); // Đưa nội dung vào modal
        $('#modal-username').text("Bài viết của: " + username); // Đưa username vào modal
        $('#fullContentModal').fadeIn(); // Hiển thị modal
    });

    // Lắng nghe sự kiện click vào ngành
    $('.additional-info').click(function() {
        var fullIndustry = $(this).text(); // Lấy ngành của bài viết
        var fullTitle = $(this).closest('tr').find('.title').text(); // Lấy tiêu đề của bài viết
        var fullContent = $(this).closest('tr').find('.content').text(); // Lấy toàn bộ nội dung của bài viết
        var username = $(this).closest('tr').find('.user-id').text(); // Lấy username của bài viết (cập nhật class là .user-id)

        $('#modal-title').text(fullTitle); // Đưa tiêu đề vào modal
        $('#modal-industry').text("Ngành: " + fullIndustry); // Đưa ngành vào modal
        $('#fullContentText').text(fullContent); // Đưa nội dung vào modal
        $('#modal-username').text("Bài viết của: " + username); // Đưa username vào modal
        $('#fullContentModal').fadeIn(); // Hiển thị modal
    });

    // Đóng modal khi click vào dấu 'X'
    $('.custom-close').click(function() {
        $('#fullContentModal').fadeOut(); // Ẩn modal
    });

    // Đóng modal khi click ra ngoài modal-content
    $('#fullContentModal').click(function(event) {
        if ($(event.target).is('#fullContentModal')) { // Kiểm tra nếu click vào chính modal (không phải modal-content)
            $('#fullContentModal').fadeOut(); // Ẩn modal
        }
    });
});

    document.addEventListener('DOMContentLoaded', function() {
        const menuLinks = document.querySelectorAll('#sidebar li a');

        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Xóa lớp 'active' khỏi tất cả các liên kết
                menuLinks.forEach(link => link.classList.remove('active'));

                // Thêm lớp 'active' vào phần tử được click
                e.target.classList.add('active');
            });
        });

        // Duy trì trạng thái 'active' khi tải lại trang (nếu cần)
        const currentPath = window.location.pathname;
        menuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    });
