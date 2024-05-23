import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Author from './author';

class Book extends Model {}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publishedDate: {
    type: DataTypes.DATE,
  },
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Author,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Book',
});

Book.belongsTo(Author, { foreignKey: 'authorId' });
Author.hasMany(Book, { foreignKey: 'authorId' });

export default Book;
