import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Trash } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCartContext();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>سلة المشتريات - الشبح فاشون Alshbh Fashion</title>
          <meta name="description" content="سلة المشتريات - الشبح فاشون Alshbh Fashion. أكمل طلبك الآن واستمتع بأفضل العروض." />
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
        <title>{`سلة المشتريات (${itemCount || 0}) - الشبح فاشون Alshbh Fashion`}</title>
        <meta name="description" content="سلة المشتريات - الشبح فاشون Alshbh Fashion. أكمل طلبك الآن واستمتع بأفضل العروض." />
      </Helmet>

      <Layout>
        <div className="container py-4 px-3">
          <div className="flex items-center justify-between mb-4" dir="rtl">
            <h1 className="text-xl sm:text-2xl font-bold">سلة المشتريات</h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCart}
              className="gap-1 text-xs sm:text-sm"
            >
              <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
              مسح
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Cart Items - Mobile Friendly */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-card rounded-lg border p-3 sm:p-4"
                  dir="rtl"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <Link to={`/product/${item.productId}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.nameAr}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      />
                    </Link>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productId}`}>
                        <h3 className="font-medium text-sm sm:text-base hover:text-primary transition-colors line-clamp-2">
                          {item.nameAr}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                        <span
                          className="w-4 h-4 rounded-full border shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span>{item.color}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="mt-2">
                        {item.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary text-sm sm:text-base">
                              {item.discountPrice} ج.م
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {item.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-primary text-sm sm:text-base">
                            {item.price} ج.م
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quantity & Subtotal Row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
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
                    
                    {/* Subtotal */}
                    <div className="text-left">
                      <span className="text-xs text-muted-foreground">الإجمالي:</span>
                      <p className="font-bold text-primary">
                        {((item.discountPrice || item.price) * item.quantity).toFixed(0)} ج.م
                      </p>
                    </div>
                  </div>
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
