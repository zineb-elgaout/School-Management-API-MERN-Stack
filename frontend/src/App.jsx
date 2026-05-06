import { useState, useEffect } from 'react';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import StatsCard from './components/StatsCard';
import {
  getStudents, createStudent, updateStudent,
  deleteStudent, getStats, exportCSV
} from './api/students';

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filiere, setFiliere] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notify = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studRes, statsRes] = await Promise.all([
        getStudents(filiere),
        getStats(),
      ]);
      setStudents(studRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      notify('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filiere]);

  const handleCreate = async (data) => {
    try {
      await createStudent(data);
      notify('✅ Étudiant créé avec succès');
      setShowForm(false);
      fetchData();
    } catch (err) {
      notify('❌ ' + (err.response?.data?.error || 'Erreur création'));
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateStudent(editingStudent._id, data);
      notify('✅ Étudiant modifié avec succès');
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      notify('❌ ' + (err.response?.data?.error || 'Erreur modification'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant ?')) return;
    try {
      await deleteStudent(id);
      notify('✅ Étudiant supprimé');
      fetchData();
    } catch (err) {
      notify('❌ Erreur suppression');
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      notify('✅ Export CSV téléchargé');
    } catch (err) {
      notify('❌ Erreur export CSV');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ─── Header ─── */}
      <header className="bg-gray-800 text-white px-8 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎓 EduNode</h1>
            <p className="text-gray-400 text-sm">School Management Dashboard</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              📥 Export CSV
            </button>
            <button
              onClick={() => { setShowForm(true); setEditingStudent(null); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              + Ajouter étudiant
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* ─── Notification ─── */}
        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            {message}
          </div>
        )}

        {/* ─── Stats ─── */}
        <StatsCard stats={stats} />

        {/* ─── Formulaire création ─── */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Nouvel étudiant
            </h2>
            <StudentForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* ─── Formulaire édition ─── */}
        {editingStudent && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Modifier — {editingStudent.name}
            </h2>
            <StudentForm
              initial={editingStudent}
              onSubmit={handleUpdate}
              onCancel={() => setEditingStudent(null)}
            />
          </div>
        )}

        {/* ─── Filtres ─── */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-4 items-center">
          <span className="text-sm font-medium text-gray-600">Filtrer par filière :</span>
          <div className="flex gap-2 flex-wrap">
            {['', 'INFO', 'MATH', 'ECO', 'PHYS', 'CHIMIE'].map((f) => (
              <button
                key={f}
                onClick={() => setFiliere(f)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filiere === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f || 'Tous'}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-400">
            {loading ? 'Chargement...' : `${students.length} étudiant(s)`}
          </span>
        </div>

        {/* ─── Tableau ─── */}
        <StudentTable
          students={students}
          onEdit={(s) => { setEditingStudent(s); setShowForm(false); }}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}