import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        // navigate happens via useEffect when user is set
      } else {
        if (!form.name.trim())     throw new Error('Name is required');
        if (!form.email.trim())    throw new Error('Email is required');
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters');
        await signup(form.name, form.email, form.password);
        // ✅ Show success and switch to login tab
        setSuccess(`Account created! Please log in, ${form.name.split(' ')[0]} 👋`);
        setForm({ name: '', email: form.email, password: '' });
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        {['🎬','🎥','🍿','⭐','🎭','📽️'].map((e, i) => (
          <span key={i} className={styles.floatEmoji} style={{ '--i': i }}>{e}</span>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>🎬</div>
        <h1 className={styles.brand}>CineSearch</h1>
        <p className={styles.tagline}>Your personal movie universe</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          >Login</button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
          >Sign Up</button>
        </div>

        <div className={styles.form} onKeyDown={handleKeyDown}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="John Doe" />
            </div>
          )}
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>

          {error   && <p className={styles.error}>⚠ {error}</p>}
          {success && <p className={styles.successMsg}>✅ {success}</p>}

          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Login →' : 'Create Account →'}
          </button>
        </div>

        <p className={styles.hint}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}>
            {mode === 'login' ? 'Sign up free' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}