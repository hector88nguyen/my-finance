# Tài liệu Kịch bản Kiểm thử (Test Cases)
> Cập nhật: 25/03/2026 — Phiên bản 2.0 (Firebase Auth + Firestore)

## 1. Unit Tests (Vitest) — `src/utils/`

| ID | Mô tả | File | Trạng thái |
|---|---|---|---|
| TC-U01a | `getCategoryData()` trả về color/icon đúng cho "Ăn uống" | categories.test.js | Tự động |
| TC-U01b | `getCategoryData()` trả về fallback khi danh mục không tồn tại | categories.test.js | Tự động |
| TC-U01c | `getCategoryData()` hoạt động cho danh mục thu nhập "Tiền lương" | categories.test.js | Tự động |
| TC-U01d | `CATEGORIES` object có đủ 2 khóa expense và income | categories.test.js | Tự động |
| TC-U02a | Format 1,000,000 → chuỗi tiếng Việt có ký hiệu ₫ | categories.test.js | Tự động |
| TC-U02b | Format số âm → chứa dấu trừ | categories.test.js | Tự động |
| TC-U02c | Format số 0 → không lỗi, vẫn có ₫ | categories.test.js | Tự động |

## 2. Integration Tests (Vitest + Testing Library) — `src/components/`

| ID | Mô tả | File | Trạng thái |
|---|---|---|---|
| TC-I01a | `CurrencyInput` khởi tạo với giá trị rỗng | CurrencyInput.test.jsx | Tự động |
| TC-I01b | `CurrencyInput` nhập 1234567 → hiển thị 1,234,567 | CurrencyInput.test.jsx | Tự động |
| TC-I01c | `CurrencyInput` không chứa ký tự chữ | CurrencyInput.test.jsx | Tự động |
| TC-I01d | `CurrencyInput` nhận giá trị prop ban đầu | CurrencyInput.test.jsx | Tự động |
| TC-I02a | `ErrorBoundary` render bình thường khi component con không lỗi | ErrorBoundary.test.jsx | Tự động |
| TC-I02b | `ErrorBoundary` hiển thị fallback UI khi component con throw Error | ErrorBoundary.test.jsx | Tự động |
| TC-I02c | `ErrorBoundary` fallback UI có nút "Tải lại trang" | ErrorBoundary.test.jsx | Tự động |

## 3. End-to-End Tests (Playwright) — `tests/`

> **Lưu ý:** Các test cần tài khoản Firebase thật được đánh dấu **[Skip-CI]** và cần Firebase Emulator để chạy đầy đủ. Các test không cần auth chạy tự động trong CI/CD.

### TC-E01: Xác thực (Authentication)

| ID | Mô tả | Auth cần? | CI |
|---|---|---|---|
| TC-E01a | Trang Login hiển thị đủ Form Email, Password, Google button | Không | ✅ Tự động |
| TC-E01b | Nút toggle chuyển giữa Đăng nhập ↔ Đăng ký | Không | ✅ Tự động |
| TC-E01c | Đăng nhập sai mật khẩu → hiển thị thông báo lỗi | Không | ✅ Tự động |
| TC-E01d | Truy cập trang protected chưa đăng nhập → redirect /login | Không | ✅ Tự động |

### TC-E02: Quản lý Tài khoản (Accounts)

| ID | Mô tả | Auth cần? | CI |
|---|---|---|---|
| TC-E02a | Tạo tài khoản mới → hiển thị trong danh sách | Có | [Skip-CI] |
| TC-E02b | Nút Ẩn/Hiện số dư → toggle giữa số thật và `***` | Có | [Skip-CI] |
| TC-E02c | Sửa tên tài khoản → cập nhật trong danh sách | Có | [Skip-CI] |
| TC-E02d | Click tên tài khoản → chuyển sang /transactions với filter | Có | [Skip-CI] |
| TC-E02e | Click nút (+) của ví → mở form thêm giao dịch với ví đó | Có | [Skip-CI] |

### TC-E03: Giao dịch (Transactions)

| ID | Mô tả | Auth cần? | CI |
|---|---|---|---|
| TC-E03a | Thêm khoản Chi → hiển thị trong danh sách | Có | [Skip-CI] |
| TC-E03b | Thêm khoản Thu → số tiền hiển thị màu xanh | Có | [Skip-CI] |
| TC-E03c | Xóa giao dịch → biến mất khỏi danh sách | Có | [Skip-CI] |
| TC-E03d | Lọc giao dịch theo tài khoản → chỉ hiện đúng ví đó | Có | [Skip-CI] |
| TC-E03e | Group giao dịch theo ngày → nhãn "Hôm nay", "Hôm qua" | Có | [Skip-CI] |
| TC-E03f | Tạo danh mục mới từ dropdown → chọn được danh mục mới | Có | [Skip-CI] |

### TC-E04: Báo cáo (Reports)

| ID | Mô tả | Auth cần? | CI |
|---|---|---|---|
| TC-E04a | Trang /reports render được biểu đồ SVG | Có | [Skip-CI] |
| TC-E04b | Filter tháng → biểu đồ cập nhật theo tháng đó | Có | [Skip-CI] |

### TC-E05: Error Handling & Navigation

| ID | Mô tả | Auth cần? | CI |
|---|---|---|---|
| TC-E05a | Truy cập URL không tồn tại → redirect về trang chủ hoặc /login | Không | ✅ Tự động |

## 4. Lệnh Chạy Test

```bash
# Unit Tests & Integration Tests
npm test

# End-to-End Tests (chỉ chạy test không cần auth)
npx playwright test

# E2E với Firebase Emulator (tương lai)
FIREBASE_EMULATOR=true npx playwright test
```
