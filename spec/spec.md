# Project name: Tài chính (Quản lý tài chính cá nhân)

## 1. What are we building?
Hệ thống Quản lý tài chính cá nhân.

## 2. Who will use this?
- Người dùng cá nhân đăng nhập thông qua **Email/Password** hoặc **tài khoản Google** (Dữ liệu lưu trên Cloud Firebase).

## 3. Core Features (MVP)
1. [x] **Xác thực:** Đăng nhập, Đăng xuất, Đặt lại mật khẩu (Mock database).
2. [x] **Tổng quan (Dashboard):** Xem tổng tài sản hiện tại, tổng thu nhập và tổng chi tiêu, các giao dịch gần nhất.
3. [x] **Giao dịch (Transactions):** Xem danh sách chi tiết tất cả các khoản thu và chi.
4. [x] **Thêm giao dịch mới:** Thêm giao dịch (Thu/Chi) bằng popup tiện lợi, kèm theo Số tiền, Danh mục và Ghi chú tùy chọn.
5. [x] **Xóa giao dịch:** Xóa lịch sử các khoản thu chi nhầm lẫn.

## 4. Phase 2 Features (Bổ sung Quản lý Tài khoản)
1. [x] **Quản lý Tài khoản hợp nhất:** Cấp phép tạo và chia nhỏ theo từng tài khoản (Ví ATM, Tiền nhà, Tiền xe...).
2. [x] Giao diện **Tài khoản của tôi** hiển thị Tổng số dư (có nút Ẩn/Hiện) và list phân loại từng tài khoản cụ thể. 
3. [x] Nâng cấp thanh Bottom Navigation mô phỏng App: Tổng quan, Tài khoản, [+] Nút lớn trung tâm, Báo cáo, Khác.

## 5. Phase 3 Features (Cập nhật nâng cao Giai đoạn 3)
1. [x] **Sửa/Xoá tài khoản:** Cho phép đổi tên, điều chỉnh số dư, và xoá các tài khoản đã tạo (có cảnh báo và tự động dọn dẹp các giao dịch liên quan).
2. [x] **Chuyển hướng thông minh:** Từ trang quản lý Tài khoản có nút bấm (ví dụ nút Thêm giao dịch) gọi trực tiếp đến form Nhập Thu/Chi và tự động chọn sẵn Tài khoản tương ứng.
3. [x] **Định dạng số tiền (Formatting):** TextBox nhập số tiền có tự động thêm dấu phẩy ngàn/triệu/tỉ (Ví dụ: 1,000,000).
4. [x] **Menu Cây Thư mục (Sidebar):** Menu Tài khoản ở thanh Sidebar bên trái (giao diện PC) sẽ xổ ra hiển thị danh sách các tài khoản đang có.

## 6. Feedback Edits (Sửa đổi theo góp ý)
- [x] **Xem giao dịch theo tài khoản:** Bấm vào tài khoản trên Sidebar/Trang Accounts sẽ lọc giao dịch bằng tham số URL (`?account=id`). Sidebar tự động highlight đúng tài khoản đang được lọc.
- [x] Khắc phục lỗi Parse số tiền khi gõ thay đổi trên textbox bằng thư viện React chuẩn.

## 7. Phase 4 Features (Đề xuất Chuẩn hoá App Tài chính)
Sau khi đối chiếu với các hệ thống quản lý tài chính tiêu chuẩn (như Money Lover, MISA Sổ Thu Chi), ứng dụng của chúng ta tuy đã có bộ khung tốt nhưng hiện đang thiếu một số tính năng lõi để trở nên chuyên nghiệp hơn. Dưới đây là đề xuất cải thiện GĐ 4:
1. [x] **Quản lý Danh mục (Categories System):** Thay thế trường nhập tay chữ Text "Danh mục" bằng danh sách chọn có sẵn, phân loại rõ Thu/Chi, kèm Icon trực quan (Vd: 🍔 Ăn uống, 🛒 Mua sắm, 💰 Tiền lương). 
2. [x] **Báo cáo & Thống kê (Reports/Analytics):** Xây dựng trang `/reports` (hiện đang trống) bằng biểu đồ trực quan (Pie Chart / Bar Chart) để người dùng xem tỷ lệ chi tiêu theo tháng, tìm ra khoản chi tiêu tốn kém nhất.
3. [x] **Di trú dữ liệu (Data Migration):** Hỗ trợ người dùng cũ kết nối và di chuyển đồng loạt toàn bộ dữ liệu từ `LocalStorage` (trình duyệt cũ) lên lưu trữ Cloud Firebase thông qua một cú click ở trang Cài đặt (`/more`). Thay thế tính năng Backup JSON tĩnh.

