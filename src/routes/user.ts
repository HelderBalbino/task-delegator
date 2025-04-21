import { Router } from 'express';
import UserController from '../controllers/userController';
import authenticate from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/register-user', authenticate, UserController.registerDependent);
router.get('/:id', authenticate, UserController.getUserById);
router.put('/:id', authenticate, UserController.updateUser);
router.delete('/:id', authenticate, UserController.deleteUser);

export default router;
