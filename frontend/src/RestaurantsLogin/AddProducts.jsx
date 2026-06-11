import React from "react";

 function AddProduct() {
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

        {/* MAIN PRODUCT FORM */}
        <div className="form-container">
          <h2>Add Product</h2>

          <form>
            <label>Product Name</label>
            <input type="text" placeholder="Enter product name" />

            <label>Price</label>
            <input type="text" placeholder="Enter price" />

            <label>Category</label>
            <div className="category-row">
              <span>Veg</span>
              <input type="checkbox" />
              <span>Non-Veg</span>
              <input type="checkbox" />
            </div>

            <label>Best Seller</label>
            <div className="best-row">
              <span>Yes</span>
              <input type="radio" name="best" />
              <span>No</span>
              <input type="radio" name="best" />
            </div>

            <label>Description</label>
            <textarea placeholder="Enter description"></textarea>

            <label>Product Image</label>
            <input type="file" />

            <button className="submit">Submit</button>
          </form>
        </div>

      </div>
    </div>
  );
}
export default AddProduct;