const db = require('../config/database');

const getAllProducts = () => {
  const SQLQuery = 'SELECT * FROM products';
  return db.execute(SQLQuery);
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};