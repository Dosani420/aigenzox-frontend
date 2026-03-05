import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ImageResizer from "./pages/ImageResizer";
import ImageConverter from "./pages/ImageConverter";
import ImageCompressor from "./pages/ImageCompressor";
import ImageToPdf from "./pages/ImageToPdf";
import QRGenerator from "./pages/QRGenerator";
import BackgroundRemover from "./pages/BackgroundRemover";
import ComingSoon from "./pages/ComingSoon";

function App() {
  const isComingSoon = String(import.meta.env.VITE_COMING_SOON).toLowerCase() === "true";
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  const showDevBanner = isDev || (isProd && !isComingSoon);
  const devBannerText = isDev ? "Developer mode ON" : "Developer mode OFF";
  const devBannerStyle = {
    position: "fixed",
    bottom: "12px",
    right: "12px",
    zIndex: 1000,
    pointerEvents: "none",
    fontSize: "11px",
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: "999px",
    letterSpacing: "0.02em",
    color: "#fff",
    background: isDev ? "#16a34a" : "#dc2626",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    opacity: 0.9,
  };

  return (
    <>
      <CustomCursor />
      {showDevBanner ? <div style={devBannerStyle}>{devBannerText}</div> : null}

      {isComingSoon ? (
        <ComingSoon />
      ) : (
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resize" element={<ImageResizer />} />
              <Route path="/convert" element={<ImageConverter />} />
              <Route path="/compress" element={<ImageCompressor />} />
              <Route path="/image-to-pdf" element={<ImageToPdf />} />
              <Route path="/qr-generator" element={<QRGenerator />} />
              <Route path="/bg-remover" element={<BackgroundRemover />} />
            </Routes>
          </Layout>
        </Router>
      )}
    </>
  );
}

export default App;
