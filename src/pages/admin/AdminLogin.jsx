import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const { login, register } = useAdmin();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', pass: '', code: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = mode === 'login'
      ? await login(form.email, form.pass)
      : await register(form.email, form.pass, form.code);
    if (!res.ok) setError(res.error);
    setLoading(false);
  }

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Imagen */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&h=1600&fit=crop&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1714]/60 to-[#1A1714]/20" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-white text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>L'ESSENCE</p>
          <p className="text-white/50 text-sm mt-1 tracking-widest">Panel de Administración</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-xs text-[#6B6560] hover:text-[#1A1714] transition-colors mb-10 sm:mb-12 block">
            ← Volver a la tienda
          </Link>

          <h1 className="text-2xl font-bold text-[#1A1714] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {isLogin ? 'Bienvenido' : 'Crear cuenta de admin'}
          </h1>
          <p className="text-sm text-[#6B6560] mb-7">
            {isLogin ? 'Ingresa a tu panel de administración' : 'Necesitas el código de administrador para registrarte'}
          </p>

          {/* Toggle */}
          <div className="flex gap-1 p-1 bg-[#F5F0E8] rounded-xl mb-6">
            {[['login', 'Iniciar sesión'], ['register', 'Crear cuenta']].map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === m ? 'bg-white text-[#1A1714] shadow-sm' : 'text-[#6B6560] hover:text-[#1A1714]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#6B6560] uppercase font-semibold block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="w-full bg-white border border-[#1A1714]/10 rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder-[#6B6560]/40 focus:outline-none focus:border-[#B8955A]/50 focus:ring-2 focus:ring-[#B8955A]/10 transition-all shadow-sm"
                placeholder="admin@lessence.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#6B6560] uppercase font-semibold block mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.pass}
                  onChange={e => update('pass', e.target.value)}
                  className="w-full bg-white border border-[#1A1714]/10 rounded-xl px-4 py-3 pr-11 text-sm text-[#1A1714] placeholder-[#6B6560]/40 focus:outline-none focus:border-[#B8955A]/50 focus:ring-2 focus:ring-[#B8955A]/10 transition-all shadow-sm"
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6560]/40 hover:text-[#6B6560] transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Código de admin — solo en registro */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label className="text-[10px] tracking-[0.2em] text-[#6B6560] uppercase font-semibold mb-1.5 flex items-center gap-1.5">
                  <KeyRound size={11} /> Código de administrador
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => update('code', e.target.value)}
                  className="w-full bg-white border border-[#1A1714]/10 rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder-[#6B6560]/40 focus:outline-none focus:border-[#B8955A]/50 focus:ring-2 focus:ring-[#B8955A]/10 transition-all shadow-sm tracking-wider"
                  placeholder="Código secreto"
                />
                <p className="text-[11px] text-[#6B6560]/60 mt-1.5">
                  Solo quien tenga este código puede crear una cuenta de administrador.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.email || !form.pass || (!isLogin && !form.code)}
              className="flex items-center justify-center gap-2 w-full gold-gradient text-white py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : isLogin
                  ? <> Ingresar <ArrowRight size={15} /> </>
                  : <> Crear cuenta <ArrowRight size={15} /> </>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
