import React from 'react';
import './Sidebar.css';
import { useNavigate, NavLink } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='sidebar'>
      <div className='sidebar-top'>
        <div>
          <h2>Expense Tracker</h2>
          <p className='sidebar-subtitle'>Real-time finance workspace</p>
        </div>
        <span className='status-pill'>Online</span>
      </div>

      <div className='sidebar-card'>
        <p className='sidebar-card-title'>Focus</p>
        <p className='sidebar-card-value'>Track, save, grow</p>
      </div>

      <ul>
        <li>
          <NavLink
            to='/dashboard'
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/transactions'
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Transactions
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/budgets'
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Budgets
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/reports'
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Reports
          </NavLink>
        </li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Sidebar;