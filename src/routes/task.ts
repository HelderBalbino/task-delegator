// Description: This file defines the routes for task-related operations.
// It includes routes for creating, updating, deleting, and retrieving tasks.
import { Router } from 'express';
import TaskController from '../controllers/taskController';
import authenticate from '../middlewares/authMiddleware';

const taskRoutes = Router();

taskRoutes.post('/task', authenticate, TaskController.createTask);
taskRoutes.get('/tasks/:page', authenticate, TaskController.getTasksByPage);

taskRoutes.put(
	'/task/in_progress/:id',
	authenticate,
	TaskController.inProgressTask,
);
taskRoutes.put('/task/complete/:id', authenticate, TaskController.completeTask);
taskRoutes.put('/task/:id', authenticate, TaskController.updateTask);
taskRoutes.delete('/task/:id', authenticate, TaskController.deleteTask);

export default taskRoutes;
