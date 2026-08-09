import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line dark:border-espresso">
      <div className="container-lax py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl mb-3">Laxassaye</p>
          <p className="text-sm text-espresso/70 dark:text-cream/60 max-w-xs">
            Écharpes premium, pensées pour durer. Livraison au Sénégal, paiement à la livraison.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-2">Navigation</p>
          <Link to="/boutique" className="block hover:text-caramel transition-colors">Boutique</Link>
          <Link to="/a-propos" className="block hover:text-caramel transition-colors">À propos</Link>
          <Link to="/panier" className="block hover:text-caramel transition-colors">Panier</Link>
          <Link to="/admin/login" className="block hover:text-caramel transition-colors mt-2">Administration</Link>
        </div>
        <div className="text-sm space-y-2">
          <p className="eyebrow mb-2">Laxassaye</p>
          <p className="text-espresso/70 dark:text-cream/60">© {new Date().getFullYear()} Laxassaye. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
