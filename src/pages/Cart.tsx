import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Trash } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCartContext();

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
        <title>{`سلة المشتريات (${itemCount || 0}) - Alshbh Fashion`}</title>
      </Helmet>

      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-right">سلة المشتريات</h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCart}
              className="gap-2"
            >
              <Trash className="h-4 w-4" />
              مسح السلة
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border overflow-hidden">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المنتج</TableHead>
                      <TableHead className="text-center">اللون</TableHead>
                      <TableHead className="text-center">المقاس</TableHead>
                      <TableHead className="text-center">السعر</TableHead>
                      <TableHead className="text-center">الكمية</TableHead>
                      <TableHead className="text-center">الإجمالي</TableHead>
                      <TableHead className="text-center">حذف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Link
                            to={`/product/${item.productId}`}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={item.image}
                              alt={item.nameAr}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <span className="font-medium hover:text-primary transition-colors line-clamp-2">
                              {item.nameAr}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full border"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span className="text-sm">{item.color}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {item.size}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.discountPrice ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-primary">
                                {item.discountPrice} ج.م
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                {item.price} ج.م
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-primary">
                              {item.price} ج.م
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
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
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary">
                          {((item.discountPrice || item.price) * item.quantity).toFixed(0)} ج.م
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
