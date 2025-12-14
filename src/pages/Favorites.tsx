import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useCartContext } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Favorites = () => {
  const { items, removeItem } = useFavoritesContext();
  const { addItem } = useCartContext();
  const { toast } = useToast();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: item.price,
      discountPrice: item.discountPrice,
      image: item.image,
      color: "افتراضي",
      colorHex: "#000000",
      size: "M",
      quantity: 1,
    });
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة ${item.nameAr} إلى السلة`,
    });
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>المفضلة - الشبح فاشون Alshbh Fashion</title>
          <meta name="description" content="قائمة المفضلة - الشبح فاشون Alshbh Fashion. احفظ منتجاتك المفضلة." />
        </Helmet>
        <Layout>
          <div className="container py-16 text-center">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">قائمة المفضلة فارغة</h1>
            <p className="text-muted-foreground mb-8">
              لم تقم بإضافة أي منتجات للمفضلة بعد
            </p>
            <Link to="/products">
              <Button size="lg">
                تصفح المنتجات
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
            </Link>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>المفضلة ({items.length}) - الشبح فاشون Alshbh Fashion</title>
        <meta name="description" content="قائمة المفضلة - الشبح فاشون Alshbh Fashion. احفظ منتجاتك المفضلة." />
      </Helmet>

      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-right">المفضلة</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg border overflow-hidden group"
              >
                <Link to={`/product/${item.id}`} className="block">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.nameAr}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <div className="p-4 space-y-3" dir="rtl">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                      {item.nameAr}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    {item.discountPrice ? (
                      <>
                        <span className="font-bold text-primary">
                          {item.discountPrice} ج.م
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {item.price} ج.م
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-primary">{item.price} ج.م</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 ml-1" />
                      أضف للسلة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Favorites;
