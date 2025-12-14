import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { CheckCircle, Star, Truck, Shield } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>من نحن - الشبح فاشون Alshbh Fashion</title>
        <meta
          name="description"
          content="تعرف على متجر الشبح فاشون Alshbh Fashion - متجر الأزياء العصرية الرائد في مصر. نقدم أفضل الملابس بأعلى جودة."
        />
        <meta name="keywords" content="الشبح فاشون, من نحن, Alshbh Fashion, متجر ملابس مصر" />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient font-cairo">
              من نحن
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Alshbh Fashion - متجرك الأول للأزياء العصرية في مصر
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center" dir="rtl">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">قصتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  بدأت رحلة Alshbh Fashion من شغفنا بالأزياء العصرية ورغبتنا في
                  تقديم أفضل المنتجات للعملاء في مصر. نحن نؤمن بأن الموضة ليست
                  مجرد ملابس، بل هي وسيلة للتعبير عن الذات.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  نسعى دائماً لتقديم أحدث صيحات الموضة بجودة عالية وأسعار منافسة،
                  مع الحفاظ على راحة عملائنا ورضاهم كأولوية قصوى.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary to-accent rounded-2xl aspect-square flex items-center justify-center">
                <span className="text-8xl">👔</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">لماذا نتميز؟</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4 p-6 bg-card rounded-xl border">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">جودة عالية</h3>
                <p className="text-muted-foreground">
                  نختار أفضل الخامات لنقدم لكم منتجات تدوم طويلاً
                </p>
              </div>

              <div className="text-center space-y-4 p-6 bg-card rounded-xl border">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">تصاميم حصرية</h3>
                <p className="text-muted-foreground">
                  تشكيلة واسعة من أحدث صيحات الموضة العالمية
                </p>
              </div>

              <div className="text-center space-y-4 p-6 bg-card rounded-xl border">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">توصيل سريع</h3>
                <p className="text-muted-foreground">
                  نوصل طلبك لجميع محافظات مصر بأسرع وقت ممكن
                </p>
              </div>

              <div className="text-center space-y-4 p-6 bg-card rounded-xl border">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">ضمان الجودة</h3>
                <p className="text-muted-foreground">
                  نضمن لكم جودة منتجاتنا ورضاكم التام
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6" dir="rtl">
              <h2 className="text-3xl font-bold">رسالتنا</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                نسعى لأن نكون الوجهة الأولى للأزياء العصرية في مصر، من خلال
                تقديم منتجات عالية الجودة بأسعار منافسة، مع خدمة عملاء متميزة
                تضمن رضا عملائنا الكرام.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
