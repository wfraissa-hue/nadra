function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="badge">🕶️ Nouvelle Collection</span>

        <h1>
          Découvrez votre style avec <span>Nadra</span>
        </h1>

        <p>
          Des lunettes élégantes pour hommes et femmes.
          <br />
          Livraison uniquement à Casablanca avec paiement à la livraison.
        </p>

        <div className="hero-buttons">
          <a href="#products" className="btn">
            Voir les produits
          </a>

          <a href="#about" className="btn-outline">
            En savoir plus
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;