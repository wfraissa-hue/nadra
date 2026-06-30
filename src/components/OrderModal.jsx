import "./OrderModal.css";

function OrderModal({ product, onClose }) {
  if (!product) return null;

  const phone = "212657014538"; // بدلها برقم واتساب ديالك

  const order = () => {
    const name = document.getElementById("name").value.trim();
    const tel = document.getElementById("tel").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !tel || !address) {
      alert("المرجو ملء جميع الخانات.");
      return;
    }

    const message = `السلام عليكم،

المنتج: ${product.name}
الثمن: ${product.price}

الاسم: ${name}
الهاتف: ${tel}
المدينة: Casablanca
العنوان: ${address}

واش باقي متوفر؟`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <img src={product.image} alt={product.name} />

        <h2>{product.name}</h2>

        <p>{product.price}</p>

        <input
          id="name"
          type="text"
          placeholder="Nom complet"
        />

        <input
          id="tel"
          type="text"
          placeholder="Téléphone"
        />

        <input
          type="text"
          value="Casablanca"
          disabled
        />

        <input
          id="address"
          type="text"
          placeholder="Adresse complète"
        />

        <button className="confirm-btn" onClick={order}>
          Commander sur WhatsApp
        </button>
      </div>
    </div>
  );
}

export default OrderModal;