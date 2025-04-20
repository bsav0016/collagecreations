import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import GeneralButton from '../../components/generalButton/generalButton';
import LoadingDots from '../../components/loadingDots';
import HeaderSection from '../../components/headerSection';
import FormField from '../../components/form/formField';
import Form from '../../components/form/form';
import OrderAddDTO from '../../dtos/OrderDTO/OrderAddDTO';
import Checkbox from '../../components/checkbox/checkbox';
import ImageUpload from '../../components/imageUpload/imageUpload';
import RequiredFieldDesignator from '../../components/requiredFieldDesignator/requiredFieldDesignator';
import OrderService from '../../services/OrderService';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';
import appStyles from '../../App.module.css';

function AdminAddOrder() {
    const [orderAdd, setOrderAdd] = useState(new OrderAddDTO());
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const { userToken } = useAuth();

    useEffect(() => {
        if (!userToken) {
            navigate('/admin/login');
            return;
        }
    }, []);

    function maxTwoDecimals(value) {
        const pattern = /^\d+(\.\d{1,2})?$/;
        return pattern.test(value);
    }

    const addOrder = async () => {
        if (!userToken) {
            navigate('/admin/login');
            return;
        }

        if (orderAdd.firstname.length === 0 || orderAdd.lastname.length === 0 || orderAdd.email.length === 0) {
            toastRef.current('First name, last name, and email are required fields');
            return;
        }
        if (selectedImage.length === 0) {
            toastRef.current('You must select an image');
            return;
        }
        if (!(maxTwoDecimals(orderAdd.baseCost) && maxTwoDecimals(orderAdd.tax) && maxTwoDecimals(orderAdd.shippingCost))) {
            toastRef.current('All costs must be numbers with a max of 2 decimal places.');
            return;
        }
        
        if (orderAdd.isOrder) {
            const zipCodePattern = /^\d{5}$/;
            if (!zipCodePattern.test(orderAdd.zipCode)) {
                toastRef.current('Zip Code must be exactly 5 digits.');
                return;
            }
            if (orderAdd.state.length !== 2) {
                toastRef.current('State must be 2 characters (AL, CT, HI, etc)');
                return;
            }
            if (
                orderAdd.address1.length === 0 || 
                orderAdd.city.length === 0 || 
                orderAdd.state.length === 0 
            ) {
                toastRef.current('Address 1, City, and State are required');
                return;
            }
            const quantityPattern = /^\d+$/;
            if (!quantityPattern.test(orderAdd.quantity)) {
                toastRef.current('Quantity must be a positive integer');
                return;
            }
        }

        setUpdating(true);
        try {
            const data = await OrderService.newOrder(orderAdd, selectedImage, userToken);
            const orderID = data.order_id;
            toastRef.current(`Manually added order #${orderID}`);
            navigate('/admin/admin-orders');
        } catch (error) {
            console.error('Error creating order: ', error);
            toastRef.current(`Couldn't upload order. Check your inputs, especially email.`);
        } finally {
            setUpdating(false);
        }
    };

    const handleImageChange = (event) => {
        setUpdating(true);
        try {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);
            setSelectedImage(file);
        } catch {
            console.log('Error uploading image');
        } finally {
            setUpdating(false);
        }
    };

    const unconditionalFields = [
        { type: 'text', id: 'firstname', text: 'First Name: ', value: orderAdd.firstname, required: true },
        { type: 'text', id: 'lastname', text: 'Last Name: ', value: orderAdd.lastname, required: true },
        { type: 'text', id: 'email', text: 'Email: ', value: orderAdd.email, required: true },
        { type: 'text', id: 'baseCost', text: 'Total Base Cost: ', value: orderAdd.baseCost, required: true },
        { type: 'text', id: 'shippingCost', text: 'Total Shipping Cost: ', value: orderAdd.shippingCost, required: true },
        { type: 'text', id: 'tax', text: 'Tax: ', value: orderAdd.tax, required: true }
    ]

    const conditionalFields = [
        { type: 'text', id: 'quantity', text: "Quantity: ", value: orderAdd.quantity, required: true },
        { type: 'text', id: 'address1', text: 'Address Line 1: ', value: orderAdd.address1, required: true },
        { type: 'text', id: 'address2', text: 'Address Line 2: ', value: orderAdd.address2, required: false },
        { type: 'text', id: 'city', text: 'City: ', value: orderAdd.city, required: true },
        { type: 'state', id: 'state', text: 'State: ', value: orderAdd.state, required: true },
        { type: 'text', id: 'zipCode', text: 'Zip Code: ', value: orderAdd.zipCode, required: true },
    ]

    const handleFieldChange = (fieldName, checkbox) => (e) => {
        setOrderAdd(prev => {
            const updatedOrderAdd = Object.create(Object.getPrototypeOf(prev));
            Object.assign(updatedOrderAdd, prev);
            if (checkbox) {
                updatedOrderAdd.updateField(fieldName, e.target.checked);
            }
            else {
                updatedOrderAdd.updateField(fieldName, e.target.value);
            }
            return updatedOrderAdd;
        });
    };

    return (
        <div>
            <AdminNavBar />
            <div className={appStyles.App}>
                <HeaderSection
                    title='Add Order'
                    fontWeight='bold'
                    fontSize={32}
                    marginBottom={20}
                />

                <RequiredFieldDesignator />
                <Form onSubmit={addOrder}>
                <div className='row-display'>
                    <p>Check for full order. Uncheck for download: </p>
                    <Checkbox
                        id="isOrder"
                        checked={orderAdd.isOrder}
                        onChange={handleFieldChange('isOrder', true)}
                        disabled={updating}
                        marginLeft={5}
                    />
                </div>
                    {unconditionalFields.map(field => (
                        <FormField
                            key={field.id}
                            type={field.type}
                            id={field.id}
                            text={field.text}
                            value={field.value}
                            checked={field.checked}
                            disabled={updating}
                            required={field.required}
                            onChange={handleFieldChange(field.id, field.type === "checkbox")}
                        />
                    ))}
                    { (orderAdd.isOrder === true) && 
                        conditionalFields.map(field => (
                            <FormField
                                key={field.id}
                                type={field.type}
                                id={field.id}
                                text={field.text}
                                value={field.value}
                                checked={field.checked}
                                disabled={updating}
                                required={field.required}
                                onChange={handleFieldChange(field.id, field.type === "checkbox")}
                            />
                        ))
                    }
                </Form>

                <ImageUpload
                    id="image-upload"
                    title="Choose Image"
                    onChange={handleImageChange}
                    disabled={updating}
                />

                <GeneralButton
                    type='submit'
                    onClick={addOrder}
                    disabled={updating}
                    text={updating ? <>Adding<LoadingDots/></> : "Add Order"}
                />
                
                { imageUrl &&
                    <div style={{ justifyContent: 'center' }}>
                        <img src={imageUrl} alt="Collage" style={{ width: '70%', height: 'auto' }} />
                    </div>
                }

            </div>
        </div>
    );
}

export default AdminAddOrder;
