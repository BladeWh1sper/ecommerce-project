import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, deleteFromCart } from "../features/cart/cartSlice";
import { connectWebSocket, closeWebSocket } from "../utils/websocket";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const getRoleFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (e) {
    return null;
  }
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.cart);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allCarts, setAllCarts] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const role = getRoleFromToken();
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) return;

    connectWebSocket(token, () => {
      dispatch(fetchCart());
    });

    return () => {
      closeWebSocket();
    };
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isAdmin) {
      api.get("/admin/carts")
        .then(res => setAllCarts(res.data))
        .catch(err => console.error(err));
    }
  }, [isAdmin]);

  const handleCreateOrder = () => {
    api.post("/orders/", {})
      .then(() => {
        dispatch(fetchCart());
        alert("Заказ успешно создан!");
      })
      .catch(err => {
        alert("Ошибка при создании заказа");
      });
  };

  if (status === "loading") return <p>Загрузка корзины...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isAdmin ? "Корзины всех пользователей (Админ)" : "Ваша корзина"}</h2>

      {isAdmin ? (
        <div style={styles.adminList}>
          {allCarts.map((item) => (
            <div key={item.id} style={styles.adminCard}>
              <p><b>Пользователь:</b> {item.user?.email || "Неизвестно"}</p>
              <p><b>Товар:</b> {item.product?.name || "Неизвестно"}</p>
              <p><b>Количество:</b> {item.quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.cardList}>
          {items.map((item) => (
            <div key={item.id} style={styles.cartCard}>
              <p>Товар: <b>{item.product?.name || "Неизвестно"}</b></p>
              <p>Количество: <b>{item.quantity}</b></p>
              <button style={styles.removeButton} onClick={() => dispatch(deleteFromCart(item.id))}>
                Удалить
              </button>
            </div>
          ))}
          {items.length > 0 && (
            <button style={styles.orderButton} onClick={handleCreateOrder}>
              Оформить заказ
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  title: {
    fontSize: "30px",
    marginBottom: "25px",
    textAlign: "center",
    color: "#333"
  },
  adminList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  adminCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  cardList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center"
  },
  cartCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    width: "220px",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  removeButton: {
    marginTop: "10px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  orderButton: {
    marginTop: "20px",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default CartPage;
