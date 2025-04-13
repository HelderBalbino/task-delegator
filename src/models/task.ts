import { DataTypes, Model, BelongsToGetAssociationMixin } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db';
import Sector from './sector';
import Company from './company';
import User from './user';

interface TaskAttributes {
	id?: string;
	title: string;
	description: string;
	status: 'pending' | 'in_progress' | 'completed';
	sector_id: string;
	company_id: number;
	assigned_to_id: string;
	admin_id: string;
}

class Task extends Model implements TaskAttributes {
	declare id?: string;
	declare title: string;
	declare description: string;
	declare status: 'pending' | 'in_progress' | 'completed';
	declare sector_id: string;
	declare company_id: number;
	declare assigned_to_id: string;
	declare admin_id: string;
}

Task.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: uuidv4,
			primaryKey: true,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
			allowNull: false,
			defaultValue: 'pending',
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
		admin_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},
		assigned_to_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Task',
		tableName: 'tasks',
	},
);

Task.belongsTo(Sector, {
	foreignKey: 'sector_id',
	as: 'sector',
});

Task.belongsTo(Company, {
	foreignKey: 'company_id',
	as: 'company',
});

Task.belongsTo(User, {
	foreignKey: 'admin_id',
	as: 'admin',
});

Task.belongsTo(User, {
	foreignKey: 'assigned_to_id',
	as: 'assignedUser',
});

export default Task;
