import { Request } from 'express';

declare global {
	namespace Express {
		interface Request {
			user: {
				id: string; // Assuming user ID is a string
			};
		}
	}
}
