import styles from "./Footer.module.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Code2, Rocket, Sparkles } from "lucide-react";

function Footer() {
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={styles.footer}
      style={{
        borderTopColor: darkMode 
          ? "rgba(99, 102, 241, 0.25)" 
          : "rgba(99, 102, 241, 0.1)",
      }}
    >
      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.brand}>Tools Site</h3>
          <p className={styles.tagline}>Free online image tools for everyone</p>
        </div>

        <div className={styles.section}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/resize">Resizer</a></li>
            <li><a href="/convert">Converter</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Features</h4>
          <ul>
            <li><a href="#features">Fast Processing</a></li>
            <li><a href="#features">Secure & Private</a></li>
            <li><a href="#features">No Sign-up</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.bottom}>
        <p>&copy; {currentYear} Tools Site. All rights reserved.</p>
        <div className={styles.socials}>
          <Code2 
            size={20} 
            color={darkMode ? "#c4b5fd" : "#6366f1"}
            className={styles.socialIcon}
          />
          <Rocket 
            size={20} 
            color={darkMode ? "#c4b5fd" : "#6366f1"}
            className={styles.socialIcon}
          />
          <Sparkles 
            size={20} 
            color={darkMode ? "#c4b5fd" : "#6366f1"}
            className={styles.socialIcon}
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
