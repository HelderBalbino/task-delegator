import { createDemand, createUser } from './test/test';
import sequelize from './config/db';

const createTables = async () => {
	try {
		await sequelize.sync({ force: true });
		console.log('tables were successfully created!');
	} catch (error) {
		console.error('Error when creating table:', error);
	}
};

const startServer = async () => {
	await createTables();

	await createUser();
	await createDemand();
};

startServer();
