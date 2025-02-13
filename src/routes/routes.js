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

const uploadOriginal = multer({ storage });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// For Auth
router.post('/user/login', authController.userLogin);
router.post('/seller/login', authController.sellerLogin);
router.post('/user/register', authController.userRegister);
router.post('/seller/register', authController.sellerRegister);
router.post('/user/otp', authController.userSendOTP);
router.post('/seller/otp', authController.sellerSendOTP);
router.post('/otp/verify', authController.verifyOTP);
router.post('/recovery/reset', authController.forgetPassword);
router.get('/recovery/page/:token', authController.resetPassword);
router.post('/recovery/:token', authController.updatePassword);

// For Products
router.get('/home', productController.getHomeProducts);
router.post('/products/search', productController.searchProducts);
router.post('/products/recognize', upload.single('image'), productController.predictProductName);
router.post('/products', productController.getProductById);
router.post('/products/add', authenticateToken, productController.createProduct);
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
router.get('/transactions/user', authenticateToken, transactionController.getUserTransactions);
router.get('/transactions/seller', authenticateToken, transactionController.getSellerTransactions);
router.post('/transactions/specified', authenticateToken, transactionController.getTransaction);
router.post('/transactions/paymentlink', authenticateToken, transactionController.requestPaymentLink);
router.put('/transactions/status/user', authenticateToken, transactionController.updateTransactionStatusForUser);
router.put('/transactions/status/seller', authenticateToken, transactionController.updateTransactionStatusForSeller);
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