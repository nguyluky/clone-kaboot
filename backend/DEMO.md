# Clone Kaboot Backend Demo Guide

## 1. Tổng quan hệ thống

Hệ thống Clone Kaboot là phiên bản clone của Kahoot - nền tảng học tập tương tác phổ biến. Backend được xây dựng trên Node.js với Express và sử dụng MySQL làm cơ sở dữ liệu.

### Kiến trúc hệ thống

- **MVC Pattern**: Hệ thống được thiết kế theo mô hình Model-View-Controller
- **RESTful API**: Giao diện API tuân thủ nguyên tắc RESTful
- **JWT Authentication**: Xác thực người dùng bằng JSON Web Token
- **Testing**: Unit tests và Integration tests với Jest

## 2. Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js (>= 14.x)
- MySQL (>= 5.7)

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd kahoot-clone/backend

# Cài đặt dependencies
npm install

# Khởi tạo cơ sở dữ liệu
npm run init-db
```

### Chạy ứng dụng

```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start

# Chạy tests
npm test
```

## 3. Tính năng chính

### 1. Quản lý Canvas (Bộ đề)

- Tạo, cập nhật, xóa bộ đề
- Thêm câu hỏi và câu trả lời vào bộ đề
- Thống kê và phân tích bộ đề

### 2. Quản lý Session (Phiên thi)

- Tạo phiên thi từ bộ đề có sẵn
- Tạo phiên thi public/private
- Tham gia phiên thi bằng mã code
- Xem thống kê kết quả phiên thi

### 3. Quản lý Player (Người chơi)

- Đăng ký tham gia phiên thi
- Gửi câu trả lời
- Xem kết quả cá nhân

### 4. Dashboard

- Thống kê tổng quan hệ thống
- Theo dõi hoạt động gần đây
- Báo cáo kết quả

## 4. Demo luồng sử dụng

### Tạo bộ đề và phiên thi

1. **Tạo Canvas (bộ đề) mới**

```javascript
// Request
POST /api/canvas
{
  "title": "Kiến thức Lập trình cơ bản",
  "category": "Technology",
  "description": "Kiểm tra kiến thức về các khái niệm lập trình cơ bản"
}

// Response
{
  "id": 1,
  "message": "Canvas created successfully"
}
```

2. **Thêm câu hỏi vào Canvas**

```javascript
// Request
POST /api/questions
{
  "canva_id": 1,
  "type": "multiple_choice",
  "question": "JavaScript là ngôn ngữ lập trình hướng đối tượng?",
  "points": 10,
  "timeLimit": 20,
  "options": [
    { "text": "Đúng", "isCorrect": true },
    { "text": "Sai", "isCorrect": false }
  ]
}

// Response
{
  "id": 1,
  "message": "Question created successfully"
}
```

3. **Tạo phiên thi từ Canvas**

```javascript
// Request
POST /api/sessions
{
  "name": "Lớp IT01 - Buổi 1",
  "canva_id": 1
}

// Response
{
  "id": 1,
  "code": "ABC123",
  "message": "Session created successfully"
}
```

### Học sinh tham gia phiên thi

1. **Tham gia phiên thi và đăng ký thông tin**

```javascript
// Request
POST /api/sessions/join
{
  "code": "ABC123",
  "playerName": "Nguyễn Văn A",
  "playerPhone": "0123456789",
  "playerEmail": "a@example.com"
}

// Response
{
  "session_id": 1,
  "player_id": 1,
  "name": "Lớp IT01 - Buổi 1",
  "quiz": "Kiến thức Lập trình cơ bản",
  "questions": [...]
}
```

2. **Gửi câu trả lời**

```javascript
// Request
POST /api/players/answer
{
  "player_id": 1,
  "question_id": 1,
  "option_id": 1,
  "responseTime": 8
}

// Response
{
  "id": 1,
  "message": "Answer submitted successfully"
}
```

3. **Hoàn thành bài thi**

```javascript
// Request
POST /api/players/1/checkout

// Response
{
  "message": "Player checked out successfully"
}
```

### Xem kết quả

1. **Xem kết quả chi tiết của phiên thi**

```javascript
// Request
GET /api/sessions/1/detail

// Response
{
  "id": 1,
  "name": "Lớp IT01 - Buổi 1",
  "quiz": "Kiến thức Lập trình cơ bản",
  "participants": [...],
  "questions": [...],
  "stats": {...}
}
```

2. **Xem kết quả chi tiết của một người chơi**

```javascript
// Request
GET /api/players/1

// Response
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "score": 80,
  "correctAnswers": 4,
  "incorrectAnswers": 1,
  ...
}
```

## 5. API Documentation

Chi tiết API có thể xem tại:

- [API Reference](./docs/api-reference.md)
- [API Examples](./docs/examples.md)

## 6. Database Schema
