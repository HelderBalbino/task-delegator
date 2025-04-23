import { Router } from 'express';
import UserController from '../controllers/userController';
import authenticate from '../middlewares/authMiddleware';

const userRoutes = Router();

userRoutes.post('/register', UserController.register);
userRoutes.post('/login', UserController.login);
userRoutes.post(
	'/register-user',
	authenticate,
	UserController.registerDependent,
);
userRoutes.get('/:id', authenticate, UserController.getUserById);
userRoutes.put('/:id', authenticate, UserController.updateUser);
userRoutes.delete('/:id', authenticate, UserController.deleteUser);

export default userRoutes;
