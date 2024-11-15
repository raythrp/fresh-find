const productModel = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    const [products, _] = await productModel.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const [product, _] = await productModel.getProductById(req.params.id);
    if (product.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, sold_count, stock, description, seller_id } = req.body;
    const [result, _] = await productModel.createProduct(name, price, sold_count, stock, description, seller_id);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};