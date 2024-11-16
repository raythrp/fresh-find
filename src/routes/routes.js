const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// For Auth
router.post('/user/login', userController.userLogin);
router.post('/seller/login', );
router.post('/user/register', userController.userRegister);
router.post('/seller/register', );

// For Products
router.get('/products', authenticateToken, productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Middleware for authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized'});
  }
}

module.exports = router;