import { useState } from 'react';
import { register } from '../api/auth';
import { useAuth } from '../auth/useAuth';

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100';

const RegisterScreen = ({ onBack }) => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      await login({ email: form.email, password: form.password });
    } catch (err) {
      setError(err.response?.data?.error || 'Création impossible. Réessayez.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-10 text-slate-900">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />

      <main className="fade-up relative w-full max-w-md rounded-2xl border border-white/80 bg-white/90 p-7 shadow-xl backdrop-blur sm:p-9">
        <p className="inline-flex rounded-full border border-indigo-300/60 bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
          Inscription
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Inscrivez-vous pour accéder au dashboard EduNode.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Nom</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="Votre nom"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClassName}
              placeholder="vous@exemple.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Mot de passe</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className={inputClassName}
              placeholder="8 caractères minimum"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Retour à la connexion
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterScreen;
