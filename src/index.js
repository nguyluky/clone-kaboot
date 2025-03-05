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


app.listen(PORT, (err) => {
    console.log('server is runing at port ' + PORT);
})