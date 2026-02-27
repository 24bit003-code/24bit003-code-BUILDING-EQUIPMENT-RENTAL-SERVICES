// src/components/CustomerLogin.js

import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {

  const navigate = useNavigate();

  // show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // form data
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // alert message
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: ""
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // API call directly in component
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login-admin/",
        formData
      );

      const result = response.data;

      if(result.success){

        // save customer info in sessionStorage
        sessionStorage.setItem("admin", JSON.stringify(result.admin));

        setAlert({
          show: true,
          message: result.message,
          type: "success"
        });

        // redirect to dashboard after 1s
        setTimeout(()=>{
          navigate("/AdminDashboard");
        },1000);

      } else {

        setAlert({
          show: true,
          message: result.message,
          type: "danger"
        });

      }

    } catch (error) {
      setAlert({
        show: true,
        message: "Server error. Try again.",
        type: "danger"
      });
    }

    setTimeout(()=>{
      setAlert({show:false,message:"",type:""});
    },4000);
  };


  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >

      {/* Alert */}
      {alert.show && (
        <div
          className={`alert alert-${alert.type} shadow`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "auto",
            borderRadius: "10px"
          }}
        >
          {alert.message}
        </div>
      )}

      <div
        className="card shadow-lg p-4 text-center"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "15px",
          animation: "fadeSlide 0.8s ease"
        }}
      >
        {/* Customer Icon */}
        <div className="mb-3">
         <i
  className="bi bi-person-fill text-primary"
  style={{ fontSize: "80px" }}
></i>

        </div>

        <h3 className="fw-bold mb-4 text-primary">Admin Login</h3>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                  }`}
                ></i>
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button className="btn btn-primary w-100 py-2 fw-semibold">
            Login
          </button>

        </form>

       
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

    </div>
  );
}
