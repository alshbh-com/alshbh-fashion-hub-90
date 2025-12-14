import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-8 px-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" dir="rtl">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h3 className="text-lg font-bold text-gradient">
              Alshbh Fashion
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              الشبح فاشون - أفضل الملابس العصرية بأعلى جودة
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1Gz16PBfU1/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">روابط سريعة</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                الرئيسية
              </Link>
              <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                المنتجات
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                من نحن
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                اتصل بنا
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">خدمة العملاء</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                سلة المشتريات
              </Link>
              <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                المفضلة
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">تواصل معنا</h4>
            <div className="space-y-2 text-sm">
              <a
                href="tel:01204486263"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>01204486263</span>
              </a>
              <a
                href="tel:01278006248"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>01278006248</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>alshbh@alshbh.store</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>مصر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Alshbh Fashion. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
