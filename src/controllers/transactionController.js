const transactionModel = require('../models/transactionModel.js');
const { nanoid } = require('nanoid/non-secure');

const getUserTransaction = async (req, res) => {
  const number = req.user.number;
  const responseData = await transactionModel.getTransactionByUserId
};