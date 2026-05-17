import React from 'react';
import './Sidebar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { VscAccount, VscArchive, VscHome, VscSettingsGear, VscSignOut } from 'react-icons/vsc';
import Dock from './Dock';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: <VscHome size={18} />, to: '/dashboard' },
    { label: 'Transactions', icon: <VscArchive size={18} />, to: '/transactions' },
    { label: 'Budgets', icon: <VscAccount size={18} />, to: '/budgets' },
    { label: 'Reports', icon: <VscSettingsGear size={18} />, to: '/reports' }
  ];

  const dockItems = [
    ...navItems.map((item) => ({
      icon: item.icon,
      label: item.label,
      onClick: () => navigate(item.to),
      className: location.pathname === item.to ? 'is-active' : ''
    })),
    {
      icon: <VscSignOut size={18} />,
      label: 'Logout',
      onClick: logout,
      className: 'is-danger'
    }
  ];

  return (
    <div className='nav-dock'>
      <Dock
        items={dockItems}
        panelHeight={70}
        baseItemSize={52}
        magnification={76}
      />
    </div>
  );
}

export default Sidebar;