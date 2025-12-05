import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
export const metadata: Metadata = {
  title: "Marketplace PPL | Temukan Barang Impianmu",
  description: "Marketplace terpercaya dengan harga terbaik. Jual beli produk elektronik, fashion, makanan, buku, dan hobi dengan mudah dan aman.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-white min-h-screen antialiased">
        <Navbar />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
