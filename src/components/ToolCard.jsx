import { Link } from "react-router-dom";
import styles from "./ToolCard.module.css";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { ArrowRight } from "lucide-react";

function ToolCard({ title, description, link, icon: Icon, darkMode: propDarkMode }) { // eslint-disable-line no-unused-vars
  const { darkMode: contextDarkMode } = useContext(ThemeContext);
  const darkMode = propDarkMode !== undefined ? propDarkMode : contextDarkMode;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={link} className={styles["card-link"]}>
      <div
        className={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered
            ? darkMode
              ? "0 20px 60px rgba(99, 102, 241, 0.35)"
              : "0 20px 60px rgba(99, 102, 241, 0.25)"
            : darkMode
            ? "0 8px 20px rgba(0,0,0,0.3)"
            : "0 8px 20px rgba(0,0,0,0.05)",
          background: darkMode
            ? isHovered
              ? "rgba(30, 27, 75, 0.8)"
              : "rgba(30, 27, 75, 0.6)"
            : isHovered
            ? "rgba(255, 255, 255, 0.95)"
            : "rgba(255, 255, 255, 0.7)",
          border: isHovered
            ? `2px solid rgba(99, 102, 241, 0.6)`
            : `1px solid rgba(99, 102, 241, ${darkMode ? 0.25 : 0.15})`,
          color: darkMode ? "#e2e8f0" : "#111827",
        }}
      >
        <div className={styles.iconContainer}>
          <Icon size={56} className={styles.icon} color={darkMode ? "#c4b5fd" : "#6366f1"} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.cta}>
          <span className={styles.ctaText}>Get Started</span>
          <ArrowRight size={16} className={styles.ctaArrow} />
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;
