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
import { Bottle, createWhatsAppOrderUrl, money, ProductArtwork, useStore, whatsappNumber } from "@/lib/store";

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
          <span className="brand-name">ITRA <em>SHAMEEM</em><small>THE ART OF ATTAR</small></span>
        </button>
        <nav className={`main-nav${menuOpen ? " mobile-open" : ""}`} aria-label="Main navigation">
          <button onClick={() => scrollTo("heritage")}>Our heritage</button><Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link><button onClick={() => scrollTo("notes")}>Scent notes</button><button onClick={() => scrollTo("contact")}>Contact</button>
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
          <div className="hero-haze haze-one" /><div className="hero-haze haze-two" /><div className="hero-haze haze-three" />
          <div className="hero-arch" aria-hidden="true">
            <svg className="fatemi-gateway" viewBox="0 0 600 820" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gateway-wall" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d7b46c" stopOpacity=".18" /><stop offset=".48" stopColor="#c9a45c" stopOpacity=".035" /><stop offset="1" stopColor="#174d47" stopOpacity=".13" /></linearGradient>
                <linearGradient id="gateway-line" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#846839" stopOpacity=".65" /><stop offset=".5" stopColor="#e2c57f" stopOpacity=".92" /><stop offset="1" stopColor="#846839" stopOpacity=".65" /></linearGradient>
                <radialGradient id="gateway-light"><stop stopColor="#d5ad60" stopOpacity=".16" /><stop offset="1" stopColor="#d5ad60" stopOpacity="0" /></radialGradient>
                <pattern id="gateway-jaali" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 12 12 0l12 12-12 12ZM0 0l24 24M24 0 0 24" fill="none" stroke="#d3b56e" strokeOpacity=".38" strokeWidth=".65" /><circle cx="12" cy="12" r="2" fill="#d3b56e" fillOpacity=".48" /></pattern>
              </defs>
              <ellipse cx="300" cy="390" rx="205" ry="248" fill="url(#gateway-light)" />
              <path d="M65 820V360c0-95 40-155 119-198 60-33 94-60 116-107 22 47 56 74 116 107 79 43 119 103 119 198v460H65Z M105 820V378c0-79 36-128 105-167 44-25 72-53 90-93 18 40 46 68 90 93 69 39 105 88 105 167v442H105Z" fill="url(#gateway-wall)" fillRule="evenodd" />
              <path className="gateway-outline" d="M65 820V360c0-95 40-155 119-198 60-33 94-60 116-107 22 47 56 74 116 107 79 43 119 103 119 198v460" />
              <path className="gateway-inner-arch" d="M105 820V378c0-79 36-128 105-167 44-25 72-53 90-93 18 40 46 68 90 93 69 39 105 88 105 167v442" />
              <path className="gateway-filigree" d="M84 820V361c0-86 37-143 109-183 58-32 91-62 107-103m216 745V361c0-86-37-143-109-183-58-32-91-62-107-103M126 820V383c0-68 31-113 90-147 43-25 69-51 84-86m174 670V383c0-68-31-113-90-147-43-25-69-51-84-86" />
              <path className="gateway-lattice" d="M77 396h28v302H77zM495 396h28v302h-28z" fill="url(#gateway-jaali)" />
              <path className="gateway-mosaic" d="M73 390v314m36-314v314m382-314v314m36-314v314" />
              <path className="gateway-detail" d="M65 720h470M65 730h470M80 343h20m420 0h20M119 372h16m330 0h16M177 235h28m190 0h28M213 193l14 9m146-9-14 9M286 101l14 26 14-26M300 119v35M92 706h18m380 0h18M65 315l14-14m442 0 14 14" />
              <path className="gateway-pillar" d="M111 820V295h18v525M471 820V295h18v525M99 296h42M459 296h42M103 283l17-13 17 13M463 283l17-13 17 13M100 285h40M460 285h40" />
              <path className="gateway-dome" d="M107 270c1-15 5-27 13-34 8 7 12 19 13 34M467 270c1-15 5-27 13-34 8 7 12 19 13 34M120 236v-19m360 19v-19M114 217h12m348 0h12M111 270h18m342 0h18M111 282h18m342 0h18" />
              <g className="gateway-ornament">
                <g transform="translate(300 68)"><path d="M0-20C4-9 9-4 20 0 9 4 4 9 0 20-4 9-9 4-20 0-9-4-4-9 0-20Z" /><circle r="3" fill="#f2d68f" /></g>
                <g transform="translate(72 320) scale(.72)"><path d="M0-20C4-9 9-4 20 0 9 4 4 9 0 20-4 9-9 4-20 0-9-4-4-9 0-20Z" /><circle r="3" fill="#f2d68f" /></g>
                <g transform="translate(528 320) scale(.72)"><path d="M0-20C4-9 9-4 20 0 9 4 4 9 0 20-4 9-9 4-20 0-9-4-4-9 0-20Z" /><circle r="3" fill="#f2d68f" /></g>
                <g transform="translate(72 742) scale(.58)"><path d="M0-20C4-9 9-4 20 0 9 4 4 9 0 20-4 9-9 4-20 0-9-4-4-9 0-20Z" /><circle r="3" fill="#f2d68f" /></g>
                <g transform="translate(528 742) scale(.58)"><path d="M0-20C4-9 9-4 20 0 9 4 4 9 0 20-4 9-9 4-20 0-9-4-4-9 0-20Z" /><circle r="3" fill="#f2d68f" /></g>
              </g>
              <circle className="gateway-rosette" cx="300" cy="159" r="7" /><circle className="gateway-rosette" cx="300" cy="159" r="2" />
            </svg>
          </div>
          <div className="hero-content">
            <div className="eyebrow hero-eyebrow"><span /> <span /></div>
            <h1>Essence of<br /><em>heritage,</em> bottled.</h1>
            <p className="hero-copy">Ancient oils. Unhurried craft. A fragrance that<br className="desktop-break" /> remembers where it came from.</p>
            <button className="button button-gold" onClick={() => scrollTo("collection")}>Explore the collection <ArrowRight size={15} /></button>
            <div className="hero-footnote"><span>EST. IN THE TRADITION OF KANNAUJ</span><span>01 — 08</span></div>
          </div>
          <div className="hero-side-note">DISTILLED WITH DEVOTION <span>✳</span> WORN FOREVER</div>
          <button className="scroll-cue" onClick={() => scrollTo("heritage")} aria-label="Scroll to our heritage"><span>SCROLL TO DISCOVER</span><ArrowDown size={13} /></button>
          <div className="hero-bottle"><Bottle color="#986b38" /></div>
          <div className="hero-stamp"><span>100%</span><small>PURE<br />ATTAR</small></div>
        </section>

        <section className="intro-strip" aria-label="Our craft"><span>NO ALCOHOL</span><i>✳</i><span>MADE BY HAND</span><i>✳</i><span>ROOTED IN KANNAUJ</span><i>✳</i><span>WORN CLOSE</span></section>

        <section className="heritage section-pad" id="heritage">
          <div className="heritage-art reveal"><div className="heritage-frame"><div className="sun-disc" /><div className="heritage-vase"><Bottle color="#81572f" small /></div><div className="heritage-ornament">❋</div><span className="art-caption">THE DEG & BHAPKA · KANNAUJ, INDIA</span></div><div className="heritage-vertical">A LEGACY IN EVERY DROP</div></div>
          <div className="heritage-copy reveal">
            <div className="eyebrow"><span /> OUR HERITAGE</div>
            <h2>Patience is<br />the <em>first note.</em></h2>
            <p>In Kannauj, the perfume capital of India, fragrance is not made in haste. Fresh botanicals are distilled in copper degs, their vapour guided by bamboo into a cool bhapka—where the scent settles, drop by precious drop, into a base of pure sandalwood oil.</p>
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
