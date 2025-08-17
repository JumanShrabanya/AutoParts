import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navbar/Navigation";
import React from "react";

const CustomerLayout = ({ children }) => {
  return (
    <main>
      <Navigation />
      {children}
      <Footer />
    </main>
  );
};

export default CustomerLayout;
