import { Inter } from "next/font/google";
import "./globals.css";
import { UserSessionProvider } from "@/context/userSession";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AutoParts - Premium Automotive Parts & Accessories",
  description:
    "Your one-stop destination for high-quality automotive parts, accessories, and performance upgrades. Find genuine parts for all major brands with expert support and fast shipping.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <UserSessionProvider>
          <main>{children}</main>
        </UserSessionProvider>
      </body>
    </html>
  );
}
