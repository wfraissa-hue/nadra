import React from "react";
// 1. استيراد اللوغو الجديد (تأكد من اسم الصورة والمسار ديالها)
import logo from "../images/logo.png"; 

function Header() {
  return (
    <header className="navbar">
      {/* 2. تعويض الكلمة الحمراء "Nadra" باللوغو الجديد الفخم */}
      <div className="logo">
        <img 
          src={logo} 
          alt="Nadra Logo" 
          style={{ 
            height: "70px",       /* الحجم المناسب للـ Navbar */
            width: "auto",        /* الحفاظ على أبعاد الصورة */
            display: "block",
            objectFit: "contain"
          }} 
        />
      </div>

      <nav>
        {/* ربط "Accueil" بـ # للرجوع للفوق بسلاسة */}
        <a href="#">Accueil</a>
        <a href="#products">Produits</a>
        <a href="#about">À propos</a>
        <a href="#contact">Contact</a>
      </nav>

      <a href="#products" className="btn">
        Commander
      </a>
    </header>
  );
}

export default Header;