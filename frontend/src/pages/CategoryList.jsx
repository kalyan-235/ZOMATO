import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Card from "../Components/Card";

const CategoryList = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        if (category === "ALL") {
          const res = await API.get("/zomato");
          setItems(res.data);
        } else {
          const res = await API.get(`/zomato/category/${category}`);
          setItems(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryItems();
  }, [category]);

  return (
    <div className="space">
      <div className="search-bar">
        <input type="text" placeholder="Search food or restaurants..." />
      </div>
      <Card itemsData={items} />
    </div>
  );
};

export default CategoryList;
