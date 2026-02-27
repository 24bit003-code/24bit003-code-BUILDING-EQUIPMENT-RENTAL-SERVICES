// src/components/CustomerDashboard.js

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
export default function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

const [equipmentCount, setEquipmentCount] = useState(0);
const [rentalCount, setRentalCount] = useState(0);
const [equipmentList, setEquipmentList] = useState([]);

// NOW use them
const animatedEquipmentCount = useCountUp(equipmentCount, 800);
const animatedRentalCount = useCountUp(rentalCount, 800);
  // Example stats
  const stats = [
  {
    title: "Active Rentals",
    value: animatedRentalCount,
    icon: "bi-truck",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)"
  },
  {
    title: "Available Equipments",
    value: animatedEquipmentCount,
    icon: "bi-box-seam",
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)"
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
  const customerData = sessionStorage.getItem("customer");
  if (!customerData){
     navigate('/CustomerLogin');
  }; // if nothing is stored, exit

  // Parse the object to extract email
  let email = null;
  try {
    email = JSON.parse(customerData)?.email;
  } catch (err) {
    console.error("Failed to parse customer from sessionStorage:", err);
    return; // exit if parsing fails
  }

  if (!email) return; // exit if email is missing
  console.log("Fetching customer data for email:", email); // debug

  // Fetch customer from backend
  fetch("http://127.0.0.1:8000/api/get-customer/", { // match Django URL exactly
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => setCustomer(data))
    .catch(err => console.error("Failed to fetch customer:", err));
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
// fetch rental count
useEffect(() => {
  if (!customer?.id) return;

  fetch(`http://127.0.0.1:8000/api/payment/${customer.id}/`)
    .then(res => res.json())
    .then(data => {
      setRentalCount(data.length); // total rentals by customer
    })
    .catch(err => console.error(err));
}, [customer]);

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
          {sidebarOpen && <h4 className="fw-bold">Customer</h4>}
          <button
            className="btn btn-sm btn-light"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* Menu */}
        <ul className="nav flex-column">
  <li className="nav-item mb-2">
    <Link to="/CustomerDashboard" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-house-fill me-2"></i>
      {sidebarOpen && "Dashboard"}
    </Link>
  </li>
  <li className="nav-item mb-2">
    <Link to="/CustomerRental" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-cart-check-fill me-2"></i>
      {sidebarOpen && "My Rentals"}
    </Link>
  </li>
  <li className="nav-item mb-2">
    <Link to="/CustomerEqupments" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-box-seam me-2"></i>
      {sidebarOpen && "Equipments"}
    </Link>
  </li>
  {/* <li className="nav-item mb-2">
    <Link to="/Equipments" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-credit-card me-2"></i>
      {sidebarOpen && "Payments"}
    </Link>
  </li> */}
  <li className="nav-item mb-2 mt-auto">
    <Link to="/Customerprofile" className="nav-link text-white d-flex align-items-center">
       <i className="bi bi-gear-fill me-2"></i>
      {sidebarOpen && "Settings"}
    </Link>
  </li>
  <li className="nav-item">
    <Link to="/Logout" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-box-arrow-right me-2"></i>
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
  Welcome, {customer?.name} <i
            className="bi bi-person-circle text-primary"
            style={{ fontSize: "30px" }}
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
          { title: "Rent Equipment", icon: "bi-plus-circle", link: "/CustomerEqupments" },
          { title: "My Rentals", icon: "bi-box", link: "/CustomerRental" },
          // { title: "Payments", icon: "bi-credit-card", link: "/payments" },
          { title: "Settings", icon: "bi-gear-fill", link: "/Customerprofile" },
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


       {/* Available Equipment Cards */}
<div className="d-flex justify-content-between align-items-center mb-3">
  <h4 className="mb-0">Summary of Available Equipments</h4>

  <Link
    to="/CustomerEqupments"
    className="btn btn-sm text-white"
    style={{
      background: "linear-gradient(180deg, #1b4f72, #2980b9)",
      border: "none",
    }}
  >
    View All Equipments
  </Link>
</div>

<div className="row g-3">
  {equipmentList.map((item, idx) => (
    <div
      key={item.id}
      className="col-12 col-sm-6 col-md-4 col-lg-3"
      style={{
        animation: `fadeSlide 0.5s ease ${idx * 0.1}s forwards`,
        opacity: 0,
      }}
    >
      <div
        className="card shadow-sm h-100"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Equipment Image */}
        <img
          src={
            item.image
              ? `http://127.0.0.1:8000${item.image}`
              : "/placeholder.jpg"
          }
          className="card-img-top"
          alt={item.equipment_name}
          style={{
            height: "150px",
           
          }}
        />

        {/* Equipment Details */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-semibold">
            {item.equipment_name}
          </h5>

          <p
            className="card-text text-muted"
            style={{
              fontSize: "14px",
              minHeight: "40px",
            }}
          >
            {item.description}
          </p>

          <p className="card-text fw-bold mb-3">
            Price/day: Tsh &nbsp;
            <span style={{ color: "#2980b9" }}>
              {item.price_per_day}
            </span>
          </p>

          {/* Rent Button */}
          <button
  className="btn w-100 text-white mt-auto"
  style={{
    background: "linear-gradient(180deg, #1b4f72, #2980b9)",
    border: "none",
    borderRadius: "8px",
  }}
  onClick={() => navigate(`/Payment/${item.id}`)}
>
  Rent Now
</button>
        </div>
      </div>
    </div>
  ))}
</div>
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
