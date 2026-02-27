// src/components/CustomerDashboard.js

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
export default function CustomerEqupments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
const [, setCustomer] = useState(null);
  const navigate = useNavigate();

  // Example stats
  // const stats = [
  //   { title: "Total Orders", value: 12, icon: "bi-cart-fill", color: "primary" },
  //   { title: "Active Rentals", value: 3, icon: "bi-truck", color: "success" },
  //   { title: "Pending Payments", value: 2, icon: "bi-wallet2", color: "warning" },
  // ];

  // Example equipment list
const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/equipment/")
    .then(res => res.json())
    .then(data => {
      setEquipmentList(data); // <-- use all items
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
      
          
               
     
{/* Main Content */}
<div
  className="flex-grow-1 p-4"
  style={{ marginLeft: sidebarOpen ? "220px" : "60px", transition: "margin-left 0.3s" }}
>
<button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

  <h3 className="mb-4">All Equipments Available  <i className="bi bi-box-seam me-2"></i> </h3>
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
            src={item.image ? `http://127.0.0.1:8000${item.image}` : "/placeholder.jpg"}
            className="card-img-top"
            alt={item.equipment_name}
            style={{ height: "150px"}}
          />

          {/* Equipment Details */}
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-semibold">{item.equipment_name}</h5>
            <p className="card-text text-muted" style={{ fontSize: "14px", minHeight: "40px" }}>
              {item.description}
            </p>
            <p className="card-text fw-bold mb-3">
              Price/day: <span style={{ color: "#2980b9" }}>Tsh {item.price_per_day}</span>
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
        `}
      </style>
    </div>
  );
}
