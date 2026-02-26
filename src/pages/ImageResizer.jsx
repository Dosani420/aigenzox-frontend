import { useState, useRef } from "react";
import styles from "./ImageResizer.module.css";
import { Link } from "react-router-dom";
import AdUnit from "../components/AdUnit";
import { AlertCircle, CheckCircle, Loader, UploadCloud, Link2, Unlink, X, MoveDiagonal, Lock, ShieldCheck } from "lucide-react";

const PRESET_SIZES = [
    { name: "Instagram Square", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Twitter Post", width: 1200, height: 630 },
    { name: "Facebook Post", width: 1200, height: 630 },
    { name: "LinkedIn Post", width: 1200, height: 628 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
];

function ImageResizer() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [originalWidth, setOriginalWidth] = useState(0);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [outputFormat, setOutputFormat] = useState("png");
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.dataTransfer?.files[0] || e.target.files[0];
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
            setSuccess("");
        } else {
            setError("Please select a valid image file");
            clearImage();
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
        setSuccess("");
        setWidth("");
        setHeight("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const applyPreset = (preset) => {
        setLockAspectRatio(false);
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

    const toggleLock = () => {
        setLockAspectRatio(prev => !prev);
        // Optionally synchronize ratios on lock enablement here if wanted.
        // However, it's safer to just let the user toggle the lock free of automatic overwrites.
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
        if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + " MB";
        return (bytes / 1024).toFixed(1) + " KB";
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

            const diffStr = blob.size < originalSize
                ? `(${((1 - blob.size / originalSize) * 100).toFixed(1)}% smaller)`
                : `(${(((blob.size / originalSize) - 1) * 100).toFixed(1)}% larger)`;

            setSuccess(`Resized ${width}x${height}! Size: ${formatFileSize(blob.size)} ${diffStr}`);
        } catch (err) {
            setError(err.message || "An error occurred while resizing");
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnter = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleImageChange({ dataTransfer: e.dataTransfer });
    };

    return (
        <div className="page-wrap">
            {/* 1. HERO */}
            <div className={styles.toolHero}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Home</Link><span>›</span>
                    <a href="#tools">Tools</a><span>›</span>
                    <span style={{ color: "var(--text-soft)" }}>Image Resizer</span>
                </div>
                <h1 className={styles.heroH1}>Image <em>Resizer</em></h1>
                <p className={styles.heroP}>Resize your images instantly to exact pixel dimensions. Perfect for social media posts, thumbnails, and profile pictures.</p>
                <div className={styles.badges}>
                    <div className={styles.badge}><MoveDiagonal size={14} /> Precision Control</div>
                    <div className={styles.badge}><Lock size={14} /> 100% Private</div>
                    <div className={`${styles.badge} ${styles.purple}`}>High Quality Extraction</div>
                </div>
            </div>

            {/* Leaderboard AD */}
            <div className="ad-row">
                <AdUnit format="728x90" label="Advertisement · Leaderboard" />
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className={styles.toolMain}>

                {/* LEFT COMPONENT: DropZone or Preview */}
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
                                type="file"
                                ref={fileInputRef}
                                className={styles.uploadInput}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <span className={styles.uploadIconBig}><UploadCloud size={48} color="var(--accent)" strokeWidth={1.5} /></span>
                            <div className={styles.uploadTitle}>Drop your image to resize</div>
                            <div className={styles.uploadSub}>Or click to select an image file</div>
                            <button className={styles.btnUpload}>
                                Browse Files
                            </button>
                        </div>
                    ) : (
                        <>
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
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className={styles.infoItem}><strong>File:</strong> {image.name}</span>
                                        <span className={styles.infoItem}><strong>Original:</strong> {originalWidth} &times; {originalHeight} px • {formatFileSize(originalSize)}</span>
                                        {width && height && (
                                            <span className={styles.infoItem}><strong>Output Est. :</strong> {width} &times; {height} px • {formatFileSize(estimateFileSize())}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Presets appear below the image once uploaded */}
                            <div className={styles.presetsSection}>
                                <div className={styles.sLabel} style={{ marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.72rem" }}>Need a standard size?</div>
                                <div className={styles.presetsGrid}>
                                    {PRESET_SIZES.map((preset) => (
                                        <button
                                            key={preset.name}
                                            className={styles.presetBtn}
                                            onClick={() => applyPreset(preset)}
                                        >
                                            {preset.name}<br /><small>{preset.width} &times; {preset.height}</small>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Messages */}
                    {error && (
                        <div className={`${styles.alertMsg} ${styles.alertError}`}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                    {success && (
                        <div className={`${styles.alertMsg} ${styles.alertSuccess}`}>
                            <CheckCircle size={16} /> {success}
                        </div>
                    )}
                </div>

                {/* RIGHT SETTINGS PANEL */}
                <div className={styles.settingsPanel}>
                    <div className={styles.sTitle}>✂️ Dimension Settings</div>

                    <div className={styles.sGroup}>
                        <div className={styles.sLabel}>Dimensions</div>
                        <div className={styles.sizeInputsRow}>
                            <div className={styles.sInputWrap}>
                                <span className={styles.inputPrefix}>W</span>
                                <input
                                    type="number"
                                    className={styles.sInput}
                                    value={width}
                                    onChange={handleWidthChange}
                                    disabled={!image || loading}
                                    placeholder="Width"
                                />
                            </div>
                            <button
                                className={`${styles.lockBtn} ${lockAspectRatio ? styles.locked : ''}`}
                                onClick={toggleLock}
                                title={lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                                disabled={!image || loading}
                            >
                                {lockAspectRatio ? <Link2 size={16} /> : <Unlink size={16} />}
                            </button>
                            <div className={styles.sInputWrap}>
                                <span className={styles.inputPrefix}>H</span>
                                <input
                                    type="number"
                                    className={styles.sInput}
                                    value={height}
                                    onChange={handleHeightChange}
                                    disabled={!image || loading}
                                    placeholder="Height"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.sGroup}>
                        <div className={styles.sLabel}>Output Format</div>
                        <div className={styles.sSelectWrap}>
                            <select
                                className={styles.sSelect}
                                value={outputFormat}
                                onChange={(e) => setOutputFormat(e.target.value)}
                                disabled={!image || loading}
                            >
                                <option value="png">PNG (Lossless)</option>
                                <option value="jpeg">JPG (Standard)</option>
                                <option value="webp">WebP (Optimized)</option>
                            </select>
                        </div>
                    </div>

                    {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                        <div className={styles.sGroup}>
                            <div className={styles.sLabel}>Quality — {quality}%</div>
                            <div className={styles.rangeRow}>
                                <input
                                    type="range"
                                    className={styles.rangeInput}
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    disabled={!image || loading}
                                />
                                <span className={styles.rangeVal}>{quality}%</span>
                            </div>
                        </div>
                    )}

                    <button
                        className={styles.processBtn}
                        onClick={handleResize}
                        disabled={!image || loading}
                        style={{ marginTop: "8px" }}
                    >
                        {loading ? <Loader size={18} className="spinner" /> : "Resize Image"}
                    </button>

                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", lineHeight: "1.6" }}>
                        <ShieldCheck size={14} strokeWidth={2} /> Processing happens securely on our servers without logging. Files are deleted post execution.
                    </div>
                </div>
            </div>

            <div className="ad-row">
                <AdUnit format="728x90" label="Advertisement · Leaderboard" />
            </div>

        </div>
    );
}

export default ImageResizer;
