**ĐỒ ÁN 01**
- Thư mục gốc là DO_AN_01
- package.json là file để lưu thông tin đồ án và các thư viện được sử dụng
- Thư mục node_modules chứa thư viện được tải về trong package.json
- File .gitignore được sử dụng để chỉ định các tệp và thư mục mà bạn muốn Git bỏ qua, không theo dõi và không đưa vào hệ thống kiểm soát phiên bản.
- Thư mục chính của dự án là src gồm:
    + File chính index.js để cấu hình server liên kết mô hình dữ liệu MVC
    + Mô hình MVC:
        M - models được lưu trong thư mục app dùng để cấu hình cho CSDL
        V - views được lưu trong thư mục Resources để lưu giao diện interface
        C - controllers được lưu trong app để xử lý logic của các đường dẫn (router)
    + Thư mục router dùng để cấu hình đường dẫn của trang web
    + Thư mục phụ trợ: 
        * config cấu hình các middleware cho dự án (
            File dbconfig.js chứa phương thức kết nối cơ sở dữ liệu
            File ruleRoute.js chứa các ràng buộc về đường dẫn
        )

        * public cấu hình các đường dẫn file tĩnh

        * until tạo ra các middleware xử lý dữ liệu


