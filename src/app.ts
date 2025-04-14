import { createDemand, createUser } from './test/test';
import sequelize from './config/db';

// Import the sequelize instance
const createTables = async () => {
	try {
		// Create the tables
		await sequelize.sync({ force: true });
		console.log('tables were successfully created!');
		//
	} catch (error) {
		// Handle any errors that occur during table creation
		// Log the error to the console
		console.error('Error when creating table:', error);
	}
};

const startServer = async () => {
	await createTables();

	await createUser();
	await createDemand();
};

startServer();
