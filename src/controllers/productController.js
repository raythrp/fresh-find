const productModel = require('../models/productModel');
const { nanoid } = require('nanoid/non-secure');
const uploadImage = require('../helpers/helpers.js');

const getHomeProducts = async (req, res) => {
  try {
    const products = await productModel.getHomeProducts();

    // Still not correct *stil assuming the array shape
    const productIds = products.map((item) => item.id);
    console.log(productIds);
    const productPhotos = await productModel.getHomeProductsPhoto(productIds);
    res.status(200).json({
      message: 'Success',
      product_datas: products,
      product_photos: productPhotos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Products retrieval fail' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (product.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json({
        message: 'Product found',
        data: product[0]
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Product retrieval fail' });
  }
};

const createProduct = async (req, res) => {
  try {
    const number = req.user.number;
    const id = nanoid(12);
    const { name, price, stock, description, category } = req.body;
    await productModel.createProduct(id, name, price, 0, stock, description, number, category);
    res.status(201).json({ message: 'Product creation success', product_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Product creation fail' });
  }
};

const createProductPhoto = async (req, res) => {
  const seller_id = req.user.number;
  const newPhoto = req.file;
  const id = nanoid(12);
  const product_id = req.body.productId;
  
  // Verifying product owner
  const verified = await productModel.verifyProductOwner(product_id, seller_id);
  console.log(verified)
  console.log(seller_id)
  console.log(product_id)
  if (typeof verified[0][0] != 'object') {
    return res.status(401).json({message: 'Unauthorized'});
  }

  // Handling image upload
  let imageUrl = '' 
  try {
    imageUrl = await uploadImage(newPhoto, 'product_photos');
  } catch (error) {
    return res.status(500).json({ message: 'Upload fail'});
  }

  // Insert link to database
  try {
    await productModel.createProductPhoto(id, product_id, imageUrl);
    return res.status(200).json({ message: 'Photo adding success', data: imageUrl});
  } catch {
    return res.status(500).json({ message: 'Database update fail' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, sold_count, stock, description, seller_id } = req.body;
    const [result, _] = await productModel.updateProduct(req.params.id, name, price, sold_count, stock, description, seller_id);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: 'Product updated' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result, _] = await productModel.deleteProduct(req.params.id);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getHomeProducts,
  getProductById,
  createProduct,
  createProductPhoto,
  updateProduct,
  deleteProduct
};