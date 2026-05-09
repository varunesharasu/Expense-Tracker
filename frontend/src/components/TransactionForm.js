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
  const [customCategory, setCustomCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'others') {
      setFormData({
        ...formData,
        category: ''
      });
    } else {
      setFormData({
        ...formData,
        category: value
      });
      setCustomCategory('');
    }
    setError('');
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
    setFormData({
      ...formData,
      category: e.target.value
    });
    setError('');
  };

  const isFormValid = () => {
    const categoryValid = formData.category === 'others' 
      ? customCategory.trim() 
      : formData.category.trim();
    return formData.title.trim() && formData.amount && categoryValid;
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
      setCustomCategory('');
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

      <p className='form-hint'>Fields marked with * are required.</p>

      <div className='form-row'>
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
      </div>

      <div className='form-row'>
        <select
          name='category'
          value={formData.category === '' && customCategory ? 'others' : formData.category}
          onChange={handleCategoryChange}
          required
        >
          <option value=''>Select Category *</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value='others'>Others</option>
        </select>

        <select name='type' value={formData.type} onChange={handleChange}>
          <option value='income'>Income</option>
          <option value='expense'>Expense</option>
        </select>
      </div>

      {(formData.category === '' || customCategory) && (formData.category === 'others' || customCategory) && (
        <input
          type='text'
          placeholder='Enter custom category *'
          value={customCategory}
          onChange={handleCustomCategoryChange}
          required
        />
      )}

      <button type='submit' disabled={!isFormValid() || loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

export default TransactionForm;