import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  family: string;
  description: string;
  top: string;
  heart: string;
  base: string;
  color: string;
  price6: number;
  price12: number;
  mood: string;
  image?: string;
};

export type CartLine = { key: string; productId: string; size: 6 | 12; quantity: number };

const initialProducts: Product[] = [
  { id: "oudh", name: "Oudh", family: "Agarwood · No. 01", description: "Deep, woody, smoky, resinous", top: "Saffron", heart: "Rosewood", base: "Aged agarwood", color: "#8a6030", price6: 850, price12: 1450, mood: "A slow-burning stillness, like the last light in a palace courtyard." },
  { id: "kasturi", name: "Kasturi", family: "Musk · No. 02", description: "Warm, animalic, sweet, sensual", top: "Cardamom", heart: "Soft musk", base: "Amber skin", color: "#a66f4c", price6: 690, price12: 1180, mood: "A quiet warmth that stays close, soft as silk against the skin." },
  { id: "mitti", name: "Mitti", family: "Petrichor · No. 03", description: "Earthy, rain on dry soil", top: "First rain", heart: "Terracotta", base: "Vetiver", color: "#9b6a4a", price6: 590, price12: 990, mood: "The first monsoon: sun-warmed earth, softened by a passing rain." },
  { id: "gulab", name: "Gulab", family: "Rose · No. 04", description: "Fresh, floral, romantic", top: "Damask rose", heart: "Red petals", base: "White woods", color: "#9c4c50", price6: 640, price12: 1080, mood: "A garden at dawn, where velvety rose petals hold the morning dew." },
  { id: "chandan", name: "Chandan", family: "Sandalwood · No. 05", description: "Creamy, soft, calming", top: "Bergamot", heart: "Mysore sandal", base: "Vanilla wood", color: "#b18a52", price6: 620, price12: 1050, mood: "A meditative hush, creamy sandalwood warmed by the afternoon sun." },
  { id: "amber", name: "Amber", family: "Resin · No. 06", description: "Sweet, resinous, cozy", top: "Golden honey", heart: "Labdanum", base: "Benzoin resin", color: "#bb7c36", price6: 650, price12: 1100, mood: "A golden glow, honeyed resin and soft embers on a winter evening." },
  { id: "jannat", name: "Jannat-ul-Firdaus", family: "Paradise · No. 07", description: "Floral, fruity, luxurious", top: "Citrus blossom", heart: "Jasmine & lily", base: "Musk woods", color: "#66805e", price6: 720, price12: 1240, mood: "An imagined garden in full bloom: luminous, layered, and abundant." },
  { id: "shamama", name: "Shamama", family: "Winter blend · No. 08", description: "Spicy, herbal, rich winter attar", top: "Clove & spice", heart: "Herbal bouquet", base: "Warm woods", color: "#8e533d", price6: 780, price12: 1320, mood: "A fireside blend of warming spice, dried herbs and treasured woods." },
];

const cartStorageKey = "itra-shameem-cart";
const productStorageKey = "itra-shameem-products";
export const whatsappNumber = "919825258283";
export const products = initialProducts;

