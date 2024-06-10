import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import bigLogo from '../Assets/big-logo.png'

function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  const navigateToAdminAddWhite = () => {
    navigate('/admin-add-white/');
  };

  const navigateToAdminAddOrder = () => {
    navigate('/admin-add-order/');
  };

  const navigateToAdminOrders = () => {
    navigate('/admin-orders/');
  };

  return (
    <div className="App">
      <header>
        <img src={bigLogo} alt="Big Logo" className="big-logo" style={{ width: '30%' }}/>
      </header>

      <div className="clear-button">
        <button style={{ marginRight: 10 }} className="general-button" onClick={navigateToAdminOrders}>
          View Orders
        </button>
        <button className="general-button" onClick={navigateToAdminAddOrder}>
          Add An Order
        </button>
      </div>

      <div className="clear-button">
        <button className="general-button" onClick={navigateToAdminAddWhite} style={{ marginRight: 10 }}>
          Add White to Square Image
        </button>
      </div>
    </div>
  );
}

export default AdminHome;
