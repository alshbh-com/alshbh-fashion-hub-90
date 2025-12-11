import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .limit(6);

      if (!error && data) {
        setCategories(data);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-right">
            تسوق حسب القسم
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  // Category colors for visual appeal
  const categoryColors = [
    "from-burnt-brown to-burnt-brown-light",
    "from-gold to-accent",
    "from-silver to-silver-light",
    "from-burnt-brown-dark to-burnt-brown",
    "from-accent to-gold",
    "from-burnt-brown-light to-gold",
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-right">
          تسوق حسب القسم
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group"
            >
              <div
                className={`aspect-square rounded-xl bg-gradient-to-br ${
                  categoryColors[index % categoryColors.length]
                } p-6 flex items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-luxury`}
              >
                <span className="text-lg md:text-xl font-bold text-white drop-shadow-md">
                  {category.name_ar}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
