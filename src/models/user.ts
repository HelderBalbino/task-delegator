import { DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import sequelize from '../config/db';
import Sector from './sector';
import Company from './company';

interface UserAttributes {
	id: string;
	name: string;
	email: string;
	password: string;
	role: 'admin' | 'user';
	sector_id: string;
	company_id: number;
	primary_user_id?: string;
	company?: Company;
	sector?: Sector;
	createdAt?: Date;
	updatedAt?: Date;
}

interface UserCreationAttributes extends Optional {}

class User extends Model implements UserAttributes {
	declare id: string;
	declare name: string;
	declare email: string;
	declare password: string;
	declare role: 'admin' | 'user';
	declare sector_id: string;
	declare company_id: number;
	declare primary_user_id?: string;
	declare company?: Company;
	declare sector?: Sector;
	declare createdAt?: Date;
	declare updatedAt?: Date;

	static async hashPassword(password: string): Promise {
		const saltRounds = 10;
		return await bcrypt.hash(password, saltRounds);
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('admin', 'user'),
			allowNull: false,
			defaultValue: 'user',
		},
		sector_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'sectors',
				key: 'id',
			},
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'companies',
				key: 'id',
			},
		},
		primary_user_id: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'users',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		hooks: {
			beforeCreate: async (user) => {
				user.password = await User.hashPassword(user.password);
			},
			beforeUpdate: async (user) => {
				if (user.changed('password')) {
					user.password = await User.hashPassword(user.password);
				}
			},
		},
	},
);

User.belongsTo(Sector, {
	foreignKey: 'sector_id',
	as: 'sector',
});

User.belongsTo(Company, {
	foreignKey: 'company_id',
	as: 'company',
});

User.belongsTo(User, {
	foreignKey: 'primary_user_id',
	as: 'primaryUser',
});

User.hasMany(User, {
	foreignKey: 'primary_user_id',
	as: 'subordinates',
});

export default User;
