# Clone Kaboot API Documentation

Chào mừng bạn đến với tài liệu API của Clone Kaboot - hệ thống tạo và tham gia bài kiểm tra trực tuyến tương tác.

## Mục lục

### [API Documentation](api-docs.md)

Tài liệu chi tiết về các API có sẵn, bao gồm các endpoint, mô tả, request parameters và response formats.

### [API Reference](api-reference.md)

Tham khảo kỹ thuật về cấu trúc request/response và định dạng dữ liệu.

### [Examples](examples.md)

Các ví dụ cụ thể về cách sử dụng API trong các tình huống thực tế.

## Tổng quan

Clone Kaboot API là RESTful API cho phép:

1. **Quản lý bài kiểm tra**

   - Tạo, cập nhật, xóa bài kiểm tra
   - Thêm câu hỏi và đáp án

2. **Quản lý phiên thi**

   - Tạo phiên thi từ bài kiểm tra có sẵn
   - Tham gia phiên thi bằng mã
   - Theo dõi người tham gia và kết quả

3. **Quản lý người chơi**

   - Đăng ký người chơi
   - Gửi câu trả lời
   - Xem kết quả và thống kê

4. **Thống kê và báo cáo**

   - Thống kê tổng quan
   - Hoạt động gần đây
   - Phân tích kết quả

5. **Xác thực và phân quyền**
   - Xác thực người dùng
   - Phân biệt quyền Admin và Player
   - Bảo vệ các API endpoints

## Bắt đầu nhanh

### Tạo một bài kiểm tra

```javascript
fetch("/api/canvas", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Kiểm tra Toán học",
    category: "Mathematics",
    description: "Bài kiểm tra Toán học cơ bản",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("Canvas created:", data));
```

### Tạo phiên thi

```javascript
fetch("/api/sessions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Lớp Toán 10A",
    canva_id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log("Session created, join code:", data.code));
```

### Tham gia phiên thi

```javascript
fetch("/api/sessions/join", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: "ABC123" }),
})
  .then((response) => response.json())
  .then((data) => console.log("Joined session:", data));
```

## Yêu cầu kỹ thuật

- Giao thức: HTTP/HTTPS
- Định dạng dữ liệu: JSON
- Base URL: `/api`
