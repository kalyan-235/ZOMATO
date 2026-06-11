import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';
import AdminLayout from './AdminLayout';

const CATEGORIES = ['Veg','Non-veg','drinks','salads','tiffins','Biryani','Dosa','Idli','Burger','Desserts','Ice-Cream'];

const EMPTY_FORM = { name:'', image:'', oldPrice:'', price:'', rating:'', reviews:'', restaurant:'', category:'Veg', time:'', description:'' };

const ManageItems = () => {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();

  // If opened from Restaurants page, pre-filter to that restaurant
  const restaurantFilter = searchParams.get('restaurant') || '';

  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState({ ...EMPTY_FORM, restaurant: restaurantFilter });
  const [editId, setEditId]     = useState(null);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg]           = useState('');

  const fetchItems = () => {
    API.get('/admin/items').then(res => { setItems(res.data); setLoading(false); });
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/admin/items/${editId}`, form);
        setMsg('Item updated successfully.');
      } else {
        await API.post('/admin/items', form);
        setMsg('Item added successfully.');
      }
      setForm({ ...EMPTY_FORM, restaurant: restaurantFilter }); setEditId(null); setShowForm(false);
      fetchItems();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving item.');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await API.delete(`/admin/items/${id}`);
    fetchItems();
  };

  const filtered = items.filter(i => {
    // If coming from a specific restaurant, only show that restaurant's items
    const matchesRestaurant = restaurantFilter
      ? i.restaurant === restaurantFilter
      : true;
    // Also apply the search bar filter
    const matchesSearch = search
      ? i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.restaurant?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesRestaurant && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="adm-page">
        <div className="adm-page-header">
          <div>
            {restaurantFilter && (
              <button
                className="adm-btn-outline adm-btn-sm"
                style={{ marginBottom: '8px' }}
                onClick={() => navigate('/admin/restaurants')}
              >
                ← Back to Restaurants
              </button>
            )}
            <h1>
              🍽️ {restaurantFilter ? `${restaurantFilter} — Items` : 'Manage All Items'}
            </h1>
            {restaurantFilter && (
              <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.82rem' }}>
                Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''} for this restaurant
              </p>
            )}
          </div>
          <button className="adm-btn-primary" onClick={() => { setForm({ ...EMPTY_FORM, restaurant: restaurantFilter }); setEditId(null); setShowForm(v => !v); }}>
            {showForm ? '✕ Cancel' : '+ Add New Item'}
          </button>
        </div>

        {msg && <div className="adm-toast">{msg}</div>}

        {/* ── FORM ── */}
        {showForm && (
          <form className="adm-form" onSubmit={handleSubmit}>
            <h3>{editId ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
            <div className="adm-form-grid">
              <div className="adm-form-group">
                <label>Item Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Chicken Biryani" />
              </div>
              <div className="adm-form-group">
                <label>Restaurant *</label>
                <input name="restaurant" value={form.restaurant} onChange={handleChange} required placeholder="Restaurant name" />
              </div>
              <div className="adm-form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-form-group">
                <label>Price (₹) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="199" />
              </div>
              <div className="adm-form-group">
                <label>Old Price (₹)</label>
                <input type="number" name="oldPrice" value={form.oldPrice} onChange={handleChange} placeholder="249" />
              </div>
              <div className="adm-form-group">
                <label>Rating</label>
                <input type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleChange} placeholder="4.5" />
              </div>
              <div className="adm-form-group">
                <label>Reviews</label>
                <input type="number" name="reviews" value={form.reviews} onChange={handleChange} placeholder="120" />
              </div>
              <div className="adm-form-group">
                <label>Delivery Time</label>
                <input name="time" value={form.time} onChange={handleChange} placeholder="30–40 mins" />
              </div>
              <div className="adm-form-group adm-form-full">
                <label>Image Path</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="IMAGES/chicken_Biryani.avif" />
              </div>
              <div className="adm-form-group adm-form-full">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description…" rows={3} />
              </div>
            </div>
            <div className="adm-form-actions">
              <button type="submit" className="adm-btn-primary">{editId ? 'Update Item' : 'Add Item'}</button>
              <button type="button" className="adm-btn-outline" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}>Cancel</button>
            </div>
          </form>
        )}

        {/* ── SEARCH ── */}
        <div className="adm-search-bar">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search items or restaurants…" />
          <span>{filtered.length} items</span>
        </div>

        {/* ── TABLE ── */}
        {loading ? <p className="adm-loading">Loading…</p> : (
          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Restaurant</th><th>Category</th><th>Price</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td><img src={item.image?.startsWith('/') ? item.image : `/${item.image}`} alt={item.name} className="adm-item-thumb" /></td>
                    <td className="adm-item-name">{item.name}</td>
                    <td>{item.restaurant}</td>
                    <td><span className="adm-badge">{item.category}</span></td>
                    <td>₹{item.price}</td>
                    <td>⭐ {item.rating || '—'}</td>
                    <td>
                      <button className="adm-btn-edit"   onClick={() => handleEdit(item)}>✏️ Edit</button>
                      <button className="adm-btn-delete" onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageItems;
