import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Image, FileText, Zap, QrCode, Palette } from "lucide-react";
import styles from "./ToolCategories.module.css";

const TOOL_CATEGORIES = [
  {
    id: "image",
    name: "Image Tools",
    icon: Image,
    description: "Resize, convert, compress, and optimize images",
    tools: [
      { name: "Image Resizer", path: "/resize", icon: Image },
      { name: "Image Converter", path: "/convert", icon: FileText },
      { name: "Image Compressor", path: "/compress", icon: Zap }
    ]
  },
  {
    id: "pdf",
    name: "PDF Tools",
    icon: FileText,
    description: "Convert images to PDF and manipulate PDF files",
    tools: [
      { name: "Image to PDF", path: "/image-to-pdf", icon: FileText }
    ]
  },
  {
    id: "utility",
    name: "Utilities",
    icon: Zap,
    description: "Quick utilities for common tasks",
    tools: [
      { name: "QR Code Generator", path: "/qr-generator", icon: QrCode },
      { name: "Background Remover", path: "/bg-remover", icon: Palette }
    ]
  }
];

function ToolCategories({ onCategorySelect, selectedCategory }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.categoriesGrid}>
        {TOOL_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <div
              key={category.id}
              className={`${styles.categoryCard} ${isSelected ? styles.selected : ""} hover-lift`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className={styles.categoryIcon}>
                <IconComponent
                  size={32}
                  color={isSelected ? (darkMode ? "#c4b5fd" : "#6366f1") : (darkMode ? "#cbd5e1" : "#666")}
                />
              </div>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              <p className={styles.categoryDescription}>{category.description}</p>

              <div className={styles.toolsList}>
                {category.tools.map((tool, index) => {
                  const ToolIcon = tool.icon;
                  return (
                    <div key={index} className={styles.toolItem}>
                      <ToolIcon size={16} />
                      <span>{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ToolCategories;