import AdUnit from "../components/AdUnit";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import {
  MoveRight, PlayCircle,
  Image, FileText, Zap, Maximize2, RefreshCw, Scissors, QrCode, Lock, Target, Cpu
} from "lucide-react";

function Home() {
  return (
    <div className="page-wrap">

      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.gridBg}></div>
          <div className={`${styles.orb} ${styles.orb1}`}></div>
          <div className={`${styles.orb} ${styles.orb2}`}></div>
          <div className={`${styles.orb} ${styles.orb3}`}></div>
        </div>

        <div className={styles.heroBadge}>
          <div className={styles.badgeDot}></div>
          AI-Powered · Free · 100% Private
        </div>

        <h1 className={styles.heroH1}>
          <span className={styles.grad}>Transform Images</span><br />
          Instantly with<br />
          <span className={styles.dim}>Precision AI</span>
        </h1>

        <p className={styles.heroP}>
          Resize, convert, compress, and enhance images with AI — right in your browser. No uploads, no accounts, completely free.
        </p>

        <div className={styles.heroCta}>
          <a href="#tools" className={styles.btnHeroMain}>
            Launch Tools
            <MoveRight size={18} strokeWidth={2.5} />
          </a>
          <button className={styles.btnHeroSec}>
            <PlayCircle size={18} strokeWidth={2.5} />
            Watch Demo
          </button>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>2.4<em>M+</em></div>
            <div className={styles.statLbl}>Images Processed</div>
          </div>
          <div className={styles.statDiv}></div>
          <div className={styles.stat}>
            <div className={styles.statNum}><em>~</em>50ms</div>
            <div className={styles.statLbl}>Process Speed</div>
          </div>
          <div className={styles.statDiv}></div>
          <div className={styles.stat}>
            <div className={styles.statNum}>100<em>%</em></div>
            <div className={styles.statLbl}>Private</div>
          </div>
          <div className={styles.statDiv}></div>
          <div className={styles.stat}>
            <div className={styles.statNum}>7<em>+</em></div>
            <div className={styles.statLbl}>Free Tools</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {Array(16).fill(null).map((_, i) => {
            const items = ["Image Resizer", "Format Converter", "AI Compressor", "BG Remover", "QR Generator", "Image to PDF"];
            const txt = items[i % items.length];
            return (
              <div key={i} className={styles.marqueeItem}>
                <div className={styles.mqDot}></div>{txt}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TOOL CATEGORIES */}
      <section className="sec">
        <div className="sec-label">Tool Categories</div>
        <h2 className="sec-title">Choose Your <span className="ac">Workflow</span></h2>
        <p className="sec-sub">All the tools you need in one place.</p>

        <div className={styles.catGrid}>
          <div className={styles.catCard}>
            <div className={`${styles.catIco} ${styles.icoG}`}><Image size={22} strokeWidth={1.8} /></div>
            <div className={styles.catName}>Image Tools</div>
            <div className={styles.catDesc}>Resize, convert, and compress images at any scale.</div>
            <div className={styles.catLinks}>
              <Link className={styles.catLink} to="/resize"><div className={styles.clDot}></div>Image Resizer</Link>
              <Link className={styles.catLink} to="/convert"><div className={styles.clDot}></div>Image Converter</Link>
              <Link className={styles.catLink} to="/compress"><div className={styles.clDot}></div>Image Compressor</Link>
            </div>
          </div>
          <div className={styles.catCard}>
            <div className={`${styles.catIco} ${styles.icoP}`}><FileText size={22} strokeWidth={1.8} /></div>
            <div className={styles.catName}>Document Tools</div>
            <div className={styles.catDesc}>Convert images to PDF and manage document files easily.</div>
            <div className={styles.catLinks}>
              <Link className={styles.catLink} to="/image-to-pdf"><div className={styles.clDot}></div>Image to PDF</Link>
            </div>
          </div>
          <div className={styles.catCard}>
            <div className={`${styles.catIco} ${styles.icoB}`}><Zap size={22} strokeWidth={1.8} /></div>
            <div className={styles.catName}>Utilities</div>
            <div className={styles.catDesc}>AI-powered utilities for everyday creative and developer tasks.</div>
            <div className={styles.catLinks}>
              <Link className={styles.catLink} to="/qr-generator"><div className={styles.clDot}></div>QR Code Generator</Link>
              <Link className={styles.catLink} to="/bg-remover"><div className={styles.clDot}></div>Background Remover</Link>
            </div>
          </div>
        </div>
      </section>

      {/* AD ROW 2 */}
      <div className="ad-row-2">
        <AdUnit format="336x280" label="Advertisement · 336×280" />
        <AdUnit format="336x280" label="Advertisement · 336×280" />
      </div>

      {/* 3. IMAGE TOOLS GRID */}
      <section className="sec" id="tools">
        <div className={styles.toolsHeader}>
          <div>
            <div className="sec-label">Image Tools</div>
            <h2 className="sec-title">Precision Tools,<br /><span className="ac">Zero Friction</span></h2>
          </div>
          <p className="sec-sub">Browser-native processing. No uploads, no waiting — your files stay on your device.</p>
        </div>

        <div className={styles.toolsGrid}>
          <Link to="/resize" className={`${styles.toolCard} ${styles.big}`}>
            <div className={styles.toolNum}>01 — FEATURED</div>
            <div className={styles.toolIco}><Maximize2 size={26} strokeWidth={1.6} /></div>
            <div className={styles.toolTags}>
              <span className={`${styles.tag} ${styles.tagG}`}>Most Used</span>
              <span className={styles.tag}>Batch Support</span>
              <span className={styles.tag}>All Formats</span>
            </div>
            <div className={styles.toolName}>Image Resizer</div>
            <div className={styles.toolDesc}>Resize images to exact pixel dimensions or percentage scale. Perfect for social media, web, and print. Supports JPG, PNG, WebP, GIF with lossless precision.</div>
            <div className={styles.toolLink}>Start Resizing →</div>
          </Link>

          <Link to="/convert" className={styles.toolCard}>
            <div className={styles.toolNum}>02</div>
            <div className={styles.toolIco}><RefreshCw size={26} strokeWidth={1.6} /></div>
            <div className={styles.toolName}>Image Converter</div>
            <div className={styles.toolDesc}>Convert between PNG, JPG, and WebP formats. Optimize for any platform in one click.</div>
            <div className={styles.toolLink}>Convert Now →</div>
          </Link>

          <Link to="/compress" className={styles.toolCard}>
            <div className={styles.toolNum}>03</div>
            <div className={styles.toolIco}><Zap size={26} strokeWidth={1.6} /></div>
            <div className={styles.toolName}>AI Compressor</div>
            <div className={styles.toolDesc}>Reduce file size up to 80% while keeping visual quality. Smart perceptual compression.</div>
            <div className={styles.toolLink}>Compress →</div>
          </Link>

          <Link to="/bg-remover" className={styles.toolCard}>
            <div className={styles.toolNum}>04</div>
            <div className={styles.toolIco}><Scissors size={26} strokeWidth={1.6} /></div>
            <div className={styles.toolName}>BG Remover</div>
            <div className={styles.toolDesc}>AI removes backgrounds in seconds. Clean transparent PNGs, ready to use anywhere.</div>
            <div className={styles.toolLink}>Remove BG →</div>
          </Link>

          <Link to="/qr-generator" className={styles.toolCard}>
            <div className={styles.toolNum}>05</div>
            <div className={styles.toolIco}><QrCode size={26} strokeWidth={1.6} /></div>
            <div className={styles.toolName}>QR Generator</div>
            <div className={styles.toolDesc}>Generate styled QR codes for URLs, text, and contact cards. Export as SVG or PNG.</div>
            <div className={styles.toolLink}>Generate →</div>
          </Link>

          <Link to="/image-to-pdf" className={styles.toolCard}>
            <div className={styles.toolNum}>06</div>
            <div className={styles.toolIco}><FileText size={26} strokeWidth={1.6} /></div>
            <div className={styles.toolName}>Image to PDF</div>
            <div className={styles.toolDesc}>Combine multiple images into a single, high-quality PDF document instantly.</div>
            <div className={styles.toolLink}>Create PDF →</div>
          </Link>
        </div>
      </section>

      {/* MID PAGE BANNER */}
      <div className="ad-row">
        <AdUnit format="728x90" label="Advertisement · 728×90 Banner" />
      </div>

      {/* 4. FEATURES SEC */}
      <section className="sec">
        <div className="sec-label">Why PixelMind</div>
        <h2 className="sec-title" style={{ marginBottom: "44px" }}>Built for <span className="ac">Speed</span> &amp; Privacy</h2>

        <div className={styles.featBox}>
          <div className={styles.featTop}>
            <div className={styles.featLeft}>
              <div className="sec-label" style={{ marginBottom: "10px" }}>Architecture</div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-.025em", marginBottom: "14px", color: "var(--text)" }}>100% In-Browser Processing</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.82, maxWidth: "360px" }}>WebAssembly and the Canvas API run all processing directly in your browser. Files are never sent to any server — full privacy, instant results, no latency.</p>
              <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <span className={`${styles.tag} ${styles.tagG}`}>WASM Powered</span>
                <span className={styles.tag}>Canvas API</span>
                <span className={styles.tag}>Offline Ready</span>
              </div>
            </div>
            <div className={styles.featRight}>
              <div className={styles.terminal}>
                <div className={styles.tBar}>
                  <div className={`${styles.td} ${styles.r}`}></div><div className={`${styles.td} ${styles.y}`}></div><div className={`${styles.td} ${styles.g2}`}></div>
                </div>
                <div><span className={styles.tPath}>pixelmind/</span> <span className={styles.tCmd}>process</span></div>
                <div><span className={styles.tOut}>→ WASM engine ready</span></div>
                <div><span className={styles.tOut}>→ Reading file buffer...</span></div>
                <div><span className={styles.tOut}>→ PNG → WebP (92%)</span></div>
                <div><span className={styles.tOut}>→ 2.3MB → 0.4MB</span></div>
                <div><span className={styles.tOk}>✓ Done in 48ms. Saved.</span></div>
                <div><span className={styles.tCmd}>$ No upload. Private.</span></div>
                <div><span className={styles.tCmd}>$ </span><div className={styles.tCur}></div></div>
              </div>
            </div>
          </div>
          <div className={styles.featBottom}>
            <div className={styles.featItem}>
              <div className={styles.featEm}><Zap size={24} strokeWidth={1.8} color="var(--accent)" /></div>
              <div className={styles.featName}>Lightning Fast</div>
              <div className={styles.featTxt}>Process images in under 100ms. No server round-trips, no upload queues.</div>
            </div>
            <div className={styles.featItem}>
              <div className={styles.featEm}><Lock size={24} strokeWidth={1.8} color="var(--accent)" /></div>
              <div className={styles.featName}>100% Private</div>
              <div className={styles.featTxt}>Your files never leave your device. All processing runs client-side.</div>
            </div>
            <div className={styles.featItem}>
              <div className={styles.featEm}><Target size={24} strokeWidth={1.8} color="var(--accent)" /></div>
              <div className={styles.featName}>No Sign-up Needed</div>
              <div className={styles.featTxt}>Open a tool, start working instantly. Zero friction, zero accounts.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
