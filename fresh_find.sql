CREATE TABLE users (
  number CHAR(12) PRIMARY KEY,
  photo VARCHAR,
  email VARCHAR,
  name VARCHAR,
  birthdate DATE,
  buys_count INTEGER,
  address_number INTEGER,
  address_street VARCHAR,
  address_village VARCHAR,
  address_subdistrict VARCHAR,
  address_city VARCHAR,
  address_province VARCHAR,
  address_code INTEGER,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE sellers (
  number CHAR(12) PRIMARY KEY,
  photo VARCHAR,
  email VARCHAR,
  store_name VARCHAR,
  birthdate DATE,
  sales_count INTEGER,
  address_number INTEGER,
  address_street VARCHAR,
  address_village VARCHAR,
  address_subdistrict VARCHAR,
  address_city VARCHAR,
  address_province VARCHAR,
  address_code INTEGER,
  bank_account VARCHAR,
  bank_name VARCHAR,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE products (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  price INTEGER,
  sold_count INTEGER,
  stock INTEGER,
  category VARCHAR,
  description VARCHAR,
  seller_id CHAR(12),
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (seller_id) REFERENCES sellers(number)
);

CREATE TABLE product_photos (
  id VARCHAR PRIMARY KEY,
  product_id VARCHAR,
  link VARCHAR,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE transactions (
  id VARCHAR PRIMARY KEY,
  product_amount INTEGER,
  shipping_amount INTEGER,
  product_id VARCHAR,
  seller_id CHAR(12),
  user_id CHAR(12),
  status VARCHAR,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (seller_id) REFERENCES sellers(number),
  FOREIGN KEY (user_id) REFERENCES users(number)
);

CREATE TABLE wishlists {
  product_id VARCHAR,
  user_id VARCHAR,
  FOREIGN KEY (product_id) REFERENCES products(id)
  FOREIGN KEY (user_id) REFERENCES users(number)
}