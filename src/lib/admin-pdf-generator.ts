import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const fmtMoney = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
export default function generateAdminReportPDF(
  type: "SELLERS_STATUS" | "SELLERS_LOCATION" | "PRODUCTS_RATING",
  data: any[],
  adminName: string = "Administrator"
) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // --- Header Section ---
  const setHeader = (title: string) => {
    // Red Top Border
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(1);
    doc.line(14, 15, 196, 15);
    // Main Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("LAPORAN PLATFORM ADMIN", 105, 25, { align: "center" });
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);
    // Report Title
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(title, 14, 40);
    // Meta Info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text(`Tanggal Cetak: ${date}`, 14, 46);
    doc.text(`Dicetak Oleh: ${adminName}`, 14, 51);
    // Bottom Header Line
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.3);
    doc.line(14, 55, 196, 55);
  };
  // --- Content Generation ---
  if (type === "SELLERS_STATUS") {
    setHeader("DAFTAR STATUS AKUN PENJUAL");
    const tableBody = data.map((item, index) => [
      index + 1,
      item.store_name || "-",
      item.status || (item.is_verified ? "Terverifikasi" : "Belum Verifikasi"),
      item.created_at
        ? new Date(item.created_at).toLocaleDateString("id-ID")
        : "-",
    ]);
    autoTable(doc, {
      startY: 60,
      head: [["No", "Nama Toko", "Status Akun", "Tanggal Bergabung"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      styles: { fontSize: 9 },
    });
  } else if (type === "SELLERS_LOCATION") {
    setHeader("DAFTAR PENJUAL BERDASARKAN LOKASI");
    // ✅ FIXED: item.province already mapped dari pic_province di API
    // No changes needed here, just ensure API passes correct data
    const tableBody = data.map((item, index) => [
      index + 1,
      item.province || "Tidak Diketahui", // ✅ OK: Data sudah benar dari API
      item.store_name || "-",
      item.city || "-",
    ]);
    autoTable(doc, {
      startY: 60,
      head: [["No", "Provinsi", "Nama Toko", "Kota/Kabupaten"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      styles: { fontSize: 9 },
    });
  } else if (type === "PRODUCTS_RATING") {
    setHeader("DAFTAR PRODUK & RATING (TERTINGGI)");
    // ✅ FIXED: item.province already mapped dari pic_province di API
    // No changes needed here, just ensure API passes correct data
    const tableBody = data.map((item, index) => [
      index + 1,
      item.name,
      item.rating ? `${item.rating.toFixed(1)} ★` : "0 ★",
      fmtMoney(item.price),
      item.category,
      item.store_name,
      item.province, // ✅ OK: Data sudah benar dari API
    ]);
    autoTable(doc, {
      startY: 60,
      head: [
        [
          "No",
          "Nama Produk",
          "Rating",
          "Harga",
          "Kategori",
          "Nama Toko",
          "Provinsi",
        ],
      ],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      styles: { fontSize: 8 }, // Smaller font for more columns
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
      },
    });
  }
  // Save PDF
  doc.save(`Laporan_Admin_${type}_${Date.now()}.pdf`);
}
