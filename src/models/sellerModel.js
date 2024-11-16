const db = require('../config/database');

// Getting password for auth
const getCredentials = (number) => {
  const SQLQuery = 'SELECT password FROM sellers WHERE number = ?';
  return db.query(SQLQuery, [number]);
};

// For all details
const getUserByNumber = (number) => {
  const SQLQuery = 'SELECT * FROM sellers WHERE number = ?';
  return db.query(SQLQuery, [number]);
}

module.exports = {
  getCredentials,
  getUserByNumber
};