import React, { useState } from 'react';
import './TransactionForm.css';
import API from '../services/api';

function TransactionForm({ fetchTransactions }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post('/transactions', {
      ...formData,
      amount: Number(formData.amount)
    });

    fetchTransactions();

    setFormData({
      title: '',
      amount: '',
      category: '',
      type: 'expense'
    });
  };

  return (
    <form className='transaction-form' onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      <input
        type='text'
        name='title'
        placeholder='Title'
        value={formData.title}
        onChange={handleChange}
      />

      <input
        type='number'
        name='amount'
        placeholder='Amount'
        value={formData.amount}
        onChange={handleChange}
      />

      <input
        type='text'
        name='category'
        placeholder='Category'
        value={formData.category}
        onChange={handleChange}
      />

      <select name='type' value={formData.type} onChange={handleChange}>
        <option value='income'>Income</option>
        <option value='expense'>Expense</option>
      </select>

      <button type='submit'>Add</button>
    </form>
  );
}

export default TransactionForm;