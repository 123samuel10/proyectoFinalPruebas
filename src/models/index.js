const Category = require('./Category');
const Product = require('./Product');
const { sequelize } = require('../../config/database');

const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✓ Database synchronized successfully');
  } catch (error) {
    console.error('✗ Error synchronizing database:', error.message);
    throw error;
  }
};

module.exports = {
  Category,
  Product,
  sequelize,
  syncDatabase
};
