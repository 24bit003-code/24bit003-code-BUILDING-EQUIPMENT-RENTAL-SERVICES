// src/components/CustomerLogout.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("admin");

    

    navigate("/AdminLogin");
  }, [navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <h3 className="text-primary">Logging out...</h3>
    </div>
  );
}
