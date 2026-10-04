import { useState } from "react";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { money, ProductArtwork, useStore } from "@/lib/store";

export default function Products() {
  const [sizes, setSizes] = useState<Record<string, 6 | 12>>({});
  const { addToCart, products } = useStore();

  return (
    <section className="store-page section-pad store-products">
      <div className="store-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Collection</span></div>
      <div className="section-heading">
        <div className="eyebrow"><span /> THE HOUSE COLLECTION</div>
        <h1>Eight souls.<br /><em>Infinite stories.</em></h1>
        <p>Each attar is a world distilled into a single, precious drop.</p>
      </div>
      <div className="product-grid">
        {products.map((product, index) => {
          const size = sizes[product.id] ?? 6;
          const price = size === 6 ? product.price6 : product.price12;
          return (
            <article className="product-card" key={product.id} style={{ "--card-index": index } as React.CSSProperties}>
              <Link className="product-visual" to={`/products/${product.id}`} style={{ "--bottle-tone": product.color } as React.CSSProperties} aria-label={`View ${product.name}`}>
                <span className="product-number">0{index + 1}</span><span className="product-orbit" />
                <div className="product-bottle"><ProductArtwork product={product} /></div>
                <div className="product-notes"><span>TOP <b>{product.top}</b></span><span>HEART <b>{product.heart}</b></span><span>BASE <b>{product.base}</b></span></div>
                <span className="product-family">{product.family}</span>
              </Link>
              <div className="product-info">
                <div className="product-title-row"><h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2><span>{money(price)}</span></div>
                <p>{product.description}</p>
                <div className="product-buy-row">
                  <div className="size-toggle" aria-label={`Choose size for ${product.name}`}>
                    <button className={size === 6 ? "active" : ""} onClick={() => setSizes((current) => ({ ...current, [product.id]: 6 }))}>6 ml</button>
                    <button className={size === 12 ? "active" : ""} onClick={() => setSizes((current) => ({ ...current, [product.id]: 12 }))}>12 ml</button>
                  </div>
                  <button className="add-button" onClick={() => addToCart(product.id, size)}>Add to bag <Plus size={14} /></button>
                </div>
                <Link className="product-view-link" to={`/products/${product.id}`}>Discover this attar <ArrowRight size={13} /></Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="collection-footnote"><Sparkles size={13} /> Every bottle is hand-filled and wrapped with care. Complimentary delivery on orders over ₹1,500.</p>
    </section>
  );
}