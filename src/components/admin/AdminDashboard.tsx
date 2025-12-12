import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  MapPin,
  Image,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminProducts from "./sections/AdminProducts";
import AdminCategories from "./sections/AdminCategories";
import AdminOrders from "./sections/AdminOrders";
import AdminGovernorates from "./sections/AdminGovernorates";
import AdminAds from "./sections/AdminAds";

type Section =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "governorates"
  | "ads";

const menuItems = [
  { id: "dashboard" as Section, label: "لوحة التحكم", icon: LayoutDashboard },
  { id: "products" as Section, label: "المنتجات", icon: Package },
  { id: "orders" as Section, label: "الطلبات", icon: ShoppingCart },
  { id: "categories" as Section, label: "الأقسام", icon: FolderTree },
  { id: "governorates" as Section, label: "المحافظات", icon: MapPin },
  { id: "ads" as Section, label: "الإعلانات", icon: Image },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "products":
        return <AdminProducts />;
      case "categories":
        return <AdminCategories />;
      case "orders":
        return <AdminOrders />;
      case "governorates":
        return <AdminGovernorates />;
      case "ads":
        return <AdminAds />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">مرحباً بك في لوحة التحكم</h2>
            <p className="text-muted-foreground">
              اختر قسماً من القائمة للبدء
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-60 bg-sidebar border-l border-sidebar-border transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <div>
              <Link to="/" className="text-lg font-bold text-sidebar-foreground">
                Alshbh Fashion
              </Link>
              <p className="text-xs text-sidebar-foreground/70">لوحة التحكم</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  activeSection === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-sidebar-border">
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground">
                <LogOut className="h-5 w-5" />
                الخروج
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b px-3 lg:px-6 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">
            {menuItems.find((m) => m.id === activeSection)?.label || "لوحة التحكم"}
          </h1>
          <div />
        </header>

        {/* Content */}
        <div className="p-3 lg:p-6">{renderSection()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
