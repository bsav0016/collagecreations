import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Customer/home/home';
import Support from '../pages/Customer/support';
import Preview from '../pages/Customer/preview/preview';
import Order from '../pages/Customer/order';
import BillingPage from '../pages/Customer/billingPage/billingPage';
import Download from '../pages/Customer/download/download';
import Confirmation from '../pages/Customer/confirmation';
import MessageConfirmation from '../pages/Customer/messageConfirmation';
import RegularImageOrder from '../pages/Customer/regularImageOrder';
import Tips from '../pages/Customer/tips/tips';
import NotFound from '../pages/NotFound/notFound';
import { CollageCreation } from '../pages/Customer/collageCreationPage/collageCreationPage';


const CustomerRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {/*<Route path="collage-image-creation" element={<CollageCreation type="image" />} />
    <Route path="collage-text-creation" element={<CollageCreation type="text" />} />*/}
    <Route path="collage" element={<CollageCreation />} />
    <Route path="collage/:step" element={<CollageCreation />} />
    <Route path="support" element={<Support isCustomOrder={false} />} />
    <Route path="custom-order" element={<Support isCustomOrder={true} />} />
    <Route path="preview" element={<Preview />} />
    <Route path="order" element={<Order />} />
    <Route path="billing-page" element={<BillingPage />} />
    <Route path="confirmation" element={<Confirmation />} />
    <Route path="message-confirmation" element={<MessageConfirmation />} />
    <Route path="download" element={<Download />} />
    <Route path="regular-image-order" element={<RegularImageOrder />} />
    <Route path="tips" element={<Tips />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default CustomerRoutes;
