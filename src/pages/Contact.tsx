import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "تم الإرسال بنجاح",
      description: "شكراً لتواصلك معنا، سنرد عليك في أقرب وقت ممكن",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const whatsappNumber = "201204486263";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      <Helmet>
        <title>اتصل بنا - الشبح فاشون Alshbh Fashion</title>
        <meta
          name="description"
          content="تواصل مع فريق الشبح فاشون Alshbh Fashion - نحن هنا لمساعدتك. خدمة عملاء متميزة على مدار الساعة."
        />
        <meta name="keywords" content="الشبح فاشون, اتصل بنا, تواصل, خدمة عملاء" />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient font-cairo">
              اتصل بنا
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نحن هنا لمساعدتك. تواصل معنا بأي طريقة تفضلها
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8" dir="rtl">
                <h2 className="text-2xl font-bold">معلومات التواصل</h2>

                <div className="space-y-6">
                  <a
                    href="tel:01204486263"
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:border-primary transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">خدمة العملاء</p>
                      <p className="text-muted-foreground" dir="ltr">
                        01204486263
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:01278006248"
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:border-primary transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">رقم إضافي</p>
                      <p className="text-muted-foreground" dir="ltr">
                        01278006248
                      </p>
                    </div>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-800 hover:border-green-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 dark:text-green-300">
                        تواصل عبر واتساب
                      </p>
                      <p className="text-green-600 dark:text-green-400" dir="ltr">
                        01204486263
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl border">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">البريد الإلكتروني</p>
                      <p className="text-muted-foreground">
                        alshbh@alshbh.store
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl border">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">الموقع</p>
                      <p className="text-muted-foreground">مصر</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card p-8 rounded-xl border" dir="rtl">
                <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
