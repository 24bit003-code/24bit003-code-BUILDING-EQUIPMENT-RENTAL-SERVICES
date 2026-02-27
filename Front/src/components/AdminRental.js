// src/components/AdminRental.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function AdminRental() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setAdmin] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [, setLoading] = useState(false);       // track loading state
const [payments, setPayments] = useState([]);        // store payments
const [equipmentMap, setEquipmentMap] = useState({}); // store equipment mapped by ID
const [customerMap, setCustomerMap] = useState({}); // store equipment mapped by ID

const [, setError] = useState("");              // store fetch error messages

  // Fetch admin data
  useEffect(() => {
    const adminData = sessionStorage.getItem("admin");
    if (!adminData) {
      navigate("/AdminLogin");
      return;
    }

    let email = null;
    try {
      email = JSON.parse(adminData)?.email;
    } catch (err) {
      console.error("Failed to parse admin:", err);
      return;
    }

    if (!email) return;

    fetch("http://127.0.0.1:8000/api/get-admin/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => setAdmin(data))
      .catch((err) => console.error("Failed to fetch admin:", err));
  }, [navigate]);

  // Fetch all rentals
// Fetch all rentals and equipment
useEffect(() => {
  setLoading(true);

  Promise.all([
    fetch(`http://127.0.0.1:8000/api/payment/`).then(res => res.json()),
    fetch(`http://127.0.0.1:8000/api/equipment/`).then(res => res.json()),
    fetch(`http://127.0.0.1:8000/api/customers/`).then(res => res.json())
  ])
    .then(([paymentsData, equipmentData,customerData]) => {
      setPayments(paymentsData);

      const eqMap = {};
      equipmentData.forEach(eq => {
        eqMap[eq.id] = eq;
      });
      setEquipmentMap(eqMap);
const cusMap = {};
      customerData.forEach(cus => {
        cusMap[cus.id] = cus;
      });
      setCustomerMap(cusMap);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError("Failed to load rentals or equipment.");
      setLoading(false);
    });
}, []); // empty dependency array → runs once on mount
  // Delete rental
  const deleteRental = (id) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) return;

    fetch(`http://127.0.0.1:8000/api/payment/${id}/`, {
      method: "DELETE",
    })
      .then(() => {
        setRentals(rentals.filter((r) => r.id !== id));
        setSuccessMsg("Rental deleted successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to delete rental.");
        setTimeout(() => setErrorMsg(""), 3000);
      });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`text-white p-3 position-fixed h-100 ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        style={{
          width: sidebarOpen ? "200px" : "70px",
          transition: "width 0.3s",
          background: "linear-gradient(180deg, #1b4f72, #2980b9)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {sidebarOpen && <h4 className="fw-bold">Admin</h4>}
          <button
            className="btn btn-sm btn-light"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* Menu */}
        <ul className="nav flex-column h-100">
          <li className="nav-item mb-2">
            <Link to="/AdminDashboard" className="nav-link text-white d-flex align-items-center">
              <i className="bi bi-speedometer2 me-2"></i>
              {sidebarOpen && "Dashboard"}
            </Link>
          </li>
          {/* <li className="nav-item mb-2">
            <Link to="/AdminCustomers" className="nav-link text-white d-flex align-items-center">
              <i className="bi bi-people-fill me-2"></i>
              {sidebarOpen && "Customers"}
            </Link>
          </li> */}
          <li className="nav-item mb-2">
            <Link to="/AdminEquipment" className="nav-link text-white d-flex align-items-center">
              <i className="bi bi-box-seam me-2"></i>
              {sidebarOpen && "Equipments"}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/AdminRental" className="nav-link text-white d-flex align-items-center">
              <i className="bi bi-cart-check-fill me-2"></i>
              {sidebarOpen && "Rentals"}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/AdminProfile" className="nav-link text-white d-flex align-items-center">
              <i className="bi bi-gear-fill me-2"></i>
              {sidebarOpen && "Settings"}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/AdminLogout" className="nav-link text-white d-flex align-items-center">
              <i className="bi bi-box-arrow-right me-2"></i>
              {sidebarOpen && "Logout"}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: sidebarOpen ? "220px" : "60px",
          transition: "margin-left 0.3s",
        }}
      > <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h3 className="mb-4">All Rentals <i className="bi bi-cart-check-fill me-2"></i></h3>

        {successMsg && (
          <div
            className="alert alert-success position-fixed top-0 end-0 m-3"
            style={{ zIndex: 9999 }}
          >
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div
            className="alert alert-danger position-fixed top-0 end-0 m-3"
            style={{ zIndex: 9999 }}
          >
            {errorMsg}
          </div>
        )}
<div className="table-responsive">
  <table className="table table-bordered table-hover align-middle">
    <thead className="table-primary">
      <tr>
        <th>#</th>
        <th>Equipment Name</th>
        <th>Image</th>
        <th>Rented By</th>
        <th>Amount Paid</th>
        <th>Payment Method</th>
        <th>Paid On</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {payments.length === 0 ? (
        <tr>
          <td colSpan="9" className="text-center">No rentals found.</td>
        </tr>
      ) : (
        payments.map((p, idx) => {
          const eq = equipmentMap[p.equipment];
          const cus = customerMap[p.customer]; // get customer details
          return (
            <tr key={p.id}>
              <td>{idx + 1}</td>
              <td>{eq ? eq.equipment_name : "Loading..."}</td>
              <td>
                {eq && eq.image ? (
                  <img
                    src={`http://127.0.0.1:8000${eq.image}`}
                    alt={eq.equipment_name}
                    style={{ width: "80px", height: "70px", borderRadius: "5px" }}
                  />
                ) : "Loading..."}
              </td>
              <td>{cus.name}</td>
              <td>Tsh {p.amount}</td>
              <td>
                Paid through: <b>{p.method}</b><br />
                Sim No: {p.mobile_no}
              </td>
              <td>{new Date(p.paid_on).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteRental(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
      </div>

      {/* Styles */}
      <style>{`
        .nav-link:hover {
          background-color: rgba(255,255,255,0.1);
          border-radius: 8px;
        }
        table th, table td {
          vertical-align: middle !important;
        }
      `}</style>
    </div>
  );
}