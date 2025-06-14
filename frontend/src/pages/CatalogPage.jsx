import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/catalog/catalogSlice";
import { addToCart } from "../features/cart/cartSlice";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CatalogPage = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.catalog);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAuthenticated(true);
        if (payload.role === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    }
    dispatch(fetchProducts());
  }, [dispatch, token]);

  const handleAddToCart = (productId) => {
    const item = { product_id: productId, quantity: 1 };
    dispatch(addToCart(item));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/admin/products/${productId}`);
      dispatch(fetchProducts());
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  if (status === "loading") return <p>Загрузка...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Каталог товаров</h2>

      {isAdmin && (
        <button style={styles.addButton} onClick={() => navigate("/add-product")}>
          Добавить новый товар
        </button>
      )}

      <div style={styles.productList}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.price}>Цена: {product.price} ₽</p>
            <p style={styles.stock}>Остаток: {product.stock} шт.</p>

            {isAuthenticated && !isAdmin && (
              <button style={styles.cartButton} onClick={() => handleAddToCart(product.id)}>
                Добавить в корзину
              </button>
            )}

            {isAdmin && (
              <div style={styles.adminButtons}>
                <button style={styles.editButton} onClick={() => handleEditProduct(product.id)}>Редактировать</button>
                <button style={styles.deleteButton} onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  addButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  productList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    width: "260px",
    backgroundColor: "#fafafa",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  productName: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },
  price: {
    fontSize: "16px",
    marginBottom: "5px",
  },
  stock: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "15px",
  },
  cartButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
  },
  adminButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#333",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CatalogPage;
