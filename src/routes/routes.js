const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const sellerController = require('../controllers/sellerController');
const transactionController = require('../controllers/transactionController');
const wishlistController = require('../controllers/wishlistController');
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
router.post('/seller/login', authController.sellerLogin);
router.post('/user/register', authController.userRegister);
router.post('/seller/register', authController.sellerRegister);

// For Products
router.get('/home', productController.getHomeProducts);
router.get('/products', productController.getProductById);
router.post('/products', authenticateToken, productController.createProduct);
router.post('/products/photos', authenticateToken, upload.single('productPhoto'), productController.createProductPhoto);
router.put('/products/update', authenticateToken, productController.updateProductDetails);
router.delete('/products/:id', productController.deleteProduct);

// For Users
router.put('/user/details/photo', authenticateToken, upload.single('profilePhoto'), userController.updateProfilePhoto);
router.put('/user/details', authenticateToken, userController.updateUserDetails);

// For Sellers
router.put('/seller/details/photo',authenticateToken,upload.single('profilePhoto'), sellerController.updateProfilePhoto);
router.put('/seller/details', authenticateToken, sellerController.updateSellerDetails);

// For transactions
router.get('/transactions', authenticateToken, transactionController.getUserTransactions);
router.get('/transactions', authenticateToken, transactionController.getSellerTransactions);
router.get('/transactions/paymentlink', authenticateToken, transactionController.requestPaymentLink);
// Webhook for Midtrans
router.post('/transactions/payment-notification-handler', transactionController.updateTransactionStatusForMidtrans);

// For wishlist
router.get('/wishlist', authenticateToken, wishlistController.showWishlist);
router.post('/wishlist/add', authenticateToken, wishlistController.addToWishList);
router.delete('/wishlist/delete', authenticateToken, wishlistController.deleteFromWishlist);

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