import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/contexts/CartContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  rating?: number | null;
  category?: string;
}

const ProductCard = ({
  id,
  name,
  nameAr,
  price,
  discountPrice,
  image,
  rating,
  category,
}: ProductCardProps) => {
  const { addItem } = useCartContext();
  const { toggleItem, isFavorite } = useFavoritesContext();
  const { toast } = useToast();
  const isInFavorites = isFavorite(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      name,
      nameAr,
      price,
      discountPrice: discountPrice || undefined,
      image,
      color: "افتراضي",
      colorHex: "#000000",
      size: "M",
      quantity: 1,
    });
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة ${nameAr} إلى السلة`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id,
      name,
      nameAr,
      price,
      discountPrice: discountPrice || undefined,
      image,
      rating: rating || undefined,
    });
    toast({
      title: isInFavorites ? "تم الإزالة" : "تمت الإضافة",
      description: isInFavorites
        ? `تم إزالة ${nameAr} من المفضلة`
        : `تم إضافة ${nameAr} إلى المفضلة`,
    });
  };

  const discountPercentage = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <Link to={`/product/${id}`}>
      <Card className="group overflow-hidden border-border hover:shadow-luxury transition-all duration-300 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={nameAr}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Discount Badge */}
          {discountPrice && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
              خصم {discountPercentage}%
            </Badge>
          )}

          {/* Category Badge */}
          {category && (
            <Badge variant="secondary" className="absolute top-3 left-3">
              {category}
            </Badge>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 ml-2" />
                أضف للسلة
              </Button>
              <Button
                size="icon"
                variant={isInFavorites ? "default" : "outline"}
                className={isInFavorites ? "bg-destructive hover:bg-destructive/90" : "bg-background/80 hover:bg-background"}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isInFavorites ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1 text-right">
            {nameAr}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center justify-end gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "text-gold fill-gold"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground mr-1">({rating})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-end gap-2">
            {discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {discountPrice} ج.م
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {price} ج.م
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">{price} ج.م</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
