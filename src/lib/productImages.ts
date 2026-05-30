// Vite importe automatiquement TOUS les fichiers jpg/jpeg/png/webp
// des dossiers products/shoes, products/socks, products/bracelets.
// Tu n'as plus jamais besoin de modifier ce fichier —
// il suffit de déposer une image dans le bon dossier.

const allImages = import.meta.glob<{ default: string }>(
  "@/assets/products/**/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

// Construit une map  "categorie/nom-fichier-sans-extension" → url
// Ex: "@/assets/products/shoes/court-fury-x.jpg" → "shoes/court-fury-x"
const imageMap: Record<string, string> = {};

for (const path in allImages) {
  // path ressemble à "/src/assets/products/shoes/court-fury-x.jpg"
  const match = path.match(/assets\/products\/(.+)\.(jpg|jpeg|png|webp)$/i);
  if (match) {
    const key = match[1]; // "shoes/court-fury-x"
    imageMap[key] = allImages[path].default;
  }
}

/**
 * Retourne l'URL de l'image correspondant à la clé.
 * La clé = "categorie/nom-du-fichier-sans-extension"
 * Ex: getProductImage("shoes/court-fury-x")
 *
 * Si la clé n'existe pas, retourne la première image disponible.
 */
export const getProductImage = (key: string): string => {
  if (imageMap[key]) return imageMap[key];

  // Fallback : première image trouvée
  const first = Object.values(imageMap)[0];
  return first ?? "";
};

/**
 * Liste toutes les clés d'images disponibles.
 * Utile dans la page Admin pour proposer un sélecteur d'image.
 */
export const getAllImageKeys = (): string[] => Object.keys(imageMap).sort();
