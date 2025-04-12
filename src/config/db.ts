import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
// This is important to ensure that the environment variables are loaded before using them
dotenv.config();

// Create a new Sequelize instance
// The Sequelize constructor takes the database name, username, password, and options
// The options include the host and dialect (MySQL in this case)
// The environment variables are accessed using process.env
// The 'as string' assertion is used to tell TypeScript that these variables are strings
const sequelize = new Sequelize(
	process.env.DB_NAME as string, // Database name
	process.env.DB_USER as string, // Database user
	process.env.DB_PASSWORD as string, // Database password

	{
		host: process.env.DB_HOST as string, // Database host
		port: parseInt(process.env.DB_PORT as string), // Database port
		dialect: 'mysql', // Database dialect
	},
);
// Test the database connection
export default sequelize;
