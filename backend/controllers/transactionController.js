const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json(error);
  }
};