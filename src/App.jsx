import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ImageResizer from "./pages/ImageResizer";
import ImageConverter from "./pages/ImageConverter";
import ImageCompressor from "./pages/ImageCompressor";
import ImageToPdf from "./pages/ImageToPdf";
import QRGenerator from "./pages/QRGenerator";
import BackgroundRemover from "./pages/BackgroundRemover";

function App() {
  return (
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
  );
}

export default App;
