import { Link } from "react-router-dom";
import styles from "./ToolCard.module.css";
import { ArrowRight } from "lucide-react";

// The new design uses generic icons like `✦` or specific SVG paths. We will render an icon if provided.
function ToolCard({ title, description, link, icon: Icon }) {
  return (
    <Link to={link} className={styles.cardLink}>
      <div className={styles.toolCard}>
        <div className={styles.cardIcon}>
          {Icon ? <Icon size={28} /> : <span>✦</span>}
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
        <div className={styles.cta}>
          <span>Try Now</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;
