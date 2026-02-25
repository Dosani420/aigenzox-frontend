import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Wrench, Sun, Moon } from "lucide-react";

function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className={styles.navbar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: darkMode
          ? "rgba(15, 23, 42, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: isHovered
          ? darkMode
            ? "0 8px 32px rgba(99, 102, 241, 0.25)"
            : "0 8px 32px rgba(99, 102, 241, 0.15)"
          : darkMode
          ? "0 4px 16px rgba(0, 0, 0, 0.3)"
          : "0 4px 16px rgba(0, 0, 0, 0.08)",
        borderBottomColor: darkMode
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(99, 102, 241, 0.1)",
      }}
    >
      <h2 className={styles.title}>
        <Wrench size={24} className={styles.titleIcon} />
        Tools Site
      </h2>

      <div className={styles.links}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          style={{
            color: darkMode ? (window.location.pathname === "/" ? "#c4b5fd" : "#e2e8f0") : "inherit",
          }}
        >
          Home
        </NavLink>

        <NavLink
          to="/resize"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          style={{
            color: darkMode ? (window.location.pathname === "/resize" ? "#c4b5fd" : "#e2e8f0") : "inherit",
          }}
        >
          Resizer
        </NavLink>

        <NavLink
          to="/convert"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          style={{
            color: darkMode ? (window.location.pathname === "/convert" ? "#c4b5fd" : "#e2e8f0") : "inherit",
          }}
        >
          Converter
        </NavLink>

        <NavLink
          to="/compress"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          style={{
            color: darkMode ? (window.location.pathname === "/compress" ? "#c4b5fd" : "#e2e8f0") : "inherit",
          }}
        >
          Compressor
        </NavLink>

        <NavLink
          to="/qr-generator"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          style={{
            color: darkMode ? (window.location.pathname === "/qr-generator" ? "#c4b5fd" : "#e2e8f0") : "inherit",
          }}
        >
          QR Generator
        </NavLink>

        <NavLink
          to="/bg-remover"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          style={{
            color: darkMode ? (window.location.pathname === "/bg-remover" ? "#c4b5fd" : "#e2e8f0") : "inherit",
          }}
        >
          BG Remover
        </NavLink>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          title={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
          style={{
            background: darkMode
              ? "rgba(99, 102, 241, 0.15)"
              : "rgba(99, 102, 241, 0.08)",
            borderColor: darkMode
              ? "rgba(139, 92, 246, 0.4)"
              : "rgba(99, 102, 241, 0.3)",
            color: darkMode ? "#c4b5fd" : "#6366f1",
          }}
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
