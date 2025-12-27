import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-indigo-600 to-violet-700 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-6">
            <p className="text-indigo-100 leading-relaxed">
              Giúp người học trên toàn thế giới tiếp cận giáo dục trực tuyến
              chất lượng cao và cơ hội phát triển nghề nghiệp.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-indigo-400/30">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {[
                { href: "", label: "Tất cả khóa học" },
                { href: "", label: "Giáo viên của chúng tôi" },
                { href: "", label: "Bảng giá" },
                { href: "", label: "Blog" },
                { href: "", label: "Liên hệ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-indigo-100 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-indigo-300 rounded-full mr-2 group-hover:bg-white transition-colors duration-200"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-indigo-400/30">
              Danh mục
            </h3>
            <ul className="space-y-3">
              {[
                { href: "", label: "Phát triển web" },
                { href: "", label: "Khoa học dữ liệu" },
                {
                  href: "",
                  label: "Phát triển di động",
                },
                { href: "", label: "Thiết kế" },
                { href: "", label: "Kinh doanh" },
              ].map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-indigo-100 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-indigo-300 rounded-full mr-2 group-hover:bg-white transition-colors duration-200"></span>
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-indigo-400/30">
              Liên hệ
            </h3>
            <ul className="space-y-4 text-indigo-100">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-indigo-200" />
                <span>123 Phố Giáo dục, Thành phố Học tập, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-indigo-200" />
                <a
                  href="mailto:contact@leanrifyx.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  contact@leanrifyx.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-indigo-200" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-white transition-colors duration-200"
                >
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-400/30 mt-8 pt-8 text-center text-indigo-100">
          <p>&copy; {new Date().getFullYear()} LeanrifyX. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}
