import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductImage } from "@/lib/productImages";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_4kmicfi";
const EMAILJS_TEMPLATE_ID = "template_20y9km9";
const EMAILJS_PUBLIC_KEY  = "7EueG0aNGVZua4o4P";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "cart" | "form" | "success";

interface OrderForm {
  name: string;
  phone: string;
  address: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => { setStep("cart"); setError(""); }, 400);
  };

  const handleOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError("");

    const orderDetails = items
      .map((i) => `• ${i.product.name} — Taille: ${i.size} × ${i.quantity}  →  ${(i.product.price * i.quantity).toFixed(2)} Dhs`)
      .join("\n");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:     form.name,
          from_email:    "commande@ballbox.ma",
          phone:         form.phone,
          address:       form.address,
          order_details: orderDetails,
          total:         `${cartTotal.toFixed(2)} Dhs`,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStep("success");
      clearCart();
      setForm({ name: "", phone: "", address: "" });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-bold tracking-wider">
            {step === "cart"    && "YOUR CART"}
            {step === "form"    && "COMMANDER"}
            {step === "success" && "COMMANDE ENVOYÉE"}
          </h2>
          <button onClick={handleClose} className="p-2 hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STEP: cart ── */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Votre panier est vide</p>
                  <p className="text-sm text-muted-foreground mt-2">Ajoutez des articles pour commencer !</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-4 bg-muted rounded-lg p-3">
                    <img
                      src={getProductImage(item.product.image)}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">Taille : {item.size}</p>
                      <p className="font-display font-bold mt-1">{item.product.price} Dhs</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1 bg-background rounded hover:text-primary transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1 bg-background rounded hover:text-primary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.product.id, item.size)}
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-bold">{cartTotal.toFixed(2)} Dhs</span>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className="w-full py-4 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-[1.02]">
                  Commander →
                </button>
                <p className="text-center text-xs text-muted-foreground">Livraison gratuite pour les commandes de plus de $100</p>
              </div>
            )}
          </>
        )}

        {/* ── STEP: form ── */}
        {step === "form" && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Récap commande */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-xs font-display tracking-widest uppercase text-muted-foreground mb-3">Récapitulatif</p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.product.name} × {item.quantity} <span className="text-xs">(T.{item.size})</span></span>
                      <span className="font-bold">{(item.product.price * item.quantity).toFixed(2)} Dhs</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-3 pt-3 flex justify-between font-display font-bold">
                  <span>Total</span>
                  <span className="text-primary">{cartTotal.toFixed(2)} Dhs</span>
                </div>
              </div>

              {/* Formulaire */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Nom complet *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex : Ahmed Benali"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Ex : +212 6 00 00 00 00"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Adresse postale *</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Ex : 12 Rue Mohammed V, El Jadida 24000"
                    rows={3}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border space-y-3">
              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg transition-all hover:glow-primary hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                ) : (
                  "Confirmer la commande"
                )}
              </button>
              <button
                onClick={() => { setStep("cart"); setError(""); }}
                className="w-full py-3 border border-border text-muted-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:text-foreground transition-all text-sm">
                ← Retour au panier
              </button>
            </div>
          </>
        )}

        {/* ── STEP: success ── */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="w-16 h-16 text-primary mb-6" />
            <h3 className="font-display text-2xl font-bold tracking-wider mb-3">MERCI !</h3>
            <p className="text-muted-foreground mb-2">
              Votre commande a bien été envoyée.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Nous vous contacterons très bientôt au <span className="text-primary font-bold">{form.phone || "numéro fourni"}</span> pour confirmer votre commande.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold tracking-widest uppercase rounded-lg hover:glow-primary transition-all">
              Fermer
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartSidebar;
