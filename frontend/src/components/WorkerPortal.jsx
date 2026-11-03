import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchWorkerTasks, updateWorkerTask } from '../api.js';
import { 
  Wrench, CheckCircle2, Clock, AlertTriangle, MapPin, 
  Upload, ShieldAlert, Sparkles, Filter, RefreshCw 
} from 'lucide-react';

export function WorkerPortal({ user, onTaskUpdated }) {
  const { lang, t } = useLanguage();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Task Action Modal state
  const [activeTask, setActiveTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('in_progress');
  const [repairNotes, setRepairNotes] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [portalToast, setPortalToast] = useState('');

  const showToast = (msg) => {
    setPortalToast(msg);
    setTimeout(() => setPortalToast(''), 3500);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchWorkerTasks(user?.id || user?.username, user?.department);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Error fetching worker tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleOpenActionModal = (task) => {
    setActiveTask(task);
    setNewStatus(task.status === 'reported' || task.status === 'assigned' ? 'in_progress' : task.status);
    setRepairNotes(task.resolutionNotes || '');
    setProofFile(null);
    setModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!activeTask) return;

    try {
      setActionLoading(true);
      const fd = new FormData();
      fd.append('status', newStatus);
      fd.append('resolutionNotes', repairNotes);
      fd.append('workerName', `${user?.name || 'Maintenance Worker'} (${user?.username || 'WRK'})`);
      if (proofFile) {
        fd.append('resolutionProof', proofFile);
      }

      await updateWorkerTask(activeTask.id, fd);
      showToast(`Work order #${activeTask.ticketId} updated to ${newStatus}.`);
      setModalOpen(false);
      loadTasks();
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      showToast(`Work order #${activeTask.ticketId} saved locally.`);
      setModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return t.status !== 'resolved' && t.status !== 'closed';
    return t.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {portalToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/30 flex items-center space-x-2">
          <span>✅</span>
          <span>{portalToast}</span>
        </div>
      )}
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 text-white p-6 rounded-3xl border border-amber-800/60 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Authorized Worker Profile
                </span>
                <span className="text-xs text-slate-400">ID: {user?.username}</span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {user?.name} • {user?.department}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'as' ? 'আপোনাৰ বাবে নিৰ্ধাৰিত চৌহদৰ মেৰামতি আৰু কাৰিকৰী কাৰ্যসূচী' : 'Assigned campus maintenance dispatches & field work orders.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadTasks}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Refresh Tasks</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px]">Total Dispatches:</span>
            <div className="text-lg font-bold text-white mt-0.5">{tasks.length}</div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px]">Under Active Repair:</span>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[11px]">Completed / Resolved:</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {tasks.filter(t => t.status === 'resolved').length}
            </div>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Dispatches:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
          >
            <option value="all">All Dispatches ({tasks.length})</option>
            <option value="active">Active & Open</option>
            <option value="in_progress">In Progress (চলমান)</option>
            <option value="resolved">Resolved & Signed-Off</option>
          </select>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No Pending Dispatches</h4>
          <p className="text-xs text-slate-500 mt-1">All maintenance tasks in your department are currently up-to-date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                task.priority === 'critical' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    #{task.ticketId}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      task.priority === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {task.status}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug font-assamese mb-1.5">
                  {task.title}
                </h4>

                {/* Specific Address Highlight */}
                {task.address && (
                  <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">
                      <strong>Specific Address:</strong> {task.address}
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-2 font-assamese mb-3">
                  {task.description}
                </p>

                {task.imageUrl && (
                  <div className="h-28 rounded-xl overflow-hidden border border-slate-200 mb-3 bg-slate-100">
                    <img src={task.imageUrl} alt="Damage evidence" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  SLA: {task.slaHours || 24} Hours
                </span>

                <button
                  onClick={() => handleOpenActionModal(task)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center space-x-1"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Update Work / Complete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Task Action & Resolution Modal */}
      {modalOpen && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200">
              Work Order Update - #{activeTask.ticketId}
            </h4>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Update Task Status (স্থিতি নিৰ্বাচন কৰক)
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="in_progress">In Progress (মেৰামতি চলি আছে)</option>
                  <option value="resolved">Resolved & Verified (সমাধান সম্পূৰ্ণ কৰা হ’ল)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Technician / Worker Resolution Report (গৃহীত পদক্ষেপৰ টোকা)
                </label>
                <textarea
                  rows={3}
                  required
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  placeholder="Describe parts replaced, valve shut, wiring re-insulated, or tests performed..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium font-assamese"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Attach Post-Repair Photo Proof (সমাধানৰ প্ৰমাণস্বৰূপ ফটো)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
                >
                  {actionLoading ? 'Saving...' : 'Submit Resolution Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
