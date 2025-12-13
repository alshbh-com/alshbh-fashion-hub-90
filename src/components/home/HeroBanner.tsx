import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Advertisement {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string;
  link: string | null;
  is_active: boolean | null;
}

const HeroBanner = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setAds(data);
      }
      setIsLoading(false);
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient font-cairo">
            Alshbh Fashion
          </h1>
          <p className="text-xl text-muted-foreground">
            أفضل الملابس العصرية بأعلى جودة
          </p>
          <Button size="lg" className="mt-4">
            تسوق الآن
          </Button>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentIndex];

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentAd.image_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container flex items-center">
        <div className="max-w-xl space-y-6 text-right animate-fade-in" dir="rtl">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-cairo drop-shadow-lg">
            {currentAd.title_ar || currentAd.title}
          </h1>
          {(currentAd.description_ar || currentAd.description) && (
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              {currentAd.description_ar || currentAd.description}
            </p>
          )}
          <Button 
            size="lg" 
            className="shadow-luxury mt-4"
            onClick={() => {
              if (currentAd.link) {
                window.location.href = currentAd.link;
              }
            }}
          >
            تسوق الآن
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {ads.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {ads.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
