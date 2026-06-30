import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import { useState, useEffect } from "react";
import OrderModal from "./components/OrderModal";
import Products from "./components/Products";
import lunette1 from "./images/lunette1.png";
import lunette2 from "./images/lunette2.png";
import lunette3 from "./images/lunette3.png";
import lunette4 from "./images/lunette4.png";
import lunette5 from "./images/lunette5.png";

function App() {
  // 1. إرجاع المنتجات ديناميكية مع حفظها في LocalStorage
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("nadra_products");
    return savedProducts ? JSON.parse(savedProducts) : [
      { id: 1, name: "Nadra Classic Brown", price: "99 DH", image: lunette1 },
      { id: 2, name: "Nadra Vision Amber", price: "99 DH", image: lunette2 },
      { id: 3, name: "Nadra Smoke Grey", price: "99 DH", image: lunette3 },
      { id: 4, name: "Nadra Desert Gold", price: "99 DH", image: lunette4 },
      { id: 5, name: "Nadra Black Edition", price: "99 DH", image: lunette5 },
    ];
  });

  // حفظ السلعة كلما وقع تغيير (إضافة أو حذف)
  useEffect(() => {
    localStorage.setItem("nadra_products", JSON.stringify(products));
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false); // واش داخل كـ Admin

  // States الخاصة بالفورم ديال إضافة منتج جديد
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("99 DH");
  const [newImage, setNewImage] = useState("");

  // دالة إضافة منتج جديد
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newImage) {
      alert("Veuillez remplir le nom et l'image !");
      return;
    }
    const newProd = {
      id: Date.now(),
      name: newName,
      price: newPrice,
      image: newImage, // تقدر تحط URL ديال صورة من النت هنا
    };
    setProducts([...products, newProd]);
    setNewName("");
    setNewImage("");
    setNewPrice("99 DH");
  };

  // دالة حذف منتج
  const handleDeleteProduct = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      {/* الـ Header ديالك */}
      <Header />

      {/* زر سحري كيبان فالفوق باش تدخل وتخرج من لوحة التحكم */}
      <div style={{ textAlign: "center", padding: "10px", background: "#111" }}>
        <button 
          className="admin-toggle-btn"
          onClick={() => setIsAdminView(!isAdminView)}
          style={{
            background: "transparent",
            color: "#d4af37",
            border: "1px solid #d4af37",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
            borderRadius: "4px"
          }}
        >
          {isAdminView ? "👁️ Voir le Store (Client)" : "⚙️ Mode Admin (Dashboard)"}
        </button>
      </div>

      {/* لوحة التحكم Admin إذا ضغطت على الزر */}
      {isAdminView ? (
        <div className="admin-dashboard" style={{ maxWidth: "1000px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "8px", color: "#111" }}>
          <h2 style={{ borderBottom: "2px solid #d4af37", paddingBottom: "10px" }}>⚙️ Nadra Admin Dashboard</h2>
          
          {/* فورم الإضافة */}
          <form onSubmit={handleAddProduct} className="admin-form" style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "20px 0", padding: "15px", background: "#f9f9f9", borderRadius: "6px" }}>
            <h3>Ajouter un Produit</h3>
            <input type="text" placeholder="Nom du produit" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: "8px" }} />
            <input type="text" placeholder="Prix (ex: 99 DH)" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ padding: "8px" }} />
            <input type="text" placeholder="Lien de l'image (URL)" value={newImage} onChange={e => setNewImage(e.target.value)} style={{ padding: "8px" }} />
            <button type="submit" style={{ background: "#d4af37", color: "#fff", border: "none", padding: "10px", fontWeight: "bold", cursor: "pointer" }}>Ajouter au catalogue</button>
          </form>

          {/* جدول السلعة الحالية للتعديل والحذف */}
          <h3>Gestion du stock actuel ({products.length} produits)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ background: "#111", color: "#fff" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Image</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Nom</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Prix</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}><img src={p.image} alt={p.name} width="50" style={{ borderRadius: "4px" }} /></td>
                  <td style={{ padding: "10px" }}>{p.name}</td>
                  <td style={{ padding: "10px", fontWeight: "bold" }}>{p.price}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "#ff4d4d", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* واجهة الكليان العادية */
        <>
          <Hero />

          <Products
            products={products}
            onOrder={(product) => setSelectedProduct(product)}
          />

          <section id="about" className="about">
            <h2>À propos</h2>
            <p>
              Nadra est une marque spécialisée dans les lunettes modernes et
              élégantes. Nous proposons des modèles pour hommes et femmes à un
              prix unique de <strong>99 DH</strong>, avec livraison à Casablanca
              et paiement à la livraison.
            </p>
          </section>

          <section id="contact" className="contact">
            <h2>Contact</h2>
            <p>📞 WhatsApp : +212 657014538</p>
            <p>📍 Casablanca, Maroc</p>
          </section>
        </>
      )}

      <OrderModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

export default App;