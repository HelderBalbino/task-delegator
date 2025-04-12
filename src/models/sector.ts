import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Company from './company';

class Sector extends Model {
	declare id: string;
	declare name: string;
	declare company_id: number;
}

Sector.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Sector',
		tableName: 'sectors',
	},
);

Sector.belongsTo(Company, { foreignKey: 'company_id' });

export default Sector;
