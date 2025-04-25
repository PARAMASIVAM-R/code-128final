import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import FINALFORMATE from "../datas/FINALFORMATE";

const RegisterPage = () => {
  const [role, setRole] = useState("Godown Incharge");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [godownOptions, setGodownOptions] = useState([]);
  const [pdsOptions, setPdsOptions] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    district: "",
    pdslocation: "",
    godownName: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e) => {
    const selectedId = e.target.value;
    const selectedDistrictName =
      typeof FINALFORMATE[selectedId] === "string"
        ? FINALFORMATE[selectedId] // Direct district name
        : FINALFORMATE[selectedId]?.District_Name || ""; // Nested district name
  
    setSelectedDistrict(selectedId);
  
    // Store district name instead of ID
    setFormData({
      ...formData,
      district: selectedDistrictName,
      godownName: "",
      pdslocation: "",
    });
    setPdsOptions([]);
  
    // Populate godown options if available
    if (
      FINALFORMATE[selectedId] &&
      typeof FINALFORMATE[selectedId] === "object" &&
      FINALFORMATE[selectedId].Godowns
    ) {
      const godownList = Object.entries(FINALFORMATE[selectedId].Godowns).map(
        ([godownId, godown]) => ({
          id: godownId,
          name: godown.Godown,
          pdsShops: godown.PDS_Shops,
        })
      );
      setGodownOptions(godownList);
    } else {
      setGodownOptions([]);
    }
  };

  const handleGodownChange = (e) => {
    const selectedGodownId = e.target.value;
    const selectedGodown = godownOptions.find((g) => g.id === selectedGodownId);
  
    // Store godown name instead of ID
    setFormData({
      ...formData,
      godownName: selectedGodown ? selectedGodown.name : "", // Store name correctly
      pdslocation: "", // Reset PDS location when godown changes
    });
  
    // Populate PDS options if available
    if (selectedGodown && selectedGodown.pdsShops) {
      const pdsList = Object.values(selectedGodown.pdsShops);
      setPdsOptions(pdsList);
    } else {
      setPdsOptions([]);
    }
  };

  const handlePdsChange = (e) => {
    setFormData({ ...formData, pdslocation: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userPayload = {
      role,
      id: formData.id,
      name: formData.name,
      // district: formData.district,
      password: formData.password,
    };

    if (role === "Godown Incharge") {
      userPayload.godownname = formData.godownName;
    }

    if (role === "PDS Incharge") {
      userPayload.pdslocation = formData.pdslocation;
      userPayload.godownname = formData.godownName;
    }

    const token = sessionStorage.getItem("token");

    try {
      
      console.log('userPayload      ::::',userPayload )
      const response = await fetch("http://localhost:5000/api/admin/create-incharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token from session storage
        },
        body: JSON.stringify(userPayload),
      });
      const data = await response.json();
      if (!response.ok) return alert(data.message);

      alert(`${role} registered successfully!`);
      // navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed!");
    }
  };

  const districtOptions = Object.keys(FINALFORMATE)
    .map((key) => {
      const value = FINALFORMATE[key];
      if (typeof value === "string") {
        return { id: key, name: value };
      } else if (value?.District_Name) {
        return { id: key, name: value.District_Name };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="register-body">
      <div className="register-content">
        <div className="container">
          {/* <h2>Select User Type</h2> */}
          <div className="user-selection">
            {["Godown Incharge", "PDS Incharge"].map((type) => (
              <button
                key={type}
                onClick={() => setRole(type)}
                className={`user-selection-button ${
                  role === type ? "active" : ""
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <h3>{role} Register</h3>
          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <input
              type="text"
              name="id"
              placeholder={`${role} ID`}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder={`${role} Name`}
              onChange={handleChange}
              required
            />
            
            {/* District Dropdown */}
            <select name="district" className="input" onChange={handleDistrictChange} required>
              <option value="">Select a district</option>
              {districtOptions.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>

            {/* Godown Incharge */}
            {role === "Godown Incharge" && (
              <select
                name="godownName"
                className="input"
                onChange={handleGodownChange}
                required
              >
                <option value="">Select a godown</option>
                {godownOptions.map((godown) => (
                  <option key={godown.id} value={godown.id}>
                    {godown.name}
                  </option>
                ))}
              </select>
            )}

            {/* PDS Incharge */}
            {role === "PDS Incharge" && (
              <>
                <select
                  name="godownName"
                  className="input"
                  onChange={handleGodownChange}
                  required
                >
                  <option value="">Select a godown</option>
                  {godownOptions.map((godown) => (
                    <option key={godown.id} value={godown.id}>
                      {godown.name}
                    </option>
                  ))}
                </select>

                {pdsOptions.length > 0 && formData.godownName && (
                  <select
                    name="pdslocation"
                    className="input"
                    onChange={handlePdsChange}
                    required
                  >
                    <option value="">Select a PDS location</option>
                    {pdsOptions.map((pds, index) => (
                      <option key={index} value={pds}>
                        {pds}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>
          
          <p>
            Admin only has the rights to register
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
