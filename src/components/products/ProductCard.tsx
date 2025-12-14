import { Link } from "react-router-dom";
import { Heart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const { toggleItem, isFavorite } = useFavoritesContext();
  const { toast } = useToast();
  const isInFavorites = isFavorite(id);

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
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-luxury transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-3 p-3">
        {/* Image - Full display without cropping */}
        <Link to={`/product/${id}`} className="shrink-0 w-full sm:w-40">
          <div className="relative w-full bg-muted rounded-lg overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={nameAr}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              style={{ aspectRatio: '1/1' }}
            />
            {discountPrice && (
              <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0" dir="rtl">
          <div>
            <Link to={`/product/${id}`}>
              <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                {nameAr}
              </h3>
            </Link>
            
            {category && (
              <span className="text-xs text-muted-foreground">{category}</span>
            )}

            {rating && (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 gap-2">
            {/* Price */}
            <div className="flex items-center gap-2">
              {discountPrice ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    {discountPrice} ج.م
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">{price} ج.م</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className={`h-8 w-8 ${isInFavorites ? "text-destructive" : ""}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isInFavorites ? "fill-current" : ""}`} />
              </Button>
              <Link to={`/product/${id}`}>
                <Button size="sm" className="h-8 gap-1 text-xs">
                  <Eye className="h-3 w-3" />
                  التفاصيل
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
