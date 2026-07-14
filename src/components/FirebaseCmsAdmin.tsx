import React, { useEffect, useMemo, useState } from 'react';

type SectionKey = 'careers' | 'job-categories' | 'career-page-settings' | 'downloadable-guides';

type Section = {
  key: SectionKey;
  label: string;
  endpoint: string;
  example: string;
};

const sections: Section[] = [
  {
    key: 'careers',
    label: 'Careers',
    endpoint: '/api/admin/careers',
    example: '{\n  "software-engineer": { "title": "Software Engineer", "published": true }\n}',
  },
  {
    key: 'job-categories',
    label: 'Job Categories',
    endpoint: '/api/admin/job-categories',
    example: '{\n  "engineering": { "name": "Engineering", "order": 1, "published": true }\n}',
  },
  {
    key: 'career-page-settings',
    label: 'Career Page Settings',
    endpoint: '/api/admin/career-page-settings',
    example: '{\n  "hero_title": "Join Our Team",\n  "hero_subtitle": "Real challenges, real growth"\n}',
  },
  {
    key: 'downloadable-guides',
    label: 'Downloadable Guides',
    endpoint: '/api/admin/downloadable-guides',
    example: '{\n  "guide-1": { "title": "Cloud Cost Optimization", "published": true, "order": 1 }\n}',
  },
];

const STORAGE_KEY = 'atek-firebase-cms-token';

const FirebaseCmsAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [active, setActive] = useState<SectionKey>('careers');
  const [text, setText] = useState('{}');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const current = useMemo(() => sections.find(section => section.key === active)!, [active]);

  useEffect(() => {
    setToken(localStorage.getItem(STORAGE_KEY) || '');
  }, []);

  async function login() {
    setLoading(true);
    setStatus('');
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Login failed');
      }
      localStorage.setItem(STORAGE_KEY, payload.token);
      setToken(payload.token);
      setStatus('Login successful.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  async function loadSection(section = current) {
    setLoading(true);
    setStatus('');
    try {
      const response = await fetch(section.endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load section');
      }
      setText(JSON.stringify(payload, null, 2));
      setStatus(`Loaded ${section.label}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function saveSection() {
    setLoading(true);
    setStatus('');
    try {
      const parsed = JSON.parse(text);
      const response = await fetch(current.endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save section');
      }
      setStatus(`${current.label} saved to Firebase.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save data');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setStatus('Logged out.');
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h1 className="text-2xl font-bold">Firebase CMS Login</h1>
          <p className="text-slate-300 text-sm">Login with CMS admin credentials from server environment.</p>
          <input className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full rounded-lg bg-cyan-500 text-slate-900 p-3 font-semibold disabled:opacity-60" onClick={login} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          {status && <p className="text-sm text-amber-300">{status}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Firebase CMS Admin</h1>
            <p className="text-slate-300 text-sm">Manage Careers, Job Categories, Career Page Settings, and Downloadable Guides.</p>
          </div>
          <button className="rounded-lg bg-rose-500 text-white px-4 py-2 font-semibold" onClick={logout}>Logout</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => {
                setActive(section.key);
                setText(section.example);
                setStatus('');
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${active === section.key ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold" onClick={() => loadSection()} disabled={loading}>Load</button>
          <button className="rounded-lg bg-emerald-500 text-slate-950 px-4 py-2 text-sm font-semibold" onClick={saveSection} disabled={loading}>Save</button>
        </div>

        <textarea
          className="w-full min-h-[540px] rounded-xl border border-slate-700 bg-slate-900 p-4 font-mono text-sm"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        {status && <p className="text-sm text-amber-300">{status}</p>}
      </div>
    </div>
  );
};

export default FirebaseCmsAdmin;