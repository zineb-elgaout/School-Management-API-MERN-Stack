const StatsCard = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-600 text-white rounded-xl p-6 shadow">
        <p className="text-sm opacity-80">Total Étudiants</p>
        <p className="text-4xl font-bold mt-1">{stats.totalStudents}</p>
      </div>
      <div className="bg-green-600 text-white rounded-xl p-6 shadow">
        <p className="text-sm opacity-80">Moyenne Générale</p>
        <p className="text-4xl font-bold mt-1">{stats.average}/20</p>
      </div>
      <div className="bg-purple-600 text-white rounded-xl p-6 shadow">
        <p className="text-sm opacity-80">Filières</p>
        <p className="text-4xl font-bold mt-1">
          {Object.keys(stats.byFiliere || {}).length}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;