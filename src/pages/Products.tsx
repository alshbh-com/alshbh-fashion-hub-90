import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  discount_price: number | null;
  rating: number | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<(Product & { image: string })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      let query = supabase.from("products").select("*").eq("is_active", true);

      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,name_ar.ilike.%${searchQuery}%`);
      }

      if (priceRange.min) {
        query = query.gte("price", parseInt(priceRange.min));
      }
      if (priceRange.max) {
        query = query.lte("price", parseInt(priceRange.max));
      }

      switch (sortBy) {
        case "price-low":
          query = query.order("price", { ascending: true });
          break;
        case "price-high":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false, nullsFirst: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data: productsData, error } = await query;

      if (error || !productsData) {
        setIsLoading(false);
        return;
      }

      const productIds = productsData.map((p) => p.id);
      const { data: imagesData } = await supabase
        .from("product_images")
        .select("product_id, image_url")
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
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-4" dir="rtl">
      <div className="space-y-2">
        <Label>البحث</Label>
        <Input
          placeholder="ابحث عن منتج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>القسم</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name_ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>نطاق السعر</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="من"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <Input
            type="number"
            placeholder="إلى"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="h-4 w-4 ml-2" />
        مسح الفلاتر
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>المنتجات - الشبح فاشون Alshbh Fashion</title>
        <meta name="description" content="تصفح جميع منتجات الشبح فاشون Alshbh Fashion من ملابس عصرية وأزياء راقية بأفضل الأسعار" />
        <meta name="keywords" content="الشبح فاشون, منتجات, ملابس, أزياء عصرية" />
      </Helmet>

      <Layout>
        <div className="container py-4 px-3">
          <div className="flex items-center justify-between mb-4" dir="rtl">
            <h1 className="text-2xl font-bold">المنتجات</h1>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue placeholder="ترتيب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">الأقل سعراً</SelectItem>
                  <SelectItem value="price-high">الأعلى سعراً</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle>فلترة المنتجات</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-20 bg-card p-4 rounded-lg border">
                <h2 className="text-lg font-semibold mb-3 text-right">فلترة</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Products List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">لا توجد منتجات</p>
                  <Button onClick={clearFilters} className="mt-4">
                    مسح الفلاتر
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
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
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Products;
