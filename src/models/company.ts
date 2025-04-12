import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Company extends Model {
	declare id: number;
	declare name: string;
}

Company.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false, // Name is required
		},
	},
	{
		sequelize,
		modelName: 'Company',
		tableName: 'companies',
	},
);

export default Company;
