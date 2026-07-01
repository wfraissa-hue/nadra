function Products({ products, onOrder }) {
  return (
    <section id="products" className="products">
      <h2>Nos Produits</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <div className="image-box">
              <img src={product.image} alt={product.name} />

              <span
                className={
                  product.in_stock ? "stock-badge available" : "stock-badge out"
                }
              >
                {product.in_stock ? "Disponible" : "Rupture de stock"}
              </span>
            </div>

            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <p className="stars">★★★★★</p>

            {product.in_stock ? (
              <button className="btn" onClick={() => onOrder(product)}>
                Commander
              </button>
            ) : (
              <button className="btn disabled-btn" disabled>
                Non disponible
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;