import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/produits", label: "Produits" },
  { to: "/admin/couleurs", label: "Couleurs" },
  { to: "/admin/commandes", label: "Commandes" },
  { to: "/admin/livraison", label: "Livraison" },
  { to: "/admin/avis", label: "Avis" },
  { to: "/admin/accueil", label: "Homepage" },
  { to: "/admin/parametres", label: "Paramètres" },
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-cream dark:bg-ink">
      <aside className="w-60 shrink-0 border-r border-line dark:border-espresso p-6 hidden sm:flex flex-col">
        <p className="font-display text-xl mb-8">Laxassaye <span className="text-caramel text-sm align-top">admin</span></p>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-sm transition-colors ${
                  isActive ? "bg-espresso text-cream dark:bg-caramel dark:text-ink" : "hover:bg-sand dark:hover:bg-espresso/40"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => logout()} className="mt-auto text-sm text-left text-espresso/60 dark:text-cream/60 hover:text-caramel">
          Se déconnecter
        </button>
      </aside>
      <div className="flex-1 p-6 sm:p-10 max-w-6xl">
        <Outlet />
      </div>
    </div>
  );
}
