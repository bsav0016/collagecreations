import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Customer/home';
import CollageCreation from './Components/Customer/collageCreation';
import CollageTextCreation from './Components/Customer/collageTextCreation';
import Support from './Components/Customer/support';
import Preview from './Components/Customer/preview';
import Order from './Components/Customer/order';
import BillingPage from './Components/Customer/billingPage';
import Download from './Components/Customer/download';
import Confirmation from './Components/Customer/confirmation';
import MessageConfirmation from './Components/Customer/messageConfirmation';
import CustomOrder from './Components/Customer/customOrder';
import RegularImageOrder from './Components/Customer/regularImageOrder';
import Tips from './Components/Customer/tips';

import Login from './Components/Admin/login';
import AdminHome from './Components/Admin/adminHome';
import AdminOrder from './Components/Admin/adminOrder';
import AdminOrders from './Components/Admin/adminOrders';
import AdminAddOrder from './Components/Admin/adminAddOrder';
import AdminAddWhite from './Components/Admin/adminAddWhite';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collage-creation/" element={<CollageCreation />} />
        <Route path="/collage-text-creation/" element={<CollageTextCreation />} />
        <Route path="/support/" element={<Support />} />
        <Route path="/preview/" element={<Preview />} />
        <Route path="/order/" element={<Order />} />
        <Route path="/billing-page/" element={<BillingPage />} />
        <Route path="/confirmation/" element={<Confirmation />} />
        <Route path="/message-confirmation/" element={<MessageConfirmation />} />
        <Route path="/download/" element={<Download />} />
        <Route path="/custom-order/" element={<CustomOrder />} />
        <Route path="/regular-image-order/" element={<RegularImageOrder />} />
        <Route path="/tips/" element={<Tips />} />
        
        <Route path="/login/" element={<Login />} />
        <Route path="/admin-home/" element={<AdminHome />} />
        <Route path="/admin-orders/" element={<AdminOrders />} />
        <Route path="/admin-order/" element={<AdminOrder />} />
        <Route path="/admin-add-order/" element={<AdminAddOrder />} />
        <Route path="/admin-add-white/" element={<AdminAddWhite />} />
      </Routes>
    </Router>
  );
}

export default App;
