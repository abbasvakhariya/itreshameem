import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { money, ProductArtwork, useStore } from "@/lib/store";

export default function ProductDetail() {
  const { productId } = useParams();
  const { addToCart, products } = useStore();
  const product = products.find((item) => item.id === productId);
  const [size, setSize] = useState<6 | 12>(6);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  if (!product) {
    return <section className="store-page section-pad store-missing"><div className="eyebrow"><span /> THIS SCENT ISN'T HERE</div><h1>Find another<br /><em>kind of magic.</em></h1><Link className="button button-gold" to="/products">Explore the collection <ArrowRight size={15} /></Link></section>;
  }

  const price = size === 6 ? product.price6 : product.price12;
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);

  const addAndOpenCart = () => {
    addToCart(product.id, size);
    setAdded(true);
    navigate("/cart");
  };

  return (
    <>
      <section className="store-page section-pad product-detail-page">
        <div className="store-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/products">Collection</Link><span>/</span><span>{product.name}</span></div>
        <div className="product-detail-layout">
          <div className="product-detail-art" style={{ "--bottle-tone": product.color } as React.CSSProperties}>
            <span className="product-orbit" /><span className="product-detail-number">{product.family}</span>
            <div className="product-detail-bottle"><ProductArtwork product={product} /></div>
            <span className="product-detail-caption">HAND-BLENDED IN KANNAUJ, INDIA</span>
          </div>
          <div className="product-detail-copy">
            <div className="eyebrow"><span /> {product.family}</div>
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}. {product.mood}</p>
            <div className="product-detail-price">{money(price)} <span>INR · {size} ML</span></div>
            <div className="product-detail-size-label">CHOOSE YOUR BOTTLE</div>
            <div className="product-size-options" role="group" aria-label="Bottle size">
              {[6, 12].map((option) => <button key={option} className={size === option ? "active" : ""} onClick={() => setSize(option as 6 | 12)}><span>{option} ml</span><strong>{money(option === 6 ? product.price6 : product.price12)}</strong>{size === option && <Check size={14} />}</button>)}
            </div>
            <button className="button button-gold product-detail-add" onClick={addAndOpenCart}>{added ? "Added to your bag" : "Add to bag"}<Plus size={15} /></button>
            <div className="product-detail-assurance"><ShieldCheck size={16} /> Alcohol-free · Complimentary delivery over ₹1,500</div>
            <div className="scent-notes-block"><h2>The notes</h2><div><span>TOP</span><strong>{product.top}</strong></div><div><span>HEART</span><strong>{product.heart}</strong></div><div><span>BASE</span><strong>{product.base}</strong></div></div>
            <Link className="product-back-link" to="/products"><ArrowLeft size={14} /> Back to all attars</Link>
          </div>
        </div>
      </section>
      <section className="related-products section-pad">
        <div className="section-heading"><div className="eyebrow"><span /> CONTINUE EXPLORING</div><h2>Other <em>stories.</em></h2></div>
        <div className="related-product-links">{related.map((item) => <Link key={item.id} to={`/products/${item.id}`}><span>{item.family}</span><strong>{item.name}</strong><ArrowRight size={16} /></Link>)}</div>
      </section>
    </>
  );
}