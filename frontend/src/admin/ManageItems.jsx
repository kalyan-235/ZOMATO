import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';
import AdminLayout from './AdminLayout';

const CATEGORIES = ['Veg','Non-veg','drinks','salads','tiffins','Biryani','Dosa','Idli','Burger','Desserts','Ice-Cream'];
const EMPTY_FORM  = { name:'', image:'', oldPrice:'', price:'', rating:'', reviews:'', restaurant:'', category:'Veg', time:'', description:'' };

/* Normalise image src — handles https URLs, local /IMAGES/ paths, and bare paths */
const normImg = (src) => {
  if (!src) return '';
  const s = src.trim();
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;
  return `/${s}`;  // bare path like "IMAGES/foo.jpg" → "/IMAGES/foo.jpg"
};

/* Preview component with error/loading states */
const ImagePreview = ({ src }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error'

  // Reset when src changes
  useEffect(() => { setStatus('loading'); }, [src]);

  return (
    <div className="adm-url-preview">
      {status === 'error' ? (
        <div className="adm-preview-error">
          ⚠️ Cannot load image — check the URL or path
        </div>
      ) : (
        <img
          src={src}
          alt="preview"
          className="adm-img-preview"
          style={{ display: status === 'ok' ? 'block' : 'none' }}
          onLoad={()  => setStatus('ok')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'loading' && (
        <div className="adm-preview-loading">Loading preview…</div>
      )}
    </div>
  );
};

const ManageItems = () => {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();
  const restaurantFilter = searchParams.get('restaurant') || '';
  const fileInputRef     = useRef(null);

  const [items,     setItems]     = useState([]);
  const [form,      setForm]      = useState({ ...EMPTY_FORM, restaurant: restaurantFilter });
  const [editId,    setEditId]    = useState(null);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [msg,       setMsg]       = useState('');
  const [uploading, setUploading] = useState(false);
  const [imgMode,   setImgMode]   = useState('upload'); // 'upload' | 'url'

  /* ── fetch items ── */
  const fetchItems = () => {
    API.get('/admin/items').then(res => { setItems(res.data); setLoading(false); });
  };
  useEffect(() => { fetchItems(); }, []);

  /* ── form field change ── */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── file → Cloudinary upload ── */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMsg('');
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await API.post('/upload/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(prev => ({ ...prev, image: res.data.url }));
      setMsg('✅ Image uploaded successfully!');
    } catch (err) {
      setMsg(`❌ Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  /* ── submit form ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { setMsg('❌ Please add an image.'); return; }
    try {
      if (editId) {
        await API.put(`/admin/items/${editId}`, form);
        setMsg('✅ Item updated successfully.');
      } else {
        await API.post('/admin/items', form);
        setMsg('✅ Item added successfully.');
      }
      setForm({ ...EMPTY_FORM, restaurant: restaurantFilter });
      setEditId(null);
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || 'Error saving item.'}`);
    }
    setTimeout(() => setMsg(''), 4000);
  };

  /* ── edit ── */
  const handleEdit = (item) => {
    setForm({ ...item });
    setEditId(item._id);
    setShowForm(true);
    setImgMode(item.image?.startsWith('http') ? 'url' : 'upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await API.delete(`/admin/items/${id}`);
    fetchItems();
  };

  /* ── reset form ── */
  const resetForm = () => {
    setForm({ ...EMPTY_FORM, restaurant: restaurantFilter });
    setEditId(null);
    setShowForm(false);
    setImgMode('upload');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filtered = items.filter(i => {
    const matchesRestaurant = restaurantFilter ? i.restaurant === restaurantFilter : true;
    const matchesSearch = search
      ? i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.restaurant?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesRestaurant && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="adm-page">

        {/* ── PAGE HEADER ── */}
        <div className="adm-page-header">
          <div>
            {restaurantFilter && (
              <button className="adm-btn-outline adm-btn-sm" style={{ marginBottom: 8 }}
                onClick={() => navigate('/admin/restaurants')}>
                ← Back to Restaurants
              </button>
            )}
            <h1>🍽️ {restaurantFilter ? `${restaurantFilter} — Items` : 'Manage All Items'}</h1>
            {restaurantFilter && (
              <p style={{ margin:'4px 0 0', color:'#888', fontSize:'0.82rem' }}>
                {filtered.length} item{filtered.length !== 1 ? 's' : ''} in this restaurant
              </p>
            )}
          </div>
          <button className="adm-btn-primary"
            onClick={() => { resetForm(); setShowForm(v => !v); }}>
            {showForm ? '✕ Cancel' : '+ Add New Item'}
          </button>
        </div>

        {/* ── TOAST ── */}
        {msg && (
          <div className={`adm-toast ${msg.startsWith('❌') ? 'adm-toast-error' : ''}`}>
            {msg}
          </div>
        )}

        {/* ════════════════════════════════
            FORM
        ════════════════════════════════ */}
        {showForm && (
          <form className="adm-form" onSubmit={handleSubmit}>
            <h3>{editId ? '✏️ Edit Item' : '➕ Add New Item'}</h3>

            <div className="adm-form-grid">

              {/* Name */}
              <div className="adm-form-group">
                <label>Item Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Chicken Biryani" />
              </div>

              {/* Restaurant */}
              <div className="adm-form-group">
                <label>Restaurant *</label>
                <input name="restaurant" value={form.restaurant} onChange={handleChange} required placeholder="Restaurant name" />
              </div>

              {/* Category */}
              <div className="adm-form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Price */}
              <div className="adm-form-group">
                <label>Price (₹) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="199" />
              </div>

              {/* Old Price */}
              <div className="adm-form-group">
                <label>Old Price (₹)</label>
                <input type="number" name="oldPrice" value={form.oldPrice} onChange={handleChange} placeholder="249" />
              </div>

              {/* Rating */}
              <div className="adm-form-group">
                <label>Rating</label>
                <input type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleChange} placeholder="4.5" />
              </div>

              {/* Reviews */}
              <div className="adm-form-group">
                <label>Reviews</label>
                <input type="number" name="reviews" value={form.reviews} onChange={handleChange} placeholder="120" />
              </div>

              {/* Delivery Time */}
              <div className="adm-form-group">
                <label>Delivery Time</label>
                <input name="time" value={form.time} onChange={handleChange} placeholder="30–40 mins" />
              </div>

              {/* ── IMAGE FIELD (full width) ── */}
              <div className="adm-form-group adm-form-full">
                <label>Image *</label>

                {/* Mode toggle */}
                <div className="adm-img-toggle">
                  <button type="button"
                    className={imgMode === 'upload' ? 'adm-img-tab-active' : 'adm-img-tab'}
                    onClick={() => setImgMode('upload')}>
                    📁 Upload File
                  </button>
                  <button type="button"
                    className={imgMode === 'url' ? 'adm-img-tab-active' : 'adm-img-tab'}
                    onClick={() => setImgMode('url')}>
                    🔗 Paste URL
                  </button>
                </div>

                {/* Upload from device */}
                {imgMode === 'upload' && (
                  <div className="adm-upload-area"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileUpload({ target: { files: [file] } });
                    }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    {uploading ? (
                      <div className="adm-upload-uploading">
                        <span className="adm-spinner" /> Uploading to Cloudinary…
                      </div>
                    ) : form.image && form.image.startsWith('http') ? (
                      <div className="adm-upload-done">
                        <img src={form.image} alt="preview" className="adm-img-preview" />
                        <p>✅ Uploaded — click to replace</p>
                      </div>
                    ) : (
                      <div className="adm-upload-placeholder">
                        <span>☁️</span>
                        <p>Click or drag & drop to upload</p>
                        <small>JPG, PNG, WEBP, AVIF — max 5MB</small>
                      </div>
                    )}
                  </div>
                )}

                {/* Paste URL / local path */}
                {imgMode === 'url' && (
                  <div className="adm-url-input-wrap">
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/food.jpg  or  IMAGES/chicken_Biryani.avif"
                      autoComplete="off"
                    />
                    {/* Live preview */}
                    {form.image.trim() && (
                      <ImagePreview src={normImg(form.image.trim())} />
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="adm-form-group adm-form-full">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description…" rows={3} />
              </div>

            </div>{/* /adm-form-grid */}

            <div className="adm-form-actions">
              <button type="submit" className="adm-btn-primary" disabled={uploading}>
                {editId ? 'Update Item' : 'Add Item'}
              </button>
              <button type="button" className="adm-btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        )}

        {/* ── SEARCH ── */}
        <div className="adm-search-bar">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search items or restaurants…" />
          <span>{filtered.length} items</span>
        </div>

        {/* ── TABLE ── */}
        {loading ? <p className="adm-loading">Loading…</p> : (
          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Image</th><th>Name</th><th>Restaurant</th>
                  <th>Category</th><th>Price</th><th>Rating</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={normImg(item.image)}
                        alt={item.name}
                        className="adm-item-thumb"
                        onError={e => { e.target.src = '/IMAGES/burger_2.webp'; }}
                      />
                    </td>
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign:'center', color:'#aaa', padding:'32px' }}>
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ManageItems;
