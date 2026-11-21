import { Routes, Route, Outlet } from 'react-router-dom';

// Public pages
import Home           from './pages/Home';
import Category       from './pages/Category';
import Restaurants    from './pages/Restaurants';
import RestName       from './pages/RestName';
import RestaurantName from './pages/RestaurantName';
import CategoryList   from './pages/CategoryList';
import Cart           from './Components/Cart';
import About          from './pages/About';
import Offers         from './pages/Offers';
import Login          from './Components/Login';
import Signup         from './Components/Signup';
import ForgotPassword from './pages/ForgotPassword';
import MenuCard2      from './MenuCards_List/MenuCard2';
import MyOrders       from './pages/MyOrders';
import NotFound       from './pages/NotFound';

// Admin pages
import Dashboard        from './admin/Dashboard';
import ManageItems      from './admin/ManageItems';
import ManageUsers      from './admin/ManageUsers';
import AdminRestaurants from './admin/Restaurants';
import AdminOrders      from './admin/Orders';
import RestaurantApplications from './admin/RestaurantApplications';

// Restaurant owner pages
import RestaurantRegister from './restaurant/RestaurantRegister';
import RestaurantDashboard from './restaurant/RestaurantDashboard';
import RestaurantOrders from './restaurant/RestaurantOrders';
import RestaurantMenu from './restaurant/RestaurantMenu';

// Layout & guards
import NavBar    from './Components/NavBar';
import AdminRoute from './Components/AdminRoute';
import RestaurantRoute from './restaurant/RestaurantRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const PublicLayout = () => (
  <>
    <NavBar />
    <div className="page-content">
      <Outlet />
    </div>
  </>
);

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Routes>

          {/* ── PUBLIC ROUTES — with NavBar ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"                      element={<Home />} />
            <Route path="/category"              element={<Category />} />
            <Route path="/Restaurants"           element={<Restaurants />} />
            <Route path="/restName"              element={<RestName />} />
            <Route path="/restname/:name"        element={<RestName />} />
            <Route path="/restaurant/:name"      element={<RestaurantName />} />
            <Route path="/category/:category"    element={<CategoryList />} />
            <Route path="/menuCard2/:restaurant" element={<MenuCard2 />} />
            <Route path="/cart"                  element={<Cart />} />
            <Route path="/my-orders"             element={<MyOrders />} />
            <Route path="/about"                 element={<About />} />
            <Route path="/offers"                element={<Offers />} />
            <Route path="/login"                 element={<Login />} />
            <Route path="/signup"                element={<Signup />} />
            <Route path="/forgot-password"       element={<ForgotPassword />} />
            <Route path="*"                      element={<NotFound />} />
          </Route>

          {/* ── RESTAURANT OWNER PORTAL ── */}
          <Route path="/restaurant/register" element={<RestaurantRegister />} />
          <Route
            path="/restaurant/dashboard"
            element={<RestaurantRoute><RestaurantDashboard /></RestaurantRoute>}
          />
          <Route
            path="/restaurant/orders"
            element={<RestaurantRoute><RestaurantOrders /></RestaurantRoute>}
          />
          <Route
            path="/restaurant/menu"
            element={<RestaurantRoute><RestaurantMenu /></RestaurantRoute>}
          />

          {/* ── ADMIN ROUTES — no NavBar, protected ── */}
          <Route path="/admin/dashboard"
            element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/orders"
            element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/manage-items"
            element={<AdminRoute><ManageItems /></AdminRoute>} />
          <Route path="/admin/manage-users"
            element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/restaurants"
            element={<AdminRoute><AdminRestaurants /></AdminRoute>} />
          <Route path="/admin/restaurant-applications"
            element={<AdminRoute><RestaurantApplications /></AdminRoute>} />

        </Routes>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
