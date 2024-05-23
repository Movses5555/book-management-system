import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Author extends Model {}

Author.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  biography: {
    type: DataTypes.TEXT,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Author',
});

export default Author;
