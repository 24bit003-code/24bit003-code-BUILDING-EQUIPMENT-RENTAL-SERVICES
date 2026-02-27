// src/components/CustomerDashboard.js

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
export default function AdminEquipment() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
const [, setAdmin] = useState(null);
  const navigate = useNavigate();
const [showModal, setShowModal] = useState(false);
const [editingEquipment, setEditingEquipment] = useState(null);
const [successMsg, setSuccessMsg] = useState("");
const [newEquipment, setNewEquipment] = useState({
  equipment_name: "",
  description: "",
  price_per_day: "",
  image: null
});

const openUpdateModal = (equipment) => {
  setEditingEquipment(equipment);
  setShowModal(true);
};
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
  const adminData = sessionStorage.getItem("admin");
  if (!adminData){
     navigate('/AdminLogin');
  }; // if nothing is stored, exit

  // Parse the object to extract email
  let email = null;
  try {
    email = JSON.parse(adminData)?.email;
  } catch (err) {
    console.error("Failed to parse admin from sessionStorage:", err);
    return; // exit if parsing fails
  }

  if (!email) return; // exit if email is missing
  console.log("Fetching admin data for email:", email); // debug

  // Fetch customer from backend
  fetch("http://127.0.0.1:8000/api/get-admin/", { // match Django URL exactly
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => setAdmin(data))
    .catch(err => console.error("Failed to fetch admin:", err));
}, [navigate]);

// delete equipment
const deleteEquipment = (id) => {
  if (!window.confirm("Delete this equipment?")) return;

  fetch(`http://127.0.0.1:8000/api/equipment/${id}/`, {
    method: "DELETE"
  })
    .then(() => {
      setEquipmentList(equipmentList.filter(item => item.id !== id));
    })
    .catch(err => console.error(err));
};


