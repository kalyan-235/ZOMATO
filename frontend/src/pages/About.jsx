import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🍽️", title: "Great restaurants", text: "Discover trusted local restaurants and popular dishes." },
  { icon: "⚡", title: "Quick ordering", text: "Search, choose and add your favourites in a few taps." },
  { icon: "🛵", title: "Fresh delivery", text: "Enjoy your meal delivered hot and on time." },
];

const About = () => {
  return (
    <div className="ab-page">
      <section className="ab-hero">
        <div className="ab-hero-content">
          <span className="ab-hero-badge">FOOD EXPRESS</span>
          <h1 className="ab-hero-title">
            Good food, <span className="ab-accent">delivered simply.</span>
          </h1>
          <p className="ab-hero-sub">
            Find nearby restaurants, explore their menus and order fresh food
            from the comfort of your home.
          </p>
          <div className="ab-hero-cta">
            <Link to="/Restaurants" className="ab-btn-primary">Explore Restaurants</Link>
            <Link to="/category" className="ab-btn-secondary">Browse Menu</Link>
          </div>
        </div>
        <div className="ab-hero-image">
          <img src="/IMAGES/chicken_Biryani.avif" alt="Fresh biryani" />
        </div>
      </section>

      <section className="ab-section ab-mission">
        <div className="ab-mission-text">
          <span className="ab-tag">Why Food Express?</span>
          <h2>Everything you need for a great meal.</h2>
          <p>
            We make ordering convenient, clear and enjoyable — from the first
            search to the final delivery.
          </p>
        </div>
        <div className="ab-feature-grid">
          {FEATURES.map((feature) => (
            <article className="ab-feature-card" key={feature.title}>
              <span className="ab-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ab-cta">
        <h2>What are you craving today?</h2>
        <p>Choose a restaurant and get your favourites delivered.</p>
        <Link to="/Restaurants" className="ab-btn-primary">Order Now →</Link>
      </section>
    </div>
  );
};

export default About;
