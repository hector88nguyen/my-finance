# Project name: Tài chính (Quản lý tài chính cá nhân)

## 1. What are we building?
Hệ thống Quản lý tài chính cá nhân.

## 2. Who will use this?
- Người dùng cá nhân đăng nhập thông qua user name / password (Dữ liệu lưu cục bộ local).

## 3. Core Features (MVP)
1. [x] **Xác thực:** Đăng nhập, Đăng xuất, Đặt lại mật khẩu (Mock database).
2. [x] **Tổng quan (Dashboard):** Xem tổng tài sản hiện tại, tổng thu nhập và tổng chi tiêu, các giao dịch gần nhất.
3. [x] **Giao dịch (Transactions):** Xem danh sách chi tiết tất cả các khoản thu và chi.
4. [x] **Thêm giao dịch mới:** Thêm giao dịch (Thu/Chi) bằng popup tiện lợi, kèm theo Số tiền, Danh mục và Ghi chú tùy chọn.
5. [x] **Xóa giao dịch:** Xóa lịch sử các khoản thu chi nhầm lẫn.

## 4. Phase 2 Features (Bổ sung Quản lý Tài khoản)
1. [ ] **Quản lý Tài khoản hợp nhất:** Cấp phép tạo và chia nhỏ theo từng tài khoản (Ví ATM, Tiền nhà, Tiền xe...).
2. [ ] Giao diện **Tài khoản của tôi** hiển thị Tổng số dư (có nút Ẩn/Hiện) và list phân loại từng tài khoản cụ thể. 
3. [ ] Nâng cấp thanh Bottom Navigation mô phỏng App: Tổng quan, Tài khoản, [+] Nút lớn trung tâm, Báo cáo, Khác.

## 5. Phase 3 Features (Cập nhật nâng cao Giai đoạn 3)
1. [x] **Sửa thông tin tài khoản:** Cho phép đổi tên và điều chỉnh số dư của các tài khoản đã tạo.
2. [x] **Chuyển hướng thông minh:** Từ trang quản lý Tài khoản có nút bấm (ví dụ nút Thêm giao dịch) gọi trực tiếp đến form Nhập Thu/Chi và tự động chọn sẵn Tài khoản tương ứng.
3. [x] **Định dạng số tiền (Formatting):** TextBox nhập số tiền có tự động thêm dấu phẩy ngàn/triệu/tỉ (Ví dụ: 1,000,000).
4. [x] **Menu Cây Thư mục (Sidebar):** Menu Tài khoản ở thanh Sidebar bên trái (giao diện PC) sẽ xổ ra hiển thị danh sách các tài khoản đang có.

## 6. Feedback Edits (Sửa đổi theo góp ý)
- [/] **Xem giao dịch theo tài khoản:** Click vào tên tài khoản ở Menu Sidebar bên trái **hoặc** trong danh sách tài khoản ở trang `/accounts` thì hiển thị list chi tiết giao dịch tương ứng với tài khoản đó (trang `/transactions` với bộ lọc theo tài khoản).
- [x] Khắc phục lỗi Parse số tiền khi gõ thay đổi trên textbox bằng thư viện React chuẩn.

## 7. Phase 4 Features (Đề xuất Chuẩn hoá App Tài chính)
Sau khi đối chiếu với các hệ thống quản lý tài chính tiêu chuẩn (như Money Lover, MISA Sổ Thu Chi), ứng dụng của chúng ta tuy đã có bộ khung tốt nhưng hiện đang thiếu một số tính năng lõi để trở nên chuyên nghiệp hơn. Dưới đây là đề xuất cải thiện GĐ 4:
1. [x] **Quản lý Danh mục (Categories System):** Thay thế trường nhập tay chữ Text "Danh mục" bằng danh sách chọn có sẵn, phân loại rõ Thu/Chi, kèm Icon trực quan (Vd: 🍔 Ăn uống, 🛒 Mua sắm, 💰 Tiền lương). 
2. [x] **Báo cáo & Thống kê (Reports/Analytics):** Xây dựng trang `/reports` (hiện đang trống) bằng biểu đồ trực quan (Pie Chart / Bar Chart) để người dùng xem tỷ lệ chi tiêu theo tháng, tìm ra khoản chi tiêu tốn kém nhất.
3. [x] **Sao lưu & Khôi phục dữ liệu (Data Backup):** Vì ứng dụng dùng `LocalStorage` (không có Backend), dữ liệu rất dễ mất nếu người dùng xóa lịch sử duyệt web. Cần có tính năng Tải file `.json` sao lưu máy tính, và Nhập file `.json` để khôi phục dữ liệu ở mục Menu Khác (`/more`).

## 9. Phase 5 Features (Cập nhật bổ sung)
1. [x] **Biểu đồ cột Dashboard:** Trang Tổng quan hiển thị biểu đồ dạng cột (Bar Chart) thể hiện thu/chi, có filter chuyển đổi theo **Tuần** / **Tháng**. Mặc định hiển thị theo Tháng.
2. [x] **Group giao dịch theo ngày:** Trang Lịch sử Giao dịch (`/transactions`) nhóm (group) các giao dịch theo ngày, ví dụ: "Hôm nay – 23/03/2026", "Hôm qua – 22/03/2026".
3. [x] **Tạo mới inline từ dropdown:**
   - Field **Danh mục** trong form Thêm giao dịch: Có tùy chọn "Tạo danh mục mới..." ở cuối danh sách.
   - Field **Vào tài khoản** trong form Thêm giao dịch: Có tùy chọn "Tạo tài khoản mới..." ở cuối danh sách.

## 10. Phase 6 Features (Báckend Firebase Integration)
1. [x] **Firebase Authentication:** Đăng nhập/Đăng xuất bằng Email và Password thật thay vì Mock dữ liệu.
2. [x] **Firestore Database:** Toàn bộ dữ liệu Accounts, Transactions, Categories của mỗi User được lưu trữ độc lập trên Cloud (Firestore).
3. [x] **Realtime / Async Data:** Giao diện có trạng thái Loading khi gọi dữ liệu từ xa, thay vì xuất hiện ngay lập tức như LocalStorage.

## 8. Constraints
- **Tech Stack:** Web application (Xây dựng bằng ReactJS, ViteJS và Vanilla CSS).
- **Thiết bị hiển thị:** Có thể xem ở máy tính (Sidebar Navigation) hoặc trên điện thoại (Mobile Bottom Navigation - Responsive Layout).
- **Backend (Mới):** Sử dụng hệ sinh thái **Firebase** (Auth, Firestore) làm Backend as a Service (BaaS) để đồng bộ dữ liệu thời gian thực trên Cloud. (Thay thế hoàn toàn LocalStorage cũ).

## 11. Non-Functional Requirements
### Performance
- **Response Time:** < 2 seconds for 95% of requests
- **Throughput:** Handle 10 requests/second
- **Concurrent Users:** Support 10 concurrent users

### Security
- **Authentication:** JWT-based / OAuth 2.0 (Google Login via Firebase)
- **Authorization:** Role-based access control (Cần nâng cấp Firebase Security Rules)
- **Data Protection:** Encryption at rest and in transit (Managed by Google Cloud Firebase)

### Reliability
- **Availability:** 99.9% uptime
- **Recovery:** RTO < 1 hour, RPO < 10 minutes (Đề nghị bổ sung Backup Automation)
- **Error Rate:** < 0.1% error rate (Đã xử lý cấu trúc ErrorBoundary)
