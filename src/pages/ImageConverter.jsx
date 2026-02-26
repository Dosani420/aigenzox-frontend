import { useState, useRef } from "react";
import styles from "./ImageConverter.module.css";
import { Link } from "react-router-dom";
import AdUnit from "../components/AdUnit";
import { AlertCircle, CheckCircle, Loader, Download, ArrowRight, UploadCloud, X, Lock, ShieldCheck } from "lucide-react";

function ImageConverter() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [convertedURL, setConvertedURL] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setOriginalSize(file.size);
      setPreview(URL.createObjectURL(file));
      setError("");
      setConvertedURL(null);
      setSuccess("");
      estimateSize(file.size, format, quality);
    } else {
      setError("Please select a valid image file");
      clearImage();
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setConvertedURL(null);
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const estimateSize = (size, fmt, qual) => {
    let sizeMultiplier = 0.8;
    if (fmt === "png") sizeMultiplier = 0.85;
    if (fmt === "jpeg") sizeMultiplier = 0.3 + (qual / 100) * 0.4;
    if (fmt === "webp") sizeMultiplier = 0.25 + (qual / 100) * 0.3;
    setEstimatedSize(Math.round(size * sizeMultiplier));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFormatChange = (e) => {
    const newFormat = e.target.value;
    setFormat(newFormat);
    if (originalSize) estimateSize(originalSize, newFormat, quality);
  };

  const handleQualityChange = (e) => {
    const newQuality = parseInt(e.target.value);
    setQuality(newQuality);
    if (originalSize) estimateSize(originalSize, format, newQuality);
  };

  const handleConvert = async () => {
    setError("");
    setSuccess("");

    if (!image) {
      setError("Please select an image to convert");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("format", format);
      formData.append("quality", quality);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/convert`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to convert image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setConvertedURL(url);

      const compression = ((1 - blob.size / originalSize) * 100).toFixed(1);
      setSuccess(`Converted to ${format.toUpperCase()}! Smaller by ${compression}%.`);
    } catch (err) {
      setError(err.message || "An error occurred while converting");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedURL) return;
    const a = document.createElement("a");
    a.href = convertedURL;
    a.download = `converted-image.${format}`;
    a.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageChange({ dataTransfer: e.dataTransfer });
  };

  // Determine active step
  let currentStep = 1;
  if (image) currentStep = 2;
  if (convertedURL) currentStep = 4;
  else if (loading) currentStep = 3;

  return (
    <div className="page-wrap">

      {/* 1. HERO */}
      <div className={styles.toolHero}>
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>›</span>
          <a href="#tools">Tools</a>
          <span>›</span>
          <span style={{ color: "var(--text-soft)" }}>Image Converter</span>
        </div>

        <div className={styles.heroTop}>
          <div className={`${styles.heroLeft} reveal`}>
            <h1>Image <em>Converter</em></h1>
            <p>Convert images between PNG, JPG, WebP, and GIF instantly — right in your browser. No upload, no waiting, 100% private.</p>
            <div className={styles.heroBadges}>
              <div className={styles.badge}>⚡ Instant</div>
              <div className={styles.badge}><Lock size={14} /> 100% Private</div>
              <div className={`${styles.badge} ${styles.blue}`}>PNG · JPG · WebP · GIF</div>
            </div>
          </div>

          <div className={`${styles.heroFormats} reveal`}>
            <div className={styles.fmtPill}>PNG</div>
            <div className={styles.fmtArrow}>⇄</div>
            <div className={styles.fmtPill}>JPG</div>
            <div className={styles.fmtArrow}>⇄</div>
            <div className={styles.fmtPill}>WebP</div>
            <div className={styles.fmtArrow}>⇄</div>
            <div className={styles.fmtPill}>GIF</div>
          </div>
        </div>
      </div>

      {/* Leaderboard AD */}
      <div className="ad-row">
        <AdUnit format="728x90" label="Advertisement · Leaderboard" />
      </div>

      {/* 2. STEPS BAR */}
      <div className={styles.stepsBar}>
        <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>01</div>
          <div className={styles.stepLbl}>Upload Image</div>
        </div>
        <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>02</div>
          <div className={styles.stepLbl}>Settings</div>
        </div>
        <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>03</div>
          <div className={styles.stepLbl}>Convert</div>
        </div>
        <div className={`${styles.step} ${currentStep >= 4 ? styles.active : ''}`}>
          <div className={styles.stepCircle}>04</div>
          <div className={styles.stepLbl}>Download</div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className={styles.toolMain}>
        {/* LEFT COMPONENT */}
        <div>
          {!preview ? (
            <div
              className={`${styles.uploadZone} ${isDragOver ? styles.drag : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className={styles.uploadInput}
                accept="image/*"
                onChange={handleImageChange}
              />
              <span className={styles.uploadIconBig}><UploadCloud size={48} color="var(--accent)" strokeWidth={1.5} /></span>
              <div className={styles.uploadTitle}>Drop your image here</div>
              <div className={styles.uploadSub}>Or click to browse files from your device</div>
              <button className={styles.btnUpload}>
                Browse Files
              </button>
              <div className={styles.supported}>
                <span className={styles.supFmt}>PNG</span>
                <span className={styles.supFmt}>JPG</span>
                <span className={styles.supFmt}>WebP</span>
                <span className={styles.supFmt}>GIF</span>
              </div>
            </div>
          ) : (
            <div className={styles.previewBox}>
              <div className={styles.previewHeader}>
                <span className={styles.previewLabel}>Original Image</span>
                <button className={styles.btnClear} onClick={clearImage}>
                  <X size={14} /> Remove
                </button>
              </div>
              <div className={styles.previewImgWrap}>
                <img src={preview} alt="Preview" />
              </div>
              <div className={styles.previewInfo}>
                <span className={styles.infoItem}><strong>File:</strong> {image.name}</span>
                <span className={styles.infoItem}><strong>Size:</strong> {formatFileSize(originalSize)}</span>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className={`${styles.alertMsg} ${styles.alertError}`} style={{ marginTop: '20px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className={`${styles.alertMsg} ${styles.alertSuccess}`} style={{ marginTop: '20px' }}>
              <CheckCircle size={16} /> {success}
            </div>
          )}

        </div>

        {/* RIGHT SETTINGS PANEL */}
        <div className={styles.settingsPanel}>
          <div className={styles.sTitle}>⚙️ Conversion Settings</div>

          <div className={styles.sGroup}>
            <div className={styles.sLabel}>Output Format</div>
            <div className={styles.sSelectWrap}>
              <select
                className={styles.sSelect}
                value={format}
                onChange={handleFormatChange}
                disabled={!image || loading}
              >
                <option value="webp">WebP — Best for web</option>
                <option value="jpeg">JPG — Smaller size</option>
                <option value="png">PNG — Lossless quality</option>
              </select>
            </div>
          </div>

          {(format === 'jpeg' || format === 'webp') && (
            <div className={styles.sGroup}>
              <div className={styles.sLabel}>Quality — {quality}%</div>
              <div className={styles.rangeRow}>
                <input
                  type="range"
                  className={styles.rangeInput}
                  min="10"
                  max="100"
                  value={quality}
                  onChange={handleQualityChange}
                  disabled={!image || loading}
                />
                <span className={styles.rangeVal}>{quality}%</span>
              </div>
            </div>
          )}

          <button
            className={styles.convertBtn}
            onClick={handleConvert}
            disabled={!image || loading || convertedURL}
          >
            {loading ? <Loader size={18} className="spinner" /> : "Convert Image"} <ArrowRight size={18} />
          </button>

          <div className={styles.orDivider}>or</div>

          <button
            className={styles.downloadBtn}
            onClick={handleDownload}
            disabled={!convertedURL}
          >
            <Download size={16} /> Download Converted File
          </button>

          <div style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", lineHeight: "1.6" }}>
            <ShieldCheck size={14} strokeWidth={2} /> Your image never leaves your device.<br />All processing is 100% in-browser.
          </div>
        </div>
      </div>

      <div className="ad-row">
        <AdUnit format="728x90" label="Advertisement · Leaderboard" />
      </div>

      {/* 4. EXPLANATION & FORMAT GRID */}
      <div className={styles.infoSec}>
        <div className="sec-label">Formats</div>
        <h2 className="sec-title">Which format should you <span className="ac">choose?</span></h2>
        <div className={styles.formatGrid}>
          <div className={styles.fmtCard}>
            <div className={styles.fmtName}>WebP</div>
            <div className={styles.fmtDesc}>Google's modern format. 30% smaller than JPG with same quality. Best for web.</div>
            <div className={styles.fmtBest}>Best for: Web & Apps</div>
          </div>
          <div className={styles.fmtCard}>
            <div className={styles.fmtName}>JPG</div>
            <div className={styles.fmtDesc}>Most compatible format. Great compression. Perfect for photos and sharing.</div>
            <div className={styles.fmtBest}>Best for: Photos, Email</div>
          </div>
          <div className={styles.fmtCard}>
            <div className={styles.fmtName}>PNG</div>
            <div className={styles.fmtDesc}>Lossless quality with transparency support. Larger file size but pixel-perfect.</div>
            <div className={styles.fmtBest}>Best for: Logos, UI</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ImageConverter;