export const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function Bottle({ color, small = false }: { color: string; small?: boolean }) {
  return (
    <svg className={`bottle-svg${small ? " bottle-svg-small" : ""}`} viewBox="0 0 130 190" role="img" aria-label="Illustration of a handcrafted attar bottle">
      <defs>
        <linearGradient id={`glass-${color.replace("#", "")}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f4d99a" stopOpacity=".76" />
          <stop offset=".34" stopColor={color} stopOpacity=".95" />
          <stop offset="1" stopColor="#27170e" />
        </linearGradient>
        <linearGradient id="gold-edge" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f3dfaa" /><stop offset=".5" stopColor="#bb9453" /><stop offset="1" stopColor="#f4dba4" /></linearGradient>
      </defs>
      <ellipse cx="65" cy="177" rx="39" ry="7" fill="#000" opacity=".4" />
      <rect x="48" y="20" width="34" height="23" rx="4" fill="url(#gold-edge)" />
      <path d="M52 18V8q0-4 4-4h18q4 0 4 4v10" fill="#b18d54" stroke="#e7cd91" strokeWidth="1.4" />
      <path d="M43 42h44v17c0 4 4 7 10 13 5 5 8 12 8 20v58c0 9-7 16-16 16H41c-9 0-16-7-16-16V92c0-8 3-15 8-20 6-6 10-9 10-13z" fill={`url(#glass-${color.replace("#", "")})`} stroke="url(#gold-edge)" strokeWidth="2" />
      <path d="M36 87q29-9 58 0v44q-29 9-58 0z" fill="#21170f" opacity=".75" stroke="#c7a35f" strokeWidth="1" />
      <path d="M35 94q30-7 60 0" fill="none" stroke="#e2c681" strokeWidth=".8" opacity=".7" />
      <path d="M36 125q29 7 58 0" fill="none" stroke="#e2c681" strokeWidth=".8" opacity=".7" />
      <path d="M38 68c-8 13-7 22-7 42" fill="none" stroke="#fff4d6" strokeWidth="3" opacity=".32" strokeLinecap="round" />
      <text x="65" y="111" fill="#dfc786" fontSize="6" textAnchor="middle" letterSpacing="2">ITRA</text>
      <path d="M65 115l2 3-2 3-2-3z" fill="#d5b365" />
      <text x="65" y="128" fill="#e8d6ad" fontSize="5" textAnchor="middle" letterSpacing="1.4">SHAMEEM</text>
    </svg>
  );
}

export function ProductArtwork({ product, small = false }: { product: Product; small?: boolean }) {
  return product.image
    ? <img className={`bottle-svg product-photo${small ? " product-photo-small" : ""}`} src={product.image} alt={product.name} />
    : <Bottle color={product.color} small={small} />;
}

type StoreContextValue = {
  products: Product[];
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, size: 6 | 12) => void;
  changeQuantity: (key: string, delta: number) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function isProduct(product: unknown): product is Product {
  if (!product || typeof product !== "object") return false;
  const item = product as Partial<Product>;
  return typeof item.id === "string" && typeof item.name === "string" &&
    typeof item.family === "string" && typeof item.description === "string" &&
    typeof item.top === "string" && typeof item.heart === "string" &&
    typeof item.base === "string" && typeof item.color === "string" &&
    typeof item.price6 === "number" && Number.isFinite(item.price6) && item.price6 > 0 &&
    typeof item.price12 === "number" && Number.isFinite(item.price12) && item.price12 > 0 &&
    typeof item.mood === "string" && (item.image === undefined || typeof item.image === "string");
}

function readProducts(): Product[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(productStorageKey) ?? "null");
    if (Array.isArray(saved) && saved.length > 0 && saved.every(isProduct)) return saved;
  } catch {
    return initialProducts;
  }
  return initialProducts;
}

function readCart(availableProducts: Product[]): CartLine[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((line): line is CartLine =>
      typeof line?.key === "string" && availableProducts.some((product) => product.id === line.productId) &&
      (line.size === 6 || line.size === 12) && Number.isInteger(line.quantity) && line.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(readProducts);
  const [cart, setCart] = useState<CartLine[]>(() => readCart(products));
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = useMemo(() => cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId)!;
    return sum + (line.size === 6 ? product.price6 : product.price12) * line.quantity;
  }, 0), [cart, products]);

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(productStorageKey, JSON.stringify(products));
  }, [products]);

  const addToCart = (productId: string, size: 6 | 12) => {
    const key = `${productId}-${size}`;
    setCart((current) => {
      const match = current.find((line) => line.key === key);
      return match
        ? current.map((line) => line.key === key ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { key, productId, size, quantity: 1 }];
    });
  };

  const changeQuantity = (key: string, delta: number) => {
    setCart((current) => current.map((line) => line.key === key ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));
  };

  const saveProduct = (product: Product) => {
    setProducts((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists ? current.map((item) => item.id === product.id ? product : item) : [...current, product];
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((current) => current.filter((product) => product.id !== productId));
    setCart((current) => current.filter((line) => line.productId !== productId));
  };

  return <StoreContext.Provider value={{ products, cart, cartCount, cartTotal, addToCart, changeQuantity, saveProduct, deleteProduct }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}

export function createWhatsAppOrderUrl(cart: CartLine[], cartTotal: number, extra = "", availableProducts: Product[] = products) {
  const lines = cart.map((line) => {
    const product = availableProducts.find((item) => item.id === line.productId)!;
    const price = line.size === 6 ? product.price6 : product.price12;
    return `• ${product.name} ${line.size}ml × ${line.quantity} — ${money(price * line.quantity)}`;
  });
  const message = ["Namaste! I’d love to order from Itra Shameem.", ...lines, cart.length ? `Total: ${money(cartTotal)}` : "", extra].filter(Boolean).join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}