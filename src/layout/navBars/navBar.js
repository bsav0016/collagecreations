import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './navBar.module.css';
import { CollageCreationStep } from '../../pages/Customer/collageCreationPage/enums/collageCreationStep';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(-1);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setOpenDropdown(-1);
  };

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(-1);
    }
    else {
      setOpenDropdown(index);
    }
  };

  //TODO: Get rid of the arrows
  //TODO: The short menu doesn't work (make page skinny on laptop and you'll see)
  return (
    <nav>
      <div className={styles.menuIcon} onClick={toggleMenu}>
        ☰ Menu
      </div>
      <ul className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/collage">Create Collage</Link></li>
        {/*<li className={styles.dropdown}>
          <span onClick={() => toggleDropdown(0)}>
            Create Collage 
            <span className={styles.caret}>{openDropdown === 0 ? '▲' : '▼'}</span>
          </span>
          { openDropdown === 0 && 
          <ul className={`${styles.dropdownContent} ${openDropdown === 0 ? styles.open : ''}`}>
            <li><Link to="/collage-image-creation">Create Image Collage</Link></li>
            <li><Link to="/collage-text-creation">Create Text Collage</Link></li>
          </ul>
          }
        </li>*/}
        <li><Link to="/tips">Helpful Tips</Link></li>
        <li className={styles.dropdown}>
          <span onClick={() => toggleDropdown(1)}>
            Other Order
            <span className={styles.caret}>{openDropdown === 1 ? '▲' : '▼'}</span>
          </span>
          {openDropdown === 1 &&
          <ul className={`${styles.dropdownContent} ${openDropdown === 1 ? 'open' : ''}`}>
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
