import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        <div className={styles.logoIcon}>✦</div>
        Pixel<em>Mind</em>
      </NavLink>

      <ul id="nav-menu" className={styles.navLinks}>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/resize"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Resizer
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/convert"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Converter
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/compress"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Compressor
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/qr-generator"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            QR Tools
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/bg-remover"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            BG Remover
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/image-to-pdf"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            PDF Tools
          </NavLink>
        </li>
      </ul>

      <div className={styles.navRight}>
        <div className={styles.toggleWrap}>
          <span className={styles.toggleLabel}>
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </span>
          <button
            className={styles.toggleBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          ></button>
        </div>
        <NavLink to="/" className={`${styles.btnNav} ${styles.btnSolid} ${styles.desktopOnly}`}>
          All Tools
        </NavLink>
        <button
          className={styles.mobileMenuBtn}
          onClick={() => document.getElementById('nav-menu').classList.toggle(styles.showMobile)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
