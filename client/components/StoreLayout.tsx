import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useStore } from "@/lib/store";

export function StoreHeader() {
  const { cartCount } = useStore();

  return (
    <header className="site-header is-scrolled store-header">
      <Link className="brand-lockup" to="/" aria-label="Itra Shameem home">
        <span className="brand-mark">I<span>·</span>S</span>
        <span className="brand-name">ITRA <em>SHAMEEM</em><small>THE ART OF ATTAR</small></span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/">Our story</Link>
        <Link to="/products">Shop all scents</Link>
      </nav>
      <div className="header-actions">
        <Link className="bag-button" aria-label={`View cart, ${cartCount} items`} to="/cart">
          <ShoppingBag size={17} strokeWidth={1.5} /><span>Bag</span><i>{cartCount}</i>
        </Link>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand-lockup footer-brand" to="/">
          <span className="brand-mark">I<span>·</span>S</span>
          <span className="brand-name">ITRA <em>SHAMEEM</em><small>THE ART OF ATTAR</small></span>
        </Link>
        <p>Essence of heritage, bottled.<br />Made slowly in Kannauj, India.</p>
        <div className="footer-links"><span className="eyebrow">EXPLORE</span><Link to="/">Our story</Link><Link to="/products">The collection</Link></div>
        <div className="footer-connect"><span className="eyebrow">SAY NAMASTE</span><a href="tel:+919825258283">+91 98252 58283</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram <ArrowRight size={13} /></a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ITRA SHAMEEM · ALL RIGHTS RESERVED</span><span>CRAFTED WITH PATIENCE IN KANNAUJ, INDIA <i>✳</i></span></div>
    </footer>
  );
}

export default function StoreLayout() {
  return (
    <div className="attar-site store-route">
      <StoreHeader />
      <main className="store-content"><Outlet /></main>
      <StoreFooter />
    </div>
  );
}