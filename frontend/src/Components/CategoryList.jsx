
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import NavBar from "./NavBar";

const CategoryList = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        if (category === "ALL") {
          const res = await axios.get("http://localhost:5000/zomato");
          setItems(res.data);
        } else {
          const res = await axios.get(
            `http://localhost:5000/zomato/category/${category}`
          );
          setItems(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoryItems();
  }, [category]);

  return (
    <div>
      {/* <h2 style={{ textAlign: "center" }}>
        {category.toUpperCase()} ITEMS
      </h2> */}
      <NavBar />

      <div className="space">
          <div className="search-bar">
            <input type="text" placeholder="Search food or restaurants..." />
          </div>
          {/* <Category /> */}
          <Card itemsData={items} /> 
        </div>
    </div>
  );
};

export default CategoryList;




//idhi on cheste category lo on chey

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import Card from "./Card";
// import NavBar from "./NavBar";
// import Category from "./Category";

// const CategoryList = () => {
//   const { category } = useParams();
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const url =
//           category === "ALL"
//             ? "http://localhost:5000/zomato"
//             : `http://localhost:5000/zomato/category/${category}`;

//         const res = await axios.get(url);
//         setItems(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchItems();
//   }, [category]);

//   return (
//     <>
//       <NavBar />

//       <div className="space">
//         <Category activeCategory={category} />

//         <Card itemsData={items} />
//       </div>
//     </>
//   );
// };

// export default CategoryList;
