import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartContext } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Governorate {
  id: string;
  name: string;
  name_ar: string;
  shipping_price: number;
  is_active: boolean | null;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartContext();
  const { toast } = useToast();

  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<Governorate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    phonePrimary: "",
    phoneSecondary: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const fetchGovernorates = async () => {
      const { data, error } = await supabase
        .from("governorates")
        .select("*")
        .eq("is_active", true)
        .order("name_ar", { ascending: true });

      if (!error && data) {
        setGovernorates(data);
      }
    };

    fetchGovernorates();
  }, []);

  useEffect(() => {
    if (items.length === 0 && !showThankYou) {
      navigate("/cart");
    }
  }, [items.length, navigate, showThankYou]);

  const shippingPrice = selectedGovernorate?.shipping_price || 0;
  const totalPrice = subtotal + shippingPrice;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGovernorateChange = (governorateId: string) => {
    const governorate = governorates.find((g) => g.id === governorateId);
    setSelectedGovernorate(governorate || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGovernorate) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المحافظة",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerName || !formData.phonePrimary || !formData.address) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: formData.customerName,
          phone_primary: formData.phonePrimary,
          phone_secondary: formData.phoneSecondary || null,
          governorate_id: selectedGovernorate.id,
          shipping_price: shippingPrice,
          address: formData.address,
          notes: formData.notes || null,
          subtotal: subtotal,
          total_price: totalPrice,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.nameAr,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and show thank you screen
      clearCart();
      setShowThankYou(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Thank You Screen
  if (showThankYou) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="perspective-1000">
            <div className="transform-3d animate-thank-you bg-gradient-to-br from-primary to-accent p-12 rounded-2xl text-center max-w-md mx-auto shadow-gold">
              <div className="text-6xl mb-6">✨</div>
              <h1 className="text-3xl font-bold text-white mb-4 font-cairo">
                شكراً للشراء من
              </h1>
              <h2 className="text-4xl font-bold text-white mb-6 font-cairo">
                Alshbh Fashion
              </h2>
              <p className="text-white/90 text-lg">
                سيتم التواصل معك قريباً
              </p>
              <div className="mt-8 w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[shimmer_5s_linear]" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>إتمام الطلب - Alshbh Fashion</title>
      </Helmet>

      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-right">إتمام الطلب</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                <div className="bg-card p-6 rounded-lg border space-y-4">
                  <h2 className="text-xl font-bold mb-4">بيانات الشحن</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">الاسم *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phonePrimary">رقم الهاتف *</Label>
                      <Input
                        id="phonePrimary"
                        name="phonePrimary"
                        value={formData.phonePrimary}
                        onChange={handleInputChange}
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneSecondary">رقم هاتف إضافي (اختياري)</Label>
                      <Input
                        id="phoneSecondary"
                        name="phoneSecondary"
                        value={formData.phoneSecondary}
                        onChange={handleInputChange}
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>المحافظة *</Label>
                      <Select onValueChange={handleGovernorateChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المحافظة" />
                        </SelectTrigger>
                        <SelectContent>
                          {governorates.map((gov) => (
                            <SelectItem key={gov.id} value={gov.id}>
                              {gov.name_ar} ({gov.shipping_price} ج.م)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان بالتفصيل *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card p-6 rounded-lg border">
                  <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      💵
                    </div>
                    <div>
                      <p className="font-semibold">الدفع عند الاستلام</p>
                      <p className="text-sm text-muted-foreground">
                        ادفع نقداً عند استلام طلبك
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card p-6 rounded-lg border space-y-4" dir="rtl">
                <h2 className="text-xl font-bold">ملخص الطلب</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.nameAr}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.nameAr}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {(item.discountPrice || item.price) * item.quantity} ج.م
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{subtotal} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span>
                      {selectedGovernorate ? `${shippingPrice} ج.م` : "اختر المحافظة"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{totalPrice} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Checkout;
