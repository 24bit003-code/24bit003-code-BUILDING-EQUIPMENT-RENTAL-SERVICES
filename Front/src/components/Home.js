import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom"; 
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Home() {

  const eq = [
    {
      id: 1,
      name: "Wheelbarrow",
      description: "Load 330 lbs Capacity One Wheel Garden Dump",
      price_per_day: 150,
      image: "barrow.jpg"
    },
    {
      id: 2,
      name: "Hammer",
      description: "Pittsburgh Pro 22 oz. Solid Steel Framing Hammer",
      price_per_day: 1000,
      image: "hammer.jpg"
    },
    {
      id: 3,
      name: "ConcreteMixer",
      description: " For pouring footings, slabs, and other structures.",
      price_per_day: 180,
      image: "ConcreteMixer.jpg"
    },
    
    {
      id: 4,
      name: "Generator",
      description: "Predator 13,000 Watt Tri-Fuel Portable Generator",
      price_per_day: 150,
      image: "Generator.jpg"
    },
    {
      id: 5,
      name: "Power Drill",
      description: "black+decker 12V MAX* Cordless Lithium Drill/Driver",
      price_per_day: 1000,
      image: "PowerDrill.jpg"
    },
    {
      id: 6,
      name: "Saws",
      description: " For pouring footings, slabs, and other structures.",
      price_per_day: 180,
      image: "Saws.jpg"
    }
  ];

  return (
    <div>

      {/* Navbar */}
      <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{ background: "linear-gradient(180deg, #1b4f72, #2980b9)"}}
    >
      <div className="container">
        <span className="navbar-brand fw-bold text-white">Equipment Rental</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center align-items-center"
          id="navbarNav"
        >
         <ul className="navbar-nav text-center gap-lg-3">
  {[
    { name: "Home", path: "/", icon: "bi-house-door-fill" },
    { name: "Login", path: "/CustomerLogin", icon: "bi-box-arrow-in-right" },
    { name: "Register", path: "/CustomerRegister", icon: "bi-person-plus-fill" },
    { name: "Admin", path: "/AdminLogin", icon: "bi-shield-lock-fill" },
  ].map((item, idx) => (
    <li className="nav-item" key={idx}>
      <Link
        to={item.path}
        className="nav-link text-white d-flex align-items-center justify-content-center gap-2"
        style={{ transition: "all 0.3s ease" }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.1)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
        }}
      >
        <i className={`bi ${item.icon} fs-5 fs-lg-5`}></i>
        <span className="d-none d-lg-inline">{item.name}</span>
      </Link>
    </li>
  ))}
</ul>
        </div>
      </div>
    </nav>
<div
      className="d-flex align-items-center justify-content-center text-center text-white"
      style={{
        backgroundImage: "url('back.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "500px",
      }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold">Rent Construction Equipment Easily</h1>
        <p className="lead my-3">
          From hammers to wheelbarrows — all your construction tools in one place. Fast booking, affordable prices!
        </p>
        <Link to="/CustomerRegister" className="btn btn-primary btn-lg">
  Start Rent Now
</Link>
      </div>
    </div>


<center>
      
         <div className="d-flex justify-content-between align-items-center mb-3"
         style={{marginTop:'20px',maxWidth:'80%',justifyContent:'center'}}>
           <h4 className="mb-0">Summary of Available Equipments</h4>
          <Link
           to="/CustomerLogin"
           className="btn btn-sm text-white"
           style={{
             background: "linear-gradient(180deg, #1b4f72, #2980b9)",
             border: "none",
           }}
         >
           View  All Equipments
         </Link>
         </div></center>

     {/* Featured Equipment Cards */}
{/* Featured Equipment Cards */}
<div className="container my-5">
  <div className="row g-4">
    {eq.map((eq) => (
      <div className="col-sm-12 col-md-6 col-lg-4" key={eq.id}>
        <div
          className="card h-100 shadow-sm"
          style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
          }}
        >
          {/* Image */}
          <div style={{ height: "200px", overflow: "hidden" }}> &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;
  <img
    src={eq.image}
    alt={eq.name}
    style={{
      width: "80%",
      marginTop:"20px",
      objectPosition: "center",
      height: "100%",
     
    }}
  />
</div>

          {/* Body */}
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-center fw-bold">{eq.name}</h5>
            <p className="card-text text-center flex-grow-1">
              {eq.description}
            </p>
            <p className="fw-bold text-center">
              Price: Tsh {eq.price_per_day} / day
            </p>
             <Link
           to="/CustomerLogin"
           className="btn btn-sm text-white"
           style={{
             background: "linear-gradient(180deg, #1b4f72, #2980b9)",
             border: "none",
           }}
         >
           <button
  className="btn w-100 text-white"
  style={{
    background: "linear-gradient(180deg, #1b4f72, #2980b9)",
    border: "none",
  }}
>
  Rent Now
</button></Link>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Footer */}
    <footer className="text-white pt-5" style={{ background: "linear-gradient(180deg, #1b4f72, #2980b9)" }}> {/* brown background */}
      <div className="container">
        <div className="row">

          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5>About EquipRent</h5>
            <p>
              EquipRent provides fast and easy construction equipment rental services.
              From hammers to wheelbarrows, we cover all your project needs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              {["Home", "Equipment", "Login", "Register"].map((link, idx) => (
                <li key={idx} className="my-2">
                  <span
                    style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                    onMouseEnter={e => (e.target.style.color = "#ffc107")} // yellow hover
                    onMouseLeave={e => (e.target.style.color = "white")}
                  >
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Social Media */}
          <div className="col-md-4 mb-4">
            <h5>Contact Us</h5>
            <p>Email: support@equiprent.com</p>
            <p>Phone: +123 456 7890</p>
            <div className="d-flex gap-3">
              {["Facebook", "Twitter", "Instagram"].map((social, idx) => (
                <span
                  key={idx}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#ffffff33",
                    color: "white",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = "scale(1.2)";
                    e.target.style.backgroundColor = "#ffc107";
                    e.target.style.color = "black";
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "#ffffff33";
                    e.target.style.color = "white";
                  }}
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>

        </div>

        <hr className="border-light" />

        <p className="text-center mb-0 pb-3">
          © 2026 EquipmentsRentals. All Rights Reserved.
        </p>
      </div>
    </footer>
    </div>
  );
}
