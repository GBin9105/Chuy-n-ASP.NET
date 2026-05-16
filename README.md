# BÁO CÁO KẾT QUẢ BÀI THỰC HÀNH BUỔI 1
## MÔN: CHUYÊN ĐỀ ASP.NET

### I. THÔNG TIN SINH VIÊN
- **Họ và tên:** Nguyễn Phước Gia Bin
- **Mã số sinh viên:** 2123110115
- **Nhiệm vụ:** Khởi tạo cấu trúc đồ án CMS Full-Stack (Data - Backend - Frontend) và đồng bộ mã nguồn lên GitHub.
- **Trạng thái:** Đã hoàn thành 100% yêu cầu đề bài và bài tập tự rèn luyện.

---

### II. NỘI DUNG VÀ KẾT QUẢ ĐÃ ĐẠT ĐƯỢC

#### 1. Khởi tạo cấu trúc Solution hệ thống
- Tạo thành công một **Blank Solution** quản lý tập trung mang tên `Nguyễn Phước Gia Bin _ 2123110115`.
- Cấu hình giải pháp quản lý đồng thời cả 3 lớp công nghệ: Lớp dữ liệu (C#), Lớp xử lý API (ASP.NET Core) và Lớp giao diện người dùng (ReactJS).

#### 2. Xây dựng lớp dữ liệu (`CMS.Data`)
- Khởi tạo dự án dạng **Class Library** (.NET Core).
- Tạo thư mục cấu trúc `Entities` và định nghĩa thành công mã nguồn thuộc tính, khóa chính `[Key]`, khóa ngoại `[ForeignKey]` cho **8 thực thể nền tảng** bao gồm:
  1. `Category.cs`: Danh mục bài viết tin tức.
  2. `Post.cs`: Nội dung bài viết chi tiết, ngày tạo.
  3. `User.cs`: Quản lý tài khoản quản trị (Username, PasswordHash, Role phân quyền).
  4. `CategoryProduct.cs`: Danh mục các sản phẩm.
  5. `Product.cs`: Thông tin sản phẩm, giá bán, số lượng tồn kho.
  6. `Customer.cs`: Thông tin khách hàng (Họ tên, Email, mật khẩu).
  7. `Order.cs`: Đơn hàng mua sắm.
  8. `OrderDetail.cs`: Chi tiết các mặt hàng trong đơn hàng.

#### 3. Phát triển lớp xử lý Backend (`CMS.Backend`)
- Khởi tạo lại dự án chuẩn **ASP.NET Core Web App (Model-View-Controller)**.
- Cấu hình **Project Reference** liên kết đồng bộ sang thư mục `CMS.Data`.
- **Hoàn thành Bài tập tự rèn luyện nâng cao (CHALLENGE):**
  - Xây dựng dữ liệu giả lập (**Mock Data**) để kiểm thử luồng hiển thị không cần Database.
  - Lập trình thành công 3 bộ điều hướng: `CategoryController`, `PostController`, và `UserController`.
  - Thiết kế giao diện hiển thị trực quan bằng **Bootstrap Layout**:
    - Hiển thị dạng **Bảng (Table)** sạch sẽ cho danh sách Danh mục và cấu trúc Quản lý thành viên.
    - Hiển thị dạng **Khối/Thẻ (Card Layout)** trực quan cho danh sách Bài viết mới nhất.
    - Xây dựng trang xem chi tiết bài viết sinh động (`Details.cshtml`).
  - Tích hợp thanh Menu điều hướng điều khiển tập trung trong file cấu hình gốc `_Layout.cshtml`.

#### 4. Khởi tạo lớp giao diện người dùng (`cms.frontend`)
- Sử dụng môi trường Node.js để tạo dự án Single Page Application độc lập bằng framework **ReactJS**.
- Đưa dự án ReactJS vào quản lý trực tiếp trong cửa sổ *Solution Explorer* của Visual Studio dưới dạng *Existing Web Site* (`3 of 3 projects`).
- Khắc phục lỗi hệ thống Windows chặn script bằng cách mở khóa quyền `Set-ExecutionPolicy RemoteSigned` trên PowerShell.
- Khởi chạy thành công máy chủ phát triển Frontend cục bộ tại địa chỉ `http://localhost:3000`.

#### 5. Quản lý và tối ưu hóa mã nguồn Git/GitHub
- Phát hiện và xử lý triệt để lỗi phân mảnh dữ liệu khiến lệnh `git push` bị GitHub từ chối (do file cache hệ thống `CodeChunks.db` của GitHub Copilot trong thư mục `.vs` nặng tới **174.23 MB**, vượt quá giới hạn 100 MB của GitHub).
- Xây dựng file bộ lọc **`.gitignore`** tiêu chuẩn để loại bỏ vĩnh viễn các thư mục tạm, file rác sinh ra khi chạy code (`bin/`, `obj/`, `.vs/`, `node_modules/`).
- Làm sạch lịch sử commit lỗi, khởi tạo cấu trúc Git mới tinh và đồng bộ (Push) thành công 100% mã nguồn sạch lên Repository cá nhân tại địa chỉ: `https://github.com/GBin9105/Chuy-n-ASP.NET.git`.
- Tạo file tài liệu giới thiệu `README.md` hiển thị báo cáo chuyên nghiệp ngay trên trang chủ GitHub.