## 9. Phase 5 Features (Cập nhật bổ sung)
1. [x] **Biểu đồ cột Dashboard:** Trang Tổng quan hiển thị biểu đồ dạng cột (Bar Chart) thể hiện thu/chi, có filter chuyển đổi theo **Tuần** / **Tháng**. Mặc định hiển thị theo Tháng.
2. [x] **Group giao dịch theo ngày:** Trang Lịch sử Giao dịch (`/transactions`) nhóm (group) các giao dịch theo ngày, ví dụ: "Hôm nay – 23/03/2026", "Hôm qua – 22/03/2026".
3. [x] **Tạo mới inline từ dropdown:**
   - Field **Danh mục** trong form Thêm giao dịch: Có tùy chọn "Tạo danh mục mới..." ở cuối danh sách.
   - Field **Vào tài khoản** trong form Thêm giao dịch: Có tùy chọn "Tạo tài khoản mới..." ở cuối danh sách.

## 10. Phase 6 Features (Backend Firebase Integration)
1. [x] **Firebase Authentication:** Đăng nhập/Đăng xuất bằng Email và Password thật thay vì Mock dữ liệu.
2. [x] **Google Login:** Đăng nhập nhanh bằng tài khoản Google thông qua Firebase OAuth 2.0 (signInWithPopup).
3. [x] **Firestore Database:** Toàn bộ dữ liệu Accounts, Transactions, Categories của mỗi User được lưu trữ độc lập trên Cloud (Firestore).
4. [x] **Realtime / Async Data:** Giao diện có trạng thái Loading khi gọi dữ liệu từ xa, thay vì xuất hiện ngay lập tức như LocalStorage.

## 12. Phase 7 Features (Tối ưu UI/UX & Web Guidelines)
1. [x] **URL-based Routing:** Trạng thái lọc Giao dịch được gắn vào tham số URL (`?account=id`), giúp người dùng chia sẻ link, tải lại trang mà không mất State, Sidebar menu luôn nhận diện được ngữ cảnh.
2. [x] **Tối ưu Hiệu Năng & Layout:** Áp dụng Content Virtualization (`content-visibility: auto`) cho danh sách tài chính dài. Hỗ trợ hiển thị tai thỏ/không gian an toàn (`safe-area-inset`) cho iOS/Android WebViews. Định dạng chuẩn hóa font số `tabular-nums` cho số tiền để dòng không xô lệch.
3. [x] **Accessibility (A11y):** Cập nhật toàn bộ nhãn đọc màn hình (`aria-label`) cho các button điều hướng/icon. Ngăn chặn focus ring xấu xí khi click chuột bằng thuộc tính `:focus-visible` (chỉ hiện khi duyệt bằng phím Tab).
4. [x] **Mobile Keyboard DX:** Sử dụng `inputMode="decimal"` bật bàn phím số liền mạch, tự động gọi Autofill mật khẩu.

## 8. Constraints
- **Tech Stack:** Web application (Xây dựng bằng ReactJS, ViteJS và Vanilla CSS).
- **Thiết bị hiển thị:** Có thể xem ở máy tính (Sidebar Navigation) hoặc trên điện thoại (Mobile Bottom Navigation - Responsive Layout).
- **Backend:** Sử dụng hệ sinh thái **Firebase** (Auth, Firestore) làm Backend as a Service (BaaS) để đồng bộ dữ liệu thời gian thực trên Cloud.
- **CI/CD:** Tự động hóa Deploy lên GitHub Pages thông qua **GitHub Actions** mỗi khi có thay đổi trên branch `main`.

## 11. Non-Functional Requirements
### Performance
- **Response Time:** < 2 seconds for 95% of requests
- **Throughput:** Handle 10 requests/second
- **Concurrent Users:** Support 10 concurrent users

### Security
- **Authentication:** JWT-based / OAuth 2.0 (Google Login via Firebase)
- **Authorization:** Role-based access control (Security Rules đã thiết lập để cô lập dữ liệu theo UID)
- **Data Protection:** Encryption at rest and in transit (Managed by Google Cloud Firebase)

### Reliability
- **Availability:** 99.9% uptime
- **Recovery:** RTO < 1 hour, RPO < 10 minutes (Đề nghị bổ sung Backup Automation)
- **Error Rate:** < 0.1% error rate (Đã xử lý cấu trúc ErrorBoundary)
