import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menu_item from "../MenuCards_List/Menu_item";

function RestaurantPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/zomato/restaurant/${name}`)
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  }, [name]);

  return (
    <div>
      <button onClick={() => navigate("/Restaurants")} style={{ marginBottom: "10px", fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>←</button>
      <h1 style={{textAlign:"center"}}>{name}</h1>
      <Menu_item itemsData={items}/>
    </div>
  );
}

export default RestaurantPage;
