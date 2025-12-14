import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategorySection from "@/components/home/CategorySection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>الشبح فاشون - Alshbh Fashion | متجر الأزياء العصرية في مصر</title>
        <meta
          name="description"
          content="الشبح فاشون Alshbh Fashion - تسوق أفضل الملابس العصرية. أعلى جودة وأفضل الأسعار مع خدمة توصيل لجميع أنحاء مصر. متجر الشبح فاشون للأزياء."
        />
        <meta name="keywords" content="الشبح فاشون, Alshbh Fashion, ملابس, أزياء, متجر ملابس, ملابس عصرية, مصر" />
      </Helmet>
      
      <Layout>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Categories Section */}
        <CategorySection />

        {/* Featured Products */}
        <FeaturedProducts title="الأكثر مبيعاً" showFeatured limit={8} />

        {/* Discounted Products */}
        <FeaturedProducts title="عروض خاصة" showDiscounted limit={8} />

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
              لماذا تختار Alshbh Fashion؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 p-6">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">جودة عالية</h3>
                <p className="text-muted-foreground">
                  نختار أفضل الخامات لنقدم لكم ملابس عالية الجودة
                </p>
              </div>
              <div className="text-center space-y-4 p-6">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">أسعار منافسة</h3>
                <p className="text-muted-foreground">
                  أفضل الأسعار مع عروض وخصومات مستمرة
                </p>
              </div>
              <div className="text-center space-y-4 p-6">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">توصيل سريع</h3>
                <p className="text-muted-foreground">
                  نوصل طلبك لجميع محافظات مصر بأسرع وقت
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Index;
