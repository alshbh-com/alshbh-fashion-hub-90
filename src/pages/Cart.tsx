import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCartContext();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>سلة المشتريات - Alshbh Fashion</title>
        </Helmet>
        <Layout>
          <div className="container py-16 text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">سلة المشتريات فارغة</h1>
            <p className="text-muted-foreground mb-8">
              لم تقم بإضافة أي منتجات للسلة بعد
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
        <title>سلة المشتريات ({itemCount}) - Alshbh Fashion</title>
      </Helmet>

      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-right">سلة المشتريات</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-lg border"
                  dir="rtl"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.nameAr}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {item.nameAr}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        اللون:
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        {item.color}
                      </span>
                      <span>المقاس: {item.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div>
                        {item.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">
                              {item.discountPrice} ج.م
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {item.price} ج.م
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-primary">
                            {item.price} ج.م
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card p-6 rounded-lg border space-y-4" dir="rtl">
                <h2 className="text-xl font-bold">ملخص الطلب</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد المنتجات</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{subtotal} ج.م</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>الشحن</span>
                    <span>يحدد عند الدفع</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع</span>
                    <span className="text-primary">{subtotal} ج.م</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    *لا يشمل تكلفة الشحن
                  </p>
                </div>

                <Link to="/checkout">
                  <Button size="lg" className="w-full">
                    إتمام الطلب
                  </Button>
                </Link>

                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    متابعة التسوق
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Cart;
