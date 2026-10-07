import React, { useState } from 'react';
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const demos = [{ role: 'Customer', email: 'customer@atelierofficial.com', text: 'Your wardrobe, orders & saved pieces' }, { role: 'Student', email: 'student@atelierofficial.com', text: 'Your courses, classes & certificates' }, { role: 'Instructor', email: 'folashade@atelierofficial.com', text: 'Your teaching studio & mentoring' }, { role: 'Admin', email: 'admin@atelierofficial.com', text: 'Your business, inventory & academy' }];
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const user = await signIn(email.trim(), password); const role = ['ADMIN', 'INSTRUCTOR', 'STUDENT', 'CUSTOMER'].find(r => user.roles.includes(r as any)); onNavigate('/dashboard/' + role?.toLowerCase()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.'); }
    finally { setBusy(false); }
  };
  return <div className="login-layout"><div className="login-art"><img src="/assets/garments/royal-golden-boubou.jpg" alt="Golden African couture and matching headwrap" /><div><span className="eyebrow">Atelier &amp; Académie</span><h1>Your culture.<br />Your craft.<br />Your space.</h1></div></div><section className="login-form"><span className="eyebrow">Welcome to your atelier</span><h2>Make yourself<br />at home.</h2><p>Sign in to your personal space.</p><form onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /><label htmlFor="login-password">Password</label><div className="password-field"><input id="login-password" type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="brand-button" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Sign in'} <ArrowUpRight size={18} /></button></form><div className="demo-logins"><span className="eyebrow">Explore a demo account</span><p>Choose a role to fill in its login details.<br />Demo password: <strong>AtelierDemo26!</strong></p><div className="demo-role-grid">{demos.map(d => <button key={d.role} disabled={busy} onClick={() => { setEmail(d.email); setPassword('AtelierDemo26!'); setError(''); }}><strong>{d.role}<ArrowUpRight size={14} /></strong><span>{d.text}</span></button>)}</div></div></section></div>;
};
