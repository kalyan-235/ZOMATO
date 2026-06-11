import React from "react";

function MenuCard({itemsData}) {
    return (
        <div class="menu-card">
            {itemsData.map((item, index) => (
    <div key={index} class="menu-item">
    <h1 class="combo-title">
        <span class="small">MILKSHAKES</span>
        <br/>COMBO

        <span class="small-right">BURGER</span>
    </h1>

  <div class="words-left">Delicious</div>
  <div class="words-right">Yummy</div>

  <h2 class="section-title">01 - BURGERS</h2>

  <div class="item">
    <div class="item-details">
      <h3 class="item-name">Sweet Salsa</h3>
      <p class="item-desc">Corn chips, tomato, spice</p>
    </div>
    <div class="price-box">$10</div>
  </div>

  <div class="item">
    <div class="item-details">
      <h3 class="item-name">Cheese</h3>
      <p class="item-desc">Cheddar, onion</p>
    </div>
    <div class="price-box">$10</div>
  </div>

  <div class="item">
    <div class="item-details">
      <h3 class="item-name">Guacamole</h3>
      <p class="item-desc">Avocado, onion, tomato</p>
    </div>
    <div class="price-box">$10</div>
  </div>

  <h2 class="section-title">02 - MILKSHAKES</h2>

  <div class="item">
    <div class="item-details">
      <h3 class="item-name">Chocolate</h3>
      <p class="item-desc">Marshmallows / cream</p>
    </div>
    <div class="price-box">$10</div>
  </div>

  <div class="item">
    <div class="item-details">
      <h3 class="item-name">White</h3>
      <p class="item-desc">Strawberry and banana</p>
    </div>
    <div class="price-box">$10</div>
  </div>

  <div class="item">
    <div class="item-details">
      <h3 class="item-name">Passionfruit</h3>
      <p class="item-desc">White chocolate dripping</p>
    </div>
    <div class="price-box">$10</div>
  </div>

  <div class="words-left-bottom">Tasty</div>
  <div class="words-right-bottom">Foody</div>

</div>
            ))}
        </div>
    );
}
export default MenuCard;