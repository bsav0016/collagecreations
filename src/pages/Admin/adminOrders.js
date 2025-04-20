import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import CategoryDisplay from '../../components/categoryDisplay';
import GeneralButton from '../../components/generalButton/generalButton';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import TextInput from '../../components/textInput/textInput';
import styles from './search.module.css'
import HeaderSection from '../../components/headerSection';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';
import appStyles from '../../App.module.css';


//TODO: May want to look at restructuring this one... We should really just have an option to search by id, last name, or email, then have a button that will allow the rest of the page to load
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [orderIds, setOrderIds] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const [unactionedOrders, setUnactionedOrders] = useState([]);
  const [printedOrders, setPrintedOrders] = useState([]);
  const [shippedOrders, setShippedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [downloadOrders, setDownloadOrders] = useState([]);
  const [invalidOrders, setInvalidOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      if (!userToken) {
        navigate('/admin/login');
      }
      try {
        const retreivedOrders = await OrderService.getOrders(userToken);

        setOrders(retreivedOrders);
        const retreivedIds = retreivedOrders.map(order => order.id);
        setOrderIds(retreivedIds);

        setUnactionedOrders(retreivedOrders.filter(order => !order.printed && !order.shipped && !order.delivered && order.orderType === 'order'));
        setPrintedOrders(retreivedOrders.filter(order => order.printed && !order.shipped && !order.delivered && order.orderType === 'order'));
        setShippedOrders(retreivedOrders.filter(order => order.printed && order.shipped && !order.delivered && order.orderType === 'order'));
        setDeliveredOrders(retreivedOrders.filter(order => order.printed && order.shipped && order.delivered && order.orderType === 'order'));
        setDownloadOrders(retreivedOrders.filter(order => order.orderType === 'download'));
      } catch {
        toastRef.current('Network request error');
        navigate('/admin/login')
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setInvalidOrders(orders.filter(order => (
        !unactionedOrders.includes(order) &&
        !printedOrders.includes(order) &&
        !shippedOrders.includes(order) &&
        !deliveredOrders.includes(order) &&
        !downloadOrders.includes(order)
      )));
    }
  }, [orders, unactionedOrders, printedOrders, shippedOrders, deliveredOrders, downloadOrders])

  const handleOrderClick = (id) => {
    navigate('/admin/admin-order/', {
      state: { id: id }
    });
  }

  const handleGoClick = () => {
    const orderId = parseInt(orderNumber);
    if (!Number.isNaN(orderId) && orderIds.includes(orderId)) {
      handleOrderClick(orderId);
    } else {
      toastRef.current('Please insert a valid order ID.');
    }
  }

  const navigateCompleted = () => {
    navigate('/admin/resolved-orders/', {
      state: { items: deliveredOrders } 
    })
  }

  const navigateDownloaded = () => {
    navigate('/admin/downloaded-orders/', {
      state: { items: downloadOrders } 
    })
  }

  return (
    <div>
      <AdminNavBar />
      {loadingOrders ?
      <LoadingScreen />
      :
      <div className={appStyles.App}>
        <HeaderSection
          title='Orders'
          fontWeight='bold'
          fontSize={32}
          marginBottom={20}
        />

        <div className={styles.search}>
          <TextInput 
            type="text" 
            value={orderNumber} 
            onChange={(e) => setOrderNumber(e.target.value)} 
            placeholder="Enter order number" 
            maxWidth='300px'
          />

          <GeneralButton
            onClick={handleGoClick}
            text={"Go"}
          />
        </div>

        <CategoryDisplay 
          title='Invalid Orders' 
          type='order' 
          items={invalidOrders} 
        />
        <CategoryDisplay 
          title='Unactioned Orders' 
          type='order' 
          items={unactionedOrders} 
        />
        <CategoryDisplay 
          title='Printed Orders' 
          type='order' 
          items={printedOrders} 
        />
        <CategoryDisplay 
          title='Shipped Orders' 
          type='order' 
          items={shippedOrders} 
        />

        <GeneralButton
          onClick={navigateCompleted}
          text={"Completed Orders"}
        />
        <GeneralButton
          onClick={navigateDownloaded}
          text={"Download Orders"}
        />
      </div>
      }
    </div>
  );
}

export default AdminOrders;
