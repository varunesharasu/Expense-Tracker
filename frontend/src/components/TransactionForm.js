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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const isFormValid = () => {
    return formData.title.trim() && formData.amount && formData.category.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isFormValid()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='transaction-form' onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      {error && <div className='error-message'>{error}</div>}

      <input
        type='text'
        name='title'
        placeholder='Title *'
        value={formData.title}
        onChange={handleChange}
        required
      />

      <input
        type='number'
        name='amount'
        placeholder='Amount *'
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <input
        type='text'
        name='category'
        placeholder='Category *'
        value={formData.category}
        onChange={handleChange}
        required
      />

      <select name='type' value={formData.type} onChange={handleChange}>
        <option value='income'>Income</option>
        <option value='expense'>Expense</option>
      </select>

      <button type='submit' disabled={!isFormValid() || loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

export default TransactionForm;