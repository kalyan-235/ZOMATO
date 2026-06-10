import React from "react";
import "./AddProducts.css";
function AddRestaurant() {
  return (
    <div className="page-container">

      {/* TOP NAVBAR */}
      <div className="navbar">
        <h4>Logout</h4>
      </div>

      <div className="main-layout">

        {/* LEFT SIDEBAR */}
        <div className="sidebar">
          <p>Add Restaurants</p>
          <p>Add Product</p>
          <p>All Products</p>
          <p>User Details</p>
        </div>

        {/* FORM CARD CENTER */}
        <div className="form-container">
          <h2>Restaurant Name</h2>

          <form>
            <label>Restaurant Name</label>
            <input type="text" placeholder="Enter Restaurant Name" />

            <label>Area</label>
            <input type="text" placeholder="Location"/>

            <label>Category</label>
            <div className="category-row">
              <span>Veg</span>
              <input type="checkbox" />
              <span>Non-Veg</span>
              <input type="checkbox" />
            </div>

            <label>Offer</label>
            <input type="text" />

            <label>Region</label>
            <div className="region-row">
              <span>South Indian</span> <input type="checkbox" />
              <span>North-Indian</span> <input type="checkbox" />
              <span>Chinese</span> <input type="checkbox" />
              <span>Bakery</span> <input type="checkbox" />
            </div>

            <label>Restaurants Image</label>
            <input type="file" />

            <button type="submit">Submit</button>
          </form>
        </div>

      </div>
    </div>
  );
}
export default AddRestaurant;