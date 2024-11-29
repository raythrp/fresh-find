const transactionModel = require('../models/transactionModel.js');
const productModel = require('../models/productModel.js');
const userModel = require('../models/userModel.js');
const sellerModel = require('../models/sellerModel.js');
const helpers = require('../helpers/helpers.js');
const { nanoid } = require('nanoid/non-secure');
const axios = require('axios');
const { sha512 } = require('js-sha512');

const getTransactionById = async () => {
  try {
    const { id } = req.body;
    const responseData = await getTransactionById(id);

    if (responseData === 0) {
      return res.status(404).json({ message: 'Transaction not found'});
    } else {
      return res.status(200).json({
        message: 'Success',
        data: responseData
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction retrieval fail'});
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const number = req.user.number;
    const transactions = await transactionModel.getTransactionByUserId(number);
    res.status(200).json({ message: 'Success', data: transactions[0], number: number});
  } catch {
    console.log(error);
    res.status(500).json({ message: 'Transaction retrieval fail'});
  }
};

const getSellerTransactions = async (req, res) => {
  try {
    const number = req.user.number;
    const transactions = await transactionModel.getTransactionBySellerId(number);
    res.status(200).json({ message: 'Success', data: transactions[0], number: number});
  } catch {
    res.status(500).json({ message: 'Transaction retrieval fail'});
  }
};

const requestPaymentLink = async (req, res) => {
  const id = nanoid(16);
  const { product_id, price, amount, shippingCost, product_name, category, name, email, seller_id } = req.body;

  // Product Stock Check
  const productStock = await productModel.verifyProductStock(product_id, seller_id);
  if (productStock[0].stock < amount) {
    return res.status(422).json({ message: 'Insufficient stock' });
  }

  const number = req.user.number;

  // Request Data
  const adjustedPrice = price + shippingCost;
  const gross_amount = adjustedPrice * amount;
  const url = `${process.env.MIDTRANS_API_BASE_URL}/v1/payment-links`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(process.env.MIDTRANS_SERVER_KEY)}`
  };
  const body = {
    "transaction_details": {
      "order_id": id,
      "gross_amount": gross_amount
      // "payment_link_id": "for-payment-123"
    },
    "customer_required": false,
    // "credit_card": {
    //   "secure": true,
    //   "bank": "bca",
    //   "installment": {
    //     "required": false,
    //     "terms": {
    //       "bni": [3, 6, 12],
    //       "mandiri": [3, 6, 12],
    //       "cimb": [3],
    //       "bca": [3, 6, 12],
    //       "offline": [6, 12]
    //     }
    //   }
    // },
    "usage_limit":  1,
    "expiry": {
      "start_time": helpers.getFormattedTimestamp,
      "duration": 10,
      "unit": "minutes"
    },
    "enabled_payments": [
      "credit_card",
      "bca_va",
      "gopay",
      "shopeepay"
    ],
    "item_details": [
      {
        // "id": "pil-001",
        "name": product_name,
        "price": adjustedPrice,
        "quantity": amount,
        // "brand": "Midtrans",
        "category": category,
        // "merchant_name": "PT. Midtrans"
      }
    ],
    "customer_details": {
      "first_name": name,
      // "last_name": "Doe",
      "email": email,
      "phone": number,
      // "notes": "Thank you for your purchase. Please follow the instructions to pay."
    }
  // "custom_field1": "custom field 1 content", 
  // "custom_field2": "custom field 2 content", 
  // "custom_field3": "custom field 3 content"
  };

  // Request to Payment Gateway
  try {
    const response = await axios.post(url, body, { headers });
    const totalShippingCost = shippingCost * amount;
    await transactionModel.createTransaction(id, amount, totalShippingCost, price * amount + totalShippingCost, product_id, seller_id, number, 'unpaid');
    res.status(200).json({ message: 'Success', paymentData: response.data, productId: product_id, grossAmount: `${gross_amount}.00` });
    console.error(id);
  } catch (error) {
    console.error(error);
    console.error(process.env.MIDTRANS_API_BASE_URL);
    res.status(500).json({ message : 'Payment link retrieval fail' });
  }
};

const updateTransactionStatusForMidtrans = async (req, res) => {
  try {
    const { order_id, transaction_status, gross_amount, signature_key, fraud_status} = req.body;
    const signatureKeyComparer = sha512(`${order_id}200${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`);
    const id = order_id.slice(0, 16);
    if (signatureKeyComparer == signature_key) {
      if (transaction_status == 'capture' || transaction_status == 'settlement' && fraud_status == 'accept') {
        await transactionModel.updateTransactionStatus(id, 'diajukan');
        const transactionDetails = await transactionModel.getTransactionById(id);
        const sellerId = transactionDetails[0].seller_id;
        const productAmount = transactionDetails[0].product_amount;
        await productModel.updateProductForSuccessfulTransaction(id, sellerId, productAmount);
        return res.status(200).json({ message: 'Success' });
      }
    }
    return res.status(500).json({ message: 'Transaction update fail'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction update fail'});
  }
};

const updateTransactionStatusForUser = async (req, res) => {
  try {
    const { id, product_amount, seller_id } = req.body;
    const number = req.user.number;
    const status = 'selesai';
    await transactionModel.updateTransactionStatus(id, status, number);
    await sellerModel.updateSellerSalesCount(seller_id, product_amount);
    await userModel.updateUserBuysCount(number, product_amount);
    res.status(200).json({ message: 'Success'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction update fail'});
  }
};

const updateTransactionStatusForSeller = async (req, res) => {
  try {
    const { id } = req.body;
    const number = req.user.number;
    const status = 'diproses';
    await transactionModel.updateTransactionStatus(id, status, number);
    res.status(200).json({ message: 'Success'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction update fail'});
  }
};

const getTransaction = async (req, res) => {
  const number = req.user.number;
  const { id } = req.body;

  try {
    const responseData = await transactionModel.getTransactionById(id, number);
    res.status(200).json({ message: 'Success', data: responseData[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction detail retieval fail'});
  }
};

module.exports = {
  getUserTransactions,
  getSellerTransactions,
  getSellerTransactions,
  updateTransactionStatusForUser,
  updateTransactionStatusForSeller,
  requestPaymentLink,
  updateTransactionStatusForMidtrans,
  getTransaction
}