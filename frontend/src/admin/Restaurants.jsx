import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import AdminLayout from './AdminLayout';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [itemCounts, setItemCounts]   = useState({});
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get('/admin/restaurants'),
      API.get('/admin/items'),
    ]).then(([rRes, iRes]) => {
      setRestaurants(rRes.data);
      // Count items per restaurant
      const counts = {};
      iRes.data.forEach(item => {
        counts[item.restaurant] = (counts[item.restaurant] || 0) + 1;
      });
      setItemCounts(counts);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout>
      <div className="adm-page">
        <div className="adm-page-header">
          <h1>🏪 Restaurants</h1>
          <span className="adm-count-badge">{restaurants.length} restaurants</span>
        </div>

        {loading ? <p className="adm-loading">Loading…</p> : (
          <div className="adm-rest-grid">
            {restaurants.map((name, i) => (
              <div className="adm-rest-card" key={i}>
                <div className="adm-rest-avatar">
                  {name[0].toUpperCase()}
                </div>
                <div className="adm-rest-info">
                  <h4>{name}</h4>
                  <p>{itemCounts[name] || 0} items</p>
                </div>
                <button
                  className="adm-btn-outline adm-btn-sm"
                  onClick={() => navigate(`/admin/manage-items?restaurant=${encodeURIComponent(name)}`)}
                >
                  View Items →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRestaurants;
