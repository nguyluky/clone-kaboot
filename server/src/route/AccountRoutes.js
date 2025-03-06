import AccountController from '../controller/AccountController.js';
import express from 'express';

const router = express.Router();

router.get('/', AccountController.getAllAccounts);
router.get('/:user_name', AccountController.getAccountByUserName);
router.post('/register', AccountController.register);
router.post('/login', AccountController.login);
router.post('/logout', AccountController.logout);
router.post('/', AccountController.addAccount);
router.put('/email/:emailAccount', AccountController.upDateAccount);
router.delete('/user_name/:username', AccountController.deleteAccount);

export default router;
