import React, { useEffect, useState } from "react";
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

const translateStatus = (status) => {
  switch (status) {
    case "pending":
      return "В обработке";
    case "paid":
      return "Оплачен";
    case "shipped":
      return "Доставлен";
    default:
      return status;
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const role = getRoleFromToken();
    if (role === "admin") {
      setIsAdmin(true);
      api.get("/admin/orders")
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    } else {
      api.get("/orders/")
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    }
  }, [token, navigate]);

  const handleDeleteOrder = (orderId) => {
    api.delete(`/admin/orders/${orderId}`)
      .then(() => {
        setOrders(prev => prev.filter(order => order.id !== orderId));
      })
      .catch(err => {
        alert("Ошибка при удалении заказа");
        console.error(err);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isAdmin ? "Все заказы (Админ)" : "Мои заказы"}</h2>
      <div style={styles.cardList}>
        {orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <p><b>Заказ #{order.id}</b> {isAdmin && <span>({order.user_email})</span>}</p>
            <p>Статус: <b>{translateStatus(order.status)}</b></p>
            <p>Итого: <b>${order.total_price}</b></p>
            {isAdmin && (
              <button style={styles.deleteButton} onClick={() => handleDeleteOrder(order.id)}>Удалить</button>
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
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "30px",
    marginBottom: "25px",
    textAlign: "center",
    color: "#333"
  },
  cardList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    width: "260px",
    backgroundColor: "#fafafa",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  deleteButton: {
    marginTop: "15px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer"
  }
};

export default OrdersPage;
