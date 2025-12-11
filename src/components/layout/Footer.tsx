import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" dir="rtl">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gradient font-cairo">
              Alshbh Fashion
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              متجر الشبه للأزياء - نقدم لكم أفضل الملابس العصرية بأعلى جودة وأفضل الأسعار
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
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
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
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
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">خدمة العملاء</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                سلة المشتريات
              </Link>
              <Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">
                المفضلة
              </Link>
              <Link to="/checkout" className="text-muted-foreground hover:text-primary transition-colors">
                إتمام الطلب
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">تواصل معنا</h4>
            <div className="space-y-3">
              <a
                href="tel:01204486263"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>01204486263</span>
              </a>
              <a
                href="tel:01278006248"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>01278006248</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@alshbhfashion.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>مصر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Alshbh Fashion. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
