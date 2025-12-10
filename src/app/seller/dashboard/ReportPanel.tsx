"use client";

import generateReportPDF from "@/lib/pdf-generator";

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  rating?: number;
  category?: { name: string };
  categories?: { name: string };
}

interface ReportPanelProps {
  products: Product[];
  user: string;
}

export default function ReportPanel({ products, user }: ReportPanelProps) {
  
  const handleDownload = (type: "STOCK" | "RATING" | "WARNING") => {
    if (!products || products.length === 0) {
      alert("Data produk belum dimuat atau kosong.");
      return;
    }
    generateReportPDF(type, products, { name: user });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="font-bold text-gray-900">Pusat Laporan (PDF)</h3>
        <p className="text-xs text-gray-500 mt-1">Unduh laporan sesuai standar SRS.</p>
      </div>
      
      <div className="p-3">
        <ul className="space-y-2">
          {/* SRS-12 */}
          <li>
            <button 
              onClick={() => handleDownload("STOCK")} 
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group transition-all border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  12
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Laporan Stok
                  </p>
                  <p className="text-[10px] text-gray-400">Urutkan stok tertinggi</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-blue-500">⬇</span>
            </button>
          </li>

          {/* SRS-13 */}
          <li>
            <button 
              onClick={() => handleDownload("RATING")} 
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group transition-all border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-xs">
                  13
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
                    Laporan Rating
                  </p>
                  <p className="text-[10px] text-gray-400">Analisis kepuasan</p>
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-yellow-500">⬇</span>
            </button>
          </li>

          {/* SRS-14 */}
          <li>
            <button 
              onClick={() => handleDownload("WARNING")} 
              className="w-full text-left p-3 hover:bg-red-50 rounded-lg flex items-center justify-between group transition-all border border-red-100 hover:border-red-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                  14
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Warning Stok</p>
                  <p className="text-[10px] text-red-400">Segera pesan (stok {'<'} 2)</p>
                </div>
              </div>
              <span className="text-red-300 group-hover:text-red-600">⬇</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}