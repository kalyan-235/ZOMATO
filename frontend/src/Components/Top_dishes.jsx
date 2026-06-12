const DISHES = [
  { img: "/IMAGES/chicken_Biryani.avif",   name: "Chicken Biryani"   },
  { img: "/IMAGES/burger_2.webp",          name: "Burger"            },
  { img: "/IMAGES/Margherita_Pizza.webp",  name: "Margherita Pizza"  },
  { img: "/IMAGES/Momos.avif",             name: "Momos"             },
  { img: "/IMAGES/Veg_friedrice.avif",     name: "Veg Fried Rice"    },
  { img: "/IMAGES/Chocolate_Brownie.webp", name: "Brownie"           },
  { img: "/IMAGES/Mutton_Biryani.webp",    name: "Mutton Biryani"    },
  { img: "/IMAGES/Tandoori_chicken.jpg",   name: "Tandoori Chicken"  },
  { img: "/IMAGES/Paneer_Butter_Masala.webp", name: "Paneer Butter Masala" },
];

const Top_dishes = () => {
  return (
    <div className="topDishes">
      <h2 className="top-dishes-title">🔥 Top Dishes Right Now</h2>
      <div className="top-dishes-container">
        {DISHES.map((d, i) => (
          <div className="top-dish-card" key={i}>
            <img src={d.img} alt={d.name} className="top-dish-image" />
            <p className="top-dish-name">{d.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top_dishes;
