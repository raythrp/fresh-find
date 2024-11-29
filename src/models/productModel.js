const db = require('../config/database');
const helpers = require('../helpers/helpers.js');

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
    const responseData = await db.execute(SQLQuery, [id]);
    return responseData[0];
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const getProductPhotoById = async (product_id) => {
  try {
    const SQLQuery = 'SELECT * FROM product_photos WHERE product_id = ?';
    const responseData = await db.execute(SQLQuery, [product_id]);
    return responseData[0];
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
}

const createProduct = async (id, name, price, sold_count, stock, description, seller_id, category) => {
  try {
  const created_at = helpers.getLocalTime();
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
};

const verifyProductStock = async (product_id, seller_id) => {
  try {
    const SQLQuery = 'SELECT stock FROM products WHERE id = ? AND seller_id = ?';
    const result = await db.execute(SQLQuery, [product_id, seller_id]);
    return result[0];
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const createProductPhoto = async (id, product_id, link) => {
  try {
    const created_at = helpers.getLocalTime();
    const SQLQuery = 'INSERT INTO product_photos (id, product_id, link, created_at) VALUES (?, ?, ?, ?)';
    return db.execute(SQLQuery, [id, product_id, link, created_at]);
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const updateProductDetails = async (id, name, price, stock, description, category, seller_id) => {
  try {
      const updatedAt = helpers.getLocalTime();
      console.error(updatedAt);
      const SQLQuery = `
          UPDATE products 
          SET name = ?, price = ?, stock = ?, description = ?, category = ?, updated_at = ? 
          WHERE id = ? AND seller_id = ?
      `;
      const [result] = await db.execute(SQLQuery, [name, price, stock, description, category, updatedAt, id, seller_id]);
      return result;
  } catch (error) {
      console.error('Error code:', error.code);
      console.error('Error message:', error.sqlMessage);
      console.error('SQL:', error.sql);
      throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const SQLQuery = 'DELETE FROM products WHERE id = ?';
    return db.execute(SQLQuery, [id]);
  } catch (error) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.sqlMessage);
    console.error('SQL:', error.sql);
    throw error;
}
};

const getProductsByKeyword = async (keyword) => {
  try {
    const SQLQuery = 'SELECT id, name, price, stock, sold_count category FROM products WHERE name LIKE %?% ORDER BY sold_count ASC';
    const result = await db.execute(SQLQuery, [keyword]);
    return result[0]; 
  } catch (error) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.sqlMessage);
    console.error('SQL:', error.sql);
    throw error;
  }
};

const updateProductForSuccessfulTransaction = async (id, seller_id, amount) => {
  try {
    const SQLQuery = 'UPDATE products SET stock = stock - ?, sold_count = sold_count + ?, updated_at = ? WHERE id = ? AND seller_id = ?';
    const updated_at = helpers.getLocalTime();
    await db.execute(SQLQuery, [amount, amount, updated_at, id, seller_id]);
  } catch (error) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.sqlMessage);
    console.error('SQL:', error.sql);
    throw error;
  }
}

module.exports = {
  getHomeProducts,
  getHomeProductsPhoto,
  getProductById,
  createProduct,
  createProductPhoto,
  verifyProductOwner,
  verifyProductStock,
  updateProductDetails,
  deleteProduct,
  getProductPhotoById,
  getProductsByKeyword,
  updateProductForSuccessfulTransaction
};