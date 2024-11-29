const db = require('../config/database');
const helpers = require('../helpers/helpers.js');

const getCredentials = async (number) => {
  try {
  const SQLQuery = 'SELECT number, password FROM sellers WHERE number = ?';
  return db.query(SQLQuery, [number]);
} catch (error) {
  console.error('Error code:', error.code);  
  console.error('Error message:', error.sqlMessage); 
  console.error('SQL:', error.sql);  
  throw error;
}
};

const getSellerById = async (number) => {
  try {
    const SQLQuery = 'SELECT * FROM sellers WHERE number = ?'
    const responseData = await db.execute(SQLQuery, [number]);
    return responseData[0];
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const getSellerForProductById = async (number) => {
  try {
    const SQLQuery = 'SELECT number, photo, store_name, sales_count, address_province FROM sellers WHERE number = ?'
    const responseData = await db.execute(SQLQuery, [number]);
    return responseData[0];
  } catch (error) {
    console.error('Error code:', error.code);  
    console.error('Error message:', error.sqlMessage); 
    console.error('SQL:', error.sql);  
    throw error;
  }
};

const createSeller = async (
  number,
  hashedPassword,
  photo,
  email,
  storeName,
  birthdate,
  salesCount,
  addressNumber,
  addressStreet,
  addressVillage,
  addressSubdistrict,
  addressCity,
  addressProvince,
  addressCode,
  bankAccount,
  bankName
) => {
  try {
  const createdAt = helpers.getLocalTime();
  const updatedAt = createdAt;

  const SQLQuery = `
    INSERT INTO sellers (
      number, password, photo, email, store_name, birthdate, sales_count,
      address_number, address_street, address_village, address_subdistrict,
      address_city, address_province, address_code, bank_account, bank_name, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return db.execute(SQLQuery, [
    number,
    hashedPassword,
    photo,
    email,
    storeName,
    birthdate,
    salesCount,
    addressNumber,
    addressStreet,
    addressVillage,
    addressSubdistrict,
    addressCity,
    addressProvince,
    addressCode,
    bankAccount,
    bankName,
    createdAt,
    updatedAt,
  ]);
} catch (error) {
  console.error('Error code:', error.code);  
  console.error('Error message:', error.sqlMessage); 
  console.error('SQL:', error.sql);  
  throw error;
}
};

const updateSellerPhoto = async (number, imageUrl) => {
  try {
    const updatedAt = helpers.getLocalTime();
    const SQLQuery = 'UPDATE sellers SET photo = ?, updated_at = ? WHERE number = ?;';
    const result = await db.execute(SQLQuery, [imageUrl, updatedAt, number]);
    return result;
  } catch (error) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.sqlMessage);
    console.error('SQL:', error.sql);
    throw error;
  }
};

const updateSellerDetails = async (number, store_name, email, address_number, address_street, address_city, address_village, address_subdistrict, address_province, address_code, bank_account, bank_name) => {
  try {
      const updatedAt = helpers.getLocalTime();
      const SQLQuery = `
          UPDATE sellers 
          SET store_name = ?, email = ?, address_number = ?, address_street = ?, address_city = ?, address_village = ?, address_subdistrict = ?, address_province = ?, address_code = ?, bank_account = ?, bank_name = ?, updated_at = ? 
          WHERE number = ?
      `;
      const [result] = await db.execute(SQLQuery, [store_name, email, address_number, address_street, address_city, address_village, address_subdistrict, address_province, address_code, bank_account, bank_name, updatedAt, number]);
      return result;
  } catch (error) {
      console.error('Error code:', error.code);
      console.error('Error message:', error.sqlMessage);
      console.error('SQL:', error.sql);
      throw error;
  }
};

const updateSellerSalesCount = async (id, amount) => {
  try {
    const SQLQuery = 'UPDATE sellers SET sales_count = sales_count + ?, updated_at = ? WHERE number = ?';
    const updated_at = helpers.getLocalTime();
    await db.execute(SQLQuery, [amount, updated_at, id]);
  } catch (error) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.sqlMessage);
    console.error('SQL:', error.sql);
    throw error;
  }
}

module.exports = {
  updateSellerPhoto,
  getCredentials,
  createSeller,
  getSellerById,
  getSellerForProductById,
  updateSellerDetails,
  updateSellerSalesCount
};
