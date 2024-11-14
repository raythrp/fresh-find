const dbPool = require('../config/database.js');

// Code untuk test database
const getAllProducts = () => {
  const SQLQuery = 'SELECT * FROM products';
  return dbPool.execute(SQLQuery);
};

module.exports = {
  getAllUsers,
  
}