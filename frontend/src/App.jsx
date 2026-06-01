import { useState, useEffect, useCallback } from 'react';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import StatsCard from './components/StatsCard';
import {
  getStudents,
  getDeletedStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  getStats,
  exportCSV,
} from './api/students';

const FILIERES = ['', 'INFO', 'MATH', 'ECO', 'PHYS', 'CHIMIE'];

export default function App() {
  const [students, setStudents] = useState([]);
  const [deletedStudents, setDeletedStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filiere, setFiliere] = useState('');
  const [viewMode, setViewMode] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const notify = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3200);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [activeRes, deletedRes, statsRes] = await Promise.all([
        getStudents(filiere),
        getDeletedStudents(),
        getStats(),
      ]);

      setStudents(activeRes.data.data || []);
      setDeletedStudents(deletedRes.data.data || []);
      setStats(statsRes.data.data || null);
    } catch {
      notify('Erreur pendant le chargement des donnees.');
    } finally {
      setLoading(false);
    }
  }, [filiere]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleCreate = async (data) => {
    try {
      await createStudent(data);
      notify('Etudiant cree avec succes.');
      setShowForm(false);
      fetchData();
    } catch (err) {
      notify(err.response?.data?.error || 'Erreur pendant la creation.');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateStudent(editingStudent._id, data);
      notify('Etudiant modifie avec succes.');
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      notify(err.response?.data?.error || 'Erreur pendant la modification.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet etudiant ?')) return;
    try {
      await deleteStudent(id);
      notify('Etudiant deplace vers la corbeille.');
      fetchData();
    } catch {
      notify('Erreur pendant la suppression.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreStudent(id);
      notify('Etudiant restaure avec succes.');
      fetchData();
    } catch (err) {
      notify(err.response?.data?.error || 'Erreur pendant la restauration.');
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
      notify('Export CSV telecharge.');
    } catch {
      notify('Erreur pendant export CSV.');
    }
  };

  const list = viewMode === 'active' ? students : deletedStudents;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />

      <header className="relative border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="fade-up">
            <p className="inline-flex rounded-full border border-cyan-300/60 bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              School Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              EduNode
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
              Gestion moderne des etudiants avec suivi des actifs et corbeille integree.
            </p>
          </div>

          <div className="fade-up delay-1 flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                setViewMode('active');
                setShowForm(true);
                setEditingStudent(null);
              }}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
            >
              Ajouter un etudiant
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        {message && (
          <div className="fade-up mb-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 shadow-sm">
            {message}
          </div>
        )}

        <div className="fade-up delay-1">
          <StatsCard stats={stats} deletedCount={deletedStudents.length} />
        </div>

        <section className="fade-up delay-2 mb-6 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setViewMode('active');
                setEditingStudent(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                viewMode === 'active'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Etudiants actifs ({students.length})
            </button>
            <button
              onClick={() => {
                setViewMode('deleted');
                setShowForm(false);
                setEditingStudent(null);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                viewMode === 'deleted'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Corbeille ({deletedStudents.length})
            </button>

            <span className="ml-auto inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {loading ? 'Chargement...' : `${list.length} element(s)`}
            </span>
          </div>

          {viewMode === 'active' && (
            <div className="flex flex-wrap gap-2">
              {FILIERES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFiliere(f)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                    filiere === f
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f || 'Tous'}
                </button>
              ))}
            </div>
          )}
        </section>

        {viewMode === 'active' && showForm && (
          <section className="fade-up delay-2 mb-6 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Nouvel etudiant</h2>
            <StudentForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </section>
        )}

        {viewMode === 'active' && editingStudent && (
          <section className="fade-up delay-2 mb-6 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Modifier: {editingStudent.name}
            </h2>
            <StudentForm
              initial={editingStudent}
              onSubmit={handleUpdate}
              onCancel={() => setEditingStudent(null)}
            />
          </section>
        )}

        <div className="fade-up delay-3">
          <StudentTable
            students={list}
            mode={viewMode}
            onEdit={(student) => {
              setEditingStudent(student);
              setShowForm(false);
            }}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </div>
      </main>
    </div>
  );
}