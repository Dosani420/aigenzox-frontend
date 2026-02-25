import { useState, useContext } from "react";
import "../styles/imageResizer.css";
import { ThemeContext } from "../context/ThemeContext";
import { Upload, AlertCircle, CheckCircle, Loader, Rocket, Zap } from "lucide-react";

const COMPRESSION_PRESETS = [
  { name: "High Quality", level: 90 },
  { name: "Balanced", level: 75 },
  { name: "Maximum", level: 50 },
  { name: "Extreme", level: 30 },
];

function ImageCompressor() {
  const { darkMode } = useContext(ThemeContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState("webp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState(0);

  const handleImageChange = (e) => {
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setOriginalSize(file.size);
      setPreview(URL.createObjectURL(file));
      setError("");
      estimateSize(file.size, format, quality);
    } else {
      setError("Please select a valid image file");
      setImage(null);
      setPreview(null);
    }
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

  const handleQualityChange = (e) => {
    const newQuality = parseInt(e.target.value);
    setQuality(newQuality);
    if (originalSize) estimateSize(originalSize, format, newQuality);
  };

  const handleFormatChange = (e) => {
    const newFormat = e.target.value;
    setFormat(newFormat);
    if (originalSize) estimateSize(originalSize, newFormat, quality);
  };

  const applyPreset = (preset) => {
    setQuality(preset.level);
    if (originalSize) estimateSize(originalSize, format, preset.level);
  };

  const handleCompress = async () => {
    setError("");
    setSuccess("");

    if (!image) {
      setError("Please select an image to compress");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("format", format);
    formData.append("quality", quality);
    formData.append("compress", true);

    try {
      const response = await fetch("http://localhost:5000/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to compress image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed.${format}`;
      a.click();

      const savings = ((1 - blob.size / originalSize) * 100).toFixed(1);
      setSuccess(`✅ Compressed! ${formatFileSize(originalSize)} → ${formatFileSize(blob.size)} (${savings}% smaller)`);
    } catch (err) {
      setError(err.message || "An error occurred while compressing");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = darkMode ? "#8b5cf6" : "#6366f1";
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = darkMode ? "rgba(139, 92, 246, 0.4)" : "rgba(99, 102, 241, 0.3)";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = darkMode ? "rgba(139, 92, 246, 0.4)" : "rgba(99, 102, 241, 0.3)";
    handleImageChange({ dataTransfer: e.dataTransfer });
  };

  return (
    <div className="resizer-container">
      <div className="resizer-header">
        <h1 style={{ color: darkMode ? "#c4b5fd" : "#6366f1" }}>Image Compressor</h1>
        <p style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Compress images while maintaining quality</p>
      </div>

      <div className="resizer-card" style={{ 
        background: darkMode ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.8)",
        color: darkMode ? "#e2e8f0" : "#111827"
      }}>
        {/* Upload Section */}
        <div className="upload-section"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{ transition: "all 0.3s ease" }}
        >
          <label htmlFor="file-input" className="file-label">
            <div className="file-input-wrapper" style={{
              borderColor: darkMode ? "rgba(139, 92, 246, 0.4)" : "rgba(99, 102, 241, 0.3)",
              background: darkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.05)",
            }}>
              <Zap 
                size={40} 
                color={darkMode ? "#c4b5fd" : "#6366f1"}
                className="upload-icon"
              />
              <span className="upload-text">
                {preview ? "Change Image" : "Select Image"}
              </span>
              <span className="upload-hint">or drag and drop</span>
            </div>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handleImageChange}
          />
        </div>

        {/* Preview & File Info */}
        {preview && (
          <div className="preview-section">
            <div className="preview">
              <img src={preview} alt="preview" />
            </div>
            <div className="file-info">
              <p><strong>Original Size:</strong> {formatFileSize(originalSize)}</p>
              <p><strong>Estimated Size:</strong> {formatFileSize(estimatedSize)}
              {originalSize > 0 && ` (${((1 - estimatedSize / originalSize) * 100).toFixed(1)}% smaller)`}
              </p>
            </div>
          </div>
        )}

        {/* Compression Presets */}
        {preview && (
          <div className="presets-section">
            <label style={{ color: darkMode ? "#cbd5e1" : "#666", marginBottom: "8px", display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
              Quick Presets
            </label>
            <div className="presets-grid">
              {COMPRESSION_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                  style={{
                    background: darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
                    color: darkMode ? "#c4b5fd" : "#6366f1",
                    border: `1px solid ${darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(99, 102, 241, 0.2)"}`,
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.15)";
                    e.target.style.borderColor = darkMode ? "rgba(139, 92, 246, 0.6)" : "rgba(99, 102, 241, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = darkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)";
                    e.target.style.borderColor = darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(99, 102, 241, 0.2)";
                  }}
                >
                  {preset.name}<br/><small>{preset.level}%</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Format & Quality */}
        <div className="format-quality-section">
          <div className="size-input-group">
            <label htmlFor="format-select" style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Output Format</label>
            <select
              id="format-select"
              value={format}
              onChange={handleFormatChange}
              disabled={loading}
              style={{
                padding: "10px 12px",
                border: `2px solid ${darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)"}`,
                borderRadius: "10px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
                color: darkMode ? "#e2e8f0" : "#111827",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <option value="webp">WEBP (Best)</option>
              <option value="jpeg">JPG (Compatible)</option>
              <option value="png">PNG (Lossless)</option>
            </select>
          </div>

          <div className="quality-slider">
            <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Quality: {quality}%</label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={handleQualityChange}
              disabled={loading}
              style={{
                width: "100%",
                cursor: "pointer",
                accentColor: "#6366f1"
              }}
            />
          </div>
        </div>

        {/* Messages */}
        {error && <div className="error-message" style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)", background: darkMode ? "rgba(127, 29, 29, 0.2)" : "rgba(239, 68, 68, 0.1)" }}>
          <AlertCircle size={18} style={{ display: "inline", marginRight: "8px" }} />
          {error}
        </div>}
        {success && <div className="success-message" style={{ color: "#22c55e", borderColor: "rgba(34, 197, 94, 0.3)", background: darkMode ? "rgba(20, 83, 45, 0.2)" : "rgba(34, 197, 94, 0.1)" }}>
          <CheckCircle size={18} style={{ display: "inline", marginRight: "8px" }} />
          {success}
        </div>}

        {/* Compress Button */}
        <button 
          className={`resize-btn ${loading ? "loading" : ""}`}
          onClick={handleCompress}
          disabled={loading}
          style={{
            background: loading ? "rgba(99, 102, 241, 0.6)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff"
          }}
        >
          {loading ? (
            <>
              <Loader size={18} className="spinner" />
              Compressing...
            </>
          ) : (
            <>
              <Zap size={18} /> Compress & Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ImageCompressor;
