import { useEffect, useMemo, useState } from "react";
import styles from "./ComingSoon.module.css";

const LAUNCH_DATE = new Date("2026-04-01T00:00:00");
const START_DATE = new Date("2026-02-01T00:00:00");

function getCountdown() {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) {
    return { days: "00", hours: "00", mins: "00", secs: "00" };
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    mins: String(mins).padStart(2, "0"),
    secs: String(secs).padStart(2, "0"),
  };
}

function getProgress() {
  const total = LAUNCH_DATE.getTime() - START_DATE.getTime();
  const elapsed = Date.now() - START_DATE.getTime();
  return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
}

function ComingSoon() {
  const [theme, setTheme] = useState(() => localStorage.getItem("aigenzox-theme") || "dark");
  const [countdown, setCountdown] = useState(getCountdown());
  const [progress, setProgress] = useState(getProgress());
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem("aigenzox-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown());
      setProgress(getProgress());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = useMemo(
    () => ["Image Converter", "Compressor", "Resizer", "BG Remover", "QR Generator", "Image to PDF"],
    []
  );

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page} data-theme={theme}>
      <div className={styles.bgGrid} />
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />

      <header className={styles.topbar}>
        <div className={styles.logo}>
          <span className={styles.logoDot}>✦</span>
          AI <em>Genzox</em>
        </div>

        <button
          className={styles.themeToggle}
          type="button"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.statusBadge}>
          <span className={styles.badgeDot} />
          Under Construction — Coming Soon
        </div>

        <h1 className={styles.mainTitle}>
          Something
          <br />
          <span className={styles.accent}>Awesome</span>
          <br />
          is Coming
        </h1>

        <p className={styles.mainSub}>
          We&apos;re building free, blazing-fast AI image tools — convert, compress, resize, remove backgrounds,
          and more.
        </p>

        <div className={styles.featuresRow}>
          {features.map((feature) => (
            <div key={feature} className={styles.featPill}>
              <span className={styles.fpDot} />
              {feature}
            </div>
          ))}
        </div>

        <div className={styles.launchProgress}>
          <div className={styles.lpHeader}>
            <span className={styles.lpLabel}>Launch Progress</span>
            <span className={styles.lpPct}>{progress}%</span>
          </div>
          <div className={styles.lpBar}>
            <div className={styles.lpFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className={styles.countdown}>
          <div className={styles.cdBlock}>
            <div className={styles.cdNum}>{countdown.days}</div>
            <div className={styles.cdLabel}>Days</div>
          </div>
          <div className={styles.cdSep}>:</div>
          <div className={styles.cdBlock}>
            <div className={styles.cdNum}>{countdown.hours}</div>
            <div className={styles.cdLabel}>Hours</div>
          </div>
          <div className={styles.cdSep}>:</div>
          <div className={styles.cdBlock}>
            <div className={styles.cdNum}>{countdown.mins}</div>
            <div className={styles.cdLabel}>Mins</div>
          </div>
          <div className={styles.cdSep}>:</div>
          <div className={styles.cdBlock}>
            <div className={styles.cdNum}>{countdown.secs}</div>
            <div className={styles.cdLabel}>Secs</div>
          </div>
        </div>

        <section className={styles.formWrap}>
          {!submitted ? (
            <form onSubmit={onSubmit}>
              <h2 className={styles.formTitle}>📬 Get Notified</h2>
              <p className={styles.formSub}>Leave your details and we’ll notify you when AI Genzox launches.</p>

              <div className={styles.fieldGrid}>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <input
                  className={styles.fieldInput}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <textarea
                className={styles.fieldTextarea}
                placeholder="Message (optional)"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />

              <button className={styles.submitBtn} type="submit">
                Send Message →
              </button>
            </form>
          ) : (
            <div className={styles.successBox}>
              <div className={styles.successTitle}>You&apos;re on the list!</div>
              <p className={styles.successMsg}>Thanks — we&apos;ll email you when AI Genzox goes live.</p>
            </div>
          )}
        </section>
      </main>

      <footer className={styles.pageFooter}>
        <span className={styles.footCopy}>© 2026 AI Genzox</span>
        <div className={styles.footLinks}>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

export default ComingSoon;
