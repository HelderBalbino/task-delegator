// Description: This file defines the routes for task-related operations.
// It includes routes for creating, updating, deleting, and retrieving tasks.
import { Router } from 'express';
import TaskController from '../controllers/taskController';
import authenticate from '../middlewares/authMiddleware';

const router = Router();

router.post('/task', authenticate, TaskController.createTask);
router.get('/tasks/:page', authenticate, TaskController.getTasksByPage);

router.put(
	'/task/in_progress/:id',
	authenticate,
	TaskController.inProgressTask,
);
router.put('/task/complete/:id', authenticate, TaskController.completeTask);
router.put('/task/:id', authenticate, TaskController.updateTask);
router.delete('/task/:id', authenticate, TaskController.deleteTask);

export default router;
