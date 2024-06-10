import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { backendURL } from '../../Constants';
import '../../App.css';

function AdminOrder() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [printed, setPrinted] = useState(false);
    const [printDate, setPrintDate] = useState('');
    const [shipped, setShipped] = useState(false);
    const [shipDate, setShipDate] = useState('');
    const [shippingNumber, setShippingNumber] = useState('');
    const [delivered, setDelivered] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [id, setId] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [orderType, setOrderType] = useState('')
    const [shippingNumberStartedBlank, setShippingNumberStartedBlank] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingDots, setLoadingDots] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login/');
            return;
        }

        try {
            const orderId = location.state.id;
            setId(orderId);
            getOrder(token, orderId);

            return () => {
                if (imageUrl) {
                    URL.revokeObjectURL(imageUrl);
                }
            };
        } catch (error) {
            console.error('Error:', error);
            navigate('/admin-home/');
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
          setLoadingDots((prevDots) => {
            if (prevDots === '...') {
              return '';
            } else {
              return prevDots + '.';
            }
          });
        }, 500);
    })

    const getOrder = async (token, orderId) => {
        try {
            const response = await fetch(`${backendURL}api/orders/${orderId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Set order details retrieved from the backend
                setOrderType(data.order_type);
                setFirstName(data.firstname);
                setLastName(data.lastname);
                setEmail(data.email);
                setAddress1(data.address1);
                setAddress2(data.address2);
                setCity(data.city);
                setState(data.state);
                setZipCode(data.zip);
                setOrderDate(new Date(data.order_date).toLocaleDateString());
                setPrinted(data.printed);
                setPrintDate(new Date(data.print_date).toLocaleDateString());
                setShipped(data.shipped);
                setShipDate(new Date(data.ship_date).toLocaleDateString());
                setShippingNumber(data.shipping_number);
                setDelivered(data.delivered);
                setDeliveryDate(new Date(data.delivery_date).toLocaleDateString());
                if (data.shippingNumber === undefined) {
                    setShippingNumberStartedBlank(true)
                }
                try {
                    processImage(data.image);
                } catch {
                    alert('Failed processing image');
                }
            } else {
                console.error('Error fetching orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const processImage = (imageData) => {
      try {
          const decodedData = atob(imageData);
          const bytes = new Uint8Array(decodedData.length);
          for (let i = 0; i < decodedData.length; i++) {
              bytes[i] = decodedData.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          setImageUrl(imageUrl);
      } catch (error) {
          console.error("Error processing image:", error);
          alert('Could not process image');
      }
    }
  

    const updateDatabase = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login/');
            return;
        }
        var parsedOrderDate = Date()
        var parsedPrintDate = Date()
        var parsedShipDate = Date()
        var parsedDeliveryDate = Date()
        try{
            parsedOrderDate = new Date(orderDate);
            parsedPrintDate = new Date(printDate);
            parsedShipDate = new Date(shipDate);
            parsedDeliveryDate = new Date(deliveryDate);
        }
        catch {
            alert('Please ensure the dates are formatted as MM/DD/YYYY')
            return
        }
        
        setIsSubmitting(true);
        try {
            if (shippingNumberStartedBlank && shippingNumber !== '') {
                sendShippedEmail()
            } 
        
            const response = await fetch(`${backendURL}api/orders/${id}/`, {
                method: 'PUT',
                headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                email: email,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zipCode,
                order_date: parsedOrderDate,
                printed: printed,
                print_date: parsedPrintDate,
                shipped: shipped,
                ship_date: parsedShipDate,
                shipping_number: shippingNumber,
                delivered: delivered,
                delivery_date: parsedDeliveryDate
                })
            });

            if (response.ok) {
                navigate('/admin-home/');
            } else {
                alert('Error updating order:', response.statusText);
            }
        } catch (error) {
            alert('Error updating order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendShippedEmail = async () => {
        let subject = "Your Collage Creations Order has Shipped!"
        let message = `Good news! Your Collage Creations order (order #${id}) has shipped with USPS. The shipping number is ${shippingNumber}.`
        try {
            const response = await fetch(`${backendURL}api/send-email/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ subject, message, email }),
            });
        
            if (response.ok) {
              console.log("Email sent")
            } else {
              const errorMessage = await response.text();
              alert(`Failed to send message: ${errorMessage}`);
            }
        } catch (error) {
            alert('An error occurred while sending your message. Please try again later.');
        }
    }

    return (
        <div className="App">
            <header className="App-header" style={{ flexDirection: 'column' }}>
                <h1>Order Number: {id}</h1>
                <div>
                    <label>Order type: {orderType}</label>
                </div>

                <div>
                    <label>First Name: </label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div>
                    <label>Last Name: </label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div>
                    <label>Email: </label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                { orderType === 'order' ?
                (
                <div>
                    <div>
                        <label>Address 1: </label>
                        <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                    </div>

                    <div>
                        <label>Address 2: </label>
                        <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                    </div>

                    <div>
                        <label>City: </label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>

                    <div>
                        <label>State: </label>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>

                    <div>
                        <label>Zip Code: </label>
                        <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>

                    <div>
                        <label>Order Date: </label>
                        <input type="text" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                    </div>

                    <div>
                        <label>Printed: </label>
                        <input type="checkbox" checked={printed} onChange={(e) => setPrinted(e.target.checked)} />
                    </div>

                    <div>
                        <label>Print Date: </label>
                        <input type="text" value={printDate} onChange={(e) => setPrintDate(e.target.value)} />
                    </div>

                    <div>
                        <label>Shipped: </label>
                        <input type="checkbox" checked={shipped} onChange={(e) => setShipped(e.target.checked)} />
                    </div>

                    <div>
                        <label>Ship Date: </label>
                        <input type="text" value={shipDate} onChange={(e) => setShipDate(e.target.value)} />
                    </div>

                    <div>
                        <label>Shipping Number: </label>
                        <input type="text" value={shippingNumber} onChange={(e) => setShippingNumber(e.target.value)} />
                    </div>

                    <div>
                        <label>Delivered: </label>
                        <input type="checkbox" checked={delivered} onChange={(e) => setDelivered(e.target.checked)} />
                    </div>

                    <div>
                        <label>Delivery Date: </label>
                        <input type="text" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                    </div>
                </div>
                ) :
                <div/>}

                <div>
                    <button onClick={updateDatabase} className='general-button' disabled={isSubmitting}>
                        {isSubmitting ? `Processing${loadingDots}` : 'Update'}
                    </button>
                </div>
                
            </header>

            <div style={{ justifyContent: 'center' }}>
              <img src={imageUrl} alt="Collage" style={{ width: '70%', height: 'auto' }} />
            </div>
        </div>
    );
}

export default AdminOrder;
