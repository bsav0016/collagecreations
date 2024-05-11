import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/home';
import CollageCreation from './Components/collageCreation';
import CollageTextCreation from './Components/collageTextCreation';
import Support from './Components/support';
import Preview from './Components/preview';
import Order from './Components/order';
import Confirmation from './Components/confirmation';
import MessageConfirmation from './Components/messageConfirmation';
import Login from './Components/login';
import AdminHome from './Components/adminHome';
import AdminOrder from './Components/adminOrder';
import AdminOrders from './Components/adminOrders';
import AdminAddOrder from './Components/adminAddOrder';
import AdminAddWhite from './Components/adminAddWhite';
import Download from './Components/download';
import CustomOrder from './Components/customOrder';
import Tips from './Components/tips';

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
        <Route path="/confirmation/" element={<Confirmation />} />
        <Route path="/message-confirmation/" element={<MessageConfirmation />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/admin-home/" element={<AdminHome />} />
        <Route path="/admin-orders/" element={<AdminOrders />} />
        <Route path="/admin-order/" element={<AdminOrder />} />
        <Route path="/admin-add-order/" element={<AdminAddOrder />} />
        <Route path="/admin-add-white/" element={<AdminAddWhite />} />
        <Route path="/download/" element={<Download />} />
        <Route path="/custom-order/" element={<CustomOrder />} />
        <Route path="/tips/" element={<Tips />} />
      </Routes>
    </Router>
  );
}

export default App;
