import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";

function Layout({ children }) {
  return (
    <>
      <CustomCursor />

      <div className="layout">
        <Navbar />
        <main className="content">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
