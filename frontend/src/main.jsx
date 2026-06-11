import { StrictMode } from 'react'
import ReactDom from 'react-dom/client';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


import './css/Home.css';
import './css/HomePage.css';
import './css/Category.css';
import './css/Prices.css';
import './css/Top_dishes.css';
import './css/Navbar.css';
import './css/AddProducts.css';
import './css/Hero.css';
import './css/Restaurants.css';
import './css/RestName.css';
import './css/About.css';
import './css/MenuCard2.css';
import './css/Offers.css';
import './css/FoodCard.css';
import './css/Menu_card.css';
import './css/Login.css';
import './css/Signup.css';
import './css/Cart.css';
import './App.css';


ReactDom.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
)
