import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"

/**
 * @type {
 * PORT: int
 * }
 */
const {
    PORT
} = process.env;


const app = express()

app.use(express.json())
app.use(cookieParser())


// /api/session/:sessionID/ => lấy thông tin phiên làm việc
// /api/session/:sessionID/leaderboard => lấy thông tin bảng xếp hạng

// chỉ dùng được khi trạng tháy là bắt đầb
// /api/session/:sessionID/cau_hoi => gửi một câu hỏi một cách ngẫu nhiên trả về đúng hoặc sai
// /api/session/:sessionID/tra_loi => trả lời câu hỏi


app.listen(PORT, (err) => {
    console.log('server is runing at port ' + PORT);
})