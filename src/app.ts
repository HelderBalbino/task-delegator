import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import sequelize from './config/db';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

// cors configuration
app.use(
	cors({
		origin: [/http:\/\/localhost:\d+$/], // Permite qualquer porta do localhost
		methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
		credentials: true, // Permite o envio de cookies e headers de autenticação
	}),
);
