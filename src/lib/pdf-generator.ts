import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Format Data Helper
const fmtMoney = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export default function generateReportPDF(
  type: "STOCK" | "RATING" | "WARNING", 
  products: any[], 
  user: { name: string }
) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const setHeader = (title: string, code: string) => {
    // Garis Header Merah (Tema Kelompok)
    doc.setDrawColor(220, 38, 38); 
    doc.setLineWidth(1.5);
    doc.line(14, 15, 196, 15);

    doc.setFontSize(14); 
    doc.setTextColor(0); 
    doc.text("LAPORAN MARKETPLACE", 14, 25);
    
    doc.setFontSize(10); 
    doc.setTextColor(100); 
    doc.text(`Kode SRS: ${code}`, 14, 30);
    
    doc.setFontSize(12); 
    doc.setTextColor(220, 38, 38); 
    doc.text(title, 14, 40);
    
    doc.setFontSize(10); 
    doc.setTextColor(0); 
    doc.text(`Tanggal: ${date} | Oleh: ${user.name}`, 14, 46);
  };

  if (type === "STOCK") {
    // SRS-12: Urutkan berdasarkan Stock Menurun (Desc)
    // Kolom: No, Produk, Kategori, Harga, Rating, Stock
    const data = [...products].sort((a, b) => b.stock - a.stock);
    
    setHeader("Laporan Daftar Produk Berdasarkan Stock", "SRS-MartPlace-12");
    
    autoTable(doc, {
      startY: 50,
      head: [["No", "Produk", "Kategori", "Harga", "Rating", "Stock"]],
      body: data.map((p, i) => [
        i + 1,
        p.name,
        p.category?.name || "-",
        fmtMoney(p.price),
        p.rating ? `${p.rating} ⭐` : "0",
        p.stock
      ]),
      headStyles: { fillColor: [220, 38, 38] },
    });
    doc.save("Laporan_Stok_SRS12.pdf");
  } 
  
  else if (type === "RATING") {
    // SRS-13: Urutkan berdasarkan Rating Menurun (Desc)
    // Kolom: No, Produk, Kategori, Harga, Stock, Rating
    const data = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    setHeader("Laporan Daftar Produk Berdasarkan Rating", "SRS-MartPlace-13");
    
    autoTable(doc, {
      startY: 50,
      head: [["No", "Produk", "Kategori", "Harga", "Stock", "Rating"]],
      body: data.map((p, i) => [
        i + 1,
        p.name,
        p.category?.name || "-",
        fmtMoney(p.price),
        p.stock,
        p.rating ? `${p.rating} ⭐` : "0"
      ]),
      headStyles: { fillColor: [40, 40, 40] },
    });
    doc.save("Laporan_Rating_SRS13.pdf");
  } 
  
  else if (type === "WARNING") {
    // SRS-14: Filter Stock < 2, Urutkan Kategori & Produk
    const data = products
      .filter(p => p.stock < 2)
      .sort((a, b) => 
        (a.category?.name || "").localeCompare(b.category?.name || "") || 
        a.name.localeCompare(b.name)
      );
    
    setHeader("Laporan Produk Segera Dipesan (Stock < 2)", "SRS-MartPlace-14");
    
    if (data.length === 0) {
      doc.text("Tidak ada produk dengan stok kritis.", 14, 60);
    } else {
      autoTable(doc, {
        startY: 50,
        head: [["No", "Produk", "Kategori", "Harga", "Stock"]],
        body: data.map((p, i) => [
          i + 1,
          p.name,
          p.category?.name || "-",
          fmtMoney(p.price),
          p.stock
        ]),
        headStyles: { fillColor: [220, 38, 38] },
        theme: 'grid'
      });
    }
    doc.save("Laporan_Warning_SRS14.pdf");
  }
}