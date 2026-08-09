import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-ink px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <h1 className="font-display text-3xl text-center mb-2">Laxassaye</h1>
        <p className="text-center text-sm text-espresso/60 dark:text-cream/60 mb-6">Espace administration</p>
        <input required type="email" placeholder="Email" className="input-lax" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Mot de passe" className="input-lax" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="text-center text-sm text-espresso/50 dark:text-cream/50 mt-6">
        <Link to="/" className="text-caramel hover:underline">← Retour à l'accueil</Link>
      </p>
    </div>
  );
}
