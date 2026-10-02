import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { ConstantsProvider } from "./context/constantsContext";
import { ToastProvider } from "./context/toastContext/toastContext";
import { AuthProvider } from "./context/authContext";
import { CustomerAuthProvider } from "./context/customerAuthContext";
import { LocalDatabaseProvider } from "./context/databaseContext";
import AdminRoutes from "./routes/adminRoutes";
import CustomerRoutes from "./routes/customerRoutes";
import { OrderProvider } from "./context/orderContext";
import { TextSizeProvider } from "./context/textSizeContext";

function App(): React.ReactElement {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TextSizeProvider>
        <HelmetProvider>
        <ConstantsProvider>
        <ToastProvider>
          <LocalDatabaseProvider>
            <OrderProvider>
              <Router>
                <Routes>
                  <Route
                    path="admin/*"
                    element={
                      <AuthProvider>
                        <AdminRoutes />
                      </AuthProvider>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <CustomerAuthProvider>
                        <CustomerRoutes />
                      </CustomerAuthProvider>
                    }
                  />
                </Routes>
              </Router>
            </OrderProvider>
          </LocalDatabaseProvider>
        </ToastProvider>
      </ConstantsProvider>
    </HelmetProvider>
    </TextSizeProvider>
    </ThemeProvider>
  );
}

export default App;
