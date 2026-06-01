const StatsCard = ({ stats, deletedCount = 0 }) => {
  if (!stats) return null;

  const filiereCount = Object.keys(stats.byFiliere || {}).length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-100 to-cyan-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
          Total actifs
        </p>
        <p className="mt-3 text-4xl font-extrabold text-cyan-900">{stats.totalStudents}</p>
      </article>

      <article className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-100 to-emerald-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          Moyenne generale
        </p>
        <p className="mt-3 text-4xl font-extrabold text-emerald-900">{stats.average}/20</p>
      </article>

      <article className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-100 to-amber-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
          Filieres actives
        </p>
        <p className="mt-3 text-4xl font-extrabold text-amber-900">{filiereCount}</p>
      </article>

      <article className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-100 to-rose-50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
          Corbeille
        </p>
        <p className="mt-3 text-4xl font-extrabold text-rose-900">{deletedCount}</p>
      </article>
    </div>
  );
};

export default StatsCard;