import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    document.title = "Магазин";
  }, []);

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/add-product" element={<ProductForm />} />
            <Route path="/edit-product/:productId" element={<ProductForm />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
