import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = () => {
    dispatch(registerUser({ email, password, role: "customer" }))
      .unwrap()
      .then(() => {
        setErrorMessage("");
        navigate("/");
      })
      .catch((err) => {
        if (err.response?.data?.detail?.includes("already exists")) {
          setErrorMessage("Почта уже зарегистрирована");
        } else {
          setErrorMessage("Ошибка регистрации");
        }
      });
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        setErrorMessage("");
        navigate("/");
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setErrorMessage("Неверная почта или пароль");
        } else {
          setErrorMessage("Ошибка входа");
        }
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Вход / Регистрация</h2>

        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />
        </div>
        <div style={styles.buttonGroup}>
          <button style={styles.buttonPrimary} onClick={handleLogin}>Войти</button>
          <button style={styles.buttonSecondary} onClick={handleRegister}>Зарегистрироваться</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "#f5f5f5"
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "350px",
    boxSizing: "border-box"
  },
  title: {
    marginBottom: "25px",
    fontSize: "28px",
    color: "#333"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "25px"
  },
  input: {
    padding: "12px 15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px"
  },
  buttonPrimary: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer"
  },
  buttonSecondary: {
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#eee",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer"
  },
  error: {
    color: "#e74c3c",
    marginBottom: "15px",
    fontSize: "14px"
  }
};

export default AuthPage;
