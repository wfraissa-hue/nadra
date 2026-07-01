import { useEffect, useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import OrderModal from "../components/OrderModal";
import { supabase } from "../supabase";

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    console.log("SUPABASE DATA:", data);
    console.log("SUPABASE ERROR:", error);

    if (error) {
      console.log("Erreur Supabase:", error);
      setProducts([]);
    } else {
      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        price: `${product.price} DH`,
        image: product.image,
        category: product.category,
        in_stock: product.in_stock,
      }));

      setProducts(formattedProducts);
    }

    setLoading(false);
  }

  return (
    <>
      <Header />

      <Hero />

      {loading ? (
        <section className="products">
          <h2>Nos Produits</h2>
          <p style={{ textAlign: "center" }}>Chargement des produits...</p>
        </section>
      ) : products.length === 0 ? (
        <section className="products">
          <h2>Nos Produits</h2>
          <p style={{ textAlign: "center" }}>
            Aucun produit disponible pour le moment.
          </p>
        </section>
      ) : (
        <Products
          products={products}
          onOrder={(product) => setSelectedProduct(product)}
        />
      )}

      <section id="about" className="about">
        <h2>À propos</h2>
        <p>
          Nadra est une marque spécialisée dans les lunettes modernes et
          élégantes. Nous proposons des modèles pour hommes et femmes à un prix
          accessible, avec livraison à Casablanca et paiement à la livraison.
        </p>
      </section>

      <section id="contact" className="contact">
        <h2>Contact</h2>
        <p>📞 WhatsApp : +212 657014538</p>
        <p>📍 Casablanca, Maroc</p>
      </section>

      <OrderModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

export default Home;