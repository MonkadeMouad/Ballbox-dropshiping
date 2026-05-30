import { useState, useEffect } from "react";
import { Star, MessageSquarePlus, ThumbsUp } from "lucide-react";
import { products } from "@/data/products";

interface Review {
  id: string;
  name: string;
  productId: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}

const REVIEWS_KEY = "hoopzone_reviews";

const defaultReviews: Review[] = [
  { id: "1", name: "Marcus J.", productId: "court-fury-red", rating: 5, text: "The Court Fury X changed my game. Best traction I've ever had on court.", date: "2026-01-15", likes: 12 },
  { id: "2", name: "Destiny W.", productId: "elite-grip-socks", rating: 5, text: "These socks are incredible. The grip is real — no more sliding in my shoes!", date: "2026-01-22", likes: 8 },
  { id: "3", name: "Tyler R.", productId: "dynasty-gold", rating: 5, text: "Dynasty Elite is fire. I wear them everywhere. Premium quality for real.", date: "2026-02-03", likes: 6 },
  { id: "4", name: "Aisha K.", productId: "team-spirit-bracelet", rating: 4, text: "Love the bracelets! Got the whole team matching. Great quality for the price.", date: "2026-02-10", likes: 4 },
];

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : defaultReviews;
  } catch {
    return defaultReviews;
  }
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

const StarPicker = ({ value, onChange }: { value: number; onChange: (n: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star className={`w-6 h-6 transition-colors ${n <= value ? "fill-gold text-gold" : "text-muted-foreground hover:text-gold"}`} />
      </button>
    ))}
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterRating, setFilterRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", productId: "", rating: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { saveReviews(reviews); }, [reviews]);

  const filtered = reviews.filter((r) => {
    if (filterProduct !== "all" && r.productId !== filterProduct) return false;
    if (filterRating > 0 && r.rating !== filterRating) return false;
    return true;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const handleSubmit = () => {
    if (!form.name.trim() || !form.productId || !form.text.trim()) return;
    const newReview: Review = {
      id: Date.now().toString(),
      name: form.name.trim(),
      productId: form.productId,
      rating: form.rating,
      text: form.text.trim(),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setForm({ name: "", productId: "", rating: 5, text: "" });
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const getProductName = (id: string) =>
    products.find((p) => p.id === id)?.name ?? id;

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      {/* Header */}
      <div className="bg-card court-lines border-b border-border">
        <div className="container py-10 md:py-16">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Témoignages</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">AVIS CLIENTS</h1>
          <p className="text-muted-foreground">Ce que les joueurs pensent de notre équipement</p>
        </div>
      </div>

      <div className="container py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-card border border-border rounded-lg p-5 text-center">
            <p className="font-display text-4xl font-bold text-primary">{avgRating}</p>
            <div className="flex justify-center gap-0.5 my-1">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} className={`w-3 h-3 ${n <= Math.round(Number(avgRating)) ? "fill-gold text-gold" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 text-center">
            <p className="font-display text-4xl font-bold text-primary">{reviews.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Avis total</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 text-center">
            <p className="font-display text-4xl font-bold text-primary">
              {reviews.filter((r) => r.rating >= 4).length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Avis positifs</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 text-center">
            <p className="font-display text-4xl font-bold text-primary">
              {Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100) || 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">Taux de satisfaction</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Filtre produit */}
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les produits</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Filtre note */}
            <div className="flex gap-1">
              {[0, 5, 4, 3, 2, 1].map((n) => (
                <button
                  key={n}
                  onClick={() => setFilterRating(n)}
                  className={`px-3 py-2 rounded-lg text-sm font-display tracking-wider transition-all ${
                    filterRating === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n === 0 ? "Tous" : `${n}★`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-105"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Laisser un avis
          </button>
        </div>

        {/* Confirmation */}
        {submitted && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg text-primary font-display tracking-wider text-sm text-center">
            ✅ Merci pour votre avis ! Il a été publié.
          </div>
        )}

        {/* Formulaire */}
        {showForm && (
          <div className="mb-10 bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold mb-6 tracking-wider">LAISSER UN AVIS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase mb-2 text-muted-foreground">
                  Votre nom *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Marcus J."
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase mb-2 text-muted-foreground">
                  Produit concerné *
                </label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choisir un produit...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-display tracking-widest uppercase mb-2 text-muted-foreground">
                Note *
              </label>
              <StarPicker value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-display tracking-widest uppercase mb-2 text-muted-foreground">
                Votre avis *
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Partagez votre expérience avec ce produit..."
                rows={4}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-105"
              >
                Publier
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-8 py-3 border border-border text-muted-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:text-foreground"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des avis */}
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} avis</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-6 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-bold text-primary-foreground">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                  ))}
                </div>
              </div>

              <p className="text-xs text-primary font-display tracking-widest uppercase mb-2">
                {getProductName(review.productId)}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                "{review.text}"
              </p>

              <button
                onClick={() => handleLike(review.id)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Utile ({review.likes})
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Aucun avis pour ce filtre.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Reviews;
