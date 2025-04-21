import { Router } from 'express';
import UserController from '../controllers/userController';
import authenticate from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', UserController.register);

export default router;
