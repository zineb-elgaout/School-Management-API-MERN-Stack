import { useState } from 'react';

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
        ? form.grades.split(',').map((g) => parseFloat(g.trim())).filter((g) => !isNaN(g))
        : [],
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ahmed Benali"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ahmed@edunode.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
        <select
          name="filiere"
          value={form.filiere}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['INFO', 'MATH', 'ECO', 'PHYS', 'CHIMIE'].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (séparées par des virgules)
        </label>
        <input
          name="grades"
          value={form.grades}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="14, 16, 12, 18"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Enregistrer
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;