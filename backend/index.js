import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import AccountRoute from './src/route/AccountRoutes.js';
import CanvaRoute from './src/route/CanvaRoute.js';
import CauHoiRoute from './src/route/CauHoiRoute.js';
import SessionRoute from './src/route/SessionRoute.js';
import PlayerRoute from './src/route/PlayerRoute.js'; // Thêm route mới
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cookieParser());
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/accounts', AccountRoute);
app.use('/canva', CanvaRoute);
app.use('/cau_hoi', CauHoiRoute);
app.use('/session', SessionRoute);
app.use('/player', PlayerRoute); // Thêm route cho player

app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server is running at port ${port}`);
  }
});
