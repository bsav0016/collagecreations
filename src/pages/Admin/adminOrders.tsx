import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import CategoryDisplay from '../../components/categoryDisplay';
import GeneralButton from '../../components/generalButton/generalButton';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import TextInput from '../../components/textInput/textInput';
import HeaderSection from '../../components/headerSection';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';

interface Order {
  id: number;
  printed: boolean;
  shipped: boolean;
  delivered: boolean;
  orderType: string;
}

function AdminOrders(): React.ReactElement {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [unactionedOrders, setUnactionedOrders] = useState<Order[]>([]);
  const [printedOrders, setPrintedOrders] = useState<Order[]>([]);
  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [downloadOrders, setDownloadOrders] = useState<Order[]>([]);
  const [invalidOrders, setInvalidOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      setLoadingOrders(true);
      if (!userToken) {
        navigate('/admin/login');
      }
      try {
        const retreivedOrders = await OrderService.getOrders(userToken);

        setOrders(retreivedOrders);
        const retreivedIds = retreivedOrders.map((order: Order) => order.id);
        setOrderIds(retreivedIds);

        setUnactionedOrders(retreivedOrders.filter((order: Order) => !order.printed && !order.shipped && !order.delivered && order.orderType === 'order'));
        setPrintedOrders(retreivedOrders.filter((order: Order) => order.printed && !order.shipped && !order.delivered && order.orderType === 'order'));
        setShippedOrders(retreivedOrders.filter((order: Order) => order.printed && order.shipped && !order.delivered && order.orderType === 'order'));
        setDeliveredOrders(retreivedOrders.filter((order: Order) => order.printed && order.shipped && order.delivered && order.orderType === 'order'));
        setDownloadOrders(retreivedOrders.filter((order: Order) => order.orderType === 'download'));
      } catch {
        toastRef.current?.('Network request error');
        navigate('/admin/login');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userToken, navigate]);

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
  }, [orders, unactionedOrders, printedOrders, shippedOrders, deliveredOrders, downloadOrders]);

  const handleOrderClick = (id: number): void => {
    navigate('/admin/admin-order/', {
      state: { id: id }
    });
  };

  const handleGoClick = (): void => {
    const orderId = parseInt(orderNumber);
    if (!Number.isNaN(orderId) && orderIds.includes(orderId)) {
      handleOrderClick(orderId);
    } else {
      toastRef.current?.('Please insert a valid order ID.');
    }
  };

  const navigateCompleted = (): void => {
    navigate('/admin/resolved-orders/', {
      state: { items: deliveredOrders } 
    });
  };

  const navigateDownloaded = (): void => {
    navigate('/admin/downloaded-orders/', {
      state: { items: downloadOrders } 
    });
  };

  return (
    <div>
      <AdminNavBar />
      {loadingOrders ? (
        <LoadingScreen />
      ) : (
        <div className="text-center py-5">
          <HeaderSection
            title='Orders'
            fontWeight='bold'
            fontSize={32}
            marginBottom={20}
          />

          <div className="flex flex-row justify-center">
            <TextInput 
              type="text" 
              value={orderNumber} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOrderNumber(e.target.value)} 
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
      )}
    </div>
  );
}

export default AdminOrders;
