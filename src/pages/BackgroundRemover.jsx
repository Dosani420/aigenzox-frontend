import React, { useState, useRef } from 'react';
import styles from './BackgroundRemover.module.css';

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
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
      setProcessedImage(null);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      formData.append('size', 'auto'); // auto-detect size

      // Using remove.bg API - you'll need to get an API key from https://www.remove.bg/api
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
    link.download = `background_removed_${selectedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Background Remover</h1>
        <p>Remove backgrounds from images automatically using AI</p>
      </div>

      <div className={styles.toolContainer}>
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
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />

            {preview ? (
              <div className={styles.previewContainer}>
                <img src={preview} alt="Preview" className={styles.preview} />
                <p className={styles.fileName}>{selectedFile.name}</p>
              </div>
            ) : (
              <div className={styles.uploadPrompt}>
                <div className={styles.uploadIcon}>📸</div>
                <p>Click to select or drag and drop an image</p>
                <span className={styles.fileTypes}>Supports: JPG, PNG, WebP (max 10MB)</span>
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.controls}>
            <button
              onClick={removeBackground}
              disabled={!selectedFile || isProcessing}
              className={styles.processBtn}
            >
              {isProcessing ? 'Processing...' : 'Remove Background'}
            </button>

            <button onClick={resetTool} className={styles.resetBtn}>
              Reset
            </button>
          </div>
        </div>

        <div className={styles.resultSection}>
          {processedImage ? (
            <div className={styles.resultContainer}>
              <h3>Background Removed!</h3>
              <img src={processedImage} alt="Processed" className={styles.result} />
              <button onClick={downloadImage} className={styles.downloadBtn}>
                Download Image
              </button>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>✨</div>
              <p>Processed image will appear here</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <h3>How it works:</h3>
        <ul>
          <li>Upload an image with a clear subject</li>
          <li>AI automatically detects and removes the background</li>
          <li>Download your image with transparent background</li>
        </ul>
        <p className={styles.note}>
          <strong>Setup Required:</strong> To use this tool, you need a remove.bg API key.
          Get one at <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer">remove.bg/api</a>
          and add it to your environment variables as <code>REACT_APP_REMOVE_BG_API_KEY</code>.
        </p>
      </div>
    </div>
  );
};

export default BackgroundRemover;