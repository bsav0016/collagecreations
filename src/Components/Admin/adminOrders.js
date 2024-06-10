import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendURL } from '../../Constants';
import '../../App.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [orderIds, setOrderIds] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      getOrders(token);
    }
  }, []);

  const getOrders = async (token) => {
    try {
      const response = await fetch(`${backendURL}api/order-ids/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        const ids = data.orders.map(order => order.id);
        setOrderIds(ids);
      } else {
        console.error('Error fetching orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderClick = (id) => {
    navigate('/admin-order/', {
      state: { id: id }
    });
  }

  const handleGoClick = () => {
    const orderId = parseInt(orderNumber);
    if (!Number.isNaN(orderId) && orderIds.includes(orderId)) {
      handleOrderClick(orderId);
    } else {
      alert('Please insert a valid order ID.');
    }
  }

  const unactionedOrders = orders.filter(order => !order.printed && !order.shipped && !order.delivered && order.order_type === 'order');
  const printedOrders = orders.filter(order => order.printed && !order.shipped && !order.delivered && order.order_type === 'order');
  const shippedOrders = orders.filter(order => order.printed && order.shipped && !order.delivered && order.order_type === 'order');
  const deliveredOrders = orders.filter(order => order.printed && order.shipped && order.delivered && order.order_type === 'order');
  const downloadOrders = orders.filter(order => order.order_type === 'download');

  const invalidOrders = orders.filter(order => (
    !unactionedOrders.includes(order) &&
    !printedOrders.includes(order) &&
    !shippedOrders.includes(order) &&
    !deliveredOrders.includes(order) &&
    !downloadOrders.includes(order)
  ));

  return (
    <div className="App">
      <header className="App-header" style={{ flexDirection: 'column'}}>
        <h1>Orders</h1>

        <div>
          <input 
            type="text" 
            value={orderNumber} 
            onChange={(e) => setOrderNumber(e.target.value)} 
            placeholder="Enter order number" 
          />
          <button style={{ margin: 5 }} className='general-button' onClick={handleGoClick}>Go</button>
        </div>

        <div>
          <h2>Invalid Orders</h2>
          {invalidOrders.map(order => (
            <button style={{ margin: 5 }} className='general-button' key={order.id} onClick={() => handleOrderClick(order.id)}>
              Order {order.id}
            </button>
          ))}
        </div>

        <div>
          <h2>Unactioned Orders</h2>
          {unactionedOrders.map(order => (
            <button style={{ margin: 5 }} className='general-button' key={order.id} onClick={() => handleOrderClick(order.id)}>
              Order {order.id}
            </button>
          ))}
        </div>

        <div>
          <h2>Printed Orders</h2>
          {printedOrders.map(order => (
            <button style={{ margin: 5 }} className='general-button' key={order.id} onClick={() => handleOrderClick(order.id)}>
              Order {order.id}
            </button>
          ))}
        </div>

        <div>
          <h2>Shipped Orders</h2>
          {shippedOrders.map(order => (
            <button style={{ margin: 5 }} className='general-button' key={order.id} onClick={() => handleOrderClick(order.id)}>
              Order {order.id}
            </button>
          ))}
        </div>

        <div>
          <h2>Delivered Orders</h2>
          {deliveredOrders.map(order => (
            <button style={{ margin: 5 }} className='general-button' key={order.id} onClick={() => handleOrderClick(order.id)}>
              Order {order.id}
            </button>
          ))}
        </div>

        <div>
          <h2>Download Orders</h2>
          {downloadOrders.map(order => (
            <button style={{ margin: 5 }} className='general-button' key={order.id} onClick={() => handleOrderClick(order.id)}>
              Order {order.id}
            </button>
          ))}
        </div>

      </header>
    </div>
  );
}

export default AdminOrders;
