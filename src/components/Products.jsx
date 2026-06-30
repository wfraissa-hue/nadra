function Products({ products, onOrder }) {
  return (
    <section id="products" className="products">
      <h2>Nos Produits</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.name} />

            <h3>{product.name}</h3>

            <p className="price">{product.price}</p>

            <p className="stars">★★★★★</p>

            <button
              className="btn"
              onClick={() => onOrder(product)}
            >
              Commander
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;