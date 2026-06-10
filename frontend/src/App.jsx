import React from "react";
import './App.css';
import Restaurants from "./Restaurants";
import {Routes,Route} from 'react-router-dom'; 
import Practice from "./Practice";
import Home from "./Home";
import './MenuCards_List/Menu_card.css'
import RestaurantName from "./Components/RestaurantName";
import CategoryList from "./Components/CategoryList";
import MenuCard2 from "./MenuCards_List/MenuCard2";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Cart from "./Components/Cart";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";



function App() {
  return (
    <CartProvider>
    <AuthProvider>
    <Routes>
      <Route path="/" element= {<Home/> }/>
      <Route path="/Restaurants" element= { <Restaurants/> }/>
      <Route path="/Cards" element= {<Practice/>}/>
      <Route path="/restaurant/:name" element={<RestaurantName/>} />
      <Route path="/category/:category" element={<CategoryList />} />
      <Route path="/menuCard2/:restaurant" element={<MenuCard2 />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/cart" element={<Cart/>}/>
    </Routes>
    </AuthProvider>
    </CartProvider>
  );
}
export default App;
 