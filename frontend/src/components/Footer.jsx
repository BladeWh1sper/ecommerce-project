import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      © {new Date().getFullYear()} Интернет-магазин. Все права защищены.
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: "auto",
    padding: "15px 30px",
    backgroundColor: "#0077cc",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
    fontSize: "0.9rem"
  }
};

export default Footer;
