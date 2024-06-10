import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendURL } from '../../Constants';
import '../../App.css';

function AdminAddOrder() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [orderType, setOrderType] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login/');
            return; // Exit early if token is not available
        }
    }, [navigate]);

    const addOrder = async () => {
        if (orderType && state.length > 2) {
            alert('State must be 2 characters (AL, CT, HI, etc)')
            return
        }
        if (firstName.length === 0 || lastName.length === 0 || email.length === 0) {
            alert('First name, last name, and email are required fields')
            return
        }
        if (selectedImage.length === 0) {
            alert('You must select an image')
            return
        }
        if (orderType && (address1.length === 0 || address2.length === 0 || city.length === 0 || state.length === 0 || zipCode.length === 0)) {
            alert('Address 1, City, State, and ZIP are required for a full order')
            return
        }
        setUpdating(true);
        try {
          let body = JSON.stringify({
            image: selectedImage,
            firstname: firstName,
            lastname: lastName,
            email: email,
            order_type: 'download'
          })
          if (orderType) {
            body = JSON.stringify({
                image: selectedImage,
                firstname: firstName,
                lastname: lastName,
                email: email,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zipCode,
                order_type: 'order'
              })
          }
          const response = await fetch(`${backendURL}api/orders/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
          });
          if (response.ok) {
            console.log('Order created successfully');
            const data = await response.json()
            const orderID = data.id
            alert(`Manually added order #${orderID}`)
            navigate('/admin-home/')       
          } else {
            console.error('Failed to create order');
            alert(`Couldn't upload order. Check your inputs, especially email.`)
          }
        } catch (error) {
          console.error('Error creating order:', error);
          alert(`Couldn't upload order. Check your inputs, especially email.`)
        } finally {
            setUpdating(false);
        }
    };

    const handleImageChange = (event) => {
        setUpdating(true);
        try{
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImageUrl(imageUrl);

            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                setSelectedImage(base64String);
            };

            reader.readAsDataURL(file);
        } catch {
            console.log('Error uploading image')
        } finally {
            setUpdating(false)
        }
    };

    return (
        <div className="App">
            <header className="App-header" style={{ flexDirection: 'column'}}>
                <h1>Add Order</h1>
                <div>
                        <label>Check for full order. Uncheck for download: </label>
                        <input type="checkbox" checked={orderType} onChange={(e) => setOrderType(e.target.checked)} />
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

                <div>
                    {orderType &&
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

                    </div>}

                    <div>
                        <header style={{ fontSize: 18, marginTop: 20 }}>
                        Add the image.
                        </header>
                    </div>

                    <div className="add-image-container">
                        <label htmlFor="main-image-upload" className="general-button">
                        Choose Main Image
                        </label>
                        <input type="file" id="main-image-upload" onChange={handleImageChange} accept="image/*" disabled={updating} />
                    </div>
                </div>
                
                <button onClick={addOrder} disabled={updating}>{updating ? "Adding..." : "Add Order"}</button>
            </header>

            { imageUrl &&
                <div style={{ justifyContent: 'center' }}>
                <img src={imageUrl} alt="Collage" style={{ width: '70%', height: 'auto' }} />
                </div>
            }

        </div>
    );
}

export default AdminAddOrder;
