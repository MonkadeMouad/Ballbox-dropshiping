import { Link } from "react-router-dom";
import { ArrowRight, Star, Zap, Shield, Truck } from "lucide-react";
import heroImage from "@/assets/hero-basketball.jpg";
import ProductCard from "@/components/ProductCard";
import { products, reviews } from "@/data/products";

const Index = () => {
  const bestsellers = products.filter((p) => p.isBestseller);
  const featured = products.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Basketball court" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 pt-20">
          <div className="max-w-2xl">
            <p className="text-primary font-display tracking-[0.3em] uppercase text-sm mb-4 animate-fade-in">
              New Season Collection
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.9] mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              DOMINATE<br />THE <span className="text-primary">COURT</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
              Premium basketball gear engineered for performance. From the court to the streets.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-105"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:bg-muted hover:scale-105"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, text: "Performance Tested" },
              { icon: Shield, text: "Premium Quality" },
              { icon: Truck, text: "Free Shipping $100+" },
              { icon: Star, text: "4.8★ Avg Rating" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 justify-center">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Featured</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">TOP PICKS</h2>
          </div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-card court-lines py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Most Loved</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">BEST SELLERS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-10">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">WHAT PLAYERS SAY</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 hover-lift"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-bold text-primary-foreground">
                  {review.avatar}
                </div>
                <span className="font-display font-semibold text-sm">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-electric/20" />
        <div className="absolute inset-0 court-lines opacity-30" />
        <div className="container relative text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            READY TO <span className="text-primary">DOMINATE</span>?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join thousands of athletes who trust HoopZone for their game.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-105 animate-pulse-glow"
          >
            Shop the Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Index;
