import { Router } from 'express';
import TaskController from '../controllers/taskController';
import authenticate from '../middlewares/authMiddleware';

const router = Router();

router.post('/task', authenticate, TaskController.createTask);

export default router;
