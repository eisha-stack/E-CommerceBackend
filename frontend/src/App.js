import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.type !== role) return <Navigate to="/" />;
  return children;
}

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <h1>Ecommerce App</h1>
      <div className="nav-links">
        <Link to="/">Products</Link>
        {user && <Link to="/cart">Cart</Link>}
        {user && <Link to="/orders">My Orders</Link>}
        {user && user.type === "admin" && <Link to="/admin">Admin</Link>}
        {user && user.type === "admin" && <Link to="/admin-orders">All Orders</Link>}
        {user ? (
          <>
            <span style={{ marginLeft: 10 }}>{user.email}</span>
            <span style={{ marginLeft: 10, fontWeight: 600, color: '#ffd600' }}>{user.type === 'admin' ? 'Admin' : 'User'}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute role="admin"><AdminPanel /></PrivateRoute>} />
              <Route path="/admin-orders" element={<PrivateRoute role="admin"><AdminOrders /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 