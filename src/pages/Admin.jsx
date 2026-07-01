import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("99");
  const [category, setCategory] = useState("solaire");
  const [inStock, setInStock] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const adminPassword = "Nadra2026";

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("FETCH ERROR:", error);
      alert(error.message);
      return;
    }

    setProducts(data || []);
  }

  function handleLogin(e) {
    e.preventDefault();

    if (password === adminPassword) {
      setIsLoggedIn(true);
    } else {
      alert("Mot de passe incorrect");
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();

    if (!name || !price || !imageFile) {
      alert("Remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.log("UPLOAD ERROR:", uploadError);
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("products").insert([
        {
          name: name,
          price: Number(price),
          image: imageUrl,
          category: category,
          in_stock: inStock,
        },
      ]);

      if (insertError) {
        console.log("INSERT ERROR:", insertError);
        alert(insertError.message);
        setLoading(false);
        return;
      }

      setName("");
      setPrice("99");
      setCategory("solaire");
      setInStock(true);
      setImageFile(null);

      await fetchProducts();

      alert("Produit ajouté avec succès");
    } catch (err) {
      console.log("GENERAL ERROR:", err);
      alert("Erreur: " + err.message);
    }

    setLoading(false);
  }

  async function handleDeleteProduct(id) {
    const confirmDelete = window.confirm("Supprimer ce produit ?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.log("DELETE ERROR:", error);
      alert(error.message);
      return;
    }

    fetchProducts();
  }

  async function toggleStock(product) {
    const { error } = await supabase
      .from("products")
      .update({ in_stock: !product.in_stock })
      .eq("id", product.id);

    if (error) {
      console.log("UPDATE ERROR:", error);
      alert(error.message);
      return;
    }

    fetchProducts();
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.page}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>Nadra Admin</h1>
          <p style={styles.text}>Entrez le mot de passe admin</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.blackBtn}>
              Connexion
            </button>
          </form>

          <a href="/" style={styles.link}>
            Retour au site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>⚙️ Nadra Dashboard</h1>
            <p style={styles.text}>Gestion des produits</p>
          </div>

          <a href="/" style={styles.blackBtn}>
            Voir le site
          </a>
        </div>

        <form onSubmit={handleAddProduct} style={styles.card}>
          <h2 style={styles.subtitle}>Ajouter un produit</h2>

          <input
            type="text"
            placeholder="Nom du produit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          />

          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            Produit disponible
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={styles.input}
          />

          <button type="submit" style={styles.goldBtn} disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter le produit"}
          </button>
        </form>

        <div style={styles.card}>
          <h2 style={styles.subtitle}>Produits actuels</h2>

          {products.length === 0 ? (
            <p>Aucun produit.</p>
          ) : (
            <div style={styles.grid}>
              {products.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImg}
                  />

                  <h3>{product.name}</h3>
                  <p style={styles.price}>{product.price} DH</p>
                  <p>Catégorie : {product.category}</p>
                  <p>
                    Statut:{" "}
                    <strong>
                      {product.in_stock ? "Disponible" : "Masqué"}
                    </strong>
                  </p>

                  <button
                    onClick={() => toggleStock(product)}
                    style={styles.blackBtn}
                  >
                    {product.in_stock ? "Masquer" : "Afficher"}
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={styles.deleteBtn}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f7f7",
    padding: "40px 20px",
    color: "#111",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  loginBox: {
    maxWidth: "400px",
    margin: "100px auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "15px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "34px",
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "20px",
  },
  text: {
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,.07)",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginBottom: "12px",
    fontSize: "15px",
  },
  checkboxLabel: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "12px",
  },
  blackBtn: {
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "30px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
    marginRight: "8px",
  },
  goldBtn: {
    background: "#d4af37",
    color: "#fff",
    border: "none",
    padding: "13px 25px",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteBtn: {
    background: "#e53935",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "30px",
    cursor: "pointer",
    marginTop: "10px",
  },
  link: {
    display: "inline-block",
    marginTop: "15px",
    color: "#111",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  productCard: {
    border: "1px solid #eee",
    borderRadius: "15px",
    padding: "15px",
    textAlign: "center",
  },
  productImg: {
    width: "100%",
    height: "160px",
    objectFit: "contain",
    background: "#fff",
    borderRadius: "12px",
  },
  price: {
    color: "#b8860b",
    fontWeight: "bold",
    fontSize: "20px",
  },
};

export default Admin;