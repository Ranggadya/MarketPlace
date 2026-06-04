import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "MarketPlace - Jual Beli Online",
  description: "Platform jual beli online terpercaya",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <Suspense>
            <Navbar />
          </Suspense>
          {children}
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
