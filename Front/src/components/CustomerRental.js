import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function CustomerRental() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
// const [equipment, setEquipment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

  // Fetch customer from session
  useEffect(() => {
    const customerData = sessionStorage.getItem("customer");
    if (!customerData) {
      navigate("/CustomerLogin");
      return;
    }

    let email = null;
    try {
      email = JSON.parse(customerData)?.email;
    } catch (err) {
      console.error("Failed to parse customer:", err);
      return;
    }

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

  // Fetch all payments for this customer
  useEffect(() => {
    if (!customer) return;

    fetch(`http://127.0.0.1:8000/api/payment/${customer.id}/`) // your backend should return all payments for a customer
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(err => console.error(err));
  }, [customer]);

  // // Delete a payment (optional, if you allow removing rental)
  // const handleDelete = (paymentId) => {
  //   if (!window.confirm("Are you sure you want to delete this rental?")) return;

  //   fetch(`http://127.0.0.1:8000/api/payment/${paymentId}/`, { method: "DELETE" })
  //     .then(res => {
  //       if (res.ok) {
  //         setPayments(payments.filter(p => p.id !== paymentId));
  //       } else {
  //         console.error("Failed to delete rental");
  //       }
  //     })
  //     .catch(err => console.error(err));
  // };

  const [equipmentMap, setEquipmentMap] = useState({}); // store equipment by ID

useEffect(() => {
  if (!payments.length) return;

  payments.forEach((p) => {
    const eqId = p.equipment; // ID from payment
    // Skip if already fetched
    if (equipmentMap[eqId]) return;

    fetch(`http://127.0.0.1:8000/api/equipment/${eqId}/`)
      .then(res => res.json())
      .then(data => {
        setEquipmentMap(prev => ({ ...prev, [eqId]: data }));
      })
      .catch(err => console.error(err));
  });
}, [equipmentMap,payments]);


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`text-white p-3 position-fixed h-100 ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
        style={{
          width: sidebarOpen ? "200px" : "70px",
          transition: "width 0.3s",
          background: "linear-gradient(180deg, #1b4f72, #2980b9)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {sidebarOpen && <h4 className="fw-bold">Customer</h4>}
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
<button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h3 className="mb-4">My Rentals <i className="bi bi-cart-check-fill me-2"></i></h3>

        {payments.length === 0 ? (
          <p>No rentals found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Equipment Name</th>
                  <th>Image</th>
                  <th>Price/Day</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Paid On</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
               {payments.map((p, idx) => {
  const eq = equipmentMap[p.equipment]; // define eq here
  return (
    <tr key={p.id}>
      <td>{idx + 1}</td>
      <td>{eq ? eq.equipment_name : "Loading..."}</td>
      <td>
        <img
          src={eq ? `http://127.0.0.1:8000${eq.image}` : ""}
          alt={eq ? eq.equipment_name : "Loading..."}
          style={{ width: "80px", height: "70px", borderRadius: "5px" }}
        />
      </td>
      <td>Tsh {eq ? eq.price_per_day : "..."}</td>
      <td>Tsh {p.amount}</td>
      <td>Paid through: <b>{p.method}</b><br></br> Sim No: {p.mobile_no}</td>
      <td>{new Date(p.paid_on).toLocaleString()}</td>
      {/* <td>
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
          Delete
        </button>
      </td> */}
    </tr>
  );
})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .nav-link:hover {
          background-color: rgba(255,255,255,0.1);
          border-radius: 8px;
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
}