// update equipment
const updateEquipment = () => {
  const formData = new FormData();

  formData.append("equipment_name", editingEquipment.equipment_name);
  formData.append("description", editingEquipment.description);
  formData.append("price_per_day", editingEquipment.price_per_day);

  if (editingEquipment.image instanceof File) {
    formData.append("image", editingEquipment.image);
  }

  fetch(`http://127.0.0.1:8000/api/equipment/${editingEquipment.id}/`, {
    method: "PUT",
    body: formData
  })
    .then(res => res.json())
    .then(updated => {
      setEquipmentList(
        equipmentList.map(item =>
          item.id === updated.id ? updated : item
        )
      );

      setShowModal(false);

      // ✅ Show success message
      setSuccessMsg("Equipment updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000); // hide after 3s
    })
    .catch(err => console.error(err));
};
// add equipment
const addEquipment = () => {
  // Manual validation
  if (
    !newEquipment.equipment_name.trim() ||
    !newEquipment.description.trim() ||
    !newEquipment.price_per_day ||
    !newEquipment.image
  ) {
    alert("Please fill in all fields and select an image!");
    return;
  }

  const formData = new FormData();
  formData.append("equipment_name", newEquipment.equipment_name);
  formData.append("description", newEquipment.description);
  formData.append("price_per_day", newEquipment.price_per_day);
  formData.append("image", newEquipment.image);

  fetch("http://127.0.0.1:8000/api/equipment/", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      setEquipmentList([...equipmentList, data]);
      setSuccessMsg("Equipment added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);

      setNewEquipment({
        equipment_name: "",
        description: "",
        price_per_day: "",
        image: null
      });
    })
    .catch(err => console.error(err));
};
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
       
         {/* Dashboard */}
         <li className="nav-item mb-2">
           <Link to="/AdminDashboard" className="nav-link text-white d-flex align-items-center">
             <i className="bi bi-speedometer2 me-2"></i>
             {sidebarOpen && "Dashboard"}
           </Link>
         </li>
       
         {/* Customers */}
         {/* <li className="nav-item mb-2">
           <Link to="/AdminCustomers" className="nav-link text-white d-flex align-items-center">
             <i className="bi bi-people-fill me-2"></i>
             {sidebarOpen && "Customers"}
           </Link>
         </li>
        */}
         {/* Equipments */}
         <li className="nav-item mb-2">
           <Link to="/AdminEquipment" className="nav-link text-white d-flex align-items-center">
             <i className="bi bi-box-seam me-2"></i>
             {sidebarOpen && "Equipments"}
           </Link>
         </li>
       
         {/* Rentals */}
         <li className="nav-item mb-2">
           <Link to="/AdminRental" className="nav-link text-white d-flex align-items-center">
             <i className="bi bi-cart-check-fill me-2"></i>
             {sidebarOpen && "Rentals"}
           </Link>
         </li>
       
         {/* Settings */}
         <li className="nav-item mb-2">
           <Link to="/AdminProfile" className="nav-link text-white d-flex align-items-center">
             <i className="bi bi-gear-fill me-2"></i>
             {sidebarOpen && "Settings"}
           </Link>
         </li>
       
       <li className="nav-item mb-2">
           <Link to="/AdminLogout" className="nav-link text-white d-flex align-items-center">
             <i className="bi bi-gear-fill me-2"></i>
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
  <h3 className="mb-4"> Equipments Management <i className="bi bi-box-seam me-2"></i></h3>

<div className="card p-3 mb-4 shadow-sm" style={{ maxWidth: "400px" }}>
  <h5>Add New Equipment</h5>

  <input
    className="form-control mb-2"
    placeholder="Equipment name"
    value={newEquipment.equipment_name}
    onChange={(e) =>
      setNewEquipment({
        ...newEquipment,
        equipment_name: e.target.value
      })
    }
    required
  />

  <input
    className="form-control mb-2"
    placeholder="Description"
    value={newEquipment.description}
    onChange={(e) =>
      setNewEquipment({
        ...newEquipment,
        description: e.target.value
      })
    }
    required
  />

  <input
    type="number"
    className="form-control mb-2"
    placeholder="Price in Tsh"
    value={newEquipment.price_per_day}
    onChange={(e) =>
      setNewEquipment({
        ...newEquipment,
        price_per_day: e.target.value
      })
    }
    required
  />

  <input
    type="file"
    className="form-control mb-2"
    onChange={(e) =>
      setNewEquipment({
        ...newEquipment,
        image: e.target.files[0]
      })
    }
    required
  />

  <button
    className="btn btn-primary w-100"
    onClick={addEquipment}
  >
    Add Equipment
  </button>
</div> 

  <h3 className="mb-4">All Equipments Available </h3>

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
            style={{ height: "170px"}}
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
            <div className="d-flex gap-2 mt-auto">

<button
  className="btn btn-warning w-50"
  onClick={() => openUpdateModal(item)}
>
  Update
</button>

<button
  className="btn btn-danger w-50"
  onClick={() => deleteEquipment(item.id)}
>
  Delete
</button>

</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
       
          {successMsg && (
  <div
    className="alert alert-success position-fixed"
    style={{
      top: "20px",
      right: "20px",
      zIndex: 9999,
      minWidth: "200px",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "8px",
    }}
  >
    {successMsg}
  </div>
)}

{/* {successMsg && (
  <div className="alert alert-success mt-3">
    {successMsg}
  </div>
)} */}

{showModal && (
<div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
<div className="modal-dialog">
<div className="modal-content">

<div className="modal-header">
<h5>Update Equipment</h5>
<button
  className="btn-close"
  onClick={() => setShowModal(false)}
></button>
</div>

<div className="modal-body">

<input
  className="form-control mb-2"
  value={editingEquipment?.equipment_name || ""}
  onChange={(e) =>
    setEditingEquipment({
      ...editingEquipment,
      equipment_name: e.target.value
    })
  }
/>

<input
  className="form-control mb-2"
   value={editingEquipment?.description || ""}
  onChange={(e) =>
    setEditingEquipment({
      ...editingEquipment,
      description: e.target.value
    })
  }
/>

<input
  className="form-control mb-2"
  value={editingEquipment?.price_per_day || ""}
  onChange={(e) =>
    setEditingEquipment({
      ...editingEquipment,
      price_per_day: e.target.value
    })
  }
/>
<input
  type="file"
  className="form-control mb-2"
  onChange={(e) =>
    setEditingEquipment({
      ...editingEquipment,
      image: e.target.files[0]
    })
  }
/>
<button
  className="btn btn-success w-100"
  onClick={updateEquipment}
>
Save Changes
</button>

</div>

</div>
</div>
</div>
)}
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
            .alert {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.alert-show {
  opacity: 1;
  transform: translateY(0);
}
.alert-hide {
  opacity: 0;
  transform: translateY(-20px);
}
        `}
      </style>
    </div>
  );
}
