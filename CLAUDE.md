# Quy trình phát triển – my-finance-demo

## Workflow bắt buộc trước khi code

Mỗi tính năng / fix đều phải đi qua đúng thứ tự sau:

1. **Clarify requirements** — làm rõ toàn bộ yêu cầu, hỏi lại nếu còn mơ hồ.
2. **Viết SPEC & Test Case** — cập nhật spec mô tả tính năng và liệt kê test case cụ thể.
3. **Chờ confirm** — chỉ tiến hành code sau khi người dùng xác nhận "SPEC OKI" (hoặc tương đương).
4. **Triển khai code** — implement theo đúng spec đã confirm.
5. **Chạy test** — `npm test` với các test case đã define; đảm bảo toàn bộ pass.
6. **Fix bug** — nếu có lỗi thì fix và chạy lại test cho đến khi sạch.
7. **Push git** — commit rõ ràng và push lên remote.
8. **Thông báo hoàn thành** — báo cho người dùng biết đã xong.

> Không được bỏ qua bước nào, đặc biệt bước 3 (confirm SPEC) và bước 5 (chạy test).
