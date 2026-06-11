import { useEffect, useState } from "react";
import Card from "../Components/Card";
import Categories from "../Components/Categories";
import axios from "axios";
import Top_dishes from '../Components/Top_dishes'
import Prices from '../Components/Prices'

function Category() {
  const [items, setItems] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/zomato");
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
  }, []);

  const filteredItems = items.filter(item => {
    let matches = true;

    // Search filter — matches item name or restaurant name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matches = matches && (
        item.name.toLowerCase().includes(q) ||
        item.restaurant.toLowerCase().includes(q)
      );
    }

    // Price / type filter
    if (selectedRange) {
      if (selectedRange === 'under99')  matches = matches && item.price <= 99;
      if (selectedRange === '100-149')  matches = matches && item.price >= 100 && item.price <= 149;
      if (selectedRange === '200-249')  matches = matches && item.price >= 200 && item.price <= 249;
      if (selectedRange === 'veg')      matches = matches && item.category === 'Veg';
      if (selectedRange === 'nonveg')   matches = matches && item.category === 'Non-veg';
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'ALL') {
      matches = matches && item.category === selectedCategory;
    }

    return matches;
  });

  return (
    <>
      <div>
        <div className="space">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search food or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Categories setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
          <Top_dishes/>
          <Prices setSelectedRange={setSelectedRange} selectedRange={selectedRange}/>
          <Card itemsData={filteredItems} />
        </div>
      </div>
    </>
  );
}

export default Category;
