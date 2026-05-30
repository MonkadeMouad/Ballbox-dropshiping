import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, ArrowLeft, Minus, Plus } from "lucide-react";
import { products, reviews } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/lib/productImages";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="pt-24 min-h-screen container text-center py-20">
        <p className="text-muted-foreground text-lg">Product not found</p>
        <Link to="/shop" className="text-primary mt-4 inline-block">Back to Shop</Link>
      </main>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0];
    for (let i = 0; i < quantity; i++) {
      addToCart(product, size);
    }
  };

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <div className="container py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Image */}
          <div className="relative group">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={getProductImage(product.image)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full font-display tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">{product.subcategory}</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="font-display text-4xl font-bold">{product.price} Dhs</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{product.originalPrice} Dhs</span>
              )}
              {product.originalPrice && (
                <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-full">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <p className="font-display text-sm tracking-widest uppercase mb-3">Colors</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <span key={color} className="px-4 py-2 bg-muted rounded-lg text-sm border border-border">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <p className="font-display text-sm tracking-widest uppercase mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg font-display font-bold text-sm transition-all ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:border-primary border border-border"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-muted rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-primary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-primary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 border rounded-lg transition-all hover:scale-105 ${
                  isWishlisted ? "bg-primary/20 border-primary text-primary" : "border-border hover:border-primary"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">CUSTOMER REVIEWS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.slice(0, 2).map((review, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{review.text}"</p>
                <span className="font-display font-semibold text-sm">{review.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
