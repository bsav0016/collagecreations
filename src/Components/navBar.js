import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/collage-creation">Create Image Collage</Link></li>
        <li><Link to="/collage-text-creation">Create Text Collage</Link></li>
        <li><Link to="/tips">Helpful Tips</Link></li>
        <li><Link to="/custom-order">Request Custom Order</Link></li>
        <li><Link to="/support">Support</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
