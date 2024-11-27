const db = require('../config/database');

const getUserWishlist = async (number) => {
  try {
    const SQLQuery = 'SELECT product_id FROM wishlist WHERE user_id = ?';
    const result = await db.execute(SQLQuery, [number]);
    return result[0];
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const createWish = async (number, product_id) => {
  try {
    const created_at = helpers.getLocalTime();
    const updated_at = created_at;
    const SQLQuery = 'INSERT INTO wishlist (product_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)'
    return db.execute(SQLQuery, [product_id, number, created_at, updated_at]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const deleteWish = async (number, product_id) => {
  try {
    const SQLQuery = 'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?';
    return db.execute(SQLQuery, [number, product_id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const checkWish = async (number, product_id) => {
  try {
    const SQLQuery = 'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?';
    return db.execute(SQLQuery, [number, product_id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
}

module.exports = {
  createWish,
  deleteWish,
  getUserWishlist,
  checkWish
}