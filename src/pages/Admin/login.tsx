import React, { useState, ChangeEvent } from 'react';
import Logo from '../../assets/medium-logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import GeneralButton from '../../components/generalButton/generalButton';
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

  const handleSubmit = async (): Promise<void> => {
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-10">
      <button onClick={updateClicked} className="border-0 bg-transparent cursor-default">
        <img src={Logo} alt="Collage Creations Logo" className="block h-16 w-auto" />
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to manage orders and tickets</p>
      </div>

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
            required
            maxLength={100}
          />
        ))}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <GeneralButton
          type="submit"
          text="Login"
          fullWidth
          disabled={processing}
        />
      </Form>
    </div>
  );
}

export default Login;
