import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Card({ itemsData }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="cards">
      {itemsData.map((item, index) => (
        <div
          className="card"
          key={index}
          onClick={() => navigate(`/restname/${item.restaurant}`, { state: { from: "category" } })}
        >
          <img src={item.image} alt="food" />
          <h3>{item.name}</h3>

          <div className="rating">
            ⭐ {item.rating} ({item.reviews})
          </div>

          <div className="price">
            <span className="old">₹{item.oldPrice}</span>
            <span className="new">₹{item.price}</span>

            {/* STOP PROPAGATION */}
            <button
              className="add-btn"
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  id: item._id,
                  name: item.name,
                  image: item.image,
                  price: Number(item.price),
                  restaurant: item.restaurant,
                });
              }}
            >
              ADD
            </button>
          </div>

          <div className="restaurant">
            {item.restaurant} • {item.time}
          </div>

        </div>
      ))}
    </div>
  );
}

export default Card;
