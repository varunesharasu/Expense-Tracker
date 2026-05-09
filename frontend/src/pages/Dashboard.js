import React, { useEffect, useState } from 'react';
import './Dashboard.css';

import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseChart from '../components/ExpenseChart';

import API from '../services/api';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className='dashboard'>
      <Sidebar />

      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h1>Welcome back</h1>
            <p>Track your cashflow with live insights.</p>
          </div>
          <div className='chip'>Live Overview</div>
        </div>

        <div className='section-row'>
          <div>
            <h3 className='section-title'>Overview</h3>
            <p className='section-subtitle'>Your balances and recent flow.</p>
          </div>
          <div className='section-actions'>
            <span className='chip'>Synced</span>
          </div>
        </div>

        <SummaryCards transactions={transactions} />

        <div className='section-row'>
          <div>
            <h3 className='section-title'>New transaction</h3>
            <p className='section-subtitle'>Add income or expenses in seconds.</p>
          </div>
          <div className='section-actions'>
            <span className='chip alt'>Live</span>
          </div>
        </div>

        <div className='dashboard-main'>
          <TransactionForm fetchTransactions={fetchTransactions} />

          <ExpenseChart transactions={transactions} />
        </div>

        <div className='section-row'>
          <div>
            <h3 className='section-title'>Recent activity</h3>
            <p className='section-subtitle'>Review and manage your entries.</p>
          </div>
          <div className='section-actions'>
            <span className='chip outline'>Updated now</span>
          </div>
        </div>

        <TransactionList
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />
      </div>
    </div>
  );
}

export default Dashboard;