# Clone Kaboot API Documentation

Đây là tài liệu API cho ứng dụng Clone Kaboot, một nền tảng tạo và tham gia các bài kiểm tra trực tuyến tương tác.

- [Tổng quan](#tổng-quan)
- [Canvas API](#canvas-api) - Quản lý các bài kiểm tra
- [Question API](#question-api) - Quản lý câu hỏi
- [Session API](#session-api) - Quản lý phiên kiểm tra
- [Player API](#player-api) - Quản lý người tham gia
- [Dashboard API](#dashboard-api) - Thống kê và báo cáo

## Tổng quan

Tất cả các API sử dụng định dạng JSON cho dữ liệu request và response.

**Base URL:** `/api`

**Mã trạng thái HTTP:**

- `200 OK`: Yêu cầu thành công
- `201 Created`: Tạo mới thành công
- `400 Bad Request`: Yêu cầu không hợp lệ
- `404 Not Found`: Không tìm thấy tài nguyên
- `500 Internal Server Error`: Lỗi server

---

## Canvas API

### Lấy tất cả Canvas

**Endpoint:** `GET /canvas`  
**Description:** Lấy danh sách tất cả các bài kiểm tra.

**Response:**

```json
[
  {
    "id": 1,
    "title": "Kiến thức Lập trình cơ bản",
    "category": "Technology",
    "description": "Kiểm tra kiến thức về các khái niệm lập trình cơ bản",
    "lastModified": "2023-08-15T10:30:00",
    "created": "2023-08-10T14:22:00",
    "questions": 5,
    "timesPlayed": 2,
    "totalParticipants": 9,
    "stats": {
      "timesPlayed": 2,
      "totalParticipants": 9,
      "avgScore": 72.5,
      "completionRate": 88.9,
      "difficultyRating": "Medium"
    }
  }
  // ...
]
```

### Lấy Canvas theo ID

**Endpoint:** `GET /canvas/:id`  
**Description:** Lấy thông tin chi tiết của một bài kiểm tra theo ID.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của canvas | Có |

**Response:**

```json
{
  "id": 1,
  "title": "Kiến thức Lập trình cơ bản",
  "category": "Technology",
  "description": "Kiểm tra kiến thức về các khái niệm lập trình cơ bản",
  "lastModified": "2023-08-15T10:30:00",
  "created": "2023-08-10T14:22:00",
  "questions": 5,
  "timesPlayed": 2,
  "totalParticipants": 9,
  "stats": {
    "timesPlayed": 2,
    "totalParticipants": 9,
    "avgScore": 72.5,
    "completionRate": 88.9,
    "difficultyRating": "Medium"
  }
}
```

### Lấy chi tiết Canvas

**Endpoint:** `GET /canvas/:id/detail`  
**Description:** Lấy thông tin chi tiết của một bài kiểm tra bao gồm cả câu hỏi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của canvas | Có |

**Response:**

```json
{
  "id": 1,
  "title": "Kiến thức Lập trình cơ bản",
  "category": "Technology",
  "description": "Kiểm tra kiến thức về các khái niệm lập trình cơ bản",
  "lastModified": "2023-08-15T10:30:00",
  "created": "2023-08-10T14:22:00",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Đâu là kiểu dữ liệu cơ bản trong hầu hết các ngôn ngữ lập trình?",
      "timeLimit": 20,
      "points": 10,
      "options": [
        {
          "id": 1,
          "text": "Integer",
          "isCorrect": true
        },
        {
          "id": 2,
          "text": "Browser",
          "isCorrect": false
        },
        {
          "id": 3,
          "text": "String",
          "isCorrect": true
        },
        {
          "id": 4,
          "text": "Monitor",
          "isCorrect": false
        }
      ]
    }
    // ...
  ],
  "stats": {
    "timesPlayed": 2,
    "totalParticipants": 9,
    "avgScore": 72.5,
    "completionRate": 88.9,
    "difficultyRating": "Medium"
  }
}
```

### Tạo Canvas mới

**Endpoint:** `POST /canvas`  
**Description:** Tạo một bài kiểm tra mới.

**Request:**

```json
{
  "title": "Bài kiểm tra Toán học",
  "category": "Mathematics",
  "description": "Kiểm tra kiến thức Toán học cơ bản cho học sinh lớp 10"
}
```

**Response:**

```json
{
  "id": 6,
  "message": "Canvas created successfully"
}
```

### Cập nhật Canvas

**Endpoint:** `PUT /canvas/:id`  
**Description:** Cập nhật thông tin của một bài kiểm tra.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của canvas | Có |

**Request:**

```json
{
  "title": "Bài kiểm tra Toán học nâng cao",
  "category": "Mathematics",
  "description": "Kiểm tra kiến thức Toán học nâng cao cho học sinh lớp 10"
}
```

**Response:**

```json
{
  "message": "Canvas updated successfully"
}
```

### Xóa Canvas

**Endpoint:** `DELETE /canvas/:id`  
**Description:** Xóa một bài kiểm tra.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của canvas | Có |

**Response:**

```json
{
  "message": "Canvas deleted successfully"
}
```

---

## Question API

### Lấy câu hỏi theo ID

**Endpoint:** `GET /questions/:id`  
**Description:** Lấy thông tin chi tiết của một câu hỏi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của câu hỏi | Có |

**Response:**

```json
{
  "id": 1,
  "type": "multiple_choice",
  "question": "Đâu là kiểu dữ liệu cơ bản trong hầu hết các ngôn ngữ lập trình?",
  "points": 10,
  "timeLimit": 20,
  "canva_id": 1,
  "options": [
    {
      "id": 1,
      "text": "Integer",
      "isCorrect": true
    },
    {
      "id": 2,
      "text": "Browser",
      "isCorrect": false
    },
    {
      "id": 3,
      "text": "String",
      "isCorrect": true
    },
    {
      "id": 4,
      "text": "Monitor",
      "isCorrect": false
    }
  ]
}
```

### Tạo câu hỏi mới

**Endpoint:** `POST /questions`  
**Description:** Tạo một câu hỏi mới.

**Request:**

```json
{
  "canva_id": 1,
  "type": "multiple_choice",
  "question": "Ngôn ngữ lập trình nào được sử dụng phổ biến nhất trong phát triển web?",
  "points": 15,
  "timeLimit": 30,
  "options": [
    {
      "text": "JavaScript",
      "isCorrect": true
    },
    {
      "text": "Assembly",
      "isCorrect": false
    },
    {
      "text": "HTML",
      "isCorrect": false
    },
    {
      "text": "Python",
      "isCorrect": false
    }
  ]
}
```

**Response:**

```json
{
  "id": 26,
  "message": "Question created successfully"
}
```

### Cập nhật câu hỏi

**Endpoint:** `PUT /questions/:id`  
**Description:** Cập nhật thông tin của một câu hỏi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của câu hỏi | Có |

**Request:**

```json
{
  "type": "multiple_choice",
  "question": "Ngôn ngữ lập trình nào được sử dụng phổ biến nhất trong phát triển web frontend?",
  "points": 20,
  "timeLimit": 25,
  "options": [
    {
      "text": "JavaScript",
      "isCorrect": true
    },
    {
      "text": "Java",
      "isCorrect": false
    },
    {
      "text": "TypeScript",
      "isCorrect": true
    },
    {
      "text": "Python",
      "isCorrect": false
    }
  ]
}
```

**Response:**

```json
{
  "message": "Question updated successfully"
}
```

### Xóa câu hỏi

**Endpoint:** `DELETE /questions/:id`  
**Description:** Xóa một câu hỏi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của câu hỏi | Có |

**Response:**

```json
{
  "message": "Question deleted successfully"
}
```

---

## Session API

### Lấy tất cả Session

**Endpoint:** `GET /sessions`  
**Description:** Lấy danh sách tất cả các phiên kiểm tra.

**Response:**

```json
[
  {
    "id": 1,
    "name": "IT Class Monday",
    "created": "2023-09-18T09:00:00",
    "code_join": "ABC123",
    "quiz": "Kiến thức Lập trình cơ bản",
    "participants": 5
  }
  // ...
]
```

### Lấy tất cả phiên thi public

**Endpoint:** `GET /sessions/public`  
**Description:** Lấy danh sách tất cả các phiên thi public.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Phiên public - Lập trình cơ bản",
    "created": "2023-09-18T09:00:00",
    "code_join": "ABC123",
    "is_public": true,
    "quiz": "Kiến thức Lập trình cơ bản",
    "participants": 5
  }
  // ...
]
```

### Lấy phiên thi public theo Canvas ID

**Endpoint:** `GET /sessions/public/canvas/:canvasId`  
**Description:** Lấy phiên thi public của một bài kiểm tra cụ thể.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| canvasId | Path | ID của canvas | Có |

**Response:**

```json
{
  "id": 1,
  "name": "Phiên public - Lập trình cơ bản",
  "created": "2023-09-18T09:00:00",
  "code_join": "ABC123",
  "canva_id": 1,
  "is_public": true,
  "quiz": "Kiến thức Lập trình cơ bản"
}
```

### Lấy Session theo ID

**Endpoint:** `GET /sessions/:id`  
**Description:** Lấy thông tin chi tiết của một phiên kiểm tra.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của session | Có |

**Response:**

```json
{
  "id": 1,
  "name": "IT Class Monday",
  "created": "2023-09-18T09:00:00",
  "code_join": "ABC123",
  "canva_id": 1,
  "quiz": "Kiến thức Lập trình cơ bản"
}
```

### Lấy chi tiết Session

**Endpoint:** `GET /sessions/:id/detail`  
**Description:** Lấy thông tin chi tiết của một phiên kiểm tra bao gồm cả người tham gia và thống kê câu hỏi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của session | Có |

**Response:**

```json
{
  "id": 1,
  "name": "IT Class Monday",
  "quiz": "Kiến thức Lập trình cơ bản",
  "created": "2023-09-18T09:00:00",
  "code_join": "ABC123",
  "participants": [
    {
      "id": 1,
      "name": "Nguyễn Văn An",
      "sdt": "0901234567",
      "email": "an.nguyen@gmail.com",
      "score": 80,
      "correctAnswers": 4,
      "incorrectAnswers": 1,
      "averageResponseTime": 18.6,
      "sessionName": "IT Class Monday",
      "quizName": "Kiến thức Lập trình cơ bản",
      "date": "2023-09-18T09:00:00",
      "totalQuestions": 5,
      "rank": 1,
      "checkIn": "2023-09-18T09:05:00",
      "checkOut": "2023-09-18T09:35:00"
    }
    // ...
  ],
  "questions": [
    {
      "id": 1,
      "question": "Đâu là kiểu dữ liệu cơ bản trong hầu hết các ngôn ngữ lập trình?",
      "correctPercentage": 60,
      "avgResponseTime": 12.4,
      "distribution": [
        {
          "answer": "Integer",
          "count": 3,
          "isCorrect": true
        },
        {
          "answer": "Browser",
          "count": 1,
          "isCorrect": false
        },
        {
          "answer": "String",
          "count": 1,
          "isCorrect": true
        },
        {
          "answer": "Monitor",
          "count": 0,
          "isCorrect": false
        }
      ]
    }
    // ...
  ],
  "stats": {
    "avgScore": 68.2,
    "avgTimePerQuestion": 18.3,
    "totalParticipants": 5,
    "completionRate": 100
  }
}
```

### Tạo Session mới

**Endpoint:** `POST /sessions`  
**Description:** Tạo một phiên kiểm tra mới (có thể là public hoặc không).

**Request:**

```json
{
  "name": "Lớp Tiếng Anh Thứ 5",
  "canva_id": 5,
  "is_public": true // Optional, default là false
}
```

**Response:**

```json
{
  "id": 8,
  "code": "XYZ789",
  "message": "Session created successfully"
}
```

**Lỗi:**

- `400 Bad Request` - Nếu canvas đã có phiên thi public

### Tham gia Session

**Endpoint:** `POST /sessions/join`  
**Description:** Tham gia một phiên kiểm tra bằng mã tham gia, đồng thời tạo tài khoản người chơi.

**Request:**

```json
{
  "code": "ABC123",
  "playerName": "Nguyễn Văn A",
  "playerPhone": "0912345678",
  "playerEmail": "nguyen.van.a@example.com"
}
```

**Response:**

```json
{
  "session_id": 1,
  "player_id": 29,
  "name": "IT Class Monday",
  "quiz": "Kiến thức Lập trình cơ bản",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Đâu là kiểu dữ liệu cơ bản trong hầu hết các ngôn ngữ lập trình?",
      "timeLimit": 20,
      "points": 10,
      "options": [
        {
          "id": 1,
          "text": "Integer",
          "isCorrect": true
        }
        // ...other options
      ]
    }
    // ...other questions
  ]
}
```

---

## Player API

### Đăng ký người chơi

**Endpoint:** `POST /players/register`  
**Description:** Đăng ký người chơi mới cho một phiên kiểm tra.

**Request:**

```json
{
  "name": "Đỗ Thị Hương",
  "sdt": "0912345678",
  "email": "huong.do@gmail.com",
  "session_id": 1
}
```

**Response:**

```json
{
  "id": 29,
  "message": "Player registered successfully"
}
```

### Lấy chi tiết người chơi

**Endpoint:** `GET /players/:id`  
**Description:** Lấy thông tin chi tiết của một người chơi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của người chơi | Có |

**Response:**

```json
{
  "id": 1,
  "name": "Nguyễn Văn An",
  "sdt": "0901234567",
  "email": "an.nguyen@gmail.com",
  "score": 80,
  "correctAnswers": 4,
  "incorrectAnswers": 1,
  "averageResponseTime": 18.6,
  "sessionName": "IT Class Monday",
  "quizName": "Kiến thức Lập trình cơ bản",
  "date": "2023-09-18T09:00:00",
  "totalQuestions": 5,
  "rank": 1,
  "checkIn": "2023-09-18T09:05:00",
  "checkOut": "2023-09-18T09:35:00",
  "answers": [
    {
      "questionId": 1,
      "questionText": "Đâu là kiểu dữ liệu cơ bản trong hầu hết các ngôn ngữ lập trình?",
      "correctAnswer": "Integer",
      "participantAnswer": "Integer",
      "isCorrect": true,
      "responseTime": 12,
      "points": 10
    }
    // ...
  ]
}
```

### Gửi câu trả lời

**Endpoint:** `POST /players/answer`  
**Description:** Gửi câu trả lời cho một câu hỏi.

**Request:**

```json
{
  "player_id": 1,
  "question_id": 3,
  "option_id": 9,
  "responseTime": 12
}
```

**Response:**

```json
{
  "id": 56,
  "message": "Answer submitted successfully"
}
```

### Gửi tất cả câu trả lời cùng lúc

**Endpoint:** `POST /players/submit-all`  
**Description:** Gửi tất cả câu trả lời của người chơi cùng một lúc khi kết thúc bài thi.

**Request:**

```json
{
  "player_id": 1,
  "answers": [
    {
      "question_id": 1,
      "option_id": 3,
      "responseTime": 15
    },
    {
      "question_id": 2,
      "option_id": 7,
      "responseTime": 22
    }
    // ...other answers
  ]
}
```

**Response:**

```json
{
  "message": "All answers submitted successfully",
  "answersProcessed": 5,
  "score": 80,
  "correctAnswers": 4,
  "incorrectAnswers": 1
}
```

### Kết thúc phần thi

**Endpoint:** `POST /players/:id/checkout`  
**Description:** Đánh dấu người chơi đã kết thúc phần thi.

**Parameters:**
| Tên | Vị trí | Mô tả | Bắt buộc |
|-----|--------|-------|----------|
| id | Path | ID của người chơi | Có |

**Response:**

```json
{
  "message": "Player checked out successfully"
}
```

---

## Dashboard API

### Lấy thống kê Dashboard

**Endpoint:** `GET /dashboard/stats`  
**Description:** Lấy thống kê tổng hợp cho dashboard.

**Response:**

```json
{
  "quicks": 5,
  "participants": 28,
  "conducted": 7,
  "play_time": 480,
  "reports": 7
}
```

### Lấy hoạt động gần đây

**Endpoint:** `GET /dashboard/activities`  
**Description:** Lấy danh sách các hoạt động gần đây.

**Query Parameters:**
| Tên | Mô tả | Mặc định |
|-----|-------|----------|
| limit | Số lượng hoạt động tối đa | 20 |

**Response:**

```json
[
  {
    "id": 7,
    "type": "session",
    "title": "Vietnam Geography Review",
    "date": "2023-09-29T14:30:00",
    "participants": 3
  },
  {
    "id": 6,
    "type": "session",
    "title": "Programming Basics",
    "date": "2023-09-28T13:00:00",
    "participants": 4
  },
  {
    "id": 5,
    "type": "canvas",
    "title": "Tiếng Anh cho người mới bắt đầu",
    "date": "2023-09-15T09:30:00",
    "action": "updated"
  }
  // ...
]
```

## Authentication API

### Kiểm tra Token

**Endpoint:** `POST /auth/check-token`  
**Description:** Kiểm tra xem một token có hợp lệ hay không.

**Request:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "valid": true
}
```

hoặc

```json
{
  "valid": false
}
```

### Xác Minh Token và Lấy Thông Tin Người Dùng

**Endpoint:** `GET /auth/verify`  
**Description:** Xác minh token và trả về thông tin người dùng.

**Headers:**
| Tên | Mô tả | Bắt buộc |
|-----|-------|----------|
| Authorization | Bearer token | Có |

**Response:**

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

## Yêu Cầu Xác Thực

Một số API endpoint yêu cầu xác thực. Để gọi các endpoint này, bạn cần thêm header `Authorization` vào request:
