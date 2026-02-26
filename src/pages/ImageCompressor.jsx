import { useState, useRef } from "react";
import styles from "./ImageCompressor.module.css";
import { Link } from "react-router-dom";
import AdUnit from "../components/AdUnit";
import { AlertCircle, Zap, Loader, Download, Plus, Trash2, Lock, Target, Globe, Package } from "lucide-react";

const COMPRESSION_PRESETS = [
  { name: "High Quality", level: 90 },
  { name: "Balanced", level: 75 },
  { name: "Maximum", level: 50 },
  { name: "Extreme", level: 30 },
];

function ImageCompressor() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState("webp");
  const [isDragOver, setIsDragOver] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    if (bytes > 1048576) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const estimateSize = (size, fmt, qual) => {
    let sizeMultiplier = 0.8;
    if (fmt === "png") sizeMultiplier = 0.85;
    if (fmt === "jpeg") sizeMultiplier = 0.3 + (qual / 100) * 0.4;
    if (fmt === "webp" || fmt === "same") sizeMultiplier = 0.25 + (qual / 100) * 0.3;
    return Math.round(size * sizeMultiplier);
  };

  const handleFilesAdded = (newFiles) => {
    setGlobalError("");
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith("image/"));

    if (validFiles.length === 0) {
      setGlobalError("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    const fileObjects = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      originalSize: file.size,
      status: 'pending', // pending | compressing | done | error
      blob: null,
      compressedSize: 0,
      progress: 0
    }));

    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleQualityChange = (e) => {
    setQuality(parseInt(e.target.value));
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const applyPreset = (preset) => {
    setQuality(preset.level);
  };

  const handleCompressFile = async (fileObj) => {
    setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'compressing', progress: 30 } : f));

    const formData = new FormData();
    formData.append("image", fileObj.file);
    formData.append("format", format === "same" ? (fileObj.file.type.split('/')[1] || 'jpeg') : format);
    formData.append("quality", quality);
    formData.append("compress", true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/compress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to compress");
      }

      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: 80 } : f));

      const blob = await response.blob();

      setFiles(prev => prev.map(f =>
        f.id === fileObj.id ? {
          ...f,
          status: 'done',
          blob,
          compressedSize: blob.size,
          progress: 100
        } : f
      ));
    } catch (err) {
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', progress: 0 } : f));
    }
  };

  const handleCompressAll = async () => {
    setGlobalError("");
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');

    if (pendingFiles.length === 0) return;

    // Process sequentially or in parallel? Let's do parallel
    await Promise.all(pendingFiles.map(f => handleCompressFile(f)));
  };

  const handleDownload = (fileObj) => {
    if (!fileObj.blob) return;
    const url = URL.createObjectURL(fileObj.blob);
    const a = document.createElement("a");
    a.href = url;
    const ext = fileObj.blob.type.split('/')[1] || 'jpg';
    a.download = fileObj.file.name.replace(/\.[^.]+$/, '') + `-compressed.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats derivation
  const totalOriginal = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressed = files.filter(f => f.status === 'done').reduce((acc, f) => acc + f.compressedSize, 0);
  const completedCount = files.filter(f => f.status === 'done').length;
  const savingsPct = totalOriginal > 0 && totalCompressed > 0 ? Math.round((1 - totalCompressed / (files.filter(f => f.status === 'done').reduce((a, f) => a + f.originalSize, 0))) * 100) : 0;

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  return (
    <div className="page-wrap">

      {/* 1. HERO */}
      <div className={styles.toolHero}>
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link><span>›</span>
          <a href="#tools">Tools</a><span>›</span>
          <span style={{ color: "var(--text-soft)" }}>Image Compressor</span>
        </div>
        <h1 className={styles.heroH1}>Image <em>Compressor</em></h1>
        <p className={styles.heroP}>Compress multiple images at once — reduce file size by up to 80% while keeping quality sharp. Batch processing, fully in-browser, zero uploads.</p>
        <div className={styles.badges}>
          <div className={styles.badge}><Zap size={14} /> Batch Processing</div>
          <div className={styles.badge}><Lock size={14} /> 100% Private</div>
          <div className={`${styles.badge} ${styles.orange}`}>Up to 80% smaller</div>
        </div>
      </div>

      {/* 2. STATS */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div className={styles.statBig}>{files.length}</div>
          <div className={styles.statSm}>Files Loaded</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statBig}>{formatFileSize(totalOriginal).split(' ')[0]} <em>{formatFileSize(totalOriginal).split(' ')[1] || 'B'}</em></div>
          <div className={styles.statSm}>Original Size</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statBig}>{totalCompressed > 0 ? formatFileSize(totalCompressed).split(' ')[0] : '0'} <em>{totalCompressed > 0 ? (formatFileSize(totalCompressed).split(' ')[1] || 'B') : 'KB'}</em></div>
          <div className={styles.statSm}>Compressed Size</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statBig}><em>{savingsPct}%</em></div>
          <div className={styles.statSm}>Space Saved</div>
        </div>
      </div>

      {/* 3. DROP ZONE */}
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.drag : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className={styles.dropInput}
          accept="image/*"
          multiple
          onChange={(e) => handleFilesAdded(e.target.files)}
        />
        <span className={styles.dropIcon}>⚡</span>
        <div className={styles.dropTitle}>Drop images here — batch supported</div>
        <div className={styles.dropSub}>Drag multiple images at once, or click to select files</div>
        <button className={styles.btnBrowse} onClick={() => fileInputRef.current.click()}>
          <Plus size={16} /> Browse Files
        </button>
        <div className={styles.multiNote}>Supports JPG, PNG, WebP · Multiple files at once</div>
      </div>

      {globalError && (
        <div className={`${styles.alertMsg} ${styles.alertError}`} style={{ maxWidth: '1200px', margin: '20px auto 0' }}>
          <AlertCircle size={16} /> {globalError}
        </div>
      )}

      {/* 4. SETTINGS BAR */}
      {files.length > 0 && (
        <div className={styles.settingsBar}>
          <div className={styles.sbGroup}>
            <span className={styles.sbLabel}>Quality</span>
            <input
              type="range"
              className={styles.rangeInput}
              min="10"
              max="100"
              value={quality}
              onChange={handleQualityChange}
            />
            <span className={styles.rangeVal}>{quality}%</span>
          </div>
          <div className={styles.sbGroup} style={{ flex: 0 }}>
            <span className={styles.sbLabel}>Format</span>
            <select className={styles.sSelect} value={format} onChange={handleFormatChange}>
              <option value="same">Same as input</option>
              <option value="webp">Convert to WebP</option>
              <option value="jpeg">Convert to JPG</option>
            </select>
          </div>
          <button
            className={styles.compressAllBtn}
            onClick={handleCompressAll}
            disabled={files.every(f => f.status === 'done' || f.status === 'compressing')}
          >
            {files.some(f => f.status === 'compressing') ? <><Loader size={16} className="spinner" /> Compressing...</> : "Compress All →"}
          </button>
        </div>
      )}

      {/* 5. PRESETS */}
      {files.length > 0 && (
        <div style={{ maxWidth: "1200px", margin: "0 auto 20px" }}>
          <div className={styles.presetsGrid}>
            {COMPRESSION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                className={styles.presetBtn}
                onClick={() => applyPreset(preset)}
              >
                {preset.name}<br /><small>{preset.level}%</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. FILE LIST */}
      <div className={styles.fileList}>
        {files.map(file => (
          <div key={file.id} className={styles.fileItem}>
            <img className={styles.fileThumb} src={file.preview} alt="Thumb" />
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{file.file.name}</div>
              <div className={styles.fileSizes}>
                <span>Original: <strong style={{ color: "var(--text-soft)" }}>{formatFileSize(file.originalSize)}</strong></span>
                {file.status === 'done' && (
                  <span>→ Compressed: <strong style={{ color: "var(--accent)" }}>{formatFileSize(file.compressedSize)}</strong> <span className={styles.fileSaving}>({Math.round((1 - file.compressedSize / file.originalSize) * 100)}% saved)</span></span>
                )}
                {file.status === 'pending' && (
                  <span>→ Estimated: <strong>{formatFileSize(estimateSize(file.originalSize, format, quality))}</strong></span>
                )}
              </div>
              <div className={styles.fileProgress}>
                <div className={styles.fileProgFill} style={{ width: `${file.progress}%` }}></div>
              </div>
            </div>

            <span className={`${styles.fileStatus} ${file.status === 'done' ? styles.statusDone : file.status === 'compressing' ? styles.statusCompressing : file.status === 'error' ? styles.statusError : styles.statusPending}`}>
              {file.status === 'done' ? '✓ Done' : file.status === 'compressing' ? 'Compressing...' : file.status === 'error' ? 'Error' : 'Pending'}
            </span>

            <button
              className={styles.fileDl}
              disabled={file.status !== 'done'}
              onClick={() => handleDownload(file)}
            >
              <Download size={14} /> Download
            </button>

            <button
              className={styles.fileDl}
              style={{ padding: '7px', color: '#ff4757', borderColor: 'transparent' }}
              onClick={() => removeFile(file.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="ad-row" style={{ marginTop: "32px" }}>
        <AdUnit format="728x90" label="Advertisement · Leaderboard" />
      </div>

      {/* 7. TIPS */}
      <div className={styles.tipsSec}>
        <div className="sec-label">Pro Tips</div>
        <h2 className="sec-title">Get the best <span className="ac">results</span></h2>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}><Target size={20} strokeWidth={1.8} /></div>
            <div className={styles.tipTitle}>Use 70-80% Quality</div>
            <div className={styles.tipTxt}>The human eye can barely tell the difference at 75% quality, but you save 40-60% file size. Sweet spot for web use.</div>
          </div>
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}><Globe size={20} strokeWidth={1.8} /></div>
            <div className={styles.tipTitle}>Convert to WebP</div>
            <div className={styles.tipTxt}>WebP images are 25-35% smaller than JPG at the same quality. All modern browsers support it.</div>
          </div>
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}><Package size={20} strokeWidth={1.8} /></div>
            <div className={styles.tipTitle}>Batch Everything</div>
            <div className={styles.tipTxt}>Drop all images at once and compress in one click. No need to process one by one.</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ImageCompressor;
