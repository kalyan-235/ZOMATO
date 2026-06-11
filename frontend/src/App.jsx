import React from "react";
import Restaurants from "./pages/Restaurants";
import { Routes, Route } from 'react-router-dom';
import Practice from "./Practice";
import Home from "./pages/Home";
import RestaurantName from "./pages/RestaurantName";
import RestName from "./pages/RestName";
import CategoryList from "./pages/CategoryList";
import MenuCard2 from "./MenuCards_List/MenuCard2";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Cart from "./Components/Cart";
import NavBar from "./Components/NavBar";
import About from "./pages/About";
import Offers from "./pages/Offers";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Category from "./pages/Category";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <NavBar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/Restaurants" element={<Restaurants />} />
            <Route path="/restName" element={<RestName />} />
            <Route path="/restname/:name" element={<RestName />} />
            <Route path="/restaurant/:name" element={<RestaurantName />} />
            <Route path="/category/:category" element={<CategoryList />} />
            <Route path="/menuCard2/:restaurant" element={<MenuCard2 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/Cards" element={<Practice />} />
          </Routes>
        </div>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
 