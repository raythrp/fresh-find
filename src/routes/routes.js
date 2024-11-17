const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Middleware for uploading file
const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// For Auth
router.post('/user/login', authController.userLogin);
router.post('/seller/login', );
router.post('/user/register', upload.single(), authController.userRegister);
router.post('/seller/register', );

// For Products
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// For user profile
router.put('/user/details/photo', authenticateToken, upload.single('profilePhoto'), userController.updateProfilePhoto);

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