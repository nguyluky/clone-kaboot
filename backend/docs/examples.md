# Clone Kaboot API Usage Examples

Tài liệu này cung cấp các ví dụ cụ thể về cách sử dụng API của Clone Kaboot trong các tình huống thực tế.

## Luồng sử dụng cơ bản

### 1. Tạo bài kiểm tra và câu hỏi

#### Tạo một bài kiểm tra mới

```javascript
// Tạo canvas mới
fetch("/api/canvas", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Kiểm tra Hóa học lớp 10",
    category: "Chemistry",
    description: "Bài kiểm tra về kiến thức Hóa học cơ bản cho học sinh lớp 10",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Canvas ID:", data.id);

    // Sử dụng canvas_id để thêm câu hỏi
    const canvasId = data.id;

    // Thêm câu hỏi trắc nghiệm
    return fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        canva_id: canvasId,
        type: "multiple_choice",
        question: "Chọn những nguyên tố thuộc nhóm kim loại kiềm?",
        points: 10,
        timeLimit: 30,
        options: [
          { text: "Natri (Na)", isCorrect: true },
          { text: "Canxi (Ca)", isCorrect: false },
          { text: "Kali (K)", isCorrect: true },
          { text: "Clo (Cl)", isCorrect: false },
        ],
      }),
    });
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Question added:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 2. Tạo và quản lý phiên kiểm tra

#### Tạo một phiên kiểm tra mới

```javascript
// Tạo phiên kiểm tra từ canvas đã có
fetch("/api/sessions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Lớp Hóa học 10A1 - 20/10/2023",
    canva_id: 1, // ID của canvas đã tạo trước đó
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Session created:", data);
    console.log("Join Code:", data.code);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### Tạo phiên thi public

```javascript
// Tạo phiên thi public từ canvas đã có
fetch("/api/sessions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Phiên public - Lập trình cơ bản",
    canva_id: 1, // ID của canvas đã tạo trước đó
    is_public: true,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Public session created:", data);
    console.log("Join Code:", data.code);
  })
  .catch((error) => {
    // Kiểm tra nếu lỗi là do canvas đã có phiên public
    if (error.response && error.response.status === 400) {
      console.error("Canvas này đã có phiên thi public");
    } else {
      console.error("Error:", error);
    }
  });
```

### Lấy danh sách phiên thi public

```javascript
// Lấy tất cả phiên thi public
fetch("/api/sessions/public")
  .then((response) => response.json())
  .then((publicSessions) => {
    console.log("Public sessions:", publicSessions);

    // Hiển thị danh sách phiên public
    const publicSessionsList = document.getElementById("public-sessions-list");
    publicSessionsList.innerHTML = "";

    publicSessions.forEach((session) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <strong>${session.quiz}</strong> - ${session.name}<br>
      Mã tham gia: ${session.code_join} | Người tham gia: ${session.participants}
      <button onclick="joinSession('${session.code_join}')">Tham gia ngay</button>
    `;
      publicSessionsList.appendChild(li);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Hàm tham gia phiên thi
function joinSession(code) {
  // ...implement join logic...
}
```

### 3. Học sinh tham gia phiên thi

#### Tham gia phiên thi bằng mã

```javascript
// Tham gia phiên thi bằng mã
fetch("/api/sessions/join", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    code: "ABC123", // Mã phiên thi
  }),
})
  .then((response) => response.json())
  .then((session) => {
    console.log("Joined session:", session);

    // Đăng ký thông tin người chơi
    return fetch("/api/players/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Nguyễn Thị Hoa",
        sdt: "0912345678",
        email: "hoa.nguyen@gmail.com",
        session_id: session.session_id,
      }),
    });
  })
  .then((response) => response.json())
  .then((player) => {
    console.log("Player registered:", player);

    // Lưu player ID để sử dụng cho các câu trả lời
    localStorage.setItem("player_id", player.id);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

#### Tham gia phiên thi bằng mã (Luồng mới)

```javascript
// Tham gia phiên thi bằng mã và đăng ký người chơi trong một bước
fetch("/api/sessions/join", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    code: "ABC123", // Mã phiên thi
    playerName: "Nguyễn Thị Hoa",
    playerPhone: "0912345678",
    playerEmail: "hoa.nguyen@gmail.com",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Joined session:", data);
    console.log("Player ID:", data.player_id);
    console.log("Session ID:", data.session_id);
    console.log("Questions:", data.questions);

    // Lưu player ID và session ID để sử dụng cho các câu trả lời
    localStorage.setItem("player_id", data.player_id);
    localStorage.setItem("session_id", data.session_id);

    // Tiếp tục với việc hiển thị câu hỏi
    startQuiz(data.questions);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 4. Trả lời câu hỏi

```javascript
// Gửi câu trả lời
const playerId = localStorage.getItem("player_id");

fetch("/api/players/answer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    player_id: playerId,
    question_id: 1, // ID của câu hỏi
    option_id: 3, // ID của đáp án được chọn
    responseTime: 15, // Thời gian trả lời (giây)
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Answer submitted:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 5. Kết thúc phiên thi

```javascript
// Đánh dấu kết thúc phiên thi cho người chơi
const playerId = localStorage.getItem("player_id");

fetch(`/api/players/${playerId}/checkout`, {
  method: "POST",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Player checked out:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 6. Xem kết quả và thống kê

```javascript
// Lấy chi tiết phiên thi
fetch("/api/sessions/1/detail")
  .then((response) => response.json())
  .then((sessionDetail) => {
    console.log("Session details:", sessionDetail);

    // Hiển thị thống kê tổng quan
    displayOverallStats(sessionDetail.stats);

    // Hiển thị danh sách người chơi và kết quả
    displayParticipants(sessionDetail.participants);

    // Hiển thị thống kê câu hỏi
    displayQuestionStats(sessionDetail.questions);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Lấy chi tiết kết quả của một người chơi
fetch("/api/players/1")
  .then((response) => response.json())
  .then((playerDetail) => {
    console.log("Player details:", playerDetail);

    // Hiển thị kết quả chi tiết
    displayPlayerResults(playerDetail);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## Các kịch bản sử dụng nâng cao

### Sửa câu hỏi trong bài kiểm tra

```javascript
// Cập nhật một câu hỏi đã tồn tại
fetch("/api/questions/5", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question: "Đâu là đơn vị cơ bản đo nhiệt độ trong hệ SI?",
    points: 15,
    timeLimit: 25,
    options: [
      { text: "Kelvin (K)", isCorrect: true },
      { text: "Độ Celsius (°C)", isCorrect: false },
      { text: "Độ Fahrenheit (°F)", isCorrect: false },
      { text: "Joule (J)", isCorrect: false },
    ],
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Question updated:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### Thống kê Dashboard

```javascript
// Lấy thống kê tổng quan cho dashboard
fetch("/api/dashboard/stats")
  .then((response) => response.json())
  .then((stats) => {
    console.log("Dashboard stats:", stats);

    // Hiển thị thống kê tổng quan
    document.getElementById("total-quizzes").textContent = stats.quicks;
    document.getElementById("total-participants").textContent =
      stats.participants;
    document.getElementById("total-sessions").textContent = stats.conducted;
    document.getElementById("total-play-time").textContent = formatMinutes(
      stats.play_time
    );
    document.getElementById("total-reports").textContent = stats.reports;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Lấy các hoạt động gần đây
fetch("/api/dashboard/activities?limit=10")
  .then((response) => response.json())
  .then((activities) => {
    console.log("Recent activities:", activities);

    // Hiển thị danh sách hoạt động
    const activityList = document.getElementById("activity-list");
    activityList.innerHTML = "";

    activities.forEach((activity) => {
      const li = document.createElement("li");

      if (activity.type === "session") {
        li.textContent = `Phiên "${activity.title}" với ${
          activity.participants
        } người tham gia vào ${formatDate(activity.date)}`;
      } else {
        li.textContent = `Bài kiểm tra "${activity.title}" được ${
          activity.action
        } vào ${formatDate(activity.date)}`;
      }

      activityList.appendChild(li);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Hàm hỗ trợ
function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} giờ ${mins} phút`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
```

### Simplified Quiz Flow

```javascript
// 1. Join session and get all questions
async function joinQuiz(code) {
  try {
    // Join the session and get all questions at once
    const sessionData = await fetch("/api/sessions/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).then((res) => res.json());

    // Register the player
    const playerData = {
      name: document.getElementById("player-name").value,
      sdt: document.getElementById("player-phone").value,
      email: document.getElementById("player-email").value,
      session_id: sessionData.session_id,
    };

    const player = await fetch("/api/players/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    }).then((res) => res.json());

    // Store player ID and questions
    localStorage.setItem("player_id", player.id);
    localStorage.setItem(
      "quiz_questions",
      JSON.stringify(sessionData.questions)
    );

    // Start the quiz
    startQuiz(sessionData.questions);
  } catch (error) {
    console.error("Error joining quiz:", error);
    alert("Failed to join quiz: " + error.message);
  }
}

// 2. Start quiz - client tracks timing and answers
function startQuiz(questions) {
  // Initialize tracking data
  const answers = [];
  let currentQuestionIndex = 0;

  // Display first question
  displayQuestion(questions[currentQuestionIndex]);

  // Function to display a question
  function displayQuestion(question) {
    const startTime = Date.now();

    // Clear previous question
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    // Show question
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    questionElement.innerHTML = `
      <h3>${question.question}</h3>
      <div class="timer">Time remaining: ${question.timeLimit} seconds</div>
    `;

    // Add options
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options";

    question.options.forEach((option) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = option.text;
      optionButton.addEventListener("click", () => {
        // Record answer and timing
        const responseTime = Math.round((Date.now() - startTime) / 1000);
        answers.push({
          question_id: question.id,
          option_id: option.id,
          responseTime: responseTime,
        });

        // Move to next question or finish
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          finishQuiz();
        }
      });

      optionsContainer.appendChild(optionButton);
    });

    questionElement.appendChild(optionsContainer);
    quizContainer.appendChild(questionElement);

    // Start countdown
    let timeLeft = question.timeLimit;
    const timerElement = questionElement.querySelector(".timer");

    const timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `Time remaining: ${timeLeft} seconds`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        // Auto-submit empty answer on timeout
        answers.push({
          question_id: question.id,
          option_id: null,
          responseTime: question.timeLimit,
        });

        // Move to next question or finish
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          displayQuestion(questions[currentQuestionIndex]);
        } else {
          finishQuiz();
        }
      }
    }, 1000);
  }

  // Function to finish quiz and submit all answers
  async function finishQuiz() {
    try {
      const playerId = localStorage.getItem("player_id");

      // Submit all answers at once
      const result = await fetch("/api/players/submit-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: playerId,
          answers: answers,
        }),
      }).then((res) => res.json());

      // Show results
      const quizContainer = document.getElementById("quiz-container");
      quizContainer.innerHTML = `
        <div class="quiz-results">
          <h2>Quiz Completed!</h2>
          <p>Your score: ${result.score.toFixed(1)}%</p>
          <p>Correct answers: ${result.correctAnswers}</p>
          <p>Incorrect answers: ${result.incorrectAnswers}</p>
          <button onclick="viewDetails(${playerId})">View Details</button>
        </div>
      `;
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz: " + error.message);
    }
  }
}

// 3. View detailed results
async function viewDetails(playerId) {
  try {
    const playerDetails = await fetch(`/api/players/${playerId}`).then((res) =>
      res.json()
    );

    // Display detailed results
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
      <div class="quiz-details">
        <h2>Detailed Results</h2>
        <p>Player: ${playerDetails.name}</p>
        <p>Score: ${playerDetails.score.toFixed(1)}%</p>
        <p>Rank: ${playerDetails.rank}</p>
        <h3>Answers:</h3>
        <ul class="answers-list">
          ${playerDetails.answers
            .map(
              (answer) => `
            <li>
              <p><strong>Question:</strong> ${answer.questionText}</p>
              <p><strong>Your answer:</strong> ${
                answer.participantAnswer || "No answer"
              }</p>
              <p><strong>Correct answer:</strong> ${answer.correctAnswer}</p>
              <p><strong>Time taken:</strong> ${answer.responseTime} seconds</p>
              <p class="${answer.isCorrect ? "correct" : "incorrect"}">
                ${answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </p>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  } catch (error) {
    console.error("Error getting player details:", error);
    alert("Failed to load details: " + error.message);
  }
}
```

## Sử dụng API với Xác Thực

### 1. Kiểm tra token

```javascript
// Kiểm tra xem token có hợp lệ không
fetch("/api/auth/check-token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Token từ hệ thống xác thực
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.valid) {
      console.log("Token hợp lệ");
      // Lưu token vào localStorage
      localStorage.setItem("auth_token", token);
    } else {
      console.log("Token không hợp lệ");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 2. Gọi API với xác thực

```javascript
// Gọi API yêu cầu xác thực
const token = localStorage.getItem("auth_token");

fetch("/api/dashboard/stats", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (response.status === 401 || response.status === 403) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Dashboard stats:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 3. Sử dụng API Service với xác thực

```javascript
// Sử dụng API service đã tích hợp xác thực
import api from "../services/api";

// Đăng nhập - Giả sử xác thực từ server bên ngoài
async function login(username, password) {
  try {
    // Gọi đến server xác thực bên ngoài
    const authResponse = await fetch("https://auth-server.example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const authData = await authResponse.json();

    if (authData.token) {
      // Lưu token
      api.auth.setToken(authData.token);

      // Kiểm tra token với hệ thống của chúng ta
      const isValid = await api.auth.verifyToken();

      if (isValid) {
        console.log("Đăng nhập thành công");
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

// Sử dụng các API được bảo vệ
async function getAdminDashboard() {
  try {
    // Kiểm tra có phải admin không
    if (!api.auth.isAdmin()) {
      throw new Error("Unauthorized - Requires admin role");
    }

    // Lấy dữ liệu dashboard
    const stats = await api.dashboard.getStats();
    const activities = await api.dashboard.getActivities(10);

    return { stats, activities };
  } catch (error) {
    console.error("Dashboard error:", error);

    // Nếu lỗi xác thực, chuyển về trang đăng nhập
    if (error.message.includes("401") || error.message.includes("403")) {
      window.location.href = "/login";
    }

    return null;
  }
}
```
