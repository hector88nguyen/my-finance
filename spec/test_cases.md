# Tài liệu Kịch bản Kiểm thử (Test Cases)

## 1. Unit Test (Hàm Cấu trúc)
- [ ] `TC-U01`: Thêm Account - Gọi hàm `addAccount(data)`, kiểm tra Account lưu LocalStorage với `balance` đúng kiểu chuỗi số (Number).
- [ ] `TC-U02`: Cập nhật Account - Gọi `editAccount(id, data)`, kiểm chứng LocalStorage ghi đè file lưu và trả về chính xác Object đó.
- [ ] `TC-U03`: Mapping Danh mục - Gọi hàm `getCategoryData(name, type)` -> Trả về đúng Component Icon và màu Hex, nếu null bắt buộc trả Fallback Tag.

## 2. Integration Test (Component)
- [ ] `TC-I01`: Giao diện `<CurrencyInput />` - Render input giả lập, gõ văn bản `abcd` -> Component value trả rỗng; gõ `1234567` -> Component text hiển thị đúng format US `1,234,567`.
- [ ] `TC-I02`: Submit Form - Điền tay 1 khoản Cho (Expense) và kích hoạt hàm Submit. Đảm bảo form chặn lỗi rỗng (Alert) và gọi localStorage chính xác nếu đủ Param.

## 3. End-to-End (E2E) qua Playwright
- [ ] `TC-E01`: Đi màn Đăng nhập -> Render Sidebar -> Đi đến mục Tài khoản -> Mở Popup -> Gõ text tạo Ví "Ví Test automation" bằng Currency input rỗng.
- [ ] `TC-E02`: Tại `/accounts`, bấm (+) góc phải Ví Test -> Layout tự chuyển hướng sang `/transactions` popup. Nhập 1,000,000 -> Check Categpory Dropdown -> Lưu. Màn hình tự nảy về bảng list và xem số dư có bị mất format không.
- [ ] `TC-E03`: Tại Sidebar -> Xác nhận Menu xổ Ví con -> Nhấp Ví Test -> Trang Giao dịch chỉ list ra đúng con số 1,000,000 của Ví thay vì tất cả.
