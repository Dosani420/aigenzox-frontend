import { useState, useRef } from "react";
import styles from "./ImageToPdf.module.css";
import { Link } from "react-router-dom";
import AdUnit from "../components/AdUnit";
import { AlertCircle, FileText, UploadCloud, X, Download, Plus, Settings2, ShieldCheck, Loader, FileOutput } from "lucide-react";

function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (fileList) => {
    const selectedFiles = Array.from(fileList || []);
    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit per file
        setError('Each file must be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      setError('');
      setResult(null);
    }
  };

  const handleFileSelect = (event) => {
    processFiles(event.target.files);
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length === 1) setResult(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("images", file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/image-to-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert images to PDF. Please try again.');
      }

      const blob = await response.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message || 'Failed to convert images. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page-wrap">
      {/* 1. HERO */}
      <div className={styles.toolHero}>
        <div className={styles.breadcrumb}>
          <Link to="/">Home</Link><span>›</span>
          <a href="#tools">Tools</a><span>›</span>
          <span style={{ color: "var(--text-soft)" }}>Image to PDF</span>
        </div>
        <h1 className={styles.heroH1}>Image to <em>PDF</em></h1>
        <p className={styles.heroP}>Combine multiple images into a single, high-quality PDF document instantly. Order your files, hit convert, and download securely.</p>
        <div className={styles.badges}>
          <div className={`${styles.badge} ${styles.red}`}><FileOutput size={14} /> PDF Merger</div>
          <div className={styles.badge}><Settings2 size={14} /> Maintain Quality</div>
          <div className={styles.badge}><ShieldCheck size={14} /> Secure & Private</div>
        </div>
      </div>

      <div className="ad-row">
        <AdUnit format="728x90" label="Advertisement · Leaderboard" />
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className={styles.toolMain}>

        {/* LEFT COMPONENT: Upload & List */}
        <div className={styles.uploadSection}>
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.drag : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.uploadInput}
            />
            <span className={styles.uploadIconBig}><UploadCloud size={48} color="#f43f5e" strokeWidth={1.5} /></span>
            <div className={styles.uploadTitle}>Drag your images here</div>
            <div className={styles.uploadSub}>Or click to browse your files</div>
            <button className={styles.btnUpload}>
              <Plus size={16} /> Add Images
            </button>
            <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--muted)' }}>
              Supports JPG, PNG, WEBP (Max 10MB each)
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className={`${styles.alertMsg} ${styles.alertError}`}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileNameWrap}>
                    <img src={URL.createObjectURL(file)} alt="preview" className={styles.filePreview} />
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                  <div className={styles.fileMeta}>
                    <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button onClick={() => removeFile(index)} className={styles.removeBtn} aria-label="Remove file">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: SETTINGS & EXPORT */}
        <div className={styles.sidePanel}>
          <div className={styles.sTitle}><FileText size={18} strokeWidth={2} /> Document Export</div>
          <p className={styles.panelP}>Images are merged sequentially as they appear in the queue. All files are processed securely.</p>

          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {!result ? (
              <button
                className={styles.processBtn}
                onClick={handleUpload}
                disabled={files.length === 0 || isConverting}
              >
                {isConverting ? <><Loader size={18} className="spinner" /> Generating PDF...</> : <><FileOutput size={18} /> Convert to PDF ({files.length})</>}
              </button>
            ) : (
              <>
                <a href={result} download="combined-images.pdf" className={styles.btnDownload}>
                  <Download size={18} /> Download Document
                </a>
                <button className={styles.resetBtn} onClick={resetTool}>
                  Restart with new images
                </button>
              </>
            )}
          </div>

          <div className={styles.infoSec}>
            <h3 className={styles.infoTitle}>Conversion Details:</h3>
            <ul className={styles.infoList}>
              <li>One image per PDF page.</li>
              <li>PDF pages automatically resize.</li>
              <li>Resolution of original images is preserved.</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="ad-row" style={{ marginTop: '20px' }}>
        <AdUnit format="728x90" label="Advertisement · Leaderboard" />
      </div>

    </div>
  );
}

export default ImageToPdf;
