import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RestaurantRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'restaurant_owner') return <Navigate to="/" replace />;

  return children;
};

export default RestaurantRoute;
