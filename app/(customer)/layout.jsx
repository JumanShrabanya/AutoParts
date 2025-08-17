import React from "react";
import Navigation from "../components/Navbar/Navigation";
import Footer from "../components/Footer/Footer";

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
