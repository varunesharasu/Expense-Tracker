import React, { useEffect, useMemo, useState } from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';
import TransactionList from '../components/TransactionList';
import API from '../services/api';

function Budgets() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const expenseTransactions = useMemo(
    () => transactions.filter((item) => item.type === 'expense'),
    [transactions]
  );

  const totalSpent = expenseTransactions.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const topCategory = useMemo(() => {
    const counts = expenseTransactions.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.length ? entries[0][0] : 'No data';
  }, [expenseTransactions]);

  return (
    <div className='dashboard'>
      <Sidebar />

      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h1>Budgets</h1>
            <p>Plan monthly spend and stay on target.</p>
          </div>
          <div className='chip outline'>Planning</div>
        </div>

        <div className='page-banner'>
          <div>
            <h3>Sent money</h3>
            <p>All expense transactions are listed here.</p>
          </div>
          <span className='chip alt'>Expense view</span>
        </div>

        <div className='page-grid'>
          <div className='page-card'>
            <h3>Total spent</h3>
            <p>${totalSpent.toFixed(2)}</p>
          </div>
          <div className='page-card'>
            <h3>Top category</h3>
            <p>{topCategory}</p>
          </div>
        </div>

        {error && <div className='page-alert'>{error}</div>}

        {loading ? (
          <div className='page-card'>Loading expenses...</div>
        ) : (
          <TransactionList
            transactions={expenseTransactions}
            fetchTransactions={fetchTransactions}
            title='Sent money'
            emptyMessage='No expenses yet.'
          />
        )}
      </div>
    </div>
  );
}

export default Budgets;
