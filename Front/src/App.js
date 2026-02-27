// src/App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; // Home component with equipment
import CustomerLogin from './components/CustomerLogin';
import AdminLogin from './components/AdminLogin';
import CustomerRegister from './components/CustomerRegister';
import CustomerDashboard from './components/CustomerDashboard';
import Logout from './components/Logout';
import AdminDashboard from './components/AdminDashboard';
import AdminLogout from './components/AdminLogout';
import CustomerEqupments from './components/CustomerEqupments';
import Payment from './components/Payment';
import CustomerRental from './components/CustomerRental';
import Customerprofile from './components/Customerprofile';
import AdminProfile from './components/AdminProfile';
import AdminEquipment from './components/AdminEquipment';
import AdminRental from './components/AdminRental';





// import CustomerRegisterAPI from './components/CustomerRegisterAPI';




const App = () => {
  return (
    <Router>
      <div className="app">
       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />}/>
           <Route path="/CustomerLogin" element={<CustomerLogin />}/>
           <Route path="/AdminLogin" element={<AdminLogin />}/>
           <Route path="/CustomerRegister" element={<CustomerRegister />}/>
           <Route path="/CustomerDashboard" element={<CustomerDashboard />}/>
           <Route path="/Logout" element={<Logout />}/>
           <Route path="/AdminDashboard" element={<AdminDashboard />}/>
            <Route path="/AdminLogout" element={<AdminLogout />}/>
            <Route path="/CustomerEqupments" element={<CustomerEqupments />}/>
            <Route path="/Payment/:id" element={<Payment />} />
            <Route path="/CustomerRental" element={<CustomerRental />} />
            <Route path="/Customerprofile" element={<Customerprofile />} />
            <Route path="/AdminProfile" element={<AdminProfile />} />
            <Route path="/AdminEquipment" element={<AdminEquipment />} />
            <Route path="/AdminRental" element={<AdminRental />} />

           {/* <Route path="/CustomerRegisterAPI" element={<CustomerRegisterAPI />}/> */}

          
        </Routes>
      </div> 
    </Router>
  );
};

export default App;
