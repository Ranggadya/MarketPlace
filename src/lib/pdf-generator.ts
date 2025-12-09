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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const setHeader = (title: string) => {
    // Garis Header Merah (Top Border)
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(1);
    doc.line(14, 15, 196, 15);

    // Title Utama
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("LAPORAN MARKETPLACE", 105, 25, { align: "center" });

    // Garis Pemisah
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // Subtitle Laporan
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(title, 14, 40);

    // Info Tanggal dan User
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text(`Tanggal: ${date}`, 14, 46);
    doc.text(`Dibuat oleh: ${user.name}`, 14, 51);

    // Garis sebelum tabel
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.3);
    doc.line(14, 55, 196, 55);
  };

  if (type === "STOCK") {
    // Urutkan berdasarkan Stock Menurun (Desc)
    const data = [...products].sort((a, b) => b.stock - a.stock);

    setHeader("Laporan Daftar Produk Berdasarkan Stock");

    autoTable(doc, {
      startY: 59,
      head: [["No", "Nama Produk", "Kategori", "Harga", "Rating", "Stock"]],
      body: data.map((p, i) => [
        i + 1,
        p.name,
        p.category?.name || p.categories?.name || "-",
        fmtMoney(p.price),
        p.rating ? p.rating.toFixed(1) : "0.0",
        p.stock,
      ]),
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { cellWidth: 55 },
        2: { cellWidth: 35 },
        3: { halign: "right", cellWidth: 35 },
        4: { halign: "center", cellWidth: 25 },
        5: { halign: "center", cellWidth: 20 },
      },
      margin: { left: 14, right: 14 },
      theme: "striped",
    });

    doc.save("Laporan_Stok.pdf");
  } else if (type === "RATING") {
    // Urutkan berdasarkan Rating Menurun (Desc)
    const data = [...products].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );

    setHeader("Laporan Daftar Produk Berdasarkan Rating");

    autoTable(doc, {
      startY: 59,
      head: [["No", "Nama Produk", "Kategori", "Harga", "Stock", "Rating"]],
      body: data.map((p, i) => [
        i + 1,
        p.name,
        p.category?.name || p.categories?.name || "-",
        fmtMoney(p.price),
        p.stock,
        p.rating ? p.rating.toFixed(1) : "0.0",
      ]),
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { cellWidth: 55 },
        2: { cellWidth: 35 },
        3: { halign: "right", cellWidth: 35 },
        4: { halign: "center", cellWidth: 20 },
        5: { halign: "center", cellWidth: 25 },
      },
      margin: { left: 14, right: 14 },
      theme: "striped",
    });

    doc.save("Laporan_Rating.pdf");
  } else if (type === "WARNING") {
    // Filter Stock < 2, Urutkan Kategori & Produk
    const data = products
      .filter((p) => p.stock < 2)
      .sort(
        (a, b) =>
          (a.category?.name || a.categories?.name || "").localeCompare(
            b.category?.name || b.categories?.name || ""
          ) || a.name.localeCompare(b.name)
      );

    setHeader("Laporan Produk Segera Dipesan (Stock < 2)");

    if (data.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("✓ Tidak ada produk dengan stok kritis.", 14, 67);
    } else {
      autoTable(doc, {
        startY: 59,
        head: [["No", "Nama Produk", "Kategori", "Harga", "Stock"]],
        body: data.map((p, i) => [
          i + 1,
          p.name,
          p.category?.name || p.categories?.name || "-",
          fmtMoney(p.price),
          p.stock,
        ]),
        headStyles: {
          fillColor: [220, 38, 38],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [254, 242, 242],
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          1: { cellWidth: 70 },
          2: { cellWidth: 40 },
          3: { halign: "right", cellWidth: 40 },
          4: {
            halign: "center",
            cellWidth: 20,
            textColor: [220, 38, 38],
            fontStyle: "bold",
          },
        },
        margin: { left: 14, right: 14 },
        theme: "striped",
      });
    }

    doc.save("Laporan_Warning.pdf");
  }
}
