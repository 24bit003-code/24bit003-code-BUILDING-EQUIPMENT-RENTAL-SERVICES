// src/components/CustomerRegisterHorizontal.js

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CustomerRegisterHorizontal() {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    age: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/register-customer/",
        formData
      );

      if (response.data.success === false) {

        setAlert({
          show: true,
          message: response.data.message,
          type: "danger"
        });

      } else {

        setAlert({
          show: true,
          message: response.data.message,
          type: "success"
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          age: "",
        });

      }

      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 4000);

    } catch (error) {

      setAlert({
        show: true,
        message: "Server error. Try again.",
        type: "danger"
      });

    }

  };


  return (
    <div className="d-flex justify-content-center align-items-center"
         style={{ minHeight: "100vh", padding: "20px", background: "#f8f9fa" }}>

      {/* ALERT TOP RIGHT */}
      {alert.show && (
        <div
          className={`alert alert-${alert.type} shadow`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
            borderRadius: "10px"
          }}
        >
          {alert.message}
        </div>
      )}

      <div className="card shadow-lg p-4"
           style={{ minHeight: "70vh", width: "100%", maxWidth: "900px", borderRadius: "20px" }}>

        <div className="row g-3 align-items-center">

          <div className="col-12 col-md-4 text-center">
            <i className="bi bi-person-circle text-primary"
               style={{ fontSize: "100px" }}></i>
          </div>

          <div className="col-12 col-md-8">

            <h3 className="text-primary fw-bold mt-2">
              Customer Registration
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="row g-2">

                <div className="col-md-6">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Phone</label>
                  <div className="input-group">
                    <span className="input-group-text">+255</span>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Password</label>
                  <div className="input-group">

                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <span className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}>

                      <i className={`bi ${
                        showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                      }`}></i>

                    </span>

                  </div>
                </div>

              </div>

              <div className="d-flex justify-content-between mt-3">

                <button className="btn btn-primary">
                  Register
                </button>

                <p className="mb-0">
    Already have an account?{" "}
    <Link
      to="/CustomerLogin"
      className="text-primary fw-semibold text-decoration-none"
      style={{ cursor: "pointer" }}
    >
      Login
    </Link>
  </p>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}
