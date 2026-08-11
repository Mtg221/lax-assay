import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { useCafeToubaCart } from "@/contexts/CafeToubaCartContext";
import { useState } from "react";

export default function Header() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { itemCount: cafeItemCount } = useCafeToubaCart();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide uppercase transition-colors ${
      isActive ? "text-caramel" : "text-espresso dark:text-cream hover:text-caramel"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 dark:bg-ink/90 backdrop-blur border-b border-line dark:border-espresso">
      <div className="container-lax flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl tracking-wide">
          Laxassaye
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          <NavLink to="/" className={linkClass} end>
            {t.nav.home}
          </NavLink>
          <NavLink to="/boutique" className={linkClass}>
            {t.nav.shop}
          </NavLink>
          <NavLink to="/cafe-touba" className={linkClass}>
            {t.nav.cafeTouba}
          </NavLink>
          <NavLink to="/a-propos" className={linkClass}>
            {t.nav.about}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocale(locale === "fr" ? "wo" : "fr")}
            aria-label="Changer de langue"
            className="text-xs font-semibold tracking-wide border border-line dark:border-espresso rounded-sm px-2.5 py-1.5 hover:border-caramel transition-colors"
          >
            {locale === "fr" ? "FR" : "WO"} <span className="opacity-40">|</span> {locale === "fr" ? "WO" : "FR"}
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Basculer le mode clair/sombre"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-line dark:border-espresso hover:border-caramel transition-colors"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <Link to="/panier" className="relative w-9 h-9 flex items-center justify-center" aria-label={t.nav.cart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12L6 6Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6 5 2H2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            {(itemCount + cafeItemCount) > 0 && (
              <span className="absolute -top-1 -right-1 bg-caramel text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount + cafeItemCount}
              </span>
            )}
          </Link>

          <button className="md:hidden w-9 h-9 flex items-center justify-center" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span className="text-xl">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line dark:border-espresso container-lax py-4 flex flex-col gap-4">
          <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
            {t.nav.home}
          </NavLink>
          <NavLink to="/boutique" className={linkClass} onClick={() => setOpen(false)}>
            {t.nav.shop}
          </NavLink>
          <NavLink to="/cafe-touba" className={linkClass} onClick={() => setOpen(false)}>
            {t.nav.cafeTouba}
          </NavLink>
          <NavLink to="/a-propos" className={linkClass} onClick={() => setOpen(false)}>
            {t.nav.about}
          </NavLink>
        </nav>
      )}
    </header>
  );
}
