// src/components/CustomerDashboard.js

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

const [equipmentCount, setEquipmentCount] = useState(0);
const [rentalCount, setRentalCount] = useState(0);
const [, setEquipmentList] = useState([]);
const [customerCount, setCustomerCount] = useState(0);
// NOW use them
const animatedEquipmentCount = useCountUp(equipmentCount, 800);
const animatedRentalCount = useCountUp(rentalCount, 800);
const animatedCustomerCount = useCountUp(customerCount, 800);
  // Example stats
 const stats = [
  {
    title: "All Rentals",
    value: animatedRentalCount,
    icon: "bi-truck",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)"
  },
  {
    title: "Equipments Available",
    value: animatedEquipmentCount,
    icon: "bi-box-seam",
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)"
  },
  {
    title: "All Customers",
    value: animatedCustomerCount,
    icon: "bi-people-fill",
    gradient: "linear-gradient(135deg, #00b09b, #96c93d)"
  }
];




  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/equipment/")
    .then(res => res.json())
    .then(data => {
      setEquipmentList(data.slice(0, 4)); // only first 4
    })
    .catch(err => console.error(err));
}, []);

  // fetch customer data using email
useEffect(() => {
  // Get the stored customer object
  const adminData = sessionStorage.getItem("admin");
  if (!adminData){
     navigate('/AdminLogin');
  }; // if nothing is stored, exit

  // Parse the object to extract email
  let email = null;
  try {
    email = JSON.parse(adminData)?.email;
  } catch (err) {
    console.error("Failed to parse admin from sessionStorage:", err);
    return; // exit if parsing fails
  }

  if (!email) return; // exit if email is missing
  console.log("Fetching admin data for email:", email); // debug

  // Fetch customer from backend
  fetch("http://127.0.0.1:8000/api/get-admin/", { // match Django URL exactly
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => setAdmin(data))
    .catch(err => console.error("Failed to fetch admin:", err));
}, [navigate]);

// count all equipment
useEffect(() => {
  fetch("http://127.0.0.1:8000/api/equipment/")
    .then(res => res.json())
    .then(data => {
      setEquipmentList(data.slice(0, 4));
      setEquipmentCount(data.length); // total equipment count
    })
    .catch(err => console.error(err));
}, []);

// count all rental
useEffect(() => {
  fetch("http://127.0.0.1:8000/api/payment/")
    .then(res => res.json())
    .then(data => {
      setRentalCount(data.length);
    })
    .catch(err => console.error("Rental count error:", err));
}, []);

// count all customer
useEffect(() => {
  fetch("http://127.0.0.1:8000/api/customers/")
    .then(res => res.json())
    .then(data => {
      setCustomerCount(data.length);
    })
    .catch(err => console.error("Customer count error:", err));
}, []);


// count animation hook
function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
  className={`text-white p-3 position-fixed h-100 ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
  style={{
    width: sidebarOpen ? "200px" : "70px",
    transition: "width 0.3s",
     background: "linear-gradient(180deg, #1b4f72, #2980b9)", // matching primary blue
  }}
>

        <div className="d-flex justify-content-between align-items-center mb-4">
          {sidebarOpen && <h4 className="fw-bold">Admin </h4>}
          <button
            className="btn btn-sm btn-light"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>

          
        </div>
 

       {/* Menu */}
<ul className="nav flex-column h-100">

  {/* Dashboard */}
  <li className="nav-item mb-2">
    <Link to="/AdminDashboard" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-speedometer2 me-2"></i>
      {sidebarOpen && "Dashboard"}
    </Link>
  </li>

  {/* Customers */}
  {/* <li className="nav-item mb-2">
    <Link to="/AdminCustomers" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-people-fill me-2"></i>
      {sidebarOpen && "Customers"}
    </Link>
  </li> */}

  {/* Equipments */}
  <li className="nav-item mb-2">
    <Link to="/AdminEquipment" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-box-seam me-2"></i>
      {sidebarOpen && "Equipments"}
    </Link>
  </li>

  {/* Rentals */}
  <li className="nav-item mb-2">
    <Link to="/AdminRental" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-cart-check-fill me-2"></i>
      {sidebarOpen && "Rentals"}
    </Link>
  </li>

  {/* Settings */}
  <li className="nav-item mb-2">
    <Link to="/AdminProfile" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-gear-fill me-2"></i>
      {sidebarOpen && "Settings"}
    </Link>
  </li>

<li className="nav-item mb-2">
    <Link to="/AdminLogout" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-gear-fill me-2"></i>
      {sidebarOpen && "Logout"}
    </Link>
  </li>



</ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{ marginLeft: sidebarOpen ? "220px" : "60px", transition: "margin-left 0.3s" }}
      >
       <h2 className="mb-4">
  Welcome, {admin?.name} <i
  className="bi bi-person-fill text-primary"
  style={{ fontSize: "40px" }}
></i>
</h2>
        {/* Stats Cards */}
       <div className="row g-4 mb-4">
  {stats.map((stat, idx) => (
    <div
      key={idx}
      className="col-12 col-sm-6 col-md-4 col-lg-3"
      style={{
        animation: `fadeSlide 0.6s ease ${idx * 0.2}s forwards`,
        opacity: 0
      }}
    >
      <div
        className="card stat-card text-white shadow-lg border-0"
        style={{
          background: stat.gradient,
          borderRadius: "16px",
          overflow: "hidden"
        }}
      >
        <div className="card-body d-flex align-items-center justify-content-between">

          {/* Icon */}
          <div className="icon-container">
            <i className={`bi ${stat.icon}`}></i>
          </div>

          {/* Text */}
          <div className="text-end">
            <h6 className="mb-1 fw-semibold">
              {stat.title}
            </h6>

            <h2 className="fw-bold mb-0">
              {stat.value}
            </h2>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>




     
               

      {/* Quick Actions */}
      <h5 className="mt-5 mb-3 fw-semibold">Quick Actions Services</h5>
      <div className="row g-3">
        {[
          { title: "Equipments", icon: "bi-plus-circle", link: "/AdminEquipment" },
          { title: "Rentals", icon: "bi-box", link: "/AdminRental" },
          // { title: "Payments", icon: "bi-credit-card", link: "/payments" },
          { title: "Setting", icon: "bi-gear-fill", link: "/AdminProfile" },
        ].map((item, i) => (
          <div key={i} className="col-6 col-md-3">
            <Link
              to={item.link}
              className="text-decoration-none"
            >
              <div
                className="card text-center shadow-sm h-100"
                style={{
                  borderRadius: "16px",
                  transition: "transform 0.3s",
                }}
              >
                <div className="card-body">
                  <i
                    className={`bi ${item.icon} fs-2`}
                    style={{ color: "#2980b9" }}
                  ></i>
                  <p className="mt-2 fw-semibold">{item.title}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div><br></br><br></br>


     

      </div>

      {/* Animations & Styles */}
      <style>
        {`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          }

          .nav-link:hover {
            background-color: rgba(255,255,255,0.1);
            border-radius: 8px;
          }

          .sidebar-open .nav-link i {
            transition: transform 0.3s;
          }

          .sidebar-closed .nav-link i {
            font-size: 1.2rem;
          }
            .stat-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.icon-container {
  font-size: 2.5rem;
  background: rgba(255,255,255,0.2);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
        `}
      </style>
    </div>
  );
}
