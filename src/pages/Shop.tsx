import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { defaultProducts } from "@/data/products";

const PRODUCTS_KEY = "hoopzone_products";

function loadVisibleProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const all = raw ? JSON.parse(raw) : defaultProducts;
    return all.filter((p: any) => !p.hidden);
  } catch { return defaultProducts.filter((p: any) => !p.hidden); }
}

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>("popular");
  const [search, setSearch] = useState("");

  const categoryParam = searchParams.get("cat") || "all";

  const categories = [
    { value: "all",       label: "Tous" },
    { value: "shoes",     label: "Chaussures" },
    { value: "socks",     label: "Chaussettes" },
    { value: "bracelets", label: "Bracelets" },
  ];

  const filtered = useMemo(() => {
    const products = loadVisibleProducts();
    let result = categoryParam === "all" ? [...products] : products.filter((p: any) => p.category === categoryParam);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p: any) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":  result.sort((a: any, b: any) => a.price - b.price); break;
      case "price-desc": result.sort((a: any, b: any) => b.price - a.price); break;
      case "newest":     result.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default:           result.sort((a: any, b: any) => b.reviews - a.reviews);
    }
    return result;
  }, [categoryParam, sort, search]);

  return (
    <main className="pt-20 md:pt-24 min-h-screen">
      <div className="bg-card court-lines border-b border-border">
        <div className="container py-10 md:py-16">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2">SHOP</h1>
          <p className="text-muted-foreground">Équipement basketball premium pour chaque joueur</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-muted border border-border rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat.value}
                onClick={() => {
                  if (cat.value === "all") searchParams.delete("cat");
                  else searchParams.set("cat", cat.value);
                  setSearchParams(searchParams);
                }}
                className={`px-4 py-2 rounded-full text-sm font-display tracking-wider uppercase transition-all ${
                  categoryParam === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="popular">Plus populaires</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="newest">Nouveautés</option>
          </select>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""}
          {search && <span> pour "<span className="text-primary">{search}</span>"</span>}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p: any, i: number) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">Aucun produit trouvé</p>
            {search && (
              <button onClick={() => setSearch("")}
                className="text-primary text-sm hover:underline">
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;
