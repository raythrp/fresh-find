const db = require('../config/database');

const getCredentials = (number) => {
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
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
    const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
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

module.exports = {
  updateSellerPhoto,
  getCredentials,
  createSeller,
};
