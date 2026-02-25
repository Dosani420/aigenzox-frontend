import { useState, useContext } from "react";
import "../styles/imageResizer.css";
import { ThemeContext } from "../context/ThemeContext";
import { QrCode, Download, AlertCircle, CheckCircle, Copy } from "lucide-react";

function QRGenerator() {
  const { darkMode } = useContext(ThemeContext);
  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateQR = async () => {
    setError("");
    setSuccess("");

    if (!qrText.trim()) {
      setError("Please enter text or URL to generate QR code");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/qr-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: qrText,
          size: qrSize,
          fgColor: fgColor,
          bgColor: bgColor,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setQrCodeUrl(data.qrDataUrl);
      setSuccess("QR code generated successfully!");
    } catch (err) {
      console.error("QR generation error:", err);
      setError(err.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = () => {
    if (!qrCodeUrl) return;
    fetch(qrCodeUrl)
      .then(res => res.blob())
      .then(blob => {
        navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]).then(() => {
          setSuccess("QR code copied to clipboard!");
        });
      })
      .catch(() => {
        setError("Failed to copy QR code");
      });
  };

  const handleGenerateKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      generateQR();
    }
  };

  return (
    <div className="resizer-container">
      {/* Header */}
      <div className="resizer-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
          <QrCode size={32} style={{ color: "#6366f1" }} />
        </div>
        <h1>QR Code Generator</h1>
        <p>Create QR codes for URLs, text, WiFi, and more</p>
      </div>

      {/* Main Card */}
      <div className="resizer-card">
        {/* Text Input */}
        <div className="upload-section">
          <label>Text or URL</label>
          <textarea
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            onKeyPress={handleGenerateKeyPress}
            placeholder="Enter text, URL, or data..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "12px",
              border: `2px solid transparent`,
              borderRadius: "8px",
              background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
              color: darkMode ? "#e2e8f0" : "#1e293b",
              fontFamily: "monospace",
              fontSize: "14px",
              resize: "vertical",
              transition: "all 0.3s ease",
              borderColor: darkMode ? "#475569" : "#cbd5e1",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(99, 102, 241, 0.6)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = darkMode ? "#475569" : "#cbd5e1";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Size Control */}
        <div className="upload-section">
          <label>Size: {qrSize} pixels</label>
          <input
            type="range"
            min={100}
            max={2000}
            step={10}
            value={qrSize}
            onChange={(e) => setQrSize(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
          />
          <div style={{ fontSize: "12px", color: darkMode ? "#94a3b8" : "#999", marginTop: "6px" }}>
            Larger sizes improve scannability at a distance
          </div>
        </div>

        {/* Colors */}
        <div className="upload-section">
          <label>Colors</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="size-input-group">
              <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Foreground</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ width: "50px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  placeholder="#000000"
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    border: `2px solid ${darkMode ? "#475569" : "#cbd5e1"}`,
                    borderRadius: "6px",
                    background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
                    color: darkMode ? "#e2e8f0" : "#1e293b",
                    fontSize: "13px",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
            <div className="size-input-group">
              <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Background</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: "50px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#ffffff"
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    border: `2px solid ${darkMode ? "#475569" : "#cbd5e1"}`,
                    borderRadius: "6px",
                    background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
                    color: darkMode ? "#e2e8f0" : "#1e293b",
                    fontSize: "13px",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-message" style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}>
            <AlertCircle size={16} style={{ display: "inline", marginRight: "8px" }} />
            {error}
          </div>
        )}
        {success && (
          <div className="success-message" style={{ color: "#22c55e", borderColor: "rgba(34, 197, 94, 0.3)" }}>
            <CheckCircle size={16} style={{ display: "inline", marginRight: "8px" }} />
            {success}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateQR}
          disabled={loading}
          className="resize-btn"
          style={{
            background: loading ? "rgba(99, 102, 241, 0.6)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
          }}
        >
          {loading ? "Generating..." : <><QrCode size={18} style={{ marginRight: "8px" }} />Generate QR Code</>}
        </button>

        {/* QR Code Preview */}
        {qrCodeUrl && (
          <>
            <div className="preview-section">
              <div className="preview" style={{ backgroundColor: bgColor, padding: "20px", borderRadius: "8px" }}>
                <img
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            </div>

            {/* Download & Copy Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <button
                onClick={downloadQR}
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={copyToClipboard}
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <Copy size={16} /> Copy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default QRGenerator;
