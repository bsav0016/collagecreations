import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/navBar.css';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(-1);

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

  return (
    <nav style={{ backgroundColor: '#282c34' }}>
      <div className="menu-icon" onClick={toggleMenu}>
        ☰ Menu
      </div>
      <ul className={isOpen ? 'open' : ''}>
        <li><Link to="/">Home</Link></li>
        <li className="dropdown">
          <span onClick={() => toggleDropdown(0)}>
            Create Collage 
            <span className="caret">{openDropdown === 0 ? '▲' : '▼'}</span>
          </span>
          { openDropdown === 0 && 
          <ul className={`dropdown-content ${openDropdown === 0 ? 'open' : ''}`}>
            <li><Link to="/collage-creation">Create Image Collage</Link></li>
            <li><Link to="/collage-text-creation">Create Text Collage</Link></li>
          </ul>
          }
        </li>
        <li><Link to="/tips">Helpful Tips</Link></li>
        <li className="dropdown">
          <span onClick={() => toggleDropdown(1)}>
            Other Order
            <span className="caret">{openDropdown === 1 ? '▲' : '▼'}</span>
          </span>
          {openDropdown === 1 &&
          <ul className={`dropdown-content ${openDropdown === 1 ? 'open' : ''}`}>
            <li><Link to="/regular-image-order">Regular Large Format Print</Link></li>
            <li><Link to="/custom-order">Request Custom Order</Link></li>
          </ul>
          }
        </li>
        <li><Link to="/support">Support</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
