import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/lib/productImages";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { toggleWishlist, wishlist, addToCart } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden hover-lift border border-border"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full font-display tracking-wider">
          {product.badge}
        </span>
      )}
      {product.isNew && (
        <span className="absolute top-3 left-3 z-10 bg-electric text-electric-foreground text-xs font-bold px-3 py-1 rounded-full font-display tracking-wider">
          NEW
        </span>
      )}

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 p-2 bg-background/60 backdrop-blur-sm rounded-full transition-all hover:bg-primary hover:scale-110"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
      </button>

      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={getProductImage(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-muted-foreground font-display tracking-widest uppercase mb-1">
          {product.subcategory}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-semibold mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">{product.price} Dhs</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{product.originalPrice} Dhs</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product, product.sizes[0])}
            className="p-2 bg-primary text-primary-foreground rounded-lg transition-all hover:scale-110 hover:glow-primary"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
