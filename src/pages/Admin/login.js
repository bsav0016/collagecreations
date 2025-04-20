import React, { useState } from 'react';
import bigLogo from '../../assets/big-logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import Form from '../../components/form/form';
import FormField from '../../components/form/formField';
import styles from '../Customer/home/home.module.css';
import LoginDTO from '../../dtos/loginDTO/loginDTO';
import appStyles from '../../App.module.css';

//FUTURE: Only allow certain number of attemps for login
function Login() {
  const [loginData, setLoginData] = useState(new LoginDTO())
  const [logoClicked, setLogoClicked] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const success = await login(loginData);
    if (success) {
      navigate('/admin/admin-orders');
    }
    setProcessing(false);
  };

  const updateClicked = () => {
    if (logoClicked >= 4) {
      navigate('/')
    }
    setLogoClicked(prev => prev + 1);
  }

  const fields = [
    { type: "text", text: "Username: ", id: "username", value: loginData.username },
    { type: "password", text: "Password: ", id: "password", value: loginData.password }
  ]

  const handleFieldChange = (fieldName) => (e) => {
    setLoginData(prev => {
      const updatedLoginData = Object.create(Object.getPrototypeOf(prev));
      Object.assign(updatedLoginData, prev);
      updatedLoginData.updateField(fieldName, e.target.value);
      return updatedLoginData;
    });
  };

  return (
    <div className={appStyles.App}>
      <button onClick={updateClicked} className={styles.bigLogo}>
        <img src={bigLogo} alt="Big Logo" />
      </button>

      <HeaderSection
        title="Admin Login"
        fontSize={32}
        fontWeight='bold'
        marginBottom={20}
      />
        <Form onSubmit={handleSubmit}>
          {fields.map(field => (
            <FormField
              key={field.id}
              type={field.type}
              text={field.text}
              id={field.id}
              value={field.value}
              onChange={handleFieldChange(field.id)}
              disabled={processing}
              maxLength={100}
            />
          ))}

          <GeneralButton
            type="submit"
            text="Login"
            disabled={processing}
          />
        </Form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;