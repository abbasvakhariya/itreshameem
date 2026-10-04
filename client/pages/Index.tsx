import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Heart,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import { createWhatsAppOrderUrl, money, ProductArtwork, useStore, whatsappNumber } from "@/lib/store";

const reviews = [
  { quote: "Oudh feels like discovering a secret room in an old haveli. I have never worn anything quite like it.", name: "Aarav Mehta", detail: "Mumbai · Oudh, 12ml" },
  { quote: "Mitti takes me straight back to the first rain in my grandmother’s garden. Beautifully made, and so personal.", name: "Sana Qureshi", detail: "Lucknow · Mitti, 6ml" },
  { quote: "The care in the packaging, the warmth of the scent—it feels less like a purchase and more like an heirloom.", name: "Ishita Rao", detail: "Bengaluru · Gulab, 12ml" },
];

export default function Index() {
  const { products, cart, cartCount, cartTotal, addToCart: addProductToCart, changeQuantity } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScent, setActiveScent] = useState(products[0]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSizes, setMobileSizes] = useState<Record<string, 6 | 12>>({});
  const [contactSent, setContactSent] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onPointer = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onPointer);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setReviewIndex((index) => (index + 1) % reviews.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("cart-is-open", cartOpen || menuOpen);
    return () => document.body.classList.remove("cart-is-open");
  }, [cartOpen, menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCart = (productId: string, size: 6 | 12) => {
    addProductToCart(productId, size);
    setCartOpen(true);
  };

  const orderOnWhatsApp = (extra = "") => {
    window.open(createWhatsAppOrderUrl(cart, cartTotal, extra, products), "_blank", "noopener,noreferrer");
  };

  const sendContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const message = String(data.get("message") || "");
    const text = `Namaste, I’m ${name}. My phone number is ${phone}. ${message}`;
    setContactSent(true);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const changeReview = (direction: number) => setReviewIndex((index) => (index + direction + reviews.length) % reviews.length);

  return (
    <div className="attar-site">
      <div className="custom-cursor" style={{ left: cursor.x, top: cursor.y }} aria-hidden="true"><span /></div>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <button className="brand-lockup" onClick={() => scrollTo("home")} aria-label="Itra Shameem, home">
          <span className="brand-mark">I<span>·</span>S</span>
          <span className="brand-name">ITR E <em>SHAMEEM</em><small>PURE ARTISANAL FRAGRANCES</small></span>
        </button>
        <nav className={`main-nav${menuOpen ? " mobile-open" : ""}`} aria-label="Main navigation">
          <button onClick={() => scrollTo("heritage")}>Our Story</button><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link><button onClick={() => scrollTo("notes")}>Blogs</button><button onClick={() => scrollTo("contact")}>Contact Us</button>
          <Link className="mobile-nav-order" to="/cart" onClick={() => setMenuOpen(false)}>Your bag <span>{cartCount}</span></Link>
        </nav>
        <div className="header-actions">
          <span className="header-phone">CALL US <a href="tel:+919825258283">+91 98252 58283</a></span>
          <Link className="bag-button" aria-label={`View cart, ${cartCount} items`} to="/cart"><ShoppingBag size={17} strokeWidth={1.5} /><span>Bag</span><i>{cartCount}</i></Link>
          <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grain" />
          <div className="hero-content">
            <div className="eyebrow hero-eyebrow"><span /> <span /></div>
            <h1>Fragrances, that are <br /><em>Out of thisWorld </em> </h1>
            <p className="hero-copy">Providing one of the <br className="desktop-break" /> best stuffs in the market.</p>
            <button className="button button-gold" onClick={() => scrollTo("collection")}>Explore the collection <ArrowRight size={15} /></button>
            <div className="hero-footnote"><span>EST. in Rajkot. Since 2025.</span><span></span></div>
          </div>
          <div className="hero-side-note">DISTILLED WITH DEVOTION <span>✳</span> WORN FOREVER</div>
          <button className="scroll-cue" onClick={() => scrollTo("heritage")} aria-label="Scroll to our heritage"><span>SCROLL TO DISCOVER</span><ArrowDown size={13} /></button>
        </section>


        <section className="heritage section-pad" id="heritage">
          <div className="heritage-art reveal"><img src="/kalakasi-hero.png" alt="Kalakasi premium attar bottle with jasmine and oud" /></div>
          <div className="heritage-copy reveal">
            <div className="eyebrow"><span /> OUR STORY</div>
            <h2>How did<em> ITR E SHAMEEM </em> Begin?</h2>
            <p>This was all a coincidence. PURE HAPPENSTANCE. We were two strangers who met at a random place. And then we decided to become friends. And that way, </p>
            <p>This is the deg-bhapka method: a living tradition passed through generations. No alcohol. No shortcuts. Only the quiet alchemy of earth, flower, fire and time.</p>
            <div className="heritage-signoff"><span className="signoff-flower">❋</span><span>Made slowly. Meant to stay.</span></div>
          </div>
        </section>

        <section className="collection section-pad" id="collection">
          <div className="section-heading reveal"><div className="eyebrow"><span /> THE HOUSE COLLECTION</div><h2>Eight souls.<br /><em>Infinite stories.</em></h2><p>Each attar is a world distilled into a single, precious drop.</p><span className="heading-index">01 — 08</span></div>
          <div className="product-grid">
            {products.map((product, index) => {
              const size = mobileSizes[product.id] ?? 6;
              const price = size === 6 ? product.price6 : product.price12;
              return <article className="product-card reveal" key={product.id} style={{ "--card-index": index } as React.CSSProperties}>
                <div className="product-visual" style={{ "--bottle-tone": product.color } as React.CSSProperties}>
                  <span className="product-number">0{index + 1}</span><span className="product-orbit" /><div className="product-bottle"><ProductArtwork product={product} /></div>
                  <div className="product-notes"><span>TOP <b>{product.top}</b></span><span>HEART <b>{product.heart}</b></span><span>BASE <b>{product.base}</b></span></div>
                  <span className="product-family">{product.family}</span>
                </div>
                <div className="product-info"><div className="product-title-row"><h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3><span>{money(price)}</span></div><p>{product.description}</p><Link className="product-view-link" to={`/products/${product.id}`}>Discover this attar <ArrowRight size={13} /></Link>
                  <div className="product-buy-row"><div className="size-toggle" aria-label={`Choose size for ${product.name}`}><button className={size === 6 ? "active" : ""} onClick={() => setMobileSizes((current) => ({ ...current, [product.id]: 6 }))}>6 ml</button><button className={size === 12 ? "active" : ""} onClick={() => setMobileSizes((current) => ({ ...current, [product.id]: 12 }))}>12 ml</button></div><button className="add-button" onClick={() => addToCart(product.id, size)}>Add to bag <Plus size={14} /></button></div>
                </div>
              </article>;
            })}
          </div>
          <p className="collection-footnote"><Sparkles size={13} /> Every bottle is hand-filled and wrapped with care. Complimentary delivery on orders over ₹1,500.</p>
        </section>

        <section className="notes-explorer" id="notes" style={{ "--mood-color": activeScent.color } as React.CSSProperties}>
          <div className="notes-background-glow" />
          <div className="notes-inner section-pad">
            <div className="notes-intro reveal"><div className="eyebrow"><span /> FIND YOUR NOTE</div><h2>A scent is a<br /><em>place you go.</em></h2><p>Choose an attar. Let it take you somewhere.</p></div>
            <div className="notes-panel reveal">
              <div className="notes-list" role="tablist" aria-label="Explore attar moods">{products.map((product, index) => <button key={product.id} className={activeScent.id === product.id ? "active" : ""} onMouseEnter={() => setActiveScent(product)} onFocus={() => setActiveScent(product)} onClick={() => setActiveScent(product)} role="tab" aria-selected={activeScent.id === product.id}><span>{String(index + 1).padStart(2, "0")}</span>{product.name}<ArrowRight size={13} /></button>)}</div>
              <div className="notes-description" key={activeScent.id}><div className="notes-seal"><Flower2 size={25} strokeWidth={1} /></div><span className="eyebrow">{activeScent.family}</span><h3>{activeScent.name}</h3><p>{activeScent.mood}</p><div className="note-chips"><span>{activeScent.top}</span><i>·</i><span>{activeScent.heart}</span><i>·</i><span>{activeScent.base}</span></div><button className="text-link" onClick={() => { setMobileSizes((current) => ({ ...current, [activeScent.id]: 6 })); scrollTo("collection"); }}>Discover this attar <ArrowRight size={14} /></button></div>
            </div>
          </div>
        </section>

        <section className="promise section-pad">
          <div className="section-heading reveal"><div className="eyebrow"><span /> THE ITRA SHAMEEM PROMISE</div><h2>Nothing added.<br /><em>Nothing taken away.</em></h2></div>
          <div className="promise-grid">
            {[
              { icon: <ShieldCheck />, title: "Alcohol-free", copy: "Pure perfume oil, close to the skin and true to its nature." },
              { icon: <Heart />, title: "Made to linger", copy: "Concentrated attar that deepens beautifully as the hours pass." },
              { icon: <Sprout />, title: "Nature, gathered", copy: "Botanicals and resins chosen for their character, not convenience." },
              { icon: <Flower2 />, title: "Crafted by hand", copy: "Small-batch distillation guided by generations of quiet knowledge." },
            ].map((item, index) => <div className="promise-card reveal" key={item.title} style={{ "--card-index": index } as React.CSSProperties}><span className="promise-icon">{item.icon}</span><span className="promise-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></div>)}
          </div>
        </section>

        <section className="testimonials section-pad">
          <div className="testimonial-decor" aria-hidden="true">❋</div><div className="testimonial-inner reveal"><div className="eyebrow"><span /> WORDS THAT LINGER</div><div className="quote-mark">“</div><div className="review-frame" key={reviewIndex}><blockquote>{reviews[reviewIndex].quote}</blockquote><div className="review-by"><span>{reviews[reviewIndex].name}</span><i>—</i>{reviews[reviewIndex].detail}</div></div><div className="review-controls"><button onClick={() => changeReview(-1)} aria-label="Previous testimonial"><ChevronLeft size={17} /></button><div>{reviews.map((review, index) => <button key={review.name} className={index === reviewIndex ? "active" : ""} onClick={() => setReviewIndex(index)} aria-label={`Show testimonial ${index + 1}`} />)}</div><button onClick={() => changeReview(1)} aria-label="Next testimonial"><ChevronRight size={17} /></button></div></div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="contact-copy reveal"><div className="eyebrow"><span /> A PERSONAL NOTE</div><h2>Let us help you<br />find <em>your scent.</em></h2><p>Choosing a fragrance is an intimate thing. Tell us what you love, and we’ll guide you to the right attar.</p><div className="contact-details"><a href="tel:+919825258283">+91 98252 58283 <ArrowRight size={13} /></a><span>MON–SAT · 10:00 AM — 7:00 PM IST</span></div><a className="instagram-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">Follow our journey on Instagram <ArrowRight size={13} /></a></div>
          <form className="contact-form reveal" onSubmit={sendContact}><label>Your name<input name="name" placeholder="How shall we address you?" required /></label><label>Phone number<input type="tel" name="phone" placeholder="+91 00000 00000" required /></label><label>A note for us<textarea name="message" placeholder="Tell us what you’re looking for…" rows={3} required /></label><button className="button button-gold" type="submit">{contactSent ? <>Message ready <Check size={15} /></> : <>Begin a conversation <ArrowRight size={15} /></>}</button><span className="form-note">Your message opens in WhatsApp. We’ll be in touch personally.</span></form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main"><button className="brand-lockup footer-brand" onClick={() => scrollTo("home")}><span className="brand-mark">I<span>·</span>S</span><span className="brand-name">ITRA <em>SHAMEEM</em><small>THE ART OF ATTAR</small></span></button><p>Essence of heritage, bottled.<br />Made slowly in Kannauj, India.</p><div className="footer-links"><span className="eyebrow">EXPLORE</span>{[["heritage", "Our heritage"], ["collection", "The collection"], ["notes", "Find your note"], ["contact", "Get in touch"]].map(([id, label]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</div><div className="footer-connect"><span className="eyebrow">SAY NAMASTE</span><a href="tel:+919825258283">+91 98252 58283</a><button onClick={() => orderOnWhatsApp("Please tell me more about your attars.")}>WhatsApp us <ArrowRight size={13} /></button><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <ArrowRight size={13} /></a></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} ITRA SHAMEEM · ALL RIGHTS RESERVED</span><span>CRAFTED WITH PATIENCE IN KANNAUJ, INDIA <i>✳</i></span></div>
      </footer>

      <div className={`drawer-scrim${cartOpen ? " visible" : ""}`} onClick={() => setCartOpen(false)} aria-hidden="true" />
      <aside className={`cart-drawer${cartOpen ? " open" : ""}`} aria-label="Shopping bag" aria-modal="true" role="dialog" aria-hidden={!cartOpen}>
        <div className="drawer-header"><div><span className="eyebrow">YOUR SELECTION</span><h2>The attar bag <i>({cartCount})</i></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={20} /></button></div>
        {cart.length ? <><div className="drawer-items">{cart.map((line) => {
          const product = products.find((item) => item.id === line.productId)!;
          const price = line.size === 6 ? product.price6 : product.price12;
          return <div className="drawer-item" key={line.key}><div className="drawer-bottle"><ProductArtwork product={product} small /></div><div className="drawer-item-info"><h3>{product.name}</h3><span>{line.size} ml · {money(price)} each</span><div className="quantity-control"><button onClick={() => changeQuantity(line.key, -1)} aria-label={`Remove one ${product.name}`}><Minus size={12} /></button><span>{line.quantity}</span><button onClick={() => changeQuantity(line.key, 1)} aria-label={`Add one ${product.name}`}><Plus size={12} /></button></div></div><strong>{money(price * line.quantity)}</strong></div>;
        })}</div><div className="drawer-bottom"><div className="drawer-total"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><p>Complimentary delivery on orders over ₹1,500.</p><button className="button button-gold drawer-checkout" onClick={() => orderOnWhatsApp()}>Order on WhatsApp <ArrowRight size={15} /></button><button className="continue-shopping" onClick={() => setCartOpen(false)}>Continue exploring</button></div></> : <div className="empty-bag"><div className="empty-bag-mark">✳</div><h3>Your bag is waiting.</h3><p>Find a scent that feels like yours.</p><button className="button button-gold" onClick={() => { setCartOpen(false); scrollTo("collection"); }}>Explore the collection <ArrowRight size={15} /></button></div>}
      </aside>
    </div>
  );
}
