// src/components/Payment.js

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

const getImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_BASE}${image}`;
};

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams(); // equipment ID from URL
// Mobile number for mobile payments
const [mobileNo, setMobileNo] = useState("");
  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Customer & Equipment
  const [customer, setCustomer] = useState(null);
  const [equipment, setEquipment] = useState(null);

  // Rental
  const [days, setDays] = useState(1);
  const [total, setTotal] = useState(0);

  // Payment method
  const [method, setMethod] = useState("Mpesa");

  // Success message
  const [successMsg, setSuccessMsg] = useState("");

  //////////////////////////////////////////////////////
  // Fetch Equipment by ID
  //////////////////////////////////////////////////////
  useEffect(() => {
  if (!id) {
    console.log("No ID in URL params");
    return;
  }

  fetch(`http://127.0.0.1:8000/api/equipment/${id}/`)
    .then(res => {
      console.log("Equipment fetch status:", res.status);
      if (!res.ok) throw new Error("Failed to fetch equipment");
      return res.json();
    })
    .then(data => {
      console.log("Equipment data:", data);
      setEquipment(data);
    })
    .catch(err => console.error("Fetch error:", err));
}, [id]);

  //////////////////////////////////////////////////////
  // Fetch Customer from session
  //////////////////////////////////////////////////////
  useEffect(() => {
    const customerData = sessionStorage.getItem("customer");

    if (!customerData) {
      navigate("/CustomerLogin");
      return;
    }

    const email = JSON.parse(customerData)?.email;
    if (!email) return;

    fetch("http://127.0.0.1:8000/api/get-customer/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => setCustomer(data))
      .catch(err => console.error(err));
  }, [navigate]);

  //////////////////////////////////////////////////////
  // Calculate total price
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (equipment) {
      setTotal(days * parseFloat(equipment.price_per_day));
    }
  }, [days, equipment]);

  //////////////////////////////////////////////////////
  // Handle Confirm Rental
  //////////////////////////////////////////////////////
  const handleRental = (e) => {
  e.preventDefault();

  if (!customer || !equipment || !equipment.id) {
    alert("Equipment or customer not loaded yet!");
    return;
  }

  const payload = {
    customer: customer.id,
    equipment: equipment.id,
    amount: parseFloat(total),
    method,
    mobile_no: mobileNo,
  };

  console.log("Submitting payment:", payload);

  fetch("http://127.0.0.1:8000/api/payment/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async res => {
      if (!res.ok) {
        const text = await res.text(); // read raw response (HTML on 500)
        console.error("Server error:", text);
        throw new Error("Payment failed");
      }
      return res.json();
    })
    .then(data => {
      console.log("Payment saved:", data);
      setSuccessMsg("Payment Successful!");
      setTimeout(() => setSuccessMsg(""), 3000);
    })
    .catch(err => console.error("Fetch error:", err));
};
  if (!equipment) {
    return (
      <div className="container mt-5">
        <h4>Loading equipment...</h4>
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // JSX
  //////////////////////////////////////////////////////
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <div
        className="text-white p-3 position-fixed h-100"
        style={{
          width: sidebarOpen ? "200px" : "70px",
          transition: "0.3s",
          background: "linear-gradient(180deg, #1b4f72, #2980b9)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {sidebarOpen && <h4>Customer</h4>}
          <button className="btn btn-sm btn-light" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
    <Link to="/Profile" className="nav-link text-white d-flex align-items-center">
      <i className="bi bi-person-circle me-2"></i>
      {sidebarOpen && "Profile"}
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
        style={{ marginLeft: sidebarOpen ? "220px" : "80px", transition: "0.3s" }}
      >
        {/* Success Message */}
        {successMsg && (
          <div
            className="alert alert-success position-fixed"
            style={{ top: "20px", right: "20px", zIndex: 9999 }}
          >
            {successMsg}
          </div>
        )}

        {/* Back */}
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="row">
          {/* Equipment Image */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
  <img
    src={getImageUrl(equipment.image)}
    alt={equipment.equipment_name}
    className="img-fluid rounded shadow"
    style={{
      width: '300px',   // desired width
      height: '300px',  // desired height
      objectFit: "cover",
    }}
  />
</div>

          {/* Equipment Details */}
          <div className="col-md-6">
            <h2>{equipment.equipment_name}</h2>
            <p>{equipment.description}</p>
            <h4 className="text-primary">Price per day: Tsh {equipment.price_per_day}</h4>

            <hr />

            <form onSubmit={handleRental}>
  <label className="form-label">Number of Days</label>
  <input
    type="number"
    min="1"
    value={days}
    onChange={(e) => setDays(e.target.value)}
    className="form-control mb-3"
    required
  />

  <label className="form-label">Payment Method</label>
  <select
    className="form-select mb-3"
    value={method}
    onChange={(e) => setMethod(e.target.value)}
    required
  >
    <option value="">Select method</option>
    <option value="Mpesa">Mpesa</option>
    <option value="Airtel Money">Airtel Money</option>
  </select>

  {(method === "Mpesa" || method === "Airtel Money") && (
    <div className="mb-3">
      <label className="form-label">Mobile Number</label>
      <input
        type="number"
        min="10"
        className="form-control"
        placeholder="Enter your mobile number"
        value={mobileNo}
        onChange={(e) => setMobileNo(e.target.value)}
        required
      />
    </div>
  )}

  <h5>Total Price: <span className="text-success">Tsh {total}</span></h5>

  <button
  type="submit"
  className="btn btn-success w-100 mt-3"
  disabled={!equipment || !customer}
>
  Confirm Rental
</button>
</form>
          </div>
        </div>
      </div>
      <style>
{`
  .nav-link:hover {
    background-color: rgba(255,255,255,0.1);
    border-radius: 8px;
    transition: background-color 0.3s;
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
