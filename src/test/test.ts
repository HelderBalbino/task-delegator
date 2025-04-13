import Company from '../models/company';
import Sector from '../models/sector';
import Task from '../models/task';
import User from '../models/user';

// This file is used to create a user and a demand for testing purposes
// It is not used in the application itself
export const createUser = async () => {
	const [company, companyCreated] = await Company.findOrCreate({
		where: { name: 'Company 1' },
	});

	if (!companyCreated) {
		return;
	}

	const [sector, sectorCreated] = await Sector.findOrCreate({
		where: { name: 'Sector 1', company_id: company.id },
	});

	if (!sectorCreated) {
		return;
	}

	// Create a user with the company and sector
	await User.create({
		name: 'User 1',
		email: 'HtH2x@example.com',
		password: 'password',
		role: 'user',
		sector_id: sector.id,
		company_id: company.id,
	});
};

// Create a demand for the user
// This is used to test the create demand endpoint
export const createDemand = async () => {
	// Find the user by email
	// and include the company and sector
	// This is the same as using a join in SQL

	const user = await User.findOne({
		where: { email: 'HtH2x@example.com' },
		include: [
			{ model: Company, as: 'company' },
			{ model: Sector, as: 'sector' },
		],
	});

	// Check if the user exists
	// and if the user has a company and sector
	if (!user) {
		throw new Error('User not found');
	}

	// Check if the user has a company and sector
	if (!user.company || !user.sector) {
		// If the user does not have a company or sector, we cannot create a demand
		throw new Error('User has no company or sector');
	}

	const company = user.company;
	const sector = user.sector;

	await Task.create({
		title: 'Demand 1',
		description: 'Description 1',
		status: 'pending',
		sector_id: sector.id,
		company_id: company.id,
		assigned_to_id: user.id,
		admin_id: user.id,
	});
};
