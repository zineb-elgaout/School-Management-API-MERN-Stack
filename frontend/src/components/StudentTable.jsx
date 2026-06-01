const getAverage = (grades) => {
  if (!grades || grades.length === 0) return 'N/A';
  return (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1);
};

const getAverageClassName = (grades) => {
  const avg = parseFloat(getAverage(grades));
  if (isNaN(avg)) return 'text-slate-400';
  if (avg >= 14) return 'text-emerald-600 font-semibold';
  if (avg >= 10) return 'text-amber-600 font-semibold';
  return 'text-rose-600 font-semibold';
};

const StudentTable = ({ students, onEdit, onDelete, onRestore, mode = 'active' }) => {
  const isDeletedMode = mode === 'deleted';

  if (!students || students.length === 0) {
    return (
      <div className="rounded-2xl border border-white/80 bg-white/90 px-6 py-12 text-center text-slate-500 shadow-sm backdrop-blur">
        <p className="text-lg font-semibold text-slate-700">Aucun etudiant trouve</p>
        <p className="mt-1 text-sm">
          {isDeletedMode ? 'La corbeille est vide.' : 'Ajoute un etudiant pour commencer.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-sm backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-900 text-left text-xs uppercase tracking-wider text-slate-200">
              {['Nom', 'Email', 'Filiere', 'Notes', 'Moyenne', 'Actions'].map((header) => (
                <th key={header} className="px-4 py-3 font-semibold first:pl-6 last:pr-6">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="border-b border-slate-100 align-top last:border-b-0 hover:bg-slate-50/70"
              >
                <td className="px-4 py-3.5 font-semibold text-slate-800 first:pl-6">
                  {student.name}
                </td>
                <td className="px-4 py-3.5 text-slate-600">{student.email}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {student.filiere}
                  </span>
                </td>
                <td className="max-w-56 px-4 py-3.5 text-slate-600">
                  {student.grades && student.grades.length > 0
                    ? student.grades.join(', ')
                    : '-'}
                </td>
                <td className={`px-4 py-3.5 ${getAverageClassName(student.grades)}`}>
                  {getAverage(student.grades)}
                </td>
                <td className="px-4 py-3.5 last:pr-6">
                  {isDeletedMode ? (
                    <button
                      onClick={() => onRestore(student._id)}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Restaurer
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onEdit(student)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDelete(student._id)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;