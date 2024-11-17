const db = require('../config/database');

// Getting password for auth
const getCredentials = (number) => {
  try {
    const SQLQuery = 'SELECT number, password FROM users WHERE number = ?';
    return db.query(SQLQuery, [number]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

// For getting all details
const getUserByNumber = (number) => {
  const SQLQuery = 'SELECT * FROM users WHERE number = ?';
  return db.query(SQLQuery, [number]);
}

// For creating new user
const createUser = async (number, hashedPassword, photo, email, name, birthdate, buys_count, address_number, address_street, address_village, address_subdistrict, address_city, address_province, address_code) => {
  try {
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;
    const SQLQuery = 'INSERT INTO users (number, password, photo, email, name, birthdate, buys_count, address_number, address_street, address_village, address_subdistrict, address_city, address_province, address_code, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result, _] = await db.execute(SQLQuery, [number, hashedPassword, photo, email, name, birthdate, buys_count, address_number, address_street, address_village, address_subdistrict, address_city, address_province, address_code, createdAt, updatedAt]);
    return result;
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

// For updating profile photo
const updateUserPhoto = async (number, imageUrl) => {
  try {
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const SQLQuery = 'UPDATE users SET photo = ?, updated_at = ? WHERE number = ?;'
    const result = await db.execute(SQLQuery, [imageUrl, updatedAt, number]);
    return result;
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

module.exports = {
  getCredentials,
  getUserByNumber,
  createUser,
  updateUserPhoto
};