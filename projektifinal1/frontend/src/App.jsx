import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Calendar, BookOpen, Bell, Plus, X, Check, Clock,
  MapPin, User, Trash2, AlertCircle, CheckCircle2,
  GraduationCap, FileText, AlertTriangle, BellRing
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const DAYS = ['Hënë', 'Martë', 'Mërkurë', 'Enjte', 'Premte', 'Shtunë', 'Diel'];
const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        {...props}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2.5 rounded-xl font-medium transition active:scale-95 disabled:opacity-50 disabled:active:scale-100';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function ScheduleTab({ onNotification }) {
  const [schedule, setSchedule] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    subject: '', instructor: '', location: '', dayOfWeek: '1', startTime: '', endTime: '', color: COLORS[0]
  });

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/schedule`);
      setSchedule(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/schedule/${editing}`, form);
      } else {
        await axios.post(`${API_URL}/schedule`, form);
        onNotification('Orë e shtuar në orar', 'schedule');
      }
      fetchSchedule();
      setShowAdd(false);
      setEditing(null);
      setForm({ subject: '', instructor: '', location: '', dayOfWeek: '1', startTime: '', endTime: '', color: COLORS[0] });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Fshij këtë orë?')) return;
    await axios.delete(`${API_URL}/schedule/${id}`);
    fetchSchedule();
  };

  const openEdit = (item) => {
    setForm(item);
    setEditing(item.id);
    setShowAdd(true);
  };

  const grouped = DAYS.map((day, i) => ({
    day, dayNum: i + 1,
    classes: schedule.filter(s => s.dayOfWeek === i + 1).sort((a, b) => a.startTime.localeCompare(b.startTime))
  })).filter(g => g.classes.length > 0);

  return (
    <div className="pb-20">
      <div className="bg-blue-500 text-white px-4 py-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-7 h-7" /> Orari
        </h1>
        <p className="text-blue-100 mt-1">Orët e tua javore</p>
      </div>

      <div className="p-4 space-y-4">
        {grouped.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nuk ka orë të planifikuara</p>
          </div>
        ) : (
          grouped.map(({ day, classes }) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{day}</h3>
              <div className="space-y-2">
                {classes.map(item => (
                  <div
                    key={item.id}
                    style={{ borderLeftColor: item.color }}
                    className="bg-white rounded-xl p-4 border-l-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.subject}</h4>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                          <Clock className="w-4 h-4" />
                          {item.startTime} - {item.endTime}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </div>
                        )}
                        {item.instructor && (
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <User className="w-4 h-4" />
                            {item.instructor}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-500">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => { setEditing(null); setForm({ subject: '', instructor: '', location: '', dayOfWeek: '1', startTime: '', endTime: '', color: COLORS[0] }); setShowAdd(true); }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditing(null); }} title={editing ? 'Ndrysho Orën' : 'Shto Orë'}>
        <form onSubmit={handleSubmit}>
          <Input label="Lënda" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
          <Input label="Mësimdhënësi" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
          <Input label="Lokacioni" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <Select
            label="Dita e Javës"
            value={form.dayOfWeek}
            onChange={e => setForm({ ...form, dayOfWeek: e.target.value })}
            options={DAYS.map((d, i) => ({ value: i + 1, label: d }))}
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <Input label="Ora e Fillimit" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
            </div>
            <div className="flex-1">
              <Input label="Ora e Përfundimit" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngjyra</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1">Anulo</Button>
            <Button type="submit" className="flex-1">{editing ? 'Përditëso' : 'Shto'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function GradesTab({ onNotification }) {
  const [grades, setGrades] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [showGrade, setShowGrade] = useState(false);
  const [showAbsence, setShowAbsence] = useState(false);
  const [gradeForm, setGradeForm] = useState({ subject: '', title: '', score: '', maxScore: '100', weight: '1', date: '' });
  const [absenceForm, setAbsenceForm] = useState({ subject: '', date: '', justified: false, reason: '' });
  const [activeView, setActiveView] = useState('grades');

  const fetchGrades = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/grades`);
      setGrades(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchAbsences = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/absences`);
      setAbsences(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchGrades(); fetchAbsences(); }, [fetchGrades, fetchAbsences]);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/grades`, { ...gradeForm, score: parseFloat(gradeForm.score), maxScore: parseFloat(gradeForm.maxScore), weight: parseFloat(gradeForm.weight) });
      fetchGrades();
      setShowGrade(false);
      setGradeForm({ subject: '', title: '', score: '', maxScore: '100', weight: '1', date: '' });
      onNotification('Notë e shtuar', 'grade');
    } catch (err) { console.error(err); }
  };

  const handleAddAbsence = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/absences`, { ...absenceForm, date: absenceForm.date });
      fetchAbsences();
      setShowAbsence(false);
      setAbsenceForm({ subject: '', date: '', justified: false, reason: '' });
      onNotification('Mungesë e regjistruar', 'absence');
    } catch (err) { console.error(err); }
  };

  const handleDeleteGrade = async (id) => {
    if (!confirm('Fshij këtë notë?')) return;
    await axios.delete(`${API_URL}/grades/${id}`);
    fetchGrades();
  };

  const handleDeleteAbsence = async (id) => {
    if (!confirm('Fshij këtë regjistrim mungese?')) return;
    await axios.delete(`${API_URL}/absences/${id}`);
    fetchAbsences();
  };

  const subjects = [...new Set([...grades.map(g => g.subject), ...absences.map(a => a.subject)])];

  const avgGrade = grades.length > 0
    ? (grades.reduce((acc, g) => acc + (g.score / g.maxScore) * g.weight, 0) / grades.reduce((acc, g) => acc + g.weight, 0) * 100).toFixed(1)
    : '0';

  const getGradeColor = (pct) => {
    if (pct >= 90) return 'text-green-600 bg-green-50';
    if (pct >= 70) return 'text-blue-600 bg-blue-50';
    if (pct >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="pb-20">
      <div className="bg-purple-600 text-white px-4 py-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-7 h-7" /> Notat & Mungesat
        </h1>
        <p className="text-purple-100 mt-1">Ndjek performancën tënde akademike</p>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Mesatarja e Notave</p>
            <p className={`text-3xl font-bold ${parseFloat(avgGrade) >= 70 ? 'text-green-600' : 'text-red-600'}`}>{avgGrade}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Mungesa</p>
            <p className="text-2xl font-bold text-orange-600">{absences.length}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveView('grades')}
            className={`flex-1 py-2.5 rounded-xl font-medium transition ${activeView === 'grades' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Notat ({grades.length})
          </button>
          <button
            onClick={() => setActiveView('absences')}
            className={`flex-1 py-2.5 rounded-xl font-medium transition ${activeView === 'absences' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Mungesat ({absences.length})
          </button>
        </div>

        {activeView === 'grades' && (
          <div className="space-y-3">
            {grades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nuk ka nota të regjistruara</p>
              </div>
            ) : grades.map(g => {
              const pct = (g.score / g.maxScore) * 100;
              return (
                <div key={g.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{g.title}</h4>
                      <p className="text-sm text-gray-500">{g.subject} • {g.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(pct)}`}>
                        {g.score}/{g.maxScore}
                      </span>
                      <button onClick={() => handleDeleteGrade(g.id)} className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeView === 'absences' && (
          <div className="space-y-3">
            {absences.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Pikësim i përkryer!</p>
              </div>
            ) : (
              absences.map(a => (
                <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{a.subject}</h4>
                        {a.justified ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">E Arsyetuar</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">E Paarsyetuar</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{a.date}</p>
                      {a.reason && <p className="text-sm text-gray-600 mt-1">{a.reason}</p>}
                    </div>
                    <button onClick={() => handleDeleteAbsence(a.id)} className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => activeView === 'grades' ? setShowGrade(true) : setShowAbsence(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Modal open={showGrade} onClose={() => setShowGrade(false)} title="Shto Notë">
        <form onSubmit={handleAddGrade}>
          <Input label="Lënda" value={gradeForm.subject} onChange={e => setGradeForm({ ...gradeForm, subject: e.target.value })} required list="subjects" />
          <datalist id="subjects">{subjects.map(s => <option key={s} value={s} />)}</datalist>
          <Input label="Titulli" value={gradeForm.title} onChange={e => setGradeForm({ ...gradeForm, title: e.target.value })} required />
          <div className="flex gap-3">
            <div className="flex-1">
              <Input label="Pikët" type="number" step="0.1" value={gradeForm.score} onChange={e => setGradeForm({ ...gradeForm, score: e.target.value })} required />
            </div>
            <div className="flex-1">
              <Input label="Pikët Maksimale" type="number" value={gradeForm.maxScore} onChange={e => setGradeForm({ ...gradeForm, maxScore: e.target.value })} required />
            </div>
          </div>
          <Input label="Pesha" type="number" step="0.1" value={gradeForm.weight} onChange={e => setGradeForm({ ...gradeForm, weight: e.target.value })} />
          <Input label="Data" type="date" value={gradeForm.date} onChange={e => setGradeForm({ ...gradeForm, date: e.target.value })} required />
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowGrade(false)} className="flex-1">Anulo</Button>
            <Button type="submit" className="flex-1">Shto</Button>
          </div>
        </form>
      </Modal>

      <Modal open={showAbsence} onClose={() => setShowAbsence(false)} title="Regjistro Mungesë">
        <form onSubmit={handleAddAbsence}>
          <Input label="Lënda" value={absenceForm.subject} onChange={e => setAbsenceForm({ ...absenceForm, subject: e.target.value })} required list="abs-subjects" />
          <datalist id="abs-subjects">{subjects.map(s => <option key={s} value={s} />)}</datalist>
          <Input label="Data" type="date" value={absenceForm.date} onChange={e => setAbsenceForm({ ...absenceForm, date: e.target.value })} required />
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={absenceForm.justified}
                onChange={e => setAbsenceForm({ ...absenceForm, justified: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Mungesë e arsyetuar</span>
            </label>
          </div>
          <Input label="Arsyeja (opsionale)" value={absenceForm.reason} onChange={e => setAbsenceForm({ ...absenceForm, reason: e.target.value })} />
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowAbsence(false)} className="flex-1">Anulo</Button>
            <Button type="submit" className="flex-1">Ruaj</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const eventSourceRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      setNotifications(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const es = new EventSource(`${API_URL}/notifications/stream`);
    eventSourceRef.current = es;
    
    es.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assignment': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'grade': return <GraduationCap className="w-5 h-5 text-green-500" />;
      case 'absence': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="pb-20">
      <div className="bg-orange-500 text-white px-4 py-6 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-7 h-7" /> Njoftimet
            </h1>
            <p className="text-orange-100 mt-1">{unreadCount} të palexuara</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition"
            >
              Lexo të gjitha
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BellRing className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nuk ka njoftime</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`bg-white rounded-xl p-4 shadow-sm transition ${!n.read ? 'border-l-4 border-orange-500' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                      {!n.read && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [stats, setStats] = useState({ unreadNotifications: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats`);
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotification = async (message, type) => {
    try {
      await axios.post(`${API_URL}/notifications`, {
        type,
        title: type === 'grade' ? 'Notë e Përditësuar' : type === 'absence' ? 'Mungesë e Regjistruar' : 'Orar i Përditësuar',
        message
      });
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { id: 'schedule', label: 'Orari', icon: Calendar, color: 'bg-blue-500' },
    { id: 'grades', label: 'Notat', icon: BookOpen, color: 'bg-purple-500' },
    { id: 'notifications', label: 'Njoftimet', icon: Bell, color: 'bg-orange-500', badge: stats.unreadNotifications },
  ];

  return (
    <div className="min-h-screen bg-gray-100 max-w-md mx-auto">
      {activeTab === 'schedule' && <ScheduleTab onNotification={handleNotification} />}
      {activeTab === 'grades' && <GradesTab onNotification={handleNotification} />}
      {activeTab === 'notifications' && <NotificationsTab />}
      
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-2 pb-4">
        <div className="flex justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 relative ${activeTab === tab.id ? '' : 'text-gray-400'}`}
            >
              <div className={`p-2 rounded-xl transition ${activeTab === tab.id ? tab.color + ' text-white' : ''}`}>
                <tab.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-gray-900' : ''}`}>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
