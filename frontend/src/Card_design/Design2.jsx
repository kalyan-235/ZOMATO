import React from "react";

const MenuRight = () => {
  const menuItems = [
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
    "Lorem ipsum",
  ];

  const renderItems = () =>
    menuItems.map((item, i) => (
      <li key={i}>
        {item}
        <span>$10</span>
      </li>
    ));

  return (
    <div className="menuRightContainer">

      {/* Top Title */}
      <h2 className="menuTitle">MENU</h2>

      {/* First Main Course */}
      <div className="section">
        <h3 className="sectionTitle">Main Course</h3>
        <ul className="itemList">{renderItems()}</ul>
      </div>

      {/* Large Circle Image Placeholder */}
      <div className="imageCircle"></div>

      {/* Second Main Course */}
      <div className="section sideSection">
        <h3 className="sectionTitle">Main Course</h3>
        <ul className="itemList">{renderItems()}</ul>
      </div>

      {/* Third Main Course */}
      <div className="section bottomSection">
        <h3 className="sectionTitle">Main Course</h3>
        <ul className="itemList">{renderItems()}</ul>
      </div>

      {/* Decorative shapes */}
      <div className="decor-chili"></div>
      <div className="decor-leaf1"></div>
      <div className="decor-leaf2"></div>
      <div className="decor-leaf3"></div>

    </div>
  );
};

export default MenuRight;
