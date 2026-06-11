import { Routes, Route, Outlet } from 'react-router-dom';

// Pages
import Home            from './pages/Home';
import Category        from './pages/Category';
import Restaurants     from './pages/Restaurants';
import RestName        from './pages/RestName';
import RestaurantName  from './pages/RestaurantName';
import CategoryList    from './pages/CategoryList';
import Cart            from './Components/Cart';
import About           from './pages/About';
import Offers          from './pages/Offers';
import Login           from './Components/Login';
import Signup          from './Components/Signup';
import ForgotPassword  from './pages/ForgotPassword';
import MenuCard2       from './MenuCards_List/MenuCard2';

// Admin pages
import Dashboard        from './admin/Dashboard';
import ManageItems      from './admin/ManageItems';
import ManageUsers      from './admin/ManageUsers';
import AdminRestaurants from './admin/Restaurants';

// Layout & guards
import NavBar      from './Components/NavBar';
import AdminRoute  from './Components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

/* Wraps all public pages with NavBar + page-content offset */
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
            <Route path="/about"                 element={<About />} />
            <Route path="/offers"                element={<Offers />} />
            <Route path="/login"                 element={<Login />} />
            <Route path="/signup"                element={<Signup />} />
            <Route path="/forgot-password"       element={<ForgotPassword />} />
          </Route>

          {/* ── ADMIN ROUTES — no NavBar, protected ── */}
          <Route path="/admin/dashboard"
            element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/manage-items"
            element={<AdminRoute><ManageItems /></AdminRoute>} />
          <Route path="/admin/manage-users"
            element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/restaurants"
            element={<AdminRoute><AdminRestaurants /></AdminRoute>} />

        </Routes>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
