import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  discount_price: number | null;
  rating: number | null;
  category_id: string | null;
  is_featured: boolean | null;
}

interface ProductImage {
  product_id: string;
  image_url: string;
  is_primary: boolean | null;
}

interface FeaturedProductsProps {
  title: string;
  showFeatured?: boolean;
  showDiscounted?: boolean;
  limit?: number;
}

const FeaturedProducts = ({
  title,
  showFeatured = false,
  showDiscounted = false,
  limit = 8,
}: FeaturedProductsProps) => {
  const [products, setProducts] = useState<(Product & { image: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(limit);

      if (showFeatured) {
        query = query.eq("is_featured", true);
      }

      if (showDiscounted) {
        query = query.not("discount_price", "is", null);
      }

      const { data: productsData, error } = await query;

      if (error || !productsData) {
        setIsLoading(false);
        return;
      }

      // Fetch primary images for products
      const productIds = productsData.map((p) => p.id);
      const { data: imagesData } = await supabase
        .from("product_images")
        .select("product_id, image_url, is_primary")
        .in("product_id", productIds)
        .eq("is_primary", true);

      const imageMap = new Map<string, string>();
      imagesData?.forEach((img) => {
        imageMap.set(img.product_id, img.image_url);
      });

      const productsWithImages = productsData.map((product) => ({
        ...product,
        image: imageMap.get(product.id) || "/placeholder.svg",
      }));

      setProducts(productsWithImages);
      setIsLoading(false);
    };

    fetchProducts();
  }, [showFeatured, showDiscounted, limit]);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-right">
            {title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <Link to="/products">
            <Button variant="ghost" className="gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              nameAr={product.name_ar}
              price={product.price}
              discountPrice={product.discount_price}
              image={product.image}
              rating={product.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
