const StudentTable = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-xl">Aucun étudiant trouvé</p>
      </div>
    );
  }

  const getAverage = (grades) => {
    if (!grades || grades.length === 0) return 'N/A';
    return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
  };

  const getAverageColor = (grades) => {
    const avg = getAverage(grades);
    if (avg === 'N/A') return 'text-gray-400';
    if (avg >= 14) return 'text-green-600 font-bold';
    if (avg >= 10) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            {['Nom', 'Email', 'Filière', 'Notes', 'Moyenne', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr
              key={s._id}
              className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
            >
              <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
              <td className="px-4 py-3 text-gray-600">{s.email}</td>
              <td className="px-4 py-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {s.filiere}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {s.grades && s.grades.length > 0 ? s.grades.join(', ') : '—'}
              </td>
              <td className={`px-4 py-3 ${getAverageColor(s.grades)}`}>
                {getAverage(s.grades)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(s._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;