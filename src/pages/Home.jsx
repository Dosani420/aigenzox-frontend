import ToolCard from "../components/ToolCard";
import ToolCategories from "../components/ToolCategories";
import styles from "./Home.module.css";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FileText, Image, Zap, Lock, ArrowRight, ImageDown, RefreshCw, Zap as compress } from "lucide-react";


function Home() {
  const { darkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState("image");

  const getToolsForCategory = (category) => {
    switch (category) {
      case "image":
        return [
          {
            title: "Image Resizer",
            description: "Resize images to custom dimensions easily. Perfect for social media, web, and print.",
            link: "/resize",
            icon: ImageDown
          },
          {
            title: "Image Converter",
            description: "Convert images between PNG, JPG and WEBP formats. Optimize for any platform.",
            link: "/convert",
            icon: RefreshCw
          },
          {
            title: "Image Compressor",
            description: "Compress images while maintaining quality. Perfect for web optimization and storage.",
            link: "/compress",
            icon: compress
          }
        ];
      case "pdf":
        return [
          {
            title: "Image to PDF",
            description: "Convert one or multiple images into a single PDF file.",
            link: "/image-to-pdf",
            icon: () => (
              <div className={styles.iconContainer} >
                <Image size={50} className={styles.icon} color={darkMode ? "#c4b5fd" : "#6366f1"} />
                <ArrowRight size={40} className={styles.icon} color={darkMode ? "#c4b5fd" : "#6366f1"} />
                <FileText size={50} className={styles.icon} color={darkMode ? "#c4b5fd" : "#6366f1"} />
              </div>
            )
          }
        ];
      case "utility":
        return [
          {
            title: "QR Code Generator",
            description: "Generate QR codes for URLs, text, and more. Customize size and format.",
            link: "/qr-generator",
            icon: Zap
          },
          {
            title: "Background Remover",
            description: "Remove image backgrounds automatically. Perfect for product photos and graphics.",
            link: "/bg-remover",
            icon: compress
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className={styles.container}>
      {/* HERO SECTION */}
      <section className={`${styles.hero} ${styles.heroLoaded}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleHighlight}>Free Online</span>
            <br />
            <span>Image Tools</span>
          </h1>
          <p className={styles.heroDescription}>
            Resize, convert and optimize your images instantly — fast, simple and free.
            No installation needed, no signup required.
          </p>
          <div className={styles.heroCTA}>
            <button
              className={styles.primaryBtn}
              onClick={() => document.querySelector('[href="/resize"]').click()}
            >
              <span>Start Now</span>
              <ArrowRight size={18} className={styles.btnArrow} />
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => setSelectedCategory("image")}
            >
              Explore Tools
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={styles.decoration1}></div>
        <div className={styles.decoration2}></div>
      </section>

      {/* TOOL CATEGORIES */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>Choose Your Tool Category</h2>
        <ToolCategories
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </section>

      {/* TOOLS GRID */}
      <section className={styles.gridSection}>
        <h2 className={styles.gridTitle}>
          {selectedCategory === "image" && "Image Tools"}
          {selectedCategory === "pdf" && "PDF Tools"}
          {selectedCategory === "utility" && "Utility Tools"}
        </h2>
        <div className={styles.grid}>
          {getToolsForCategory(selectedCategory).map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              link={tool.link}
              icon={tool.icon}
              darkMode={darkMode}
            />
          ))}
        </div>
      </section>

      {/* FEATURES HIGHLIGHT */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <Zap
            size={40}
            className={styles.featureIcon}
            color={darkMode ? "#c4b5fd" : "#6366f1"}
            strokeWidth={1.5}
          />
          <h3>Lightning Fast</h3>
          <p>Process images in milliseconds</p>
        </div>
        <div className={styles.feature}>
          <Lock
            size={40}
            className={styles.featureIcon}
            color={darkMode ? "#c4b5fd" : "#6366f1"}
            strokeWidth={1.5}
          />
          <h3>100% Secure</h3>
          <p>Your files never leave your device</p>
        </div>
        <div className={styles.feature}>
          <Zap
            size={40}
            className={styles.featureIcon}
            color={darkMode ? "#c4b5fd" : "#6366f1"}
            strokeWidth={1.5}
          />
          <h3>Easy to Use</h3>
          <p>Intuitive interface for everyone</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
