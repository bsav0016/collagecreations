import React from 'react';
import { Link } from 'react-router-dom';

function Footer(): React.ReactElement {
  return (
    <footer className="mt-12 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link to="/terms" className="hover:underline">Terms of Service</Link>
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link to="/refund-policy" className="hover:underline">Refund &amp; Return Policy</Link>
        <Link to="/support" className="hover:underline">Support</Link>
      </nav>
      <p className="mt-3">&copy; {new Date().getFullYear()} Collage Creations</p>
    </footer>
  );
}

export default Footer;
