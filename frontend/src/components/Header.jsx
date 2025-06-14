import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#0077cc",
      color: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Магазин товаров</Link>
      </div>

      <nav style={{ display: "flex", gap: "20px" }}>
        <NavLink to="/" label="Каталог" currentPath={location.pathname} />
        <NavLink to="/cart" label="Корзина" currentPath={location.pathname} />
        <NavLink to="/orders" label="Заказы" currentPath={location.pathname} />
        {token ? (
          <button onClick={handleLogout} style={buttonStyle}>Выйти</button>
        ) : (
          <NavLink to="/login" label="Войти" currentPath={location.pathname} />
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ to, label, currentPath }) => {
  const isActive = currentPath === to;
  return (
    <Link to={to} style={{
      color: "#fff",
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "500",
      borderBottom: isActive ? "2px solid #fff" : "none",
      paddingBottom: "2px"
    }}>
      {label}
    </Link>
  );
};

const buttonStyle = {
  backgroundColor: "transparent",
  border: "1px solid #fff",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "500"
};

export default Header;
