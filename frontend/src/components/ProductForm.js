import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct, fetchProductById, clearCurrentProduct } from "../features/catalog/catalogSlice";
import { useParams, useNavigate } from "react-router-dom";

const ProductForm = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.catalog.currentProduct);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });

  
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    } else {
      dispatch(clearCurrentProduct());
    }
  }, [dispatch, productId]);

  
  useEffect(() => {
    if (productId && product) {
      setForm(product);
    }
    if (!productId) {
      setForm({
        name: "",
        description: "",
        price: 0,
        stock: 0,
      });
    }
  }, [product, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (productId) {
      await dispatch(updateProduct({ id: productId, ...form }));
    } else {
      await dispatch(createProduct(form));
    }
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{productId ? "Редактировать товар" : "Добавить товар"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Название"
          required
          style={styles.input}
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          required
          style={styles.input}
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Цена"
          required
          style={styles.input}
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Остаток на складе"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {productId ? "Обновить" : "Создать"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "500px",
    margin: "50px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "28px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    fontSize: "18px",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProductForm;
