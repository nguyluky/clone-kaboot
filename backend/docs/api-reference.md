# Clone Kaboot API Reference

Tài liệu tham khảo chi tiết về các API của hệ thống Clone Kaboot.

## Types and Structures

### Canvas Object

```typescript
{
  id: number;
  title: string;
  category: string;
  description: string;
  lastModified: Date;
  created: Date;
  questions: number;
  stats: {
    timesPlayed: number;
    totalParticipants: number;
    avgScore: number;
    completionRate: number;
    difficultyRating: "Medium" | "Hard" | "EZ";
  }
}
```

### Question Object

```typescript
{
  id: number;
  type: "multiple_choice" | "single_choice" | "text";
  question: string;
  timeLimit: number;
  points: number;
  options?: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
}
```

### Session Object

```typescript
{
  id: number;
  name: string;
  created: Date;
  code_join: string;
  is_public: boolean;
  quiz: string;
  participants: number;
}
```

### Player Object

```typescript
{
  id: number;
  name: string;
  sdt: string;
  email: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  sessionName: string;
  quizName: string;
  date: Date;
  totalQuestions: number;
  rank: number;
  checkIn: Date;
  checkOut: Date;
}
```

## Canvas API

### GET /api/canvas

Lấy tất cả các bài kiểm tra.

```http
GET /api/canvas
```

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
]
```

### GET /api/canvas/:id

Lấy thông tin chi tiết của một bài kiểm tra.

```http
GET /api/canvas/1
```

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

### GET /api/canvas/:id/detail

Lấy thông tin chi tiết của một bài kiểm tra bao gồm cả câu hỏi.

```http
GET /api/canvas/1/detail
```

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
        }
        // ...
      ]
    }
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

### POST /api/canvas

Tạo một bài kiểm tra mới.

```http
POST /api/canvas
Content-Type: application/json

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

### PUT /api/canvas/:id

Cập nhật thông tin của một bài kiểm tra.

```http
PUT /api/canvas/1
Content-Type: application/json

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

### DELETE /api/canvas/:id

Xóa một bài kiểm tra.

```http
DELETE /api/canvas/1
```

**Response:**

```json
{
  "message": "Canvas deleted successfully"
}
```

## Question API

### GET /api/questions/:id

Lấy thông tin chi tiết của một câu hỏi.

```http
GET /api/questions/1
```

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
    }
    // ...
  ]
}
```

### POST /api/questions

Tạo một câu hỏi mới.

```http
POST /api/questions
Content-Type: application/json

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

### PUT /api/questions/:id

Cập nhật thông tin của một câu hỏi.

```http
PUT /api/questions/1
Content-Type: application/json

{
  "question": "Ngôn ngữ lập trình nào được sử dụng phổ biến nhất trong phát triển web frontend?",
  "points": 20,
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

### DELETE /api/questions/:id

Xóa một câu hỏi.

```http
DELETE /api/questions/1
```

**Response:**

```json
{
  "message": "Question deleted successfully"
}
```

## Session API

### GET /api/sessions

Lấy danh sách tất cả các phiên kiểm tra.

```http
GET /api/sessions
```

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
]
```

### GET /api/sessions/:id

Lấy thông tin chi tiết của một phiên kiểm tra.

```http
GET /api/sessions/1
```

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

### GET /api/sessions/:id/detail

Lấy thông tin chi tiết của một phiên kiểm tra bao gồm cả người tham gia và thống kê câu hỏi.

```http
GET /api/sessions/1/detail
```

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
        }
        // ...
      ]
    }
  ],
  "stats": {
    "avgScore": 68.2,
    "avgTimePerQuestion": 18.3,
    "totalParticipants": 5,
    "completionRate": 100
  }
}
```

### GET /api/sessions/public

Lấy danh sách tất cả các phiên thi public.

```http
GET /api/sessions/public
```

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
]
```

### GET /api/sessions/public/canvas/:canvasId

Lấy phiên thi public của một canvas cụ thể.

```http
GET /api/sessions/public/canvas/1
```

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

### POST /api/sessions

Tạo một phiên kiểm tra mới (có thể là public hoặc không).

```http
POST /api/sessions
Content-Type: application/json

{
  "name": "Phiên public - Lập trình cơ bản",
  "canva_id": 1,
  "is_public": true
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

### POST /api/sessions/join

Tham gia một phiên kiểm tra bằng mã tham gia.

```http
POST /api/sessions/join
Content-Type: application/json

{
  "code": "ABC123"
}
```

**Response:**

```json
{
  "session_id": 1,
  "name": "IT Class Monday",
  "quiz": "Kiến thức Lập trình cơ bản"
}
```

### POST /api/sessions/join

Tham gia một phiên kiểm tra bằng mã tham gia và tạo tài khoản người chơi.

```http
POST /api/sessions/join
Content-Type: application/json

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
    // ...array of questions
  ]
}
```

## Player API

### POST /api/players/register

Đăng ký người chơi mới cho một phiên kiểm tra.

```http
POST /api/players/register
Content-Type: application/json

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

### GET /api/players/:id

Lấy thông tin chi tiết của một người chơi.

```http
GET /api/players/1
```

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
  ]
}
```

### POST /api/players/answer

Gửi câu trả lời cho một câu hỏi.

```http
POST /api/players/answer
Content-Type: application/json

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

### POST /api/players/:id/checkout

Đánh dấu người chơi đã kết thúc phần thi.

```http
POST /api/players/1/checkout
```

**Response:**

```json
{
  "message": "Player checked out successfully"
}
```

## Dashboard API

### GET /api/dashboard/stats

Lấy thống kê tổng hợp cho dashboard.

```http
GET /api/dashboard/stats
```

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

### GET /api/dashboard/activities

Lấy danh sách các hoạt động gần đây.

```http
GET /api/dashboard/activities?limit=5
```

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
  },
  {
    "id": 4,
    "type": "canvas",
    "title": "Lịch sử Thế giới - Thế kỷ 20",
    "date": "2023-09-10T11:45:00",
    "action": "updated"
  },
  {
    "id": 3,
    "type": "canvas",
    "title": "Văn hóa Ẩm thực Việt Nam",
    "date": "2023-09-05T16:20:00",
    "action": "created"
  }
]
```

## Authentication API

### POST /api/auth/check-token

Kiểm tra xem một token có hợp lệ hay không.

```http
POST /api/auth/check-token
Content-Type: application/json

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

### GET /api/auth/verify

Xác minh token và lấy thông tin người dùng.

```http
GET /api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

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
