// src/components/CustomerLogout.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the customer session
    sessionStorage.removeItem("customer");

    // Optional: clear all sessionStorage if needed
    // sessionStorage.clear();

    // Redirect to login after logout
    navigate("/CustomerLogin");
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
