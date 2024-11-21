const db = require('../config/database');

const getHomeProducts = async () => {
  try {
    const SQLQuery = 'SELECT id, name, price, category FROM products WHERE category = ?'
    let result = [];
    let categories = ['sayur', 'ikan', 'buah'];
    let sayur = await db.execute(SQLQuery, [categories[0]]);
    let ikan = await db.execute(SQLQuery, [categories[1]]);
    let buah = await db.execute(SQLQuery, [categories[2]]);
    result = [...sayur[0], ...ikan[0], ...buah[0]];
    return result;
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  } 
};

const getHomeProductsPhoto = async (productIdArray) => {
  try {
    const SQLQuery = 'SELECT product_id, link FROM product_photos WHERE product_id = ?';
    let responseData = [];
    console.error(productIdArray[0]);
    for (let i = 0; i < 18; i++) {
      if (!productIdArray[i]) {
        continue;
      }
      const result = await db.execute(SQLQuery, [productIdArray[i].toString()]);
      responseData.push(...result[0]);
    }
    return responseData;
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
}

const getProductById = async (id) => {
  try {
    const SQLQuery = 'SELECT * FROM products WHERE id = ?';
    return db.execute(SQLQuery, [id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const createProduct = async (id, name, price, sold_count, stock, description, seller_id, category) => {
  try {
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const updated_at = created_at;
  const SQLQuery = 'INSERT INTO products (id, name, price, sold_count, stock, description, seller_id, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  return db.execute(SQLQuery, [id, name, price, sold_count, stock, description, seller_id, category, created_at, updated_at]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const verifyProductOwner = async (product_id, seller_id) => {
  try {
    const SQLQuery = 'SELECT * FROM products WHERE id = ? AND seller_id = ?';
    return db.execute(SQLQuery, [product_id, seller_id]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
}

const createProductPhoto = async (id, product_id, link) => {
  try {
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const SQLQuery = 'INSERT INTO product_photos (id, product_id, link, created_at) VALUES (?, ?, ?, ?)';
    return db.execute(SQLQuery, [id, product_id, link, created_at]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const updateProduct = async (id, name, price, sold_count, stock, description, seller_id) => {
  const SQLQuery = 'UPDATE products SET name = ?, price = ?, sold_count = ?, stock = ?, description = ?, seller_id = ? WHERE id = ?';
  return db.execute(SQLQuery, [name, price, sold_count, stock, description, seller_id, id]);
};

const deleteProduct = async (id) => {
  const SQLQuery = 'DELETE FROM products WHERE id = ?';
  return db.execute(SQLQuery, [id]);
};

module.exports = {
  getHomeProducts,
  getHomeProductsPhoto,
  getProductById,
  createProduct,
  createProductPhoto,
  verifyProductOwner,
  updateProduct,
  deleteProduct
};