import {
  findAll,
  findUserName,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../model/AccountModel.js';
import bcrypt from 'bcrypt';
import HTTP_STATUS from '../constants/httpStatus.js';
import jwtUtils from '../utils/auth.js'

class AccountController {
  async getAllAccounts(req, res) {
    try {
      const accounts = await findAll();
      res.status(HTTP_STATUS.OK).json(accounts);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async getAccountByUserName(req, res) {
    try {
      const { username } = req.params;
      const account = await findUserName(username);
      if (!account) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Account not found' });
      }
      res.status(HTTP_STATUS.OK).json(account);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async register(req, res) {
    try {
      const { username, password, email } = req.body;
      // Kiểm tra xem username đã tồn tại chưa
      const existingAccount = await findUserName(username);
      if (existingAccount) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const account = await createAccount({ username, password: hashedPassword, email });
      const token = jwtUtils.generateAccessToken({ username, email }); // Tạo token sau khi đăng ký

      // Lưu token vào cookie (tuỳ chọn, có thể gửi về client để tự quản lý)
      res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000 }); // 1 giờ
      res.status(HTTP_STATUS.CREATED).json({ message: 'Registration successful', account, token });
    } catch (err) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: String(err) });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const account = await findUserName(username);
      if (!account) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Account not found' });
      }

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });
      }

      const token = jwtUtils.generateAccessToken({ username, email: account.email });
      res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000 });
      res.status(HTTP_STATUS.OK).json({ message: 'Login successful', token });
    } catch (err) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: String(err) });
    }
  }

  async logout(req, res) {
    try {
      // Xóa cookie access_token
      res.clearCookie('access_token');
      res.status(HTTP_STATUS.OK).json({ message: 'Logout successful' });
    } catch (err) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: String(err) });
    }
  }

  async addAccount(req, res) {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const account = await createAccount({ username, password: hashedPassword, email });
      res.status(HTTP_STATUS.CREATED).json(account);
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async upDateAccount(req, res) {
    try {
      const { emailAccount } = req.params;
      const account = await findUserName(emailAccount);
      if (!account) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Email address not found' });
      }

      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await updateAccount(emailAccount, { username, password: hashedPassword });
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Update account success' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { username } = req.params;
      const account = await findUserName(username);
      if (!account) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Account not found' });
      }
      await deleteAccount(username);
      res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Delete account success' });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: String(err) });
    }
  }
}

export default new AccountController();
