import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, Save, ShieldAlert, Package, ChevronDown, ChevronUp, Eye, EyeOff, Star, MessageSquare, KeyRound } from "lucide-react";
import { products as defaultProducts } from "@/data/products";
import { getAllImageKeys } from "@/lib/productImages";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: "shoes" | "socks" | "bracelets";
  subcategory: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  hidden?: boolean;
}

interface Review {
  id: string;
  name: string;
  productId: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}

type FormData = Omit<Product, "id">;

// ─── Storage ──────────────────────────────────────────────────────────────────

const PRODUCTS_KEY  = "hoopzone_products";
const REVIEWS_KEY   = "hoopzone_reviews";
const PASSWORD_KEY  = "hoopzone_admin_pw";
const LOCKOUT_KEY   = "hoopzone_lockout";

const DEFAULT_PASSWORD = "BallBox2026!";
const LOCKOUT_SECONDS  = 30;
const MAX_ATTEMPTS     = 3;

function getPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) ?? DEFAULT_PASSWORD;
}

function getLockout(): { until: number; count: number } {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    return raw ? JSON.parse(raw) : { until: 0, count: 0 };
  } catch { return { until: 0, count: 0 }; }
}

function setLockout(count: number) {
  const until = Date.now() + LOCKOUT_SECONDS * 1000 * count;
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until, count }));
}

function clearLockout() {
  localStorage.removeItem(LOCKOUT_KEY);
}

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : defaultProducts;
  } catch { return defaultProducts; }
}

function saveProducts(p: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
}

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveReviews(r: Review[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(r));
}

const blank: FormData = {
  name: "", category: "shoes", subcategory: "", price: 0,
  image: "", sizes: [], colors: [],
  description: "", rating: 4.5, reviews: 0, badge: "",
  isBestseller: false, isNew: false, hidden: false,
};

// ─── ProductForm (outside Admin to prevent focus loss) ───────────────────────

interface ProductFormProps {
  title: string;
  form: FormData;
  onChange: (f: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm = ({ title, form, onChange, onSave, onCancel }: ProductFormProps) => {
  const imageKeys = getAllImageKeys();
  const set = (patch: Partial<FormData>) => onChange({ ...form, ...patch });
  const setArray = (field: "sizes" | "colors", val: string) =>
    set({ [field]: val.split(",").map((s) => s.trim()).filter(Boolean) });

  return (
    <div className="bg-card border border-primary/40 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-bold tracking-wider">{title}</h2>
        <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Nom du produit *</label>
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Court Fury X" className="field" />
        </div>
        <div>
          <label className="label">Catégorie *</label>
          <select value={form.category} onChange={(e) => set({ category: e.target.value as Product["category"] })} className="field">
            <option value="shoes">Shoes</option>
            <option value="socks">Socks</option>
            <option value="bracelets">Bracelets</option>
          </select>
        </div>
        <div>
          <label className="label">Sous-catégorie</label>
          <input value={form.subcategory} onChange={(e) => set({ subcategory: e.target.value })} placeholder="Performance" className="field" />
        </div>
        <div>
          <label className="label">Prix (Dhs) *</label>
          <input type="number" min="0" step="0.01" value={form.price}
            onChange={(e) => set({ price: parseFloat(e.target.value) || 0 })} className="field" />
        </div>
        <div>
          <label className="label">Image</label>
          <select value={form.image} onChange={(e) => set({ image: e.target.value })} className="field">
            <option value="">-- Choisir une image --</option>
            {imageKeys.map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
          {form.image && <p className="text-xs text-primary mt-1">✓ {form.image}</p>}
        </div>
        <div>
          <label className="label">Tailles <span className="text-muted-foreground">(séparées par virgules)</span></label>
          <input value={form.sizes.join(", ")} onChange={(e) => setArray("sizes", e.target.value)} placeholder="7, 8, 9, 10, 11" className="field" />
        </div>
        <div>
          <label className="label">Couleurs <span className="text-muted-foreground">(séparées par virgules)</span></label>
          <input value={form.colors.join(", ")} onChange={(e) => setArray("colors", e.target.value)} placeholder="Red/Black, White/Red" className="field" />
        </div>
        <div>
          <label className="label">Badge <span className="text-muted-foreground">(ex: SALE, NEW)</span></label>
          <input value={form.badge ?? ""} onChange={(e) => set({ badge: e.target.value })} placeholder="SALE" className="field" />
        </div>
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.isBestseller} onChange={(e) => set({ isBestseller: e.target.checked })} className="w-4 h-4 accent-primary" />
            <span className="text-sm font-display tracking-wider">Bestseller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.isNew} onChange={(e) => set({ isNew: e.target.checked })} className="w-4 h-4 accent-primary" />
            <span className="text-sm font-display tracking-wider">Nouveau</span>
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="label">Description</label>
        <textarea value={form.description} onChange={(e) => set({ description: e.target.value })}
          rows={3} placeholder="Description du produit..." className="field resize-none" />
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onSave}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary transition-all">
          <Save className="w-4 h-4" /> Sauvegarder
        </button>
        <button onClick={onCancel}
          className="px-6 py-3 border border-border text-muted-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:text-foreground transition-all">
          Annuler
        </button>
      </div>
    </div>
  );
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const Admin = () => {
  const [unlocked, setUnlocked]       = useState(false);
  const [pw, setPw]                   = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [pwError, setPwError]         = useState("");
  const [lockoutLeft, setLockoutLeft] = useState(0);
  const [tab, setTab]                 = useState<"products" | "reviews" | "security">("products");

  // Change password state
  const [oldPw, setOldPw]             = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [showOldPw, setShowOldPw]     = useState(false);
  const [showNewPw, setShowNewPw]     = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwChangeMsg, setPwChangeMsg] = useState<{type:"ok"|"err", text:string} | null>(null);

