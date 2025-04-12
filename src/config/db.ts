import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
// This is important to ensure that the environment variables are loaded before using them
dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME as string, // Database name
	process.env.DB_USER as string, // Database user
	process.env.DB_PASSWORD as string, // Database password

	{
		host: process.env.DB_HOST as string, // Database host
		dialect: 'mysql', // Database dialect
	},
);
// Test the database connection
export default sequelize;
