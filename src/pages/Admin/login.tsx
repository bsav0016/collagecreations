import React, { useState, ChangeEvent, FormEvent } from 'react';
import bigLogo from '../../assets/big-logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import Form from '../../components/form/form';
import FormField from '../../components/form/formField';
import LoginDTO from '../../dtos/loginDTO/loginDTO';

interface FormFieldConfig {
  type: string;
  text: string;
  id: string;
  value: string;
}

function Login(): React.ReactElement {
  const [loginData, setLoginData] = useState<LoginDTO>(new LoginDTO());
  const [logoClicked, setLogoClicked] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setProcessing(true);

    const success = await login(loginData);
    if (success) {
      navigate('/admin/admin-orders');
    }
    setProcessing(false);
  };

  const updateClicked = (): void => {
    if (logoClicked >= 4) {
      navigate('/');
    }
    setLogoClicked(prev => prev + 1);
  };

  const fields: FormFieldConfig[] = [
    { type: "text", text: "Username: ", id: "username", value: loginData.username },
    { type: "password", text: "Password: ", id: "password", value: loginData.password }
  ];

  const handleFieldChange = (fieldName: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setLoginData(prev => {
      const updatedLoginData = Object.create(Object.getPrototypeOf(prev));
      Object.assign(updatedLoginData, prev);
      updatedLoginData.updateField(fieldName, e.target.value);
      return updatedLoginData;
    });
  };

  return (
    <div className="text-center py-5">
      <button onClick={updateClicked} className="border-0 bg-white">
        <img src={bigLogo} alt="Big Logo" className="w-[20%] justify-self-center md:w-[60%]" />
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
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Login;
