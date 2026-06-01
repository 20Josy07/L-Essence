import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Promotions from './pages/admin/Promotions';
import Orders from './pages/admin/Orders';

function AdminGate() {
  const { isAdmin, authLoading } = useAdmin();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#1A1714]/10 border-t-[#B8955A] animate-spin" />
      </div>
    );
  }

  return isAdmin ? <AdminLayout /> : <AdminLogin />;
}

function StoreLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {/* clip-overflow wraps only page content, not the fixed nav/drawer */}
      <div style={{ overflowX: 'clip' }}>
        <Routes>
          <Route path="/" element={<Landing onCartOpen={() => setCartOpen(true)} />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail onCartOpen={() => setCartOpen(true)} />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin" element={<AdminGate />}>
              <Route index element={<Dashboard />} />
              <Route path="inventario" element={<Inventory />} />
              <Route path="promociones" element={<Promotions />} />
              <Route path="pedidos" element={<Orders />} />
            </Route>
            <Route path="/*" element={<StoreLayout />} />
          </Routes>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}
