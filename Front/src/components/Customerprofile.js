// src/components/CustomerDashboard.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Customerprofile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Fetch customer data
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
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error("Failed to fetch customer:", err));
  }, [navigate]);

  // Handle password update
  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!newPassword) {
      setErrorMsg("Password cannot be empty.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/customers/${customer.id}/`, {
      method: "PATCH", // PATCH to update only password
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update password");
        return res.json();
      })
      .then((data) => {
        setSuccessMsg("Password updated successfully!");
        setNewPassword(""); // clear form
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to update password.");
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
            <Link
              to="/CustomerDashboard"
              className="nav-link text-white d-flex align-items-center"
            >
              <i className="bi bi-house-fill me-2"></i>
              {sidebarOpen && "Dashboard"}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              to="/CustomerRental"
              className="nav-link text-white d-flex align-items-center"
            >
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
          <li className="nav-item mb-2 mt-auto">
            <Link
              to="/Customerprofile"
              className="nav-link text-white d-flex align-items-center"
            >
               <i className="bi bi-gear-fill me-2"></i>
              {sidebarOpen && "Settings"}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/Logout"
              className="nav-link text-white d-flex align-items-center"
            >
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
      >
<button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h3 className="mb-4">My Profile <i
            className="bi bi-person-circle text-primary"
            style={{ fontSize: "30px" }}
          ></i></h3>

        {!customer ? (
          <p>Loading customer info...</p>
        ) : (
          <>
            {/* Customer Info Cards */}
            <div className="row g-3 mb-4">
              {[
                { title: "Name", value: customer.name },
                { title: "Email", value: customer.email },
                { title: "Phone", value: customer.phone },
                { title: "Address", value: customer.address },
                { title: "Age", value: customer.age },
              ].map((item, idx) => (
                <div className="col-md-6 col-lg-4" key={idx}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Password Update Form */}
            <div className="card shadow-sm p-3" style={{ maxWidth: "400px" }}>
              <h5 className="mb-3">Update Password  <i className="bi bi-gear-fill me-2"></i></h5>
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          transition: all 0.3s;
        }
        .nav-link:hover {
          background-color: rgba(255,255,255,0.1);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}