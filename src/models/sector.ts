import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Company from './company';

// This model represents a sector in the database
class Sector extends Model {
	declare id: string;
	declare name: string;
	declare company_id: number;
}

Sector.init(
	// Define the model
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true, // ID is the primary key
			allowNull: false, // ID is required
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

Sector.belongsTo(Company, { foreignKey: 'company_id' }); // Define the relationship between Sector and Company

export default Sector;
