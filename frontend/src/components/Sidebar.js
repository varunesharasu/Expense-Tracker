import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='sidebar'>
      <h2>Expense Tracker</h2>

      <ul>
        <li>Dashboard</li>
        <li>Transactions</li>
        <li>Budgets</li>
        <li>Reports</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Sidebar;