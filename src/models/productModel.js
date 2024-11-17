const db = require('../config/database');

const getHomeProducts = () => {
  try {
    const SQLQuery = 'SELECT id, name, price FROM products WHERE category = ?'
    let result = [];
    result.append(db.execute(SQLQuery, ['sayur']));
    result.append(db.execute(SQLQuery, ['ikan']));
    result.append(db.execute(SQLQuery, ['buah']));
    return result;
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const getProductById = (id) => {
  const SQLQuery = 'SELECT * FROM products WHERE id = ?';
  return db.execute(SQLQuery, [id]);
};

const createProduct = (name, price, sold_count, stock, description, seller_id) => {
  const SQLQuery = 'INSERT INTO products (name, price, sold_count, stock, description, seller_id) VALUES (?, ?, ?, ?, ?, ?)';
  return db.execute(SQLQuery, [name, price, sold_count, stock, description, seller_id]);
};

const updateProduct = (id, name, price, sold_count, stock, description, seller_id) => {
  const SQLQuery = 'UPDATE products SET name = ?, price = ?, sold_count = ?, stock = ?, description = ?, seller_id = ? WHERE id = ?';
  return db.execute(SQLQuery, [name, price, sold_count, stock, description, seller_id, id]);
};

const deleteProduct = (id) => {
  const SQLQuery = 'DELETE FROM products WHERE id = ?';
  return db.execute(SQLQuery, [id]);
};

module.exports = {
  getHomeProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};