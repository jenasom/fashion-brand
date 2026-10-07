import React from 'react';
import { UserRound, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
export const PersonaSwitcher: React.FC = () => {
  const { user, signOut, showToast } = useApp();
  return <div className="flex items-center gap-2"><a href={user ? '#/dashboard' : '#/login'} className="flex items-center gap-2 text-xs" aria-label={user ? 'My dashboard' : 'Sign in'}><UserRound size={17} /><span>{user ? user.name.split(' ')[0] : 'Sign in'}</span></a>{user && <button aria-label="Sign out" onClick={() => signOut().catch(() => showToast('Signed out locally.', 'info'))} className="p-2"><LogOut size={15} /></button>}</div>;
};
