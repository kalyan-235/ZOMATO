import React from 'react';

const Categories = ({ setSelectedCategory, selectedCategory }) => {

    const categoryData = [
        {
            image: "https://cdn-icons-png.flaticon.com/512/857/857681.png",
            name: "ALL"},
        {
            image: "/IMAGES/biryani.png",
            name: "Biryani"},

        {
            image: "/IMAGES/pizza_2.jpg",
            name: "Pizza"},
        {
            image: "/IMAGES/samosa_1.webp",
            name: "Samosa"},
        {
            image: "/IMAGES/burger_3.webp",
            name: "Burger"},
        {
            image: "/IMAGES/noodle.png",
            name: "Noodles"},
        {
            image: "/IMAGES/sea_food_1.webp",  
            name: "Seafood"},
        {
            image: "https://cdn-icons-png.flaticon.com/512/921/921071.png",
            name: "Desserts"},
        {
            image: "/IMAGES/ice_creame_2.webp",
            name: "Ice-Cream"}
    ];

    return (
        <div className='category-Bar'>
            {categoryData.map((item, index) => (
                <div
                    key={index}
                    className={`category ${selectedCategory === item.name ? "active" : ""}`}
                    onClick={() => setSelectedCategory(item.name)}
                >
                    <img src={item.image} alt="categories" />
                    <span>{item.name.toUpperCase()}</span>
                </div>
            ))}
        </div>
    );
}

export default Categories;

