import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Company from '../models/company';
import Sector from '../models/sector';

class UserController {
	static async register(req: Request, res: Response) {
		try {
			const { name, email, password, sector_name, company_name } =
				req.body;

			const [company, companyCreated] = await Company.findOrCreate({
				where: { name: company_name },
			});

			if (!company) {
				res.status(400).json({ error: 'error in finding company' });
				return;
			}

			const [sector, sectorCreated] = await Sector.findOrCreate({
				where: { name: sector_name, company_id: company.id },
			});

			if (!sectorCreated || !sector) {
				res.status(400).json({
					error: 'error in finding sector or creating sector',
				});
				return;
			}

			const user = await User.create({
				name,
				email,
				password: password,
				role: 'admin',
				sector_id: sector.id,
				company_id: company.id,
			});

			res.status(201).json(user.createdAt);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'error in registering user' });
		}
	}

	static async registerDependent(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;

			const userId = req.user.id; //Id of logged in user

			// verifying if the logged in user is an admin
			const adminUser = await User.findByPk(userId, {
				include: [
					{ model: Company, as: 'company' },
					{ model: Sector, as: 'sector' },
				],
			});

			if (!adminUser || adminUser.role !== 'admin') {
				res.status(403).json({
					error: 'Only administrators can create dependents.',
				});
				return;
			}

			// creating the dependent user
			const dependent = await User.create({
				name,
				email,
				password: password,
				role: 'user', // dependents are regular users
				sector_id: adminUser.sector_id,
				company_id: adminUser.company_id,
				primary_user_id: adminUser.id, // associating the dependent with the admin user
			});

			res.status(201).json(dependent);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'error in registering dependent' });
		}
	}

	static async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({
				where: { email },
				include: [
					{ model: Company, as: 'company' },
					{ model: Sector, as: 'sector' },
				],
			});

			if (!user) {
				res.status(401).json({ error: 'invalid credentials' });
				return;
			}

			const validPassword = await bcrypt.compare(password, user.password);

			if (!validPassword) {
				res.status(401).json({ error: 'Invalid credentials' });
				return;
			}

			const companyName = user.company?.name; // accessing the company's name
			const sectorName = user.sector?.name; // accessing the sector's name

			const token = jwt.sign(
				{
					id: user.id,
					role: user.role,
					userParent: user.primary_user_id,
				},
				process.env.ACCESS_TOKEN_SECRET as string,
				{ expiresIn: '1h' },
			);

			res.status(200).json({
				token,
				name: user.name,
				role: user.role,
				company: companyName,
				sector: sectorName,
			});
		} catch (error) {
			console.error(error);

			res.status(500).json({ error: 'Error in login authentication' });
		}
	}

	static async getAllUsersByAdmin(req: Request, res: Response) {
		try {
			const userId = req.user.id;

			// Verifying if the logged in user is an admin
			const adminUser = await User.findByPk(userId);

			if (!adminUser || adminUser.role !== 'admin') {
				res.status(403).json({
					error: 'Only administrators can view all users.',
				});
				return;
			}

			// Fetching all users associated with the admin user
			const dependents = await User.findAll({
				where: {
					primary_user_id: adminUser.id,
				},
				attributes: ['id', 'name'], // selecting only the id and name of the dependents
			});

			// Verifying if there are any dependents
			if (dependents.length === 0) {
				res.status(404).json({ message: 'No dependents found' });
				return;
			}

			// Returning the list of dependents
			res.status(200).json(dependents);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error in finding dependents' });
		}
	}

	static async getUserById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const user = await User.findByPk(id);

			if (!user) {
				res.status(404).json({ error: 'User not found' });
				return;
			}

			if (user.primary_user_id !== userId && user.id !== userId) {
				res.status(403).json({
					error: 'user without permission to view another user profile.',
				});
				return;
			}

			res.json(user);
		} catch (error) {
			res.status(500).json({ error: 'Error in finding user' });
		}
	}

	static async updateUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const { name, email, password } = req.body;
			const user = await User.findByPk(id);

			if (!user) {
				res.status(404).json({ error: 'user not found' });
				return;
			}

			if (user.primary_user_id !== userId && user.id !== userId) {
				res.status(403).json({
					error: 'user without permission to update another user profile.',
				});
				return;
			}

			user.name = name || user.name;
			user.email = email || user.email;
			user.password = bcrypt.hashSync(password, 10);

			await user.save();

			res.json(user);
		} catch (error) {
			res.status(500).json({ error: 'Error in updating user' });
		}
	}

	static async deleteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user.id;
			const user = await User.findByPk(id);

			if (!user) {
				res.status(404).json({ error: 'user not found' });
				return;
			}

			if (user.primary_user_id !== userId && user.id !== userId) {
				res.status(403).json({
					error: 'user without permission to delete another user profile.',
				});
				return;
			}

			await user.destroy();
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			res.status(500).json({ error: 'Error in deleting user' });
		}
	}
}

export default UserController;
