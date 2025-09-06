import Navigation from "@/components/Navbar/Navigation";
import Footer from "@/components/Footer/Footer";

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
