import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import API from '../services/api';

function Transactions() {
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
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalCount = transactions.length;
  const lastUpdated = transactions[0]?.createdAt
    ? new Date(transactions[0].createdAt).toLocaleDateString()
    : 'No entries';

  return (
    <div className='dashboard'>
      <Sidebar />

      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h1>Transactions</h1>
            <p>Review, filter, and manage your entries.</p>
          </div>
          <div className='chip outline'>History</div>
        </div>

        <div className='page-banner'>
          <div>
            <h3>All transactions</h3>
            <p>{totalCount} records · Last updated {lastUpdated}</p>
          </div>
          <span className='chip'>Live feed</span>
        </div>

        <SummaryCards transactions={transactions} />

        {error && <div className='page-alert'>{error}</div>}

        {loading ? (
          <div className='page-card'>Loading transactions...</div>
        ) : (
          <TransactionList
            transactions={transactions}
            fetchTransactions={fetchTransactions}
            title='All transactions'
            emptyMessage='No transactions yet.'
          />
        )}
      </div>
    </div>
  );
}

export default Transactions;
