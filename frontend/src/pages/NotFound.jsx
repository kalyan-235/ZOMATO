import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => (
  <div className="nf-page">
    <div className="nf-content">
      <div className="nf-emoji">🍽️</div>
      <h1 className="nf-code">404</h1>
      <h2 className="nf-title">Page Not Found</h2>
      <p className="nf-sub">Looks like this page went out for delivery and never came back.</p>
      <div className="nf-actions">
        <Link to="/" className="nf-btn-primary">Go Home</Link>
        <Link to="/Restaurants" className="nf-btn-outline">Browse Restaurants</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
