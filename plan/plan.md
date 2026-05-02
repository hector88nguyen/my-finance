# Kế hoạch triển khai — my-finance-demo

> Cập nhật: 2026-05-02

---

## Quy tắc triển khai (Gate Rule)

> **Mỗi phase phải đi qua đủ 4 bước sau trước khi sang phase tiếp theo:**

| Bước | Nội dung |
|------|----------|
| 1. Code | Implement đủ checklist của phase |
| 2. Review | Rà soát code: logic đúng, không có bug hiển nhiên, không có dead code |
| 3. Fix | Sửa tất cả bug phát hiện trong bước Review |
| 4. Test | `npm test` pass + `npx vite build` clean → mới được chuyển phase |

**Không được bỏ qua bất kỳ bước nào, kể cả phase nhỏ.**

---

## Tổng quan

| Phase | Tính năng | Trạng thái | Files chính |
|-------|-----------|:----------:|-------------|
| A | Dark Mode + Toast notifications | ✅ Hoàn thành | Layout.jsx, Transactions.jsx, Accounts.jsx, More.jsx |
| B | Sửa giao dịch (Edit Transaction) | ✅ Hoàn thành | firebaseService.js, Transactions.jsx |
| C | Tìm kiếm & Lọc nâng cao | ✅ Hoàn thành | Transactions.jsx, Transactions.css |
| D | Chuyển tiền giữa tài khoản | ✅ Hoàn thành | firebaseService.js, Transactions.jsx |
| E | Quản lý Ngân sách | ✅ Hoàn thành | firebaseService.js, Reports.jsx |

---

## Phase A — Dark Mode + Toast ⏱ ~2h
> **Mục tiêu:** Hoàn thiện các tính năng đã build 90% nhưng chưa wire vào UI

### Checklist
- [x] **A1** — Wire `ThemeToggle` vào `Layout.jsx` (sidebar header + mobile top-header)
- [x] **A2** — Thay `alert()` bằng `addToast()` trong `Transactions.jsx`
- [x] **A3** — Thay `alert()` bằng `addToast()` trong `Accounts.jsx`
- [x] **A4** — Thay `alert()` bằng `addToast()` trong `More.jsx`
- [x] **A5** — Verify: build pass + toggle dark/light hoạt động

---

## Phase B — Edit Transaction ⏱ ~4h
> **Mục tiêu:** Cho phép sửa giao dịch đã nhập (tái dùng modal hiện có)

### Checklist
- [x] **B1** — Thêm hàm `editTransaction(userId, id, oldData, newData)` vào `firebaseService.js`
  - Revert balance account cũ (theo old.type + old.amount)
  - Apply balance mới (theo new.type + new.amount)
  - Xử lý trường hợp đổi accountId (revert account cũ, cộng account mới)
  - Update Firestore doc
- [x] **B2** — Thêm state `editingTx` và hàm `handleEdit(tx)` vào `Transactions.jsx`
- [x] **B3** — Pre-fill `formData` khi mở modal ở mode edit
- [x] **B4** — Thêm nút pencil (`Edit2` icon) bên cạnh nút xóa trong transaction list
- [x] **B5** — Verify: sửa số tiền/danh mục/tài khoản → balance cập nhật đúng

---

## Phase C — Search & Filter nâng cao ⏱ ~3h
> **Mục tiêu:** Filter theo từ khóa, khoảng ngày, danh mục

### Checklist
- [x] **C1** — Thêm search input lọc theo note/category (case-insensitive)
- [x] **C2** — Thêm 2 input date (Từ ngày / Đến ngày)
- [x] **C3** — Thêm dropdown filter theo danh mục
- [x] **C4** — Tích hợp 3 filter vào `useMemo` pipeline (sau filter account)
- [x] **C5** — Style filter bar trong `Transactions.css` (collapsible trên mobile)
- [x] **C6** — Verify: filter kết hợp nhiều điều kiện hoạt động đúng

---

## Phase D — Chuyển tiền giữa tài khoản ⏱ ~5h
> **Mục tiêu:** Hỗ trợ giao dịch loại "Chuyển khoản"

### Checklist
- [x] **D1** — Thêm `addTransfer(userId, { fromAccountId, toAccountId, amount, note })` vào `firebaseService.js`
  - Tạo 2 Firestore docs: 1 expense (from) + 1 income (to)
  - Cập nhật balance cả 2 accounts
- [x] **D2** — Thêm tab "Chuyển khoản" vào modal (`Transactions.jsx`)
  - Fields: Từ tài khoản, Đến tài khoản, Số tiền, Ghi chú
  - Validate: from ≠ to, amount > 0
- [x] **D3** — Hiển thị giao dịch transfer trong danh sách
  - Icon `ArrowLeftRight` (lucide-react)
  - Label: "TK nguồn → TK đích"
- [x] **D4** — Verify: balance cả 2 tài khoản cập nhật đúng sau transfer

---

## Phase E — Quản lý Ngân sách ⏱ ~6h
> **Mục tiêu:** Đặt hạn mức chi tiêu theo danh mục, xem progress trong Reports

### Checklist
- [x] **E1** — Thêm CRUD `budgets` collection vào `firebaseService.js`
  - `getBudgets(userId, month, year)`
  - `setBudget(userId, { categoryId, categoryName, amount, month, year })` — upsert
  - `deleteBudget(id)`
- [x] **E2** — Thêm section "Ngân sách tháng này" vào `Reports.jsx`
  - Progress bar mỗi danh mục: xanh (<70%), vàng (70–90%), đỏ (>90%)
  - Nút "Thiết lập ngân sách" mở modal
- [x] **E3** — Modal thiết lập ngân sách: chọn danh mục + nhập hạn mức
- [x] **E4** — Verify: thay đổi tháng → progress bar cập nhật theo đúng tháng

---

## Quy tắc sau mỗi phase
```
npm test          # 22 unit tests phải pass
npx vite build    # build clean, không lỗi
```

---

## Legend
| Ký hiệu | Ý nghĩa |
|---------|---------|
| ⬜ | Chưa làm |
| 🔄 | Đang làm |
| ✅ | Hoàn thành |