  // Products state
  const [products, setProducts]       = useState<Product[]>(loadProducts);
  const [editing, setEditing]         = useState<Product | null>(null);
  const [isAdding, setIsAdding]       = useState(false);
  const [form, setForm]               = useState<FormData>(blank);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews]         = useState<Review[]>(loadReviews);
  const [reviewDeleteConfirm, setReviewDeleteConfirm] = useState<string | null>(null);

  const [saved, setSaved]             = useState(false);

  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveReviews(reviews); }, [reviews]);

  const notify = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const slugify = (n: string) => n.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // ── Products actions ──
  const startAdd = () => { setForm(blank); setEditing(null); setIsAdding(true); };

  const handleAdd = () => {
    if (!form.name.trim() || form.price <= 0) return;
    setProducts((prev) => [{ ...form, id: slugify(form.name) + "-" + Date.now(), badge: form.badge?.trim() || undefined }, ...prev]);
    setIsAdding(false);
    notify();
  };

  const startEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setIsAdding(false); };

  const handleSaveEdit = () => {
    if (!editing) return;
    setProducts((prev) => prev.map((p) =>
      p.id === editing.id ? { ...form, id: editing.id, badge: form.badge?.trim() || undefined } : p
    ));
    setEditing(null);
    notify();
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    if (editing?.id === id) setEditing(null);
    notify();
  };

  const toggleHidden = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, hidden: !p.hidden } : p));
    notify();
  };

  // ── Reviews actions ──
  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setReviewDeleteConfirm(null);
    notify();
  };

  function handleLogin() {
    const lockout = getLockout();

    // Délai en cours
    if (Date.now() < lockout.until) {
      const secs = Math.ceil((lockout.until - Date.now()) / 1000);
      setPwError(`Trop de tentatives. Réessayez dans ${secs}s.`);
      setLockoutLeft(secs);
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockout.until - Date.now()) / 1000);
        if (remaining <= 0) { clearInterval(interval); setLockoutLeft(0); setPwError(""); }
        else setLockoutLeft(remaining);
      }, 1000);
      return;
    }

    if (pw === getPassword()) {
      setUnlocked(true);
      setPwError("");
      clearLockout();
    } else {
      const newCount = lockout.count + 1;
      setLockout(newCount);

      if (newCount < MAX_ATTEMPTS) {
        // Avant 3 tentatives : juste un message
        const remaining = MAX_ATTEMPTS - newCount;
        setPwError(`Mot de passe incorrect. Il vous reste ${remaining} essai${remaining > 1 ? "s" : ""}.`);
      } else {
        // À partir de la 3ème tentative : délai progressif
        const delayStage = newCount - MAX_ATTEMPTS + 1;
        const wait = LOCKOUT_SECONDS * delayStage;
        setPwError(`Mot de passe incorrect. Prochain essai dans ${wait}s.`);
      }
    }
  }

  function handleChangePassword() {
    if (oldPw !== getPassword()) {
      setPwChangeMsg({ type: "err", text: "Ancien mot de passe incorrect." });
      return;
    }
    if (newPw.length < 8) {
      setPwChangeMsg({ type: "err", text: "Le nouveau mot de passe doit faire au moins 8 caractères." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwChangeMsg({ type: "err", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    localStorage.setItem(PASSWORD_KEY, newPw);
    setOldPw(""); setNewPw(""); setConfirmPw("");
    setPwChangeMsg({ type: "ok", text: "✅ Mot de passe modifié avec succès !" });
    setTimeout(() => setPwChangeMsg(null), 3000);
  }

  if (!unlocked) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-10 w-full max-w-sm text-center">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-2">ADMIN</h1>
          <p className="text-sm text-muted-foreground mb-6">Entrez le mot de passe pour accéder</p>
          <div className="relative mb-3">
            <input type={showPw ? "text" : "password"} value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              disabled={lockoutLeft > 0}
              placeholder="Mot de passe"
              className={`w-full bg-muted border rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${pwError ? "border-destructive" : "border-border"} disabled:opacity-50`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {pwError && <p className="text-xs text-destructive mb-3">{pwError}</p>}
          {lockoutLeft > 0 && (
            <p className="text-xs text-muted-foreground mb-3">
              ⏳ Réessayez dans <span className="text-primary font-bold">{lockoutLeft}s</span>
            </p>
          )}
          <button onClick={handleLogin} disabled={lockoutLeft > 0}
            className="w-full py-3 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Accéder
          </button>
        </div>
      </main>
    );
  }

  // ── Main ──
  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <style>{`
        .label{display:block;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:hsl(var(--muted-foreground));margin-bottom:.4rem}
        .field{width:100%;background:hsl(var(--muted));border:1px solid hsl(var(--border));border-radius:.5rem;padding:.625rem 1rem;font-size:.875rem;color:hsl(var(--foreground));outline:none}
        .field:focus{box-shadow:0 0 0 2px hsl(var(--primary)/.5)}
      `}</style>

      <div className="bg-card court-lines border-b border-border">
        <div className="container py-10 md:py-14">
          <p className="text-primary font-display tracking-[0.3em] uppercase text-xs mb-2">Gestion</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">ADMIN</h1>
          <p className="text-muted-foreground">Gérez vos produits et avis</p>
        </div>
      </div>

      <div className="container py-10">
        {saved && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg text-primary font-display tracking-wider text-sm text-center">
            ✅ Modifications sauvegardées !
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-5 py-3 font-display text-sm tracking-widest uppercase transition-all border-b-2 -mb-px ${tab === "products" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Package className="w-4 h-4" /> Produits ({products.length})
          </button>
          <button onClick={() => setTab("reviews")}
            className={`flex items-center gap-2 px-5 py-3 font-display text-sm tracking-widest uppercase transition-all border-b-2 -mb-px ${tab === "reviews" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <MessageSquare className="w-4 h-4" /> Avis ({reviews.length})
          </button>
          <button onClick={() => setTab("security")}
            className={`flex items-center gap-2 px-5 py-3 font-display text-sm tracking-widest uppercase transition-all border-b-2 -mb-px ${tab === "security" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <KeyRound className="w-4 h-4" /> Sécurité
          </button>
        </div>

        {/* ── TAB PRODUITS ── */}
        {tab === "products" && (
          <>
            <div className="flex justify-end mb-6">
              <button onClick={startAdd}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary hover:scale-105 transition-all">
                <Plus className="w-4 h-4" /> Ajouter un produit
              </button>
            </div>

            {isAdding && (
              <ProductForm title="NOUVEAU PRODUIT" form={form} onChange={setForm}
                onSave={handleAdd} onCancel={() => setIsAdding(false)} />
            )}
            {editing && (
              <ProductForm title={`MODIFIER — ${editing.name.toUpperCase()}`} form={form} onChange={setForm}
                onSave={handleSaveEdit} onCancel={() => setEditing(null)} />
            )}

            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className={`bg-card border rounded-xl overflow-hidden transition-opacity ${p.hidden ? "opacity-50 border-border/50" : "border-border"}`}>
                  <div className="flex items-center gap-4 p-4">
                    <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-display font-semibold ${p.hidden ? "line-through text-muted-foreground" : ""}`}>{p.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground capitalize">{p.category}</span>
                        {p.hidden && <span className="text-xs px-2 py-0.5 bg-muted border border-border rounded-full text-muted-foreground">Masqué</span>}
                        {p.isBestseller && <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">Bestseller</span>}
                        {p.isNew && <span className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary rounded-full">Nouveau</span>}
                        {p.badge && <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold rounded-full">{p.badge}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        <span className="font-bold text-foreground">{p.price} Dhs</span>
                        <span className="mx-2">·</span>{p.sizes.length} tailles · {p.colors.length} couleurs
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Masquer/Afficher */}
                      <button onClick={() => toggleHidden(p.id)}
                        title={p.hidden ? "Afficher le produit" : "Masquer le produit"}
                        className={`p-2 bg-muted rounded-lg transition-colors ${p.hidden ? "text-primary" : "hover:text-primary text-muted-foreground"}`}>
                        {p.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      {/* Modifier */}
                      <button onClick={() => startEdit(p)} className="p-2 bg-muted rounded-lg hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Supprimer */}
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-destructive font-display">Confirmer ?</span>
                          <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-destructive text-white text-xs font-display rounded-lg">Oui</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-muted text-xs font-display rounded-lg">Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-2 bg-muted rounded-lg hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedId === p.id && (
                    <div className="px-4 pb-4 border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground font-display tracking-widest uppercase mb-1">Description</p>
                        <p className="text-muted-foreground">{p.description || "—"}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-display tracking-widest uppercase mb-1">Tailles</p>
                          <div className="flex flex-wrap gap-1">{p.sizes.map((s) => <span key={s} className="px-2 py-0.5 bg-muted rounded text-xs">{s}</span>)}</div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-display tracking-widest uppercase mb-1">Couleurs</p>
                          <div className="flex flex-wrap gap-1">{p.colors.map((c) => <span key={c} className="px-2 py-0.5 bg-muted rounded text-xs">{c}</span>)}</div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-display tracking-widest uppercase mb-1">ID produit</p>
                          <code className="text-xs text-primary">{p.id}</code>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── TAB AVIS ── */}
        {tab === "reviews" && (
          <div className="space-y-3">
            {reviews.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">Aucun avis pour l'instant.</div>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-display font-semibold text-sm">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} className={`w-3 h-3 ${n <= r.rating ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-primary font-display tracking-widest uppercase mb-1">{r.productId}</p>
                  <p className="text-sm text-muted-foreground">"{r.text}"</p>
                </div>
                <div className="shrink-0">
                  {reviewDeleteConfirm === r.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-destructive font-display">Supprimer ?</span>
                      <button onClick={() => handleDeleteReview(r.id)} className="px-3 py-1.5 bg-destructive text-white text-xs font-display rounded-lg">Oui</button>
                      <button onClick={() => setReviewDeleteConfirm(null)} className="px-3 py-1.5 bg-muted text-xs font-display rounded-lg">Non</button>
                    </div>
                  ) : (
                    <button onClick={() => setReviewDeleteConfirm(r.id)} className="p-2 bg-muted rounded-lg hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* ── TAB SÉCURITÉ ── */}
        {tab === "security" && (
          <div className="max-w-md">
            <h2 className="font-display text-xl font-bold tracking-wider mb-6">CHANGER LE MOT DE PASSE</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="label">Ancien mot de passe</label>
                <div className="relative">
                  <input type={showOldPw ? "text" : "password"} value={oldPw} onChange={(e) => setOldPw(e.target.value)}
                    placeholder="••••••••" className="field pr-11" />
                  <button type="button" onClick={() => setShowOldPw(!showOldPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Nouveau mot de passe <span className="text-muted-foreground">(min. 8 caractères)</span></label>
                <div className="relative">
                  <input type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)}
                    placeholder="••••••••" className="field pr-11" />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <input type={showConfirmPw ? "text" : "password"} value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                    placeholder="••••••••" className="field pr-11" />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {pwChangeMsg && (
                <p className={`text-sm px-4 py-3 rounded-lg border ${
                  pwChangeMsg.type === "ok"
                    ? "text-primary bg-primary/10 border-primary/30"
                    : "text-destructive bg-destructive/10 border-destructive/30"
                }`}>
                  {pwChangeMsg.text}
                </p>
              )}

              <button onClick={handleChangePassword}
                className="w-full py-3 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary transition-all">
                Modifier le mot de passe
              </button>
            </div>

            <div className="mt-6 bg-muted border border-border rounded-xl p-4 text-sm text-muted-foreground space-y-1">
              <p className="font-display text-xs tracking-widest uppercase text-foreground mb-2">Règles de sécurité</p>
              <p>✅ Minimum 8 caractères</p>
              <p>✅ Bloqué après 3 tentatives échouées</p>
              <p>✅ Délai progressif entre les tentatives</p>
              <p>✅ Mot de passe stocké localement dans le navigateur</p>
            </div>

            <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
              <p className="font-display text-xs tracking-widest uppercase text-destructive mb-2">Zone danger</p>
              <p className="text-xs text-muted-foreground mb-3">Débloquer l'accès admin (après 3 tentatives échouées)</p>
              <button onClick={() => { clearLockout(); notify(); }}
                className="px-4 py-2 bg-destructive text-white text-xs font-display tracking-widest uppercase rounded-lg hover:opacity-90 transition-all">
                Débloquer l'accès
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
