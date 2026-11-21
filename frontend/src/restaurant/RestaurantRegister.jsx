import { useState } from 'react';
import { Link } from 'react-router-dom';
import API, { getApiErrorMessage } from '../api';
import './restaurant.css';

const INITIAL_FORM = {
  username: '',
  email: '',
  password: '',
  restaurantName: '',
  address: '',
  phone: '',
  city: '',
  cuisine: '',
};

const RestaurantRegister = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await API.post('/restaurant/register', formData);
      setSuccess(response.data.message);
      setFormData(INITIAL_FORM);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to submit your application. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="restaurant-auth-page">
      <section className="restaurant-auth-card">
        <Link className="restaurant-brand" to="/">🍴 Food Express</Link>
        <p className="restaurant-eyebrow">Restaurant partner</p>
        <h1>Register your restaurant</h1>
        <p className="restaurant-subtitle">
          Submit your details for admin review. Your restaurant will go live after approval.
        </p>

        {error && <p className="restaurant-message restaurant-message-error" role="alert">{error}</p>}
        {success && <p className="restaurant-message restaurant-message-success" role="status">{success}</p>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="restaurant-form-grid">
              <label>
                Owner name
                <input name="username" value={formData.username} onChange={handleChange} autoComplete="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
              </label>
              <label>
                Password
                <input name="password" type="password" value={formData.password} onChange={handleChange} autoComplete="new-password" minLength={8} required />
                <small>Use at least 8 characters.</small>
              </label>
              <label>
                Restaurant name
                <input name="restaurantName" value={formData.restaurantName} onChange={handleChange} required />
              </label>
              <label className="restaurant-form-full">
                Address
                <input name="address" value={formData.address} onChange={handleChange} autoComplete="street-address" required />
              </label>
              <label>
                Phone (optional)
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" />
              </label>
              <label>
                City (optional)
                <input name="city" value={formData.city} onChange={handleChange} autoComplete="address-level2" />
              </label>
              <label className="restaurant-form-full">
                Cuisine (optional)
                <input name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="e.g. South Indian, Pizza" />
              </label>
            </div>
            <button className="restaurant-primary-button" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit for approval'}
            </button>
          </form>
        )}

        {success ? (
          <p className="restaurant-auth-footer">Already approved? <Link to="/login">Log in</Link></p>
        ) : (
          <p className="restaurant-auth-footer">Already registered? <Link to="/login">Log in</Link></p>
        )}
        <p className="restaurant-auth-footer">
          <Link to="/signup">Back to account type selection</Link>
        </p>
      </section>
    </main>
  );
};

export default RestaurantRegister;
