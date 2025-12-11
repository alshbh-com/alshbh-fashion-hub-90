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

      // Fetch product
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

      // Fetch images
      const { data: imagesData } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true });

      if (imagesData) setImages(imagesData);

      // Fetch colors
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
          setSelectedColor(colorsData[0]);
        }
      }

      // Fetch sizes
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
          setSelectedSize(sizesWithAdjustment[0]);
        }
      }

      setIsLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
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

  const currentPrice = product.discount_price || product.price;
  const finalPrice = currentPrice + (selectedSize?.price_adjustment || 0);
  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار اللون والمقاس",
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
      image: images[0]?.image_url || "/placeholder.svg",
      color: selectedColor.name_ar,
      colorHex: selectedColor.hex_code,
      size: selectedSize.name,
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
        <title>{product.name_ar} - Alshbh Fashion</title>
        <meta name="description" content={product.description_ar || product.description || ""} />
      </Helmet>

      <Layout>
        <div className="container py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            رجوع
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12" dir="rtl">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={images[selectedImage]?.image_url || "/placeholder.svg"}
                  alt={product.name_ar}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
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
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name_ar}</h1>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!)
                            ? "text-gold fill-gold"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-muted-foreground mr-2">({product.rating})</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {finalPrice} ج.م
                  </span>
                  {product.discount_price && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {product.price} ج.م
                      </span>
                      <Badge className="bg-destructive">خصم {discountPercentage}%</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {(product.description_ar || product.description) && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description_ar || product.description}
                </p>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div className="space-y-3">
                  <label className="font-medium">اللون: {selectedColor?.name_ar}</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor?.id === color.id
                            ? "border-primary scale-110"
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
                <div className="space-y-3">
                  <label className="font-medium">المقاس: {selectedSize?.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedSize?.id === size.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted hover:border-primary"
                        }`}
                      >
                        {size.name}
                        {size.price_adjustment !== 0 && (
                          <span className="text-xs mr-1">
                            ({size.price_adjustment! > 0 ? "+" : ""}
                            {size.price_adjustment} ج.م)
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="font-medium">الكمية</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
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
