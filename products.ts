export interface Product {
  id: string;
  name: string;
  category: "shoes" | "socks" | "bracelets";
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: "court-fury-red",
    name: "Court Fury X",
    category: "shoes",
    subcategory: "Performance",
    price: 179.99,
    originalPrice: 219.99,
    image: "product-shoes-1",
    sizes: ["7", "8", "9", "10", "11", "12", "13"],
    colors: ["Red/Black", "White/Red"],
    description: "Engineered for explosive plays. The Court Fury X features reactive cushioning, a locked-in fit, and multidirectional traction for dominant court performance.",
    rating: 4.8,
    reviews: 342,
    badge: "SALE",
    isBestseller: true,
  },
  {
    id: "air-strike-blue",
    name: "Air Strike Pro",
    category: "shoes",
    subcategory: "Performance",
    price: 199.99,
    image: "product-shoes-2",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Electric Blue", "Blue/White"],
    description: "Take flight with Air Strike Pro. Ultra-responsive foam, breathable mesh upper, and ankle support designed for guards who need speed and agility.",
    rating: 4.9,
    reviews: 218,
    isNew: true,
  },
  {
    id: "dynasty-gold",
    name: "Dynasty Elite",
    category: "shoes",
    subcategory: "Lifestyle",
    price: 229.99,
    image: "product-shoes-3",
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["Black/Gold", "All Black"],
    description: "From the court to the streets. Premium leather upper with gold accents, built for those who dominate everywhere they go.",
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
  },
  {
    id: "elite-grip-socks",
    name: "Elite Grip Pro",
    category: "socks",
    subcategory: "Elite Grip",
    price: 24.99,
    image: "product-socks-1",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black/Red", "Black/White"],
    description: "Non-slip grip technology keeps you planted on the court. Compression arch support and moisture-wicking fabric for peak performance.",
    rating: 4.6,
    reviews: 487,
    isBestseller: true,
  },
  {
    id: "compression-pro-socks",
    name: "Compression Pro",
    category: "socks",
    subcategory: "Compression",
    price: 29.99,
    image: "product-socks-2",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White/Blue", "White/Red", "Black"],
    description: "Medical-grade compression meets athletic design. Enhanced blood flow, reduced fatigue, and all-day comfort for serious athletes.",
    rating: 4.5,
    reviews: 312,
    isNew: true,
  },
  {
    id: "team-spirit-bracelet",
    name: "Team Spirit Pack",
    category: "bracelets",
    subcategory: "Team Colors",
    price: 14.99,
    image: "product-bracelet-1",
    sizes: ["One Size"],
    colors: ["Multi-Color", "Red/Blue/Black"],
    description: "Show your team pride with our 5-pack silicone bracelets. Durable, sweat-proof, and available in every NBA team color combination.",
    rating: 4.4,
    reviews: 623,
    isBestseller: true,
  },
  {
    id: "motivational-bracelet",
    name: "Hustle Band",
    category: "bracelets",
    subcategory: "Motivational",
    price: 9.99,
    image: "product-bracelet-2",
    sizes: ["One Size"],
    colors: ["Red/White", "Black/Gold"],
    description: "\"No Days Off\" — wear your motivation. Premium silicone with embossed motivational quotes to keep you grinding.",
    rating: 4.3,
    reviews: 891,
    badge: "POPULAR",
  },
];

export const reviews = [
  { name: "Marcus J.", rating: 5, text: "The Court Fury X changed my game. Best traction I've ever had on court.", avatar: "M" },
  { name: "Destiny W.", rating: 5, text: "These socks are incredible. The grip is real — no more sliding in my shoes!", avatar: "D" },
  { name: "Tyler R.", rating: 5, text: "Dynasty Elite is fire. I wear them everywhere. Premium quality for real.", avatar: "T" },
  { name: "Aisha K.", rating: 4, text: "Love the bracelets! Got the whole team matching. Great quality for the price.", avatar: "A" },
];
