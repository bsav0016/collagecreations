import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchConstants } from '../utils/constants/fetchConstants';
import LoadingScreen from '../components/loadingScreen/loadingScreen';

interface Constants {
  [key: string]: any;
}

interface ConstantsContextType {
  constants: Constants | null;
  loaded: boolean;
}

const ConstantsContext = createContext<ConstantsContextType | null>(null);

export const ConstantsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [constants, setConstants] = useState<Constants | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadConstants = async () => {
      const fetchedConstants = await fetchConstants();
      setConstants(fetchedConstants);
      setLoaded(true);
    };

    loadConstants();
  }, []);

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <ConstantsContext.Provider value={{ constants, loaded }}>
      {children}
    </ConstantsContext.Provider>
  );
};

export const useConstants = (): ConstantsContextType => {
  const context = useContext(ConstantsContext);
  if (!context) {
    throw new Error('useConstants must be used within a ConstantsProvider');
  }
  return context;
};
