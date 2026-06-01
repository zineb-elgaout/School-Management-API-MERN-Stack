import { useState } from 'react';

const FILIERES = ['INFO', 'MATH', 'ECO', 'PHYS', 'CHIMIE'];

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100';

const StudentForm = ({ onSubmit, initial = {}, onCancel }) => {
  const [form, setForm] = useState({
    name: initial.name || '',
    email: initial.email || '',
    filiere: initial.filiere || 'INFO',
    grades: initial.grades ? initial.grades.join(', ') : '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      grades: form.grades
        ? form.grades
            .split(',')
            .map((grade) => parseFloat(grade.trim()))
            .filter((grade) => !Number.isNaN(grade))
        : [],
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">Nom complet</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClassName}
            placeholder="Ahmed Benali"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClassName}
            placeholder="ahmed@edunode.com"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">Filiere</span>
          <select
            name="filiere"
            value={form.filiere}
            onChange={handleChange}
            className={inputClassName}
          >
            {FILIERES.map((filiere) => (
              <option key={filiere} value={filiere}>
                {filiere}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">Notes</span>
          <input
            name="grades"
            value={form.grades}
            onChange={handleChange}
            className={inputClassName}
            placeholder="14, 16, 12, 18"
          />
        </label>
      </div>

      <p className="text-xs text-slate-500">
        Format des notes: separees par des virgules.
      </p>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Enregistrer
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;