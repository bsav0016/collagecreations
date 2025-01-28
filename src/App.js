import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ConstantsProvider } from './context/constantsContext';
import { ToastProvider } from './context/toastContext/toastContext';
import { AuthProvider } from './context/authContext';
import { LocalDatabaseProvider } from './context/databaseContext';
import AdminRoutes from './routes/adminRoutes';
import CustomerRoutes from './routes/customerRoutes';
import { OrderProvider } from './context/orderContext';

function App() {
  return (
    <ConstantsProvider>
      <ToastProvider>
        <LocalDatabaseProvider>
          <Router>
            <Routes>
              <Route path="admin/*" element={<AuthProvider><AdminRoutes /></AuthProvider>} />
              <Route path="/*" element={<OrderProvider><CustomerRoutes /></OrderProvider>} />
            </Routes>
          </Router>
        </LocalDatabaseProvider>
      </ToastProvider>
    </ConstantsProvider>
  );
}

export default App;
