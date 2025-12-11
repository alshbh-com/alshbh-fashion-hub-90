import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Color {
  id: string;
  name: string;
  name_ar: string;
  hex_code: string;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<(Product & { image: string })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchFiltersData = async () => {
      const [categoriesRes, colorsRes] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("colors").select("*"),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (colorsRes.data) setColors(colorsRes.data);
    };

    fetchFiltersData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      let query = supabase.from("products").select("*").eq("is_active", true);

      // Apply category filter
      if (selectedCategory && selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,name_ar.ilike.%${searchQuery}%`);
      }

      // Apply price range
      if (priceRange.min) {
        query = query.gte("price", parseInt(priceRange.min));
      }
      if (priceRange.max) {
        query = query.lte("price", parseInt(priceRange.max));
      }

      // Apply sorting
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

      // Fetch primary images
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
    setSelectedColors([]);
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6" dir="rtl">
      {/* Search */}
      <div className="space-y-2">
        <Label>البحث</Label>
        <Input
          placeholder="ابحث عن منتج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category */}
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

      {/* Colors */}
      <div className="space-y-2">
        <Label>الألوان</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <label
              key={color.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedColors.includes(color.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColors([...selectedColors, color.id]);
                  } else {
                    setSelectedColors(selectedColors.filter((c) => c !== color.id));
                  }
                }}
              />
              <span
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: color.hex_code }}
              />
              <span className="text-sm">{color.name_ar}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
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

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="h-4 w-4 ml-2" />
        مسح الفلاتر
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>المنتجات - Alshbh Fashion</title>
        <meta name="description" content="تصفح جميع منتجات Alshbh Fashion من ملابس عصرية وأزياء راقية" />
      </Helmet>

      <Layout>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8" dir="rtl">
            <h1 className="text-3xl font-bold">المنتجات</h1>
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">السعر: من الأقل</SelectItem>
                  <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 ml-2" />
                    فلترة
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>فلترة المنتجات</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4 text-right">فلترة</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">لا توجد منتجات</p>
                  <Button onClick={clearFilters} className="mt-4">
                    مسح الفلاتر
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
