import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { API, saveToken } from './types';
import type { AuthUser } from './types';

const AuthScreen = ({ onAuth }: { onAuth: (user: AuthUser, token: string) => void }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', display_name: '', password: '', phone: '' });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const url = mode === 'login' ? API.login : API.register;
      const body = mode === 'login'
        ? { username: form.username, password: form.password }
        : { username: form.username, password: form.password, display_name: form.display_name, phone: form.phone || undefined };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (!res.ok) {
        setError(parsed.error || 'Что-то пошло не так');
      } else {
        saveToken(parsed.token);
        onAuth(parsed.user, parsed.token);
      }
    } catch {
      setError('Нет соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ placeholder, value, onChange, type = 'text' }: {
    placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
  }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={e => e.key === 'Enter' && submit()}
      className="w-full bg-muted rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 transition-all"
    />
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col items-center justify-center pt-14 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <Icon name="MessageCircle" size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Линк</h1>
        <p className="text-sm text-muted-foreground mt-1">Мессенджер нового поколения</p>
      </div>

      <div className="flex mx-6 mb-6 bg-muted rounded-2xl p-1">
        {(['login', 'register'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === m ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            {m === 'login' ? 'Вход' : 'Регистрация'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-6">
        {mode === 'register' && (
          <Field placeholder="Имя и фамилия" value={form.display_name} onChange={set('display_name')} />
        )}
        <Field placeholder="Имя пользователя (логин)" value={form.username} onChange={set('username')} />
        {mode === 'register' && (
          <Field placeholder="Телефон (необязательно)" value={form.phone} onChange={set('phone')} type="tel" />
        )}
        <Field placeholder="Пароль" value={form.password} onChange={set('password')} type="password" />

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
            <Icon name="AlertCircle" size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-1 w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Подождите...</span>
            </>
          ) : (
            mode === 'login' ? 'Войти' : 'Создать аккаунт'
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 px-8">
        Продолжая, вы соглашаетесь с условиями использования сервиса Линк
      </p>
    </div>
  );
};

export default AuthScreen;
