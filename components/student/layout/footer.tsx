import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

// Tách dữ liệu ra mảng để quản lý key dễ dàng và code gọn hơn
const FOOTER_LINKS = {
  quickLinks: [
    { label: "Trang chủ", href: "#" },
    { label: "Tất cả khóa học", href: "#" },
    { label: "Giảng viên của chúng tôi", href: "#" },
  ],
  categories: [
    { label: "Lập trình web", href: "#" },
    { label: "Khoa học dữ liệu", href: "#" },
    { label: "Phát triển di động", href: "#" },
    { label: "Thiết kế", href: "#" },
    { label: "Kinh doanh", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-indigo-700 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Lớp trang trí nền */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/20" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Giới thiệu & Social */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">LearnifyX</h2>
            <p className="text-indigo-100 leading-relaxed text-sm">
              Giúp người học trên toàn thế giới tiếp cận giáo dục trực tuyến
              chất lượng cao và cơ hội phát triển nghề nghiệp bền vững.
            </p>
          </div>

          {/* Cột 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-white/20 pb-2">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-indigo-100 hover:text-white transition-colors flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mr-2 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-white/20 pb-2">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.categories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-indigo-100 hover:text-white transition-colors flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mr-2 group-hover:bg-white transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-white/20 pb-2">
              Liên hệ
            </h3>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 shrink-0 text-indigo-200" />
                <span>123 Phố Giáo dục, Thành phố Đà Nẵng, Việt Nam</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 shrink-0 text-indigo-200" />
                <a href="#" className="hover:text-white transition-colors">
                  learnifyx@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 shrink-0 text-indigo-200" />
                <a href="#" className="hover:text-white transition-colors">
                  +84 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
