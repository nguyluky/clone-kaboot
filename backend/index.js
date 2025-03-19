import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
// import AccountRoute from './src/route/AccountRoutes.js';
import CanvaRoute from './src/route/CanvaRoute.js';
import CauHoiRoute from './src/route/CauHoiRoute.js';
import SessionRoute from './src/route/SessionRoute.js';
import PlayerRoute from './src/route/PlayerRoute.js'; // Thêm route mới
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ApiError } from './src/utils/error.js';
// import apiConfig from './src/config/apiConfig.js';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
// @ts-ignore
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// @ts-ignore
app.use(cookieParser());

// app.use('/accounts', AccountRoute);
app.use('/canva', CanvaRoute);
app.use('/cau_hoi', CauHoiRoute);
app.use('/session', SessionRoute);
app.use('/player', PlayerRoute); // Thêm route cho player

// Error handler
app.use((err, req, res, next) => {
  console.error(err)

  if (err?.code == "ER_BAD_NULL_ERROR") {
    res.status(400).send({ message: 'Bad request: ' + err.sqlMessage });
    return
  }
  else if (err instanceof ApiError) {
    res.status(err.status).send({ message: err.message });
    return;
  }
  else if (err?.code == "ER_DUP_ENTRY") {
    res.status(400).send({ message: 'Bad request: ' + err.sqlMessage });
    return;
  }

  res.status(500).send({ message: 'Internal server error: ' + String(err) });
})

app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server is running at port ${port}`);
  }
});
