import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { processImageString } from '../../utils/modifyImage';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import LoadingDots from '../../components/loadingDots';
import GeneralButton from '../../components/generalButton/generalButton';
import OrderService from '../../services/OrderService';
import HeaderSection from '../../components/headerSection';
import Form from '../../components/form/form';
import FormField from '../../components/form/formField';
import { toastRef } from '../../context/toastContext/toastContext';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import { useAuth } from '../../context/authContext';
import OrderDetailDTO from '../../dtos/OrderDTO/OrderDetailDTO';

interface FormFieldConfig {
  type: string;
  text: string;
  id: string;
  value?: string;
  checked?: boolean;
  required?: boolean;
  maxLength?: number;
}

function AdminOrder(): React.ReactElement {
  const [orderDetails, setOrderDetails] = useState<OrderDetailDTO | null>(null);
  const [id, setId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [shippingNumberStartedBlank, setShippingNumberStartedBlank] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      navigate('/admin/login');
      return;
    }

    try {
      const orderId = location.state?.id;
      setId(orderId);
      getOrder(orderId);

      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    } catch (error) {
      console.error('Error:', error);
      navigate('/admin/admin-orders');
    }
  }, []);

  const getOrder = async (orderId: string): Promise<void> => {
    setLoading(true);
    try {
      const orderDTO = await OrderService.fetchOrder(userToken, orderId);
      setOrderDetails(orderDTO);

      if (orderDTO.shippingNumber === undefined || orderDTO.shippingNumber === '') {
        setShippingNumberStartedBlank(true);
      }
      try {
        const img = await processImageString(orderDTO.image);
        setImageUrl(URL.createObjectURL(img));
      } catch {
        toastRef.current?.('Failed processing image');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toastRef.current?.('Network request error');
    } finally {
      setLoading(false);
    }
  };

  const updateDatabase = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userToken) {
      navigate('/admin/login');
      return;
    }

    if (!orderDetails) return;

    try {
      new Date(orderDetails.orderDate);
      new Date(orderDetails.printDate);
      new Date(orderDetails.shipDate);
      new Date(orderDetails.deliveryDate);
    } catch {
      toastRef.current?.('Please ensure the dates are formatted as MM/DD/YYYY');
      return;
    }

    if (orderDetails.shipped && orderDetails.shippingNumber === '') {
      toastRef.current?.('Please include a shipping number');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await OrderService.updateOrder(userToken, id, orderDetails.jsonify());

      if (response) {
        if (shippingNumberStartedBlank && orderDetails.shippingNumber !== '') {
          await OrderService.sendShipmentEmail(userToken, id, orderDetails.shippingNumber, orderDetails.email);
        }
        navigate('/admin/admin-orders');
      } else {
        toastRef.current?.('Error updating order');
      }
    } catch (error) {
      toastRef.current?.(`Error updating order: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const alwaysVisibleFields: FormFieldConfig[] = orderDetails ? [
    { type: 'text', text: 'First Name: ', id: 'firstname', value: orderDetails.firstname, required: true, maxLength: 100 },
    { type: 'text', text: 'Last Name: ', id: 'lastname', value: orderDetails.lastname, required: true, maxLength: 100 },
    { type: 'email', text: 'Email: ', id: 'email', value: orderDetails.email, required: true, maxLength: 100 },
    { type: 'text', text: 'Order Date: ', id: 'orderDate', value: orderDetails.orderDate, required: true, maxLength: 100 },
  ] : [];
  
  const conditionalFields: FormFieldConfig[] = orderDetails ? [
    { type: 'text', text: 'Address 1: ', id: 'address1', value: orderDetails.address1, required: true, maxLength: 100 },
    { type: 'text', text: 'Address 2: ', id: 'address2', value: orderDetails.address2, required: false, maxLength: 100 },
    { type: 'text', text: 'City: ', id: 'city', value: orderDetails.city, required: true },
    { type: 'state', text: 'State: ', id: 'state', value: orderDetails.state, required: true },
    { type: 'text', text: 'Zip Code: ', id: 'zipCode', value: orderDetails.zipCode, required: true, maxLength: 15 },
    { type: 'checkbox', text: 'Printed: ', id: 'printed', checked: orderDetails.printed, required: false },
    { type: 'text', text: 'Print Date: ', id: 'printDate', value: orderDetails.printDate, required: true, maxLength: 100 },
    { type: 'checkbox', text: 'Shipped: ', id: 'shipped', checked: orderDetails.shipped, required: false },
    { type: 'text', text: 'Ship Date: ', id: 'shipDate', value: orderDetails.shipDate, required: true, maxLength: 100 },
    { type: 'text', text: 'Shipping Number: ', id: 'shippingNumber', value: orderDetails.shippingNumber, required: false, maxLength: 100 },
    { type: 'checkbox', text: 'Delivered: ', id: 'delivered', checked: orderDetails.delivered, required: false },
    { type: 'text', text: 'Delivery Date: ', id: 'deliveryDate', value: orderDetails.deliveryDate, required: true, maxLength: 100 },
  ] : [];

  const costFields: FormFieldConfig[] = orderDetails ? [
    { type: 'label', text: 'Quantity: ', id: 'quantity', value: String(orderDetails.quantity) },
    { type: 'label', text: 'Base Cost: ', id: 'baseCost', value: String(orderDetails.baseCost / 100) },
    { type: 'label', text: 'Shipping Cost: ', id: 'shippingCost', value: String(orderDetails.shippingCost / 100) },
    { type: 'label', text: 'Tax: ', id: 'tax', value: String(orderDetails.tax / 100) },
    { type: 'label', text: 'Total Cost: ', id: 'totalCost', 
      value: String(orderDetails.baseCost / 100 + orderDetails.shippingCost / 100 + orderDetails.tax / 100) }
  ] : [];

  const handleFieldChange = (fieldName: string, checkbox: boolean) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setOrderDetails(prev => {
      if (!prev) return prev;
      const updatedOrderDetails = Object.create(Object.getPrototypeOf(prev));
      Object.assign(updatedOrderDetails, prev);
      if (checkbox) {
        updatedOrderDetails.updateField(fieldName, (e.target as HTMLInputElement).checked);
      }
      else {
        updatedOrderDetails.updateField(fieldName, e.target.value);
      }
      return updatedOrderDetails;
    });
  };

  return (
    <div>
      <AdminNavBar />
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="text-center py-5">
          <HeaderSection
            title={`Order Number: ${id}`}
            fontWeight='bold'
            fontSize={32}
            marginBottom={20}
          />
    
          <Form onSubmit={updateDatabase}>
            {alwaysVisibleFields.map(field => (
              <FormField
                key={field.id}
                type={field.type}
                text={field.text}
                id={field.id}
                value={field.value}
                checked={field.checked}
                onChange={handleFieldChange(field.id, field.type === 'checkbox')} 
                required={field.required}
                disabled={isSubmitting}
                maxLength={field.maxLength}
              />
            ))}
    
            {orderDetails?.orderType === 'order' && conditionalFields.map(field => (
              <FormField
                key={field.id}
                type={field.type}
                text={field.text}
                id={field.id}
                value={field.value}
                checked={field.checked}
                onChange={handleFieldChange(field.id, field.type === 'checkbox')} 
                required={field.required}
                disabled={isSubmitting}
                maxLength={field.maxLength}
                checkboxSize={20}
              />
            ))}

            {costFields.map(field => (
              <FormField
                key={field.id}
                type={field.type}
                text={field.text}
                id={field.id}
                value={field.value}
                checked={field.checked}
                onChange={handleFieldChange(field.id, field.type === 'checkbox')} 
                required={field.required}
                disabled={isSubmitting}
                maxLength={field.maxLength}
              />
            ))}
    
            <GeneralButton
              type="submit"
              disabled={isSubmitting}
              text={isSubmitting ? <>Processing<LoadingDots /></> : 'Update'}
            />
          </Form>
    
          <div className="flex justify-center">
            <img src={imageUrl || ''} alt="Collage" className="w-[70%] h-auto" />
          </div>
        </div>
      )}
    </div>
  );  
}

export default AdminOrder;
