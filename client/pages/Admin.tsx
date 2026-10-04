import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowDownToLine, ArrowLeft, Check, ImagePlus, LayoutDashboard, PackagePlus, Pencil, Search, Store, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { money, ProductArtwork, useStore } from "@/lib/store";
import type { Product } from "@/lib/store";

type ProductDraft = {
  name: string;
  family: string;
  description: string;
  top: string;
  heart: string;
  base: string;
  color: string;
  price6: string;
  price12: string;
  mood: string;
  image: string;
};

const newDraft: ProductDraft = {
  name: "", family: "", description: "", top: "", heart: "", base: "",
  color: "#8a6030", price6: "", price12: "", mood: "", image: "",
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function optimizePhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file to upload.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Choose an image smaller than 10 MB.");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This image could not be processed. Try another file.");
  context.fillStyle = "#f2e8d5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function Admin() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(newDraft);
  const [photoError, setPhotoError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => `${product.name} ${product.family} ${product.description}`.toLowerCase().includes(normalizedQuery));
  }, [products, query]);

  const photoCount = products.filter((product) => product.image).length;

  const openEditor = (product?: Product) => {
    setEditingId(product?.id ?? null);
    setDraft(product ? {
      name: product.name,
      family: product.family,
      description: product.description,
      top: product.top,
      heart: product.heart,
      base: product.base,
      color: product.color,
      price6: String(product.price6),
      price12: String(product.price12),
      mood: product.mood,
      image: product.image ?? "",
    } : newDraft);
    setPhotoError("");
    setNotice("");
    setEditorOpen(true);
  };

  const updateDraft = (field: keyof ProductDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setPhotoError("");
    try {
      updateDraft("image", await optimizePhoto(file));
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Photo upload failed.");
    } finally {
      input.value = "";
    }
  };

  const submitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const baseId = editingId ?? slugify(draft.name);
    let id = baseId;
    if (!editingId) {
      let suffix = 2;
      while (products.some((product) => product.id === id)) id = `${baseId}-${suffix++}`;
    }

    const product: Product = {
      id,
      name: draft.name.trim(),
      family: draft.family.trim(),
      description: draft.description.trim(),
      top: draft.top.trim(),
      heart: draft.heart.trim(),
      base: draft.base.trim(),
      color: draft.color,
      price6: Number(draft.price6),
      price12: Number(draft.price12),
      mood: draft.mood.trim(),
      ...(draft.image ? { image: draft.image } : {}),
    };

    saveProduct(product);
    setNotice(`${product.name} ${editingId ? "updated" : "added"} to the catalog.`);
    setEditorOpen(false);
  };

  const removeProduct = (product: Product) => {
    if (products.length <= 1) return;
    if (window.confirm(`Remove ${product.name} from the catalog? This also removes it from any saved bags.`)) {
      deleteProduct(product.id);
      setNotice(`${product.name} removed from the catalog.`);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/" aria-label="Itra Shameem storefront">
          <span className="brand-mark">I<span>·</span>S</span>
          <span>ITRA <em>SHAMEEM</em><small>ADMIN STUDIO</small></span>
        </Link>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <a className="admin-side-link active" href="#catalog"><LayoutDashboard size={16} /> Catalog</a>
        <Link className="admin-side-link" to="/products"><Store size={16} /> View storefront</Link>
        <div className="admin-sidebar-bottom"><span className="admin-status-dot" /> Local catalog is up to date</div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><Link to="/">Storefront</Link><span>/</span><span>Admin</span></div>
          <Link className="admin-store-link" to="/"><ArrowLeft size={14} /> Back to shop</Link>
        </header>

        <section className="admin-content" id="catalog">
          <div className="admin-page-heading">
            <div><span className="admin-overline">CATALOG MANAGEMENT</span><h1>Your products</h1><p>Keep every scent, detail and bottle image in order.</p></div>
            <button className="admin-primary-button" onClick={() => openEditor()}><PackagePlus size={16} /> Add product</button>
          </div>

          <div className="admin-metrics">
            <div><span>PRODUCTS</span><strong>{products.length.toString().padStart(2, "0")}</strong><small>In your collection</small></div>
            <div><span>WITH PHOTOS</span><strong>{photoCount.toString().padStart(2, "0")}</strong><small>Custom product images</small></div>
            <div><span>CATALOG STATUS</span><strong className="admin-status-text"><i /> Ready</strong><small>Changes save automatically</small></div>
          </div>

          <div className="admin-list-heading">
            <div><h2>All products</h2><span>{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</span></div>
            <label className="admin-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label>
          </div>

          {notice && <div className="admin-notice" role="status"><Check size={15} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={14} /></button></div>}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>PRODUCT</th><th>COLLECTION</th><th>PRICE · 6 ML</th><th>PRICE · 12 ML</th><th>PHOTO</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td><div className="admin-product-cell"><div className="admin-product-thumb"><ProductArtwork product={product} small /></div><div><strong>{product.name}</strong><span>{product.description}</span></div></div></td>
                    <td><span className="admin-family">{product.family}</span></td>
                    <td>{money(product.price6)}</td><td>{money(product.price12)}</td>
                    <td><span className={`admin-photo-state${product.image ? " has-photo" : ""}`}>{product.image ? "Uploaded" : "Illustration"}</span></td>
                    <td><div className="admin-row-actions"><button onClick={() => openEditor(product)} aria-label={`Edit ${product.name}`} title="Edit product"><Pencil size={15} /></button><button onClick={() => removeProduct(product)} disabled={products.length <= 1} aria-label={`Delete ${product.name}`} title="Delete product"><Trash2 size={15} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredProducts.length && <div className="admin-no-results">No products match “{query}”.</div>}
          </div>
          <div className="admin-footnote"><ArrowDownToLine size={14} /> Your catalog is stored in this browser and appears on the storefront immediately.</div>
        </section>
      </main>

      {editorOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
        <section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
          <header className="admin-editor-header"><div><span className="admin-overline">{editingId ? "EDIT PRODUCT" : "NEW PRODUCT"}</span><h2 id="admin-editor-title">{editingId ? "Product details" : "Add to the collection"}</h2></div><button onClick={() => setEditorOpen(false)} aria-label="Close editor"><X size={19} /></button></header>
          <form className="admin-product-form" onSubmit={submitProduct}>
            <div className="admin-photo-field">
              <div className="admin-photo-preview">{draft.image ? <img src={draft.image} alt="Product preview" /> : <span className="admin-photo-placeholder"><ImagePlus size={22} />Add a bottle photo</span>}</div>
              <div className="admin-photo-controls"><label className="admin-upload-button"><ImagePlus size={15} />{draft.image ? "Replace photo" : "Upload photo"}<input type="file" accept="image/*" onChange={handlePhoto} /></label>{draft.image && <button type="button" className="admin-remove-photo" onClick={() => updateDraft("image", "")}>Remove photo</button>}<span>JPG, PNG or WebP · up to 10 MB</span>{photoError && <span className="admin-form-error">{photoError}</span>}</div>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-wide">Product name<input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} placeholder="e.g. Gulab" required maxLength={55} /></label>
              <label className="admin-form-wide">Collection / family<input value={draft.family} onChange={(event) => updateDraft("family", event.target.value)} placeholder="e.g. Rose · No. 09" required maxLength={65} /></label>
              <label className="admin-form-wide">Short description<input value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} placeholder="Fresh, floral, romantic" required maxLength={100} /></label>
              <label>6 ml price<input type="number" min="1" step="1" value={draft.price6} onChange={(event) => updateDraft("price6", event.target.value)} placeholder="640" required /></label>
              <label>12 ml price<input type="number" min="1" step="1" value={draft.price12} onChange={(event) => updateDraft("price12", event.target.value)} placeholder="1080" required /></label>
              <label>Top note<input value={draft.top} onChange={(event) => updateDraft("top", event.target.value)} placeholder="Damask rose" required maxLength={45} /></label>
              <label>Heart note<input value={draft.heart} onChange={(event) => updateDraft("heart", event.target.value)} placeholder="Red petals" required maxLength={45} /></label>
              <label>Base note<input value={draft.base} onChange={(event) => updateDraft("base", event.target.value)} placeholder="White woods" required maxLength={45} /></label>
              <label>Glass color<span className="admin-color-input"><input type="color" value={draft.color} onChange={(event) => updateDraft("color", event.target.value)} /><span>{draft.color.toUpperCase()}</span></span></label>
              <label className="admin-form-wide">Scent story<textarea value={draft.mood} onChange={(event) => updateDraft("mood", event.target.value)} placeholder="Describe the feeling and memory behind this scent." rows={3} required maxLength={220} /></label>
            </div>
            <footer className="admin-editor-actions"><button type="button" className="admin-cancel-button" onClick={() => setEditorOpen(false)}>Cancel</button><button type="submit" className="admin-primary-button"><Check size={15} />{editingId ? "Save changes" : "Add product"}</button></footer>
          </form>
        </section>
      </div>}
    </div>
  );
}