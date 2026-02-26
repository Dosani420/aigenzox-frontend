import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import AdUnit from "./AdUnit";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "44px" }}>
        <AdUnit format="728x90" label="Advertisement · 728×90 Footer" />
      </div>

      <div className={styles.footTop}>
        <div className={styles.footBrand}>
          <Link to="/" className={styles.logo} style={{ fontSize: "1.05rem" }}>
            <div className={styles.logoIcon} style={{ width: "26px", height: "26px", fontSize: "0.75rem" }}>✦</div>
            Pixel<em>Mind</em>
          </Link>
          <p>Free AI image tools for creators, developers, and everyone in between. No sign-up, no nonsense.</p>
        </div>

        <div>
          <div className={styles.footColH}>Tools</div>
          <ul className={styles.footLinks}>
            <li><Link to="/resize">Image Resizer</Link></li>
            <li><Link to="/convert">Converter</Link></li>
            <li><Link to="/compress">Compressor</Link></li>
            <li><Link to="/bg-remover">BG Remover</Link></li>
            <li><Link to="/qr-generator">QR Generator</Link></li>
            <li><Link to="/image-to-pdf">Image to PDF</Link></li>
          </ul>
        </div>

        <div>
          <div className={styles.footColH}>Features</div>
          <ul className={styles.footLinks}>
            <li><a href="#">Fast Processing</a></li>
            <li><a href="#">Secure & Private</a></li>
            <li><a href="#">Batch Mode</a></li>
            <li><a href="#">Free Forever</a></li>
          </ul>
        </div>

        <div>
          <div className={styles.footColH}>Company</div>
          <ul className={styles.footLinks}>
            <li><a href="#">About</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.footBottom}>
        <span>&copy; {currentYear} PixelMind. All rights reserved.</span>
        <div className={styles.footMade}>Built with <em>✦</em> for creators</div>
      </div>
    </footer>
  );
}

export default Footer;
