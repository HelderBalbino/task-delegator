import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db';
import cors from 'cors';
import userRoutes from './routes/user';
import taskRoutes from './routes/task';

dotenv.config();

const app = express();
app.use(express.json());

// cors configuration
app.use(
	cors({
		origin: [/http:\/\/localhost:\d+$/], //only allow localhost
		methods: 'GET,POST,PUT,DELETE', // Allowed methods
		credentials: true, // Allow credentials
	}),
);

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
	try {
		await sequelize.sync({ force: false });
		console.log('connected to the database');
		app.listen(PORT, () => console.log(`Server running in port ${PORT}`));
	} catch (error) {
		console.error('Error when connecting to the database', error);
	}
};

startServer();
