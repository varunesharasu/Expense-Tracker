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
    const res = await API.get('/transactions');
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className='dashboard'>
      <Sidebar />

      <div className='dashboard-content'>
        <SummaryCards transactions={transactions} />

        <div className='dashboard-main'>
          <TransactionForm fetchTransactions={fetchTransactions} />

          <ExpenseChart transactions={transactions} />
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