import { Link } from "react-router-dom";

const STATS = [
  { value: "1,000+", label: "Restaurants" },
  { value: "50K+",   label: "Happy Customers" },
  { value: "30 min", label: "Avg. Delivery Time" },
  { value: "4.9 ⭐",  label: "Average Rating" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📍",
    title: "Choose Your Location",
    desc: "Enter your address and discover the best restaurants near you.",
  },
  {
    step: "02",
    icon: "🍽️",
    title: "Browse & Order",
    desc: "Explore menus, filter by category or price, and add items to your cart.",
  },
  {
    step: "03",
    icon: "🚴",
    title: "Fast Delivery",
    desc: "Your food is prepared fresh and delivered hot to your doorstep.",
  },
  {
    step: "04",
    icon: "😋",
    title: "Enjoy Your Meal",
    desc: "Sit back, relax, and enjoy restaurant-quality food at home.",
  },
];

const TEAM = [
  { name: "Arjun Sharma",   role: "Founder & CEO",       emoji: "👨‍💼" },
  { name: "Priya Reddy",    role: "Head of Operations",  emoji: "👩‍💻" },
  { name: "Rahul Mehta",    role: "Lead Developer",      emoji: "👨‍💻" },
  { name: "Sneha Iyer",     role: "Product Designer",    emoji: "👩‍🎨" },
];

const About = () => {
  return (
    <div className="ab-page">

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-content">
          <span className="ab-hero-badge">🍴 About Us</span>
          <h1 className="ab-hero-title">
            Connecting People with <span className="ab-accent">Great Food</span>
          </h1>
          <p className="ab-hero-sub">
            Food Express is a modern food delivery platform built to bring the
            best local restaurant experience straight to your door. Fast,
            reliable, and delicious — every single time.
          </p>
          <div className="ab-hero-cta">
            <Link to="/Restaurants" className="ab-btn-primary">Explore Restaurants</Link>
            <Link to="/category"    className="ab-btn-secondary">Browse Menu</Link>
          </div>
        </div>
        <div className="ab-hero-img">
          <div className="ab-img-circle">
            <img src="/IMAGES/chicken_Biryani.avif" alt="food" />
          </div>
          <div className="ab-float ab-float-1">🍕 Pizza</div>
          <div className="ab-float ab-float-2">🍔 Burgers</div>
          <div className="ab-float ab-float-3">🍱 Biryani</div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ab-stats">
        {STATS.map((s, i) => (
          <div className="ab-stat-card" key={i}>
            <span className="ab-stat-value">{s.value}</span>
            <span className="ab-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── MISSION ── */}
      <section className="ab-section ab-mission">
        <div className="ab-mission-text">
          <span className="ab-tag">Our Mission</span>
          <h2>Food should be <span className="ab-accent">easy, fast</span> and always delicious.</h2>
          <p>
            We started Food Express with one goal — make great food accessible
            to everyone. Whether you're craving a late-night biryani, a quick
            burger, or a wholesome home-style meal, we've got you covered with
            a curated list of the best restaurants in your city.
          </p>
          <p>
            We partner only with quality-verified restaurants and ensure every
            delivery meets our freshness and timing standards.
          </p>
        </div>
        <div className="ab-mission-cards">
          <div className="ab-value-card">
            <span>⚡</span>
            <h4>Speed</h4>
            <p>Average delivery in under 30 minutes — guaranteed.</p>
          </div>
          <div className="ab-value-card">
            <span>✅</span>
            <h4>Quality</h4>
            <p>Every restaurant is verified for hygiene and taste standards.</p>
          </div>
          <div className="ab-value-card">
            <span>💰</span>
            <h4>Value</h4>
            <p>Best prices with regular offers, discounts and free delivery.</p>
          </div>
          <div className="ab-value-card">
            <span>🤝</span>
            <h4>Trust</h4>
            <p>Transparent ratings, real reviews, no hidden charges.</p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="ab-section ab-how">
        <div className="ab-section-header">
          <span className="ab-tag">How It Works</span>
          <h2>Order in <span className="ab-accent">4 simple steps</span></h2>
        </div>
        <div className="ab-steps">
          {HOW_IT_WORKS.map((s, i) => (
            <div className="ab-step" key={i}>
              <div className="ab-step-num">{s.step}</div>
              <div className="ab-step-icon">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && <div className="ab-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="ab-section ab-team">
        <div className="ab-section-header">
          <span className="ab-tag">The Team</span>
          <h2>People behind <span className="ab-accent">Food Express</span></h2>
        </div>
        <div className="ab-team-grid">
          {TEAM.map((t, i) => (
            <div className="ab-team-card" key={i}>
              <div className="ab-team-avatar">{t.emoji}</div>
              <h4>{t.name}</h4>
              <p>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="ab-cta">
        <h2>Ready to order something <span className="ab-accent-light">amazing?</span></h2>
        <p>Join thousands of happy customers ordering daily from Food Express.</p>
        <Link to="/Restaurants" className="ab-btn-primary ab-btn-lg">
          Order Now →
        </Link>
      </section>

    </div>
  );
};

export default About;
