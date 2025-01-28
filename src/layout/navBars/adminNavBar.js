import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './navBar.module.css';
import { toastRef } from '../../context/toastContext/toastContext';

function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(-1);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(-1);
    }
    else {
      setOpenDropdown(index);
    }
  };

  const confirmSignOut = () => {
    toastRef.current("Sign Out?", "info", async () => {
      signOut();
    });
  }

  const signOut = () => {
    sessionStorage.removeItem('token')
    navigate('/admin/login');
  }

  return (
    <nav>
      <div className={styles.menuIcon} onClick={toggleMenu}>
        ☰ Menu
      </div>
      <ul className={isOpen ? 'open' : ''}>
        <li><Link to="/admin/admin-orders">Orders</Link></li>
        <li><Link to="/admin/admin-support-tickets">Support Tickets</Link></li>
        <li><Link to="/admin/admin-custom-orders">Custom Orders</Link></li>
        <li className={styles.dropdown}>
          <span onClick={() => toggleDropdown(0)}>
            Other
            <span className={styles.caret}>{openDropdown === 0 ? '▲' : '▼'}</span>
          </span>
          { openDropdown === 0 && 
          <ul className={`${styles.dropdownContent} ${openDropdown === 0 ? 'open' : ''}`}>
            <li><Link to="/admin/admin-add-order">Add Order</Link></li>
            <li><Link to="/admin/admin-add-white">Add White</Link></li>
            <li onClick={confirmSignOut} className={styles.dropdownButton}>Sign Out</li>
          </ul>
          }
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavBar;
