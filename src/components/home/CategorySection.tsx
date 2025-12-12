import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

const CategorySection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");

      if (!error && data) {
        setCategories(data);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-4 bg-muted/30">
      <div className="container">
        {/* Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between gap-2 h-12"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            <span className="font-semibold">تصفح الأقسام ({categories.length})</span>
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>

        {/* Categories Grid */}
        {isOpen && (
          <div className="mt-4 animate-fade-in" dir="rtl">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-all duration-200"
                >
                  {category.name_ar}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
