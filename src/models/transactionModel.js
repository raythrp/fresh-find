const db = require('../config/database');

const getTransactionBySellerId = async (id) => {
  try {
    const SQLQuery = 'SELECT * FROM transactions WHERE seller_id = ?';
    return db.execute(SQLQuery, [id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};
const getTransactionById = async (id) => {
  try {
    const SQLQuery = 'SELECT * FROM transactions WHERE id = ?';
    return db.execute(SQLQuery, [id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};
const getTransactionByUserId = async (id) => {
  try {
    const SQLQuery = 'SELECT * FROM transactions WHERE user_id = ?';
    return db.execute(SQLQuery, [id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const updateTransactionStatus = async (id, status) => {
  try {
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const SQLQuery = 'UPDATE transactions SET status = ?, updated_at = ? WHERE id = ?';
    db.execute(SQLQuery, [status, updated_at, id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const createTransaction = async (id, product_amount, shipping_amount, total_amount, product_id, seller_id, user_id, status) => {
  try {
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updated_at = created_at;
    const SQLQuery = 'INSERT INTO transactions (id, product_amount, shipping_amount, total_amount, product_id, seller_id, user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return db.execute(SQLQuery, [id, product_amount, shipping_amount, total_amount, product_id, seller_id, user_id, status, created_at, updated_at]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
}

module.exports = {
  getTransactionBySellerId,
  getTransactionById,
  getTransactionByUserId,
  updateTransactionStatus,
  createTransaction
}