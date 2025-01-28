import React, { createContext, useState, useContext } from 'react';
import loginService from '../services/loginService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [error, setError] = useState('');

  const login = async (loginData) => {   
    if (loginData.username === '' || !loginData.username) {
      setError('Enter username');
      return;
    } 
    else if (loginData.password === '' || !loginData.password) {
      setError('Enter password');
      return;
    }
    try {
      setError('');
      const data = await loginService(loginData);
      setUserToken(data.token);
      return true;
    } catch (error) {
      if (error.message === 'Invalid username/password') {
        setError(error.message);
      }
      else {
        setError('Network error')
      }
      return false;
    }
  };

  const logout = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);