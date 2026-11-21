import { useCallback, useEffect, useMemo, useState } from 'react';
import API from '../api';
import RestaurantLayout from './RestaurantLayout';

const EMPTY_FORM = {
  name: '',
  category: '',
  price: '',
  oldPrice: '',
  image: '',
  time: '',
  description: '',
};

const getImageSource = (image) => (
  image && !image.startsWith('/') && !image.startsWith('http') ? `/${image}` : image
);

const RestaurantMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [menuResponse, categoryResponse] = await Promise.all([
        API.get('/restaurant/menu'),
        API.get('/restaurant/menu/categories'),
      ]);
      setItems(menuResponse.data);
      setCategories(categoryResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load restaurant menu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesSearch = !query ||
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [items, categoryFilter, search]);

  const resetForm = () => {
    setForm({ ...EMPTY_FORM, category: categories[0] || '' });
    setEditingId('');
    setFormOpen(false);
  };

  const openNewItemForm = () => {
    setError('');
    setNotice('');
    setForm({ ...EMPTY_FORM, category: categories[0] || '' });
    setEditingId('');
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setError('');
    setNotice('');
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      category: item.category || categories[0] || '',
      price: item.price ?? '',
      oldPrice: item.oldPrice ?? '',
      image: item.image || '',
      time: item.time || '',
      description: item.description || '',
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
    };

    try {
      const response = editingId
        ? await API.put(`/restaurant/menu/${editingId}`, payload)
        : await API.post('/restaurant/menu', payload);
      setItems((current) => (
        editingId
          ? current.map((item) => item._id === editingId ? response.data : item)
          : [response.data, ...current]
      ));
      setNotice(editingId ? 'Menu item updated.' : 'Menu item added.');
      resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save menu item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from your menu?`)) return;
    setDeletingId(item._id);
    setError('');
    setNotice('');
    try {
      await API.delete(`/restaurant/menu/${item._id}`);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setNotice(`${item.name} deleted from your menu.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete menu item.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <RestaurantLayout>
      <div className="adm-page">
        <div className="adm-page-header">
          <div>
            <h1>🍽️ Manage Items</h1>
            <p>Add, edit, or remove food items from your restaurant menu.</p>
          </div>
          <button
            className="adm-btn-primary"
            type="button"
            onClick={() => formOpen ? resetForm() : openNewItemForm()}
          >
            {formOpen ? '✕ Cancel' : '+ Add New Item'}
          </button>
        </div>

        {notice && <div className="adm-toast" role="status">{notice}</div>}
        {error && <div className="adm-toast adm-toast-error" role="alert">{error}</div>}

      {formOpen && (
        <form className="adm-form" onSubmit={handleSubmit}>
          <h3>{editingId ? '✏️ Edit Item' : '➕ Add New Item'}</h3>

          <div className="adm-form-grid">
            <div className="adm-form-group">
              <label htmlFor="restaurant-item-name">Item Name *</label>
              <input
                id="restaurant-item-name"
                name="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                maxLength={100}
                required
              />
            </div>
            <div className="adm-form-group">
              <label htmlFor="restaurant-item-category">Category *</label>
              <select
                id="restaurant-item-category"
                name="category"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                required
              >
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label htmlFor="restaurant-item-price">Price (₹) *</label>
              <input
                id="restaurant-item-price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                required
              />
            </div>
            <div className="adm-form-group">
              <label htmlFor="restaurant-item-old-price">Original Price (₹)</label>
              <input
                id="restaurant-item-old-price"
                name="oldPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={form.oldPrice}
                onChange={(event) => setForm({ ...form, oldPrice: event.target.value })}
              />
            </div>
            <div className="adm-form-group">
              <label htmlFor="restaurant-item-image">Image URL</label>
              <input
                id="restaurant-item-image"
                name="image"
                type="url"
                value={form.image}
                onChange={(event) => setForm({ ...form, image: event.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="adm-form-group">
              <label htmlFor="restaurant-item-time">Preparation Time</label>
              <input
                id="restaurant-item-time"
                name="time"
                value={form.time}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
                placeholder="e.g. 20-30 min"
                maxLength={40}
              />
            </div>
            <div className="adm-form-group adm-form-full">
              <label htmlFor="restaurant-item-description">Description</label>
              <textarea
                id="restaurant-item-description"
                name="description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn-primary" type="submit" disabled={saving || categories.length === 0}>
              {saving ? 'Saving…' : editingId ? 'Update Item' : 'Add Item'}
            </button>
            <button className="adm-btn-outline" type="button" onClick={resetForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}

        <div className="adm-search-bar restaurant-menu-search">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="🔍 Search your menu items…"
            aria-label="Search menu items"
          />
          <span>{filteredItems.length} items</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>

        {loading && <p className="adm-loading">Loading menu…</p>}
        {!loading && !error && items.length === 0 && (
          <div className="adm-table-card restaurant-dashboard-empty">
            Your menu is empty. Add your first food item to get started.
          </div>
        )}
        {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
          <div className="adm-table-card restaurant-dashboard-empty">No menu items match these filters.</div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      {item.image ? (
                        <img
                          src={getImageSource(item.image)}
                          alt={item.name}
                          className="adm-item-thumb"
                        />
                      ) : <span>🍽️</span>}
                    </td>
                    <td className="adm-item-name">{item.name}</td>
                    <td><span className="adm-badge">{item.category}</span></td>
                    <td>₹{Number(item.price).toLocaleString('en-IN')}</td>
                    <td>
                      <button className="adm-btn-edit" type="button" onClick={() => handleEdit(item)}>
                        ✏️ Edit
                      </button>
                      <button
                        className="adm-btn-delete"
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item._id}
                      >
                        {deletingId === item._id ? 'Deleting…' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantMenu;
