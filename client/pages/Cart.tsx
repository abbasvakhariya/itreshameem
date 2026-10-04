import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createWhatsAppOrderUrl, money, ProductArtwork, useStore } from "@/lib/store";

export default function Cart() {
  const { cart, cartCount, cartTotal, changeQuantity, products } = useStore();
  const shippingRemaining = Math.max(0, 1500 - cartTotal);

  return (
    <section className="store-page section-pad cart-page">
      <div className="store-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Your bag</span></div>
      <div className="cart-page-heading"><div><div className="eyebrow"><span /> YOUR SELECTION</div><h1>Your attar <em>bag.</em></h1></div><span>{cartCount} {cartCount === 1 ? "item" : "items"}</span></div>
      {cart.length ? (
        <div className="cart-page-layout">
          <div className="cart-page-items">
            {cart.map((line) => {
              const product = products.find((item) => item.id === line.productId)!;
              const unitPrice = line.size === 6 ? product.price6 : product.price12;
              return (
                <article className="cart-page-item" key={line.key}>
                  <Link className="cart-page-bottle" to={`/products/${product.id}`}><ProductArtwork product={product} small /></Link>
                  <div className="cart-page-item-details"><Link to={`/products/${product.id}`}><h2>{product.name}</h2></Link><span>{product.family}</span><span>{line.size} ml · {money(unitPrice)} each</span>
                    <div className="quantity-control"><button onClick={() => changeQuantity(line.key, -1)} aria-label={line.quantity === 1 ? `Remove ${product.name}` : `Remove one ${product.name}`}>{line.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}</button><span>{line.quantity}</span><button onClick={() => changeQuantity(line.key, 1)} aria-label={`Add one ${product.name}`}><Plus size={12} /></button></div>
                  </div>
                  <strong className="cart-page-line-total">{money(unitPrice * line.quantity)}</strong>
                </article>
              );
            })}
            <Link className="product-back-link" to="/products"><ArrowLeft size={14} /> Continue shopping</Link>
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div>
            <div className="cart-summary-row"><span>Delivery</span><strong>{shippingRemaining ? "Calculated on WhatsApp" : "Complimentary"}</strong></div>
            <p>{shippingRemaining ? `Add ${money(shippingRemaining)} more for complimentary delivery.` : "Your order qualifies for complimentary delivery."}</p>
            <div className="cart-summary-total"><span>Total</span><strong>{money(cartTotal)}</strong></div>
            <button className="button button-gold cart-checkout" onClick={() => window.open(createWhatsAppOrderUrl(cart, cartTotal, "", products), "_blank", "noopener,noreferrer")}>Order on WhatsApp <ArrowRight size={15} /></button>
            <span className="cart-summary-note"><ShoppingBag size={13} /> Hand-packed with care in Kannauj</span>
          </aside>
        </div>
      ) : (
        <div className="cart-empty"><div className="empty-bag-mark">✳</div><h2>Your bag is waiting.</h2><p>Find a scent that feels like yours.</p><Link className="button button-gold" to="/products">Explore the collection <ArrowRight size={15} /></Link></div>
      )}
    </section>
  );
}