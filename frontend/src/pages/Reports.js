import React from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';

function Reports() {
  return (
    <div className='dashboard'>
      <Sidebar />

      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h1>Reports</h1>
            <p>Spot trends and optimize your cashflow.</p>
          </div>
          <div className='chip outline'>Insights</div>
        </div>

        <div className='page-banner'>
          <div>
            <h3>Analytics overview</h3>
            <p>See your spending and income patterns at a glance.</p>
          </div>
          <span className='chip'>Realtime</span>
        </div>

        <div className='page-grid'>
          <div className='page-card'>
            <h3>Spending trends</h3>
            <p>Track how expenses shift over time.</p>
          </div>
          <div className='page-card'>
            <h3>Income vs expense</h3>
            <p>Compare inflow and outflow for balance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
