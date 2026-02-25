import { useState, useRef } from "react";
import styles from "./ImageToPdf.module.css";

function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
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
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Each file must be less than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      setError('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
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

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/image-to-pdf`, {
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Image to PDF</h1>
        <p>Convert one or multiple images into a single PDF file</p>
      </div>

      <div className={styles.uploadSection}>
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />

          <div className={styles.uploadPrompt}>
            <div className={styles.uploadIcon}>📸</div>
            <p>Click to select or drag and drop images</p>
            <span className={styles.fileTypes}>Supports: JPG, PNG, WebP (max 10MB each)</span>
          </div>
        </div>

        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.controls}>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isConverting}
            className={styles.convertBtn}
          >
            {isConverting ? 'Converting...' : `Convert ${files.length} Image${files.length !== 1 ? 's' : ''} to PDF`}
          </button>

          <button onClick={resetTool} className={styles.resetBtn}>
            Reset
          </button>
        </div>
      </div>

      <div className={styles.resultSection}>
        {result ? (
          <div className={styles.resultContainer}>
            <h3>Conversion Complete!</h3>
            <button onClick={() => window.open(result, '_blank')} className={styles.downloadBtn}>
              📄 Download PDF
            </button>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>📄</div>
            <p>Your PDF will appear here after conversion</p>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3>How it works:</h3>
        <ul>
          <li>Select multiple images or drag and drop them</li>
          <li>Images will be converted to PDF in the order selected</li>
          <li>Download your combined PDF file</li>
        </ul>
        <p><strong>Note:</strong> Images are processed in the order they appear in the list.</p>
      </div>
    </div>
  );
}

export default ImageToPdf;
