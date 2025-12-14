import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/contexts/CartContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  discount_price: number | null;
  rating: number | null;
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean | null;
}

interface Color {
  id: string;
  name: string;
  name_ar: string;
  hex_code: string;
}

interface Size {
  id: string;
  name: string;
  price_adjustment: number | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { toggleItem, isFavorite } = useFavoritesContext();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isInFavorites = id ? isFavorite(id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError || !productData) {
        navigate("/products");
        return;
      }

      setProduct(productData);

      const { data: imagesData } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true });

      if (imagesData) setImages(imagesData);

      const { data: productColors } = await supabase
        .from("product_colors")
        .select("color_id")
        .eq("product_id", id);

      if (productColors && productColors.length > 0) {
        const colorIds = productColors.map((pc) => pc.color_id);
        const { data: colorsData } = await supabase
          .from("colors")
          .select("*")
          .in("id", colorIds);

        if (colorsData) {
          setColors(colorsData);
        }
      }

      const { data: productSizes } = await supabase
        .from("product_sizes")
        .select("size_id, price_adjustment")
        .eq("product_id", id);

      if (productSizes && productSizes.length > 0) {
        const sizeIds = productSizes.map((ps) => ps.size_id);
        const { data: sizesData } = await supabase
          .from("sizes")
          .select("*")
          .in("id", sizeIds)
          .order("sort_order", { ascending: true });

        if (sizesData) {
          const sizesWithAdjustment = sizesData.map((size) => ({
            ...size,
            price_adjustment:
              productSizes.find((ps) => ps.size_id === size.id)?.price_adjustment || 0,
          }));
          setSizes(sizesWithAdjustment);
        }
      }

      setIsLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="animate-pulse grid md:grid-cols-2 gap-6">
            <div className="aspect-square bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate price: base product price + size additional price
  const basePrice = product.discount_price || product.price;
  const sizeAdditionalPrice = selectedSize?.price_adjustment || 0;
  const unitPrice = basePrice + sizeAdditionalPrice;
  const totalPrice = unitPrice * quantity;
  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    // Check if colors exist and none selected
    if (colors.length > 0 && !selectedColor) {
      toast({
        title: "مطلوب",
        description: "يرجى اختيار اللون",
        variant: "destructive",
      });
      return;
    }

    // Check if sizes exist and none selected
    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "مطلوب",
        description: "يرجى اختيار المقاس",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      nameAr: product.name_ar,
      price: product.price,
      discountPrice: product.discount_price || undefined,
      sizePrice: selectedSize?.price_adjustment || 0, // سعر المقاس الإضافي
      image: images[0]?.image_url || "/placeholder.svg",
      color: selectedColor?.name_ar || "بدون لون",
      colorHex: selectedColor?.hex_code || "#000000",
      size: selectedSize?.name || "بدون مقاس",
      quantity,
    });

    toast({
      title: "تمت الإضافة",
      description: `تم إضافة ${product.name_ar} إلى السلة`,
    });
  };

  const handleToggleFavorite = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      nameAr: product.name_ar,
      price: product.price,
      discountPrice: product.discount_price || undefined,
      image: images[0]?.image_url || "/placeholder.svg",
      rating: product.rating || undefined,
    });

    toast({
      title: isInFavorites ? "تم الإزالة" : "تمت الإضافة",
      description: isInFavorites
        ? `تم إزالة ${product.name_ar} من المفضلة`
        : `تم إضافة ${product.name_ar} إلى المفضلة`,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name_ar} - الشبح فاشون Alshbh Fashion`}</title>
        <meta name="description" content={`${product.name_ar} - الشبح فاشون Alshbh Fashion. ${product.description_ar || product.description || "تسوق الآن بأفضل الأسعار."}`} />
        <meta name="keywords" content={`الشبح فاشون, ${product.name_ar}, Alshbh Fashion`} />
      </Helmet>

      <Layout>
        <div className="container py-4 px-3">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
            size="sm"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            رجوع
          </Button>

          <div className="grid md:grid-cols-2 gap-6" dir="rtl">
            {/* Images Section */}
            <div className="space-y-3">
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img
                  src={images[selectedImage]?.image_url || "/placeholder.svg"}
                  alt={product.name_ar}
                  className="h-full w-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${product.name_ar} - ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.name_ar}</h1>
                
                {product.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!)
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-muted-foreground mr-2 text-sm">({product.rating})</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {unitPrice} ج.م
                    </span>
                    {product.discount_price && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          {product.price + sizeAdditionalPrice} ج.م
                        </span>
                        <Badge className="bg-destructive">خصم {discountPercentage}%</Badge>
                      </>
                    )}
                  </div>
                  {sizeAdditionalPrice > 0 && (
                    <p className="text-sm text-muted-foreground">
                      (سعر المنتج: {basePrice} + المقاس: {sizeAdditionalPrice})
                    </p>
                  )}
                  {quantity > 1 && (
                    <p className="text-lg font-semibold text-primary">
                      الإجمالي: {totalPrice} ج.م
                    </p>
                  )}
                </div>
              </div>

              {(product.description_ar || product.description) && (
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {product.description_ar || product.description}
                </p>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div className="space-y-2">
                  <label className="font-medium text-sm">
                    اللون: {selectedColor?.name_ar || "اختر اللون"} <span className="text-destructive">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          selectedColor?.id === color.id
                            ? "border-primary scale-110 ring-2 ring-primary/30"
                            : "border-muted hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex_code }}
                        title={color.name_ar}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="font-medium text-sm">
                    المقاس: {selectedSize?.name || "اختر المقاس"} <span className="text-destructive">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
                          selectedSize?.id === size.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted hover:border-primary"
                        }`}
                      >
                        {size.name}
                        {size.price_adjustment !== 0 && size.price_adjustment && (
                          <span className="text-xs mr-1">
                            ({size.price_adjustment > 0 ? "+" : ""}
                            {size.price_adjustment} ج.م)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="font-medium text-sm">الكمية</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-10 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  أضف للسلة
                </Button>
                <Button
                  size="lg"
                  variant={isInFavorites ? "default" : "outline"}
                  onClick={handleToggleFavorite}
                  className={isInFavorites ? "bg-destructive hover:bg-destructive/90" : ""}
                >
                  <Heart className={`h-5 w-5 ${isInFavorites ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductDetail;
