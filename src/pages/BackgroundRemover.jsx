import React, { useState, useRef } from 'react';
import styles from './BackgroundRemover.module.css';
import { Link } from 'react-router-dom';
import AdUnit from '../components/AdUnit';
import { AlertCircle, CheckCircle, Loader, UploadCloud, X, Download, Wand2, Image as ImageIcon, Sparkles, ShieldCheck } from 'lucide-react';

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0] || event.dataTransfer?.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setSuccess('');
      setProcessedImage(null);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect({ target: { files: [e.dataTransfer.files[0]] } });
  };
  const handleDragOver = (e) => { e.preventDefault(); };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      formData.append('size', 'auto'); // auto-detect size

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': import.meta.env.VITE_REMOVE_BG_API_KEY || 'your-api-key-here',
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('API credits exhausted. Please check your remove.bg account.');
        } else if (response.status === 403) {
          throw new Error('Invalid API key. Please check your remove.bg API key.');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      setProcessedImage(processedUrl);
      setSuccess('Background removed successfully!');
    } catch (err) {
      setError(err.message || 'Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `removed-bg-${selectedFile.name.replace(/\.[^/.]+$/, "")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setError('');
    setSuccess('');
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
          <span style={{ color: "var(--text-soft)" }}>Background Remover</span>
        </div>
        <h1 className={styles.heroH1}>Background <em>Remover</em></h1>
        <p className={styles.heroP}>Instantly isolate subjects and remove backgrounds from any image using advanced AI. 100% automatic.</p>
        <div className={styles.badges}>
          <div className={styles.badge}><Sparkles size={14} /> AI Powered</div>
          <div className={`${styles.badge} ${styles.purple}`}>High Accuracy</div>
          <div className={styles.badge}><ShieldCheck size={14} /> Secure & Fast</div>
        </div>
      </div>

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
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.uploadInput}
              />
              <span className={styles.uploadIconBig}><UploadCloud size={48} color="var(--accent)" strokeWidth={1.5} /></span>
              <div className={styles.uploadTitle}>Drop an image to remove background</div>
              <div className={styles.uploadSub}>Or click to browse your files</div>
              <button className={styles.btnUpload}>
                Select Image
              </button>
              <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--muted)' }}>
                Supports JPG, PNG, WEBP up to 10MB
              </div>
            </div>
          ) : (
            <div className={styles.previewBox}>
              <div className={styles.previewHeader}>
                <span className={styles.previewLabel}>
                  {processedImage ? <><Sparkles size={14} color="var(--accent)" /> Result Image</> : <><ImageIcon size={14} /> Original Image</>}
                </span>
                <button className={styles.btnClear} onClick={resetTool}>
                  <X size={14} /> Remove
                </button>
              </div>
              <div className={styles.previewImgWrap}>
                <img src={processedImage || preview} alt="Working Asset" />
              </div>
              <div className={styles.previewInfo}>
                <span style={{ fontWeight: 600, color: "var(--text-soft)" }}>{selectedFile.name}</span>
                {processedImage && <span style={{ color: "var(--accent)", fontWeight: 700 }}>Background Removed</span>}
              </div>
            </div>
          )}

          {/* Alerts */}
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

        {/* RIGHT PANEL: ACTIONS */}
        <div className={styles.sidePanel}>
          <div className={styles.sTitle}>✨ Magic Eraser</div>
          <p className={styles.panelP}>Our AI model analyzes your picture to detect foreground subjects and erase the background pixel-perfectly.</p>

          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {!processedImage ? (
              <button
                className={styles.processBtn}
                onClick={removeBackground}
                disabled={!preview || isProcessing}
              >
                {isProcessing ? <><Loader size={18} className="spinner" /> AI Processing...</> : <><Wand2 size={18} /> Remove Background</>}
              </button>
            ) : (
              <>
                <button className={`${styles.processBtn} ${styles.btnDownload}`} onClick={downloadImage}>
                  <Download size={18} /> Download Transparent PNG
                </button>
                <button className={styles.processBtn} style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }} onClick={resetTool}>
                  Restart with new image
                </button>
              </>
            )}
          </div>

          <div className={styles.infoSec} style={{ padding: '20px 0 0 0', marginTop: '10px', borderTop: '1px solid var(--border)' }}>
            <h3 className={styles.infoTitle}>Tips for Best Results:</h3>
            <ul className={styles.infoList}>
              <li>Ensure clear contrast between subject and background.</li>
              <li>People, products, and animals work best.</li>
              <li>Images with busy backgrounds may take longer to process.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BackgroundRemover;