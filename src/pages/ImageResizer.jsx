import { useState, useContext } from "react";
import "../styles/imageResizer.css";
import { ThemeContext } from "../context/ThemeContext";
import { Upload, AlertCircle, CheckCircle, Loader, Rocket, Lock, Unlock } from "lucide-react";

const PRESET_SIZES = [
  { name: "Instagram Square", width: 1080, height: 1080 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Twitter", width: 1200, height: 630 },
  { name: "LinkedIn", width: 1200, height: 628 },
  { name: "Facebook", width: 1200, height: 630 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
];

function ImageResizer() {
    const { darkMode } = useContext(ThemeContext);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [lockAspectRatio, setLockAspectRatio] = useState(false);
    const [outputFormat, setOutputFormat] = useState("png");
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState(0);

    const handleImageChange = (e) => {
        const file = e.target.files[0] || (e.dataTransfer?.files[0]);
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setOriginalSize(file.size);
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setOriginalWidth(img.width);
                    setOriginalHeight(img.height);
                    setWidth(img.width);
                    setHeight(img.height);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            setPreview(URL.createObjectURL(file));
            setError("");
        } else {
            setError("Please select a valid image file");
            setImage(null);
            setPreview(null);
        }
    };

    const applyPreset = (preset) => {
        setWidth(preset.width);
        setHeight(preset.height);
        setError("");
    };

    const handleWidthChange = (e) => {
        const newWidth = e.target.value;
        setWidth(newWidth);
        if (lockAspectRatio && originalWidth && newWidth) {
            const newHeight = Math.round((newWidth / originalWidth) * originalHeight);
            setHeight(newHeight);
        }
    };

    const handleHeightChange = (e) => {
        const newHeight = e.target.value;
        setHeight(newHeight);
        if (lockAspectRatio && originalHeight && newHeight) {
            const newWidth = Math.round((newHeight / originalHeight) * originalWidth);
            setWidth(newWidth);
        }
    };

    const estimateFileSize = () => {
        if (!originalSize || !width || !height) return originalSize;
        const pixelRatio = (width * height) / (originalWidth * originalHeight);
        let sizeMultiplier = 0.8;
        if (outputFormat === "png") sizeMultiplier = 0.85;
        if (outputFormat === "jpeg") sizeMultiplier = 0.3 + (quality / 100) * 0.4;
        if (outputFormat === "webp") sizeMultiplier = 0.25 + (quality / 100) * 0.3;
        return Math.round(originalSize * pixelRatio * sizeMultiplier);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const handleResize = async () => {
        setError("");
        setSuccess("");

        if (!image || !width || !height) {
            setError("Please select an image and enter both width and height");
            return;
        }

        if (width <= 0 || height <= 0) {
            setError("Width and height must be greater than 0");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("image", image);
        formData.append("width", width);
        formData.append("height", height);
        formData.append("format", outputFormat);
        formData.append("quality", quality);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resize`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to resize image");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `resized-${width}x${height}.${outputFormat}`;
            a.click();
            
            const compression = ((1 - blob.size / originalSize) * 100).toFixed(1);
            setSuccess(`✅ Resized ${width}x${height}! Size: ${formatFileSize(blob.size)} (${compression}% smaller)`);
        } catch (err) {
            setError(err.message || "An error occurred while resizing");
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
                <h1 style={{ color: darkMode ? "#c4b5fd" : "#6366f1" }}>Image Resizer</h1>
                <p style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Resize and optimize your images with full control</p>
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
                            <Upload 
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
                            <p><strong>Original:</strong> {originalWidth}x{originalHeight}px • {formatFileSize(originalSize)}</p>
                            {width && height && (
                                <p><strong>Output:</strong> {width}x{height}px • {formatFileSize(estimateFileSize())} 
                                {originalSize > 0 && ` (${((1 - estimateFileSize() / originalSize) * 100).toFixed(1)}% smaller)`}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Preset Sizes */}
                {preview && (
                    <div className="presets-section">
                        <label style={{ color: darkMode ? "#cbd5e1" : "#666", marginBottom: "8px", display: "block", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
                            Quick Presets
                        </label>
                        <div className="presets-grid">
                            {PRESET_SIZES.map((preset) => (
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
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Inputs with Aspect Ratio Lock */}
                <div className="size-inputs-wrapper">
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
                        <button
                            onClick={() => setLockAspectRatio(!lockAspectRatio)}
                            style={{
                                background: lockAspectRatio 
                                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                    : darkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.05)",
                                color: lockAspectRatio ? "#fff" : darkMode ? "#c4b5fd" : "#6366f1",
                                border: `2px solid ${lockAspectRatio ? "transparent" : darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)"}`,
                                padding: "8px 12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontWeight: "600",
                                transition: "all 0.3s ease",
                                fontSize: "14px"
                            }}
                        >
                            {lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                            {lockAspectRatio ? "Locked" : "Lock"}
                        </button>
                        <span style={{ color: darkMode ? "#cbd5e1" : "#999", fontSize: "13px" }}>
                            {originalWidth && originalHeight ? `(${(originalWidth/originalHeight).toFixed(2)} ratio)` : ""}
                        </span>
                    </div>

                    <div className="size-inputs">
                        <div className="size-input-group">
                            <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Width (px)</label>
                            <input
                                type="number"
                                placeholder="e.g., 800"
                                value={width}
                                onChange={handleWidthChange}
                                disabled={loading}
                                min="1"
                                style={{
                                    background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
                                    color: darkMode ? "#e2e8f0" : "#111827",
                                    borderColor: darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)"
                                }}
                            />
                        </div>
                        <div className="size-input-group">
                            <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Height (px)</label>
                            <input
                                type="number"
                                placeholder="e.g., 600"
                                value={height}
                                onChange={handleHeightChange}
                                disabled={loading}
                                min="1"
                                style={{
                                    background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
                                    color: darkMode ? "#e2e8f0" : "#111827",
                                    borderColor: darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)"
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Format & Quality */}
                <div className="format-quality-section">
                    <div className="size-input-group" style={{ gridColumn: "1" }}>
                        <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Output Format</label>
                        <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            disabled={loading}
                            style={{
                                background: darkMode ? "rgba(30, 27, 75, 0.6)" : "rgba(255, 255, 255, 0.5)",
                                color: darkMode ? "#e2e8f0" : "#111827",
                                borderColor: darkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: `2px solid`,
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                        >
                            <option value="png">PNG (Lossless)</option>
                            <option value="jpeg">JPG (Compressed)</option>
                            <option value="webp">WEBP (Modern)</option>
                        </select>
                    </div>

                    {(outputFormat === "jpeg" || outputFormat === "webp") && (
                        <div className="quality-slider">
                            <label style={{ color: darkMode ? "#cbd5e1" : "#666" }}>Quality: {quality}%</label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    cursor: "pointer",
                                    accentColor: "#6366f1"
                                }}
                            />
                        </div>
                    )}
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

                {/* Resize Button */}
                <button 
                    className={`resize-btn ${loading ? "loading" : ""}`}
                    onClick={handleResize}
                    disabled={loading}
                    style={{
                        background: loading ? "rgba(99, 102, 241, 0.6)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "#fff"
                    }}
                >
                    {loading ? (
                        <>
                            <Loader size={18} className="spinner" />
                            Resizing...
                        </>
                    ) : (
                        <>
                            <Rocket size={18} /> Resize & Download
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ImageResizer;
