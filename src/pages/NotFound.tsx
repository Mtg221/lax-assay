import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-lax py-32 text-center">
      <h1 className="font-display text-4xl mb-4">Page introuvable</h1>
      <Link to="/" className="btn-secondary mt-4 inline-flex">
        Retour à l'accueil
      </Link>
    </div>
  );
}
