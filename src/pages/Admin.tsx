import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, Save, ShieldAlert, Package, ChevronDown, ChevronUp } from "lucide-react";
import { products as defaultProducts } from "@/data/products";
import { getAllImageKeys } from "@/lib/productImages";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: "shoes" | "socks" | "bracelets";
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

type FormData = Omit<Product, "id">;

// ─── Storage ──────────────────────────────────────────────────────────────────

const PRODUCTS_KEY = "hoopzone_products";
const ADMIN_PASSWORD = "admin123";

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : defaultProducts;
  } catch { return defaultProducts; }
}

function saveProducts(p: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p));
}

const blank: FormData = {
  name: "", category: "shoes", subcategory: "", price: 0,
  image: "", sizes: [], colors: [],
  description: "", rating: 4.5, reviews: 0, badge: "",
  isBestseller: false, isNew: false,
};

// ─── ProductForm  (OUTSIDE Admin — fixes the focus-loss bug) ─────────────────

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
        {/* Nom */}
        <div>
          <label className="label">Nom du produit *</label>
          <input value={form.name} onChange={(e) => set({ name: e.target.value })}
            placeholder="Court Fury X" className="field" />
        </div>
        {/* Catégorie */}
        <div>
          <label className="label">Catégorie *</label>
          <select value={form.category} onChange={(e) => set({ category: e.target.value as Product["category"] })} className="field">
            <option value="shoes">Shoes</option>
            <option value="socks">Socks</option>
            <option value="bracelets">Bracelets</option>
          </select>
        </div>
        {/* Sous-catégorie */}
        <div>
          <label className="label">Sous-catégorie</label>
          <input value={form.subcategory} onChange={(e) => set({ subcategory: e.target.value })}
            placeholder="Performance" className="field" />
        </div>
        {/* Prix */}
        <div>
          <label className="label">Prix (Dhs) *</label>
          <input type="number" min="0" step="0.01" value={form.price}
            onChange={(e) => set({ price: parseFloat(e.target.value) || 0 })} className="field" />
        </div>
        {/* Image */}
        <div>
          <label className="label">Image <span className="text-muted-foreground">(dépose le fichier dans src/assets/products/categorie/)</span></label>
          <select value={form.image} onChange={(e) => set({ image: e.target.value })} className="field">
            <option value="">-- Choisir une image --</option>
            {imageKeys.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          {form.image && <p className="text-xs text-primary mt-1">✓ {form.image}</p>}
        </div>
        {/* Tailles */}
        <div>
          <label className="label">Tailles <span className="text-muted-foreground">(séparées par virgules)</span></label>
          <input value={form.sizes.join(", ")} onChange={(e) => setArray("sizes", e.target.value)}
            placeholder="7, 8, 9, 10, 11" className="field" />
        </div>
        {/* Couleurs */}
        <div>
          <label className="label">Couleurs <span className="text-muted-foreground">(séparées par virgules)</span></label>
          <input value={form.colors.join(", ")} onChange={(e) => setArray("colors", e.target.value)}
            placeholder="Red/Black, White/Red" className="field" />
        </div>
        {/* Badge */}
        <div>
          <label className="label">Badge <span className="text-muted-foreground">(ex: SALE, NEW, POPULAR)</span></label>
          <input value={form.badge ?? ""} onChange={(e) => set({ badge: e.target.value })}
            placeholder="SALE" className="field" />
        </div>
        {/* Checkboxes */}
        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.isBestseller}
              onChange={(e) => set({ isBestseller: e.target.checked })}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-display tracking-wider">Bestseller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.isNew}
              onChange={(e) => set({ isNew: e.target.checked })}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-display tracking-wider">Nouveau</span>
          </label>
        </div>
      </div>

      {/* Description */}
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

// ─── Admin page ───────────────────────────────────────────────────────────────

const Admin = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<FormData>(blank);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { saveProducts(products); }, [products]);

  const notify = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const slugify = (n: string) => n.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const startAdd = () => { setForm(blank); setEditing(null); setIsAdding(true); };

  const handleAdd = () => {
    if (!form.name.trim() || form.price <= 0) return;
    setProducts((prev) => [{
      ...form, id: slugify(form.name) + "-" + Date.now(),
      badge: form.badge?.trim() || undefined,
      originalPrice: form.originalPrice || undefined,
    }, ...prev]);
    setIsAdding(false);
    notify();
  };

  const startEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setIsAdding(false); };

  const handleSaveEdit = () => {
    if (!editing) return;
    setProducts((prev) => prev.map((p) =>
      p.id === editing.id
        ? { ...form, id: editing.id, badge: form.badge?.trim() || undefined, originalPrice: form.originalPrice || undefined }
        : p
    ));
    setEditing(null);
    notify();
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    if (editing?.id === id) setEditing(null);
  };

  const handleReset = () => { setProducts(defaultProducts); setEditing(null); setIsAdding(false); notify(); };

  // ── Auth screen ──
  if (!unlocked) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-10 w-full max-w-sm text-center">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-2">ADMIN</h1>
          <p className="text-sm text-muted-foreground mb-6">Entrez le mot de passe pour accéder</p>
          <input type="password" value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Mot de passe"
            className={`w-full bg-muted border rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary ${pwError ? "border-destructive" : "border-border"}`}
          />
          {pwError && <p className="text-xs text-destructive mb-3">Mot de passe incorrect</p>}
          <button onClick={handleLogin}
            className="w-full py-3 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary transition-all">
            Accéder
          </button>
          <p className="text-xs text-muted-foreground mt-4">Mot de passe par défaut : <span className="text-primary">admin123</span></p>
        </div>
      </main>
    );
  }

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) { setUnlocked(true); setPwError(false); }
    else setPwError(true);
  }

  // ── Main page ──
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
          <p className="text-muted-foreground">Gérez vos produits facilement</p>
        </div>
      </div>

      <div className="container py-10">
        {saved && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg text-primary font-display tracking-wider text-sm text-center">
            ✅ Modifications sauvegardées !
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">{products.length} produit{products.length > 1 ? "s" : ""}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={startAdd}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary hover:scale-105 transition-all">
              <Plus className="w-4 h-4" /> Ajouter un produit
            </button>
          </div>
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
            <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-semibold">{p.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground capitalize">{p.category}</span>
                    {p.isBestseller && <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">Bestseller</span>}
                    {p.isNew && <span className="text-xs px-2 py-0.5 bg-electric/20 text-secondary rounded-full">Nouveau</span>}
                    {p.badge && <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold rounded-full">{p.badge}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <span className="font-bold text-foreground">{p.price} Dhs</span>
                    {p.originalPrice && <span className="line-through ml-2">{p.originalPrice} Dhs</span>}
                    <span className="mx-2">·</span>{p.sizes.length} tailles · {p.colors.length} couleurs
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(p)} className="p-2 bg-muted rounded-lg hover:text-primary transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
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
      </div>
    </main>
  );
};

export default Admin;
