import React from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';

function Budgets() {
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
            <h3>Monthly focus</h3>
            <p>Set category limits and follow your progress.</p>
          </div>
          <span className='chip alt'>Coming soon</span>
        </div>

        <div className='page-grid'>
          <div className='page-card'>
            <h3>Set budgets</h3>
            <p>Define caps for essentials, lifestyle, and savings.</p>
          </div>
          <div className='page-card'>
            <h3>Alerts</h3>
            <p>Get notified when you reach spending thresholds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgets;
