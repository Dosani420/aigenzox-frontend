import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load pages for better performance (LCP optimization)
const Home = lazy(() => import("./pages/Home"));
const ImageResizer = lazy(() => import("./pages/ImageResizer"));
const ImageConverter = lazy(() => import("./pages/ImageConverter"));
const ImageCompressor = lazy(() => import("./pages/ImageCompressor"));
const ImageToPdf = lazy(() => import("./pages/ImageToPdf"));
const QRGenerator = lazy(() => import("./pages/QRGenerator"));
const BackgroundRemover = lazy(() => import("./pages/BackgroundRemover"));

// Loading fallback for lazy routes
const PageLoader = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="loader-dots">Loading tools...</div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resize" element={<ImageResizer />} />
            <Route path="/convert" element={<ImageConverter />} />
            <Route path="/compress" element={<ImageCompressor />} />
            <Route path="/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
            <Route path="/bg-remover" element={<BackgroundRemover />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
