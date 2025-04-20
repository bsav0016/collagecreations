import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Admin/login';
import AdminOrder from '../pages/Admin/adminOrder';
import AdminOrders from '../pages/Admin/adminOrders';
import AdminAddOrder from '../pages/Admin/adminAddOrder';
import AdminAddWhite from '../pages/Admin/adminAddWhite';
import AdminTicket from '../pages/Admin/adminTicket';
import AdminTickets from '../pages/Admin/adminTickets';
import Resolved from '../pages/Admin/resolved';
import NotFound from '../pages/NotFound/notFound';
import { CollageCreation } from '../pages/Customer/collageCreationPage/collageCreationPage';
import Preview from '../pages/Customer/preview/preview';


const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<Login />} />
    <Route path="admin-orders" element={<AdminOrders />} />
    <Route path="admin-order" element={<AdminOrder />} />
    <Route path="resolved-orders" element={<Resolved
      title="Resolved Orders" 
      entryDisplay="Enter order id" 
      navigationExtension="admin-order"
      type="order" 
    />} />
    <Route path="downloaded-orders" element={<Resolved
      title="Downloaded Orders" 
      entryDisplay="Enter order id" 
      navigationExtension="admin-order"
      type="order"
    />} />
    <Route path="admin-add-order" element={<AdminAddOrder />} />
    <Route path="admin-add-white" element={<AdminAddWhite />} />
    <Route path="admin-support-tickets" element={<AdminTickets customOrder={false} />} />
    <Route path="admin-support-ticket" element={<AdminTicket customOrder={false} />} />
    <Route path="resolved-support-tickets" element={<Resolved
      title="Resolved Tickets" 
      entryDisplay="Enter support ticket id" 
      navigationExtension="admin-support-ticket"
      type="supportTicket" 
    />} />
    <Route path="admin-custom-orders" element={<AdminTickets customOrder={true} />} />
    <Route path="admin-custom-order" element={<AdminTicket customOrder={true} />} />
    <Route path="resolved-custom-orders" element={<Resolved
      title="Resolved Custom Orders"
      entryDisplay="Enter custom order id"
      navigationExtension="admin-custom-order"
      type="customOrder"
    />} />
    <Route path="admin-collage" element={<CollageCreation isAdmin={true}/>} />
    <Route path="admin-collage/:step" element={<CollageCreation isAdmin={true}/>} />
    <Route path="admin-preview" element={<Preview isAdmin={true}/>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AdminRoutes;
