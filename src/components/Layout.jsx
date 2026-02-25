import Navbar from "./Navbar";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import styles from "./Layout.module.css";
import Footer from "./Footer";


function Layout({ children }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={styles.layout}
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a, #1e1b4b)"
          : "linear-gradient(135deg, #eef2ff, #fdf4ff)",
        color: darkMode ? "#f1f5f9" : "#0f172a",
      }}

    >
      <Navbar />
      <div className={styles.content}>{children}</div>
      <Footer />

    </div>
  );
}

export default Layout;
