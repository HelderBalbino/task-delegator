import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		res.status(401).json({ error: 'Token not provided' });
		return;
	}

	try {
		// verifying if the token is valid
		const decoded = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET as string,
		) as { id: string };
		const user_id = decoded.id;

		// verifying if the user exists and has a 'primary_user_id'
		const user = await User.findByPk(user_id);
		console.log(user, 'user');

		if (user) {
			req.user = user;
		}

		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.error(error);
		res.status(403).json({ error: 'Invalid Token' });
	}
};

export default authenticate;
