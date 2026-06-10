import React from "react";

const MenuRight = () => {
  return (
    <div className="menu-right">

      <div className="menu-sections">

        {/* Breakfast */}
        <div className="menu-box">
          <h3 className="menu-header">BREAKFAST</h3>
          <ul>
            <li>Green Tea <span>$9.00</span></li>
            <li>Coffee <span>$7.00</span></li>
            <li>Normal Tea <span>$10.00</span></li>
            <li>Milk Tea <span>$5.00</span></li>
            <li>Salad <span>$8.00</span></li>
            <li>Green Tea <span>$10.00</span></li>
            <li>Omelette <span>$7.00</span></li>
            <li>Eggs <span>$7.00</span></li>
            <li>Cashew Waffles <span>$10.00</span></li>
            <li>Sandwich <span>$10.00</span></li>
            <li>Green Tea <span>$10.00</span></li>
          </ul>
        </div>

        {/* Drinks */}
        <div className="menu-box">
          <h3 className="menu-header">DRINKS</h3>
          <ul>
            <li>Green Tea <span>$9.00</span></li>
            <li>Coffee <span>$7.00</span></li>
            <li>Normal Tea <span>$10.00</span></li>
            <li>Milk Tea <span>$5.00</span></li>
            <li>Wine <span>$8.00</span></li>
            <li>Chocolate Coffee <span>$10.00</span></li>
            <li>Water <span>$7.00</span></li>
            <li>Drink <span>$7.00</span></li>
            <li>Cold Drink <span>$10.00</span></li>
            <li>Drink <span>$10.00</span></li>
            <li>Green Tea <span>$10.00</span></li>
          </ul>
        </div>

      </div>

      {/* Image Placeholder Section */}
      <div className="menu-images">
        <div className="img-shape-large"></div>

        <div className="img-row">
          <div className="img-circle"></div>

          <div className="price-box">
            FOOD <br /> $6.99
          </div>
            <div className="img-circle"></div>
          <div className="price-box">
            FOOD <br /> $6.99
          </div>
        </div>
      </div>

      {/* Burger */}
      <div className="burger-box">
        <h3 className="menu-header">BURGER</h3>
        <ul>
          <li>Burger <span>$9.00</span></li>
          <li>Beef Burger <span>$7.00</span></li>
          <li>Special Burger <span>$10.00</span></li>
          <li>Humburger <span>$5.00</span></li>
          <li>Wine <span>$8.00</span></li>
          <li>Beef Burger <span>$10.00</span></li>
        </ul>
      </div>
    </div>
  );
};

export default MenuRight;
