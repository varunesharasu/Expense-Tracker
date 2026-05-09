import React from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';

function Transactions() {
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
            <p>Use the dashboard to add new transactions and manage details.</p>
          </div>
          <span className='chip'>Live feed</span>
        </div>

        <div className='page-grid'>
          <div className='page-card'>
            <h3>Quick tips</h3>
            <p>Group categories and track recurring costs each month.</p>
          </div>
          <div className='page-card'>
            <h3>Categories</h3>
            <p>Organize spend types to keep reporting accurate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
