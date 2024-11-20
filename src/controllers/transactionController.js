const transactionModel = require('../models/transactionModel.js');
const { nanoid } = require('nanoid/non-secure');

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
    res.status(200).json({ message: 'Success', data: transactions});
  } catch {
    console.log(error);
    res.status(500).json({ message: 'Transaction retrieval fail'})
  }
};

const getSellerTransactions = async (req, res) => {
  try {
    const number = req.user.number;
    const responseData = await transactionModel.getTransactionBySellerId(number);
    res.status(200).json({ message: 'Success', data: responseData});
  } catch {
    res.status(500).json({ message: 'Transaction retrieval fail'})
  }
};

const updateTransactionStatusForUser = async (req, res) => {
  try {
    const { id } = req.body;
    const status = 'selesai';
    await transactionModel.updateTransactionStatus(id, status);
    res.status(200).json({ message: 'Success'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction update fail'});
  }
};

const updateTransactionStatusForSeller = async (req, res) => {
  try {
    const { id } = req.body;
    const status = 'diproses';
    await transactionModel.updateTransactionStatus(id, status);
    res.status(200).json({ message: 'Success'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Transaction update fail'});
  }
};

module.exports = {
  getUserTransactions,
  getSellerTransactions,
  getSellerTransactions,
  updateTransactionStatusForUser,
  updateTransactionStatusForSeller
}