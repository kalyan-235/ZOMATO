import React from "react";

export default function AllProducts() {
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

        {/* PRODUCT TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Chicken Biryani</td>
                <td>₹150</td>
                <td>
                  <img
                    src="public/IMAGES/biryani.png"
                    alt="product"
                    className="product-img"
                  />
                </td>
                <td>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>

              <tr>
                <td>Veg Meals</td>
                <td>₹90</td>
                <td>
                  <img
                    src="public/IMAGES/paneer_Butter_masala.webp"
                    alt="product"
                    className="product-img"
                  />
                </td>
                <td>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
