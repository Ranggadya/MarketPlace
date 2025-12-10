import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Description */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Marketplace PPL
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Platform jual beli terpercaya dengan harga terbaik. Belanja mudah,
              aman, dan nyaman.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary rounded-lg transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary rounded-lg transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary rounded-lg transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          {/* Column 2: Tentang */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tentang Kami</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Tentang Marketplace PPL
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-primary transition-colors">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary transition-colors">
                  Press Release
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3: Bantuan */}
          <div>
            <h4 className="text-white font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">
                  Info Pengiriman
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 4: Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Jl. Teknologi No. 123, Jakarta 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@marketplaceppl.com</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Marketplace PPL. Platform jual beli terpercaya.</p>
        </div>
      </div>
    </footer>
  );
}
