import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handle = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);
    setLoading(false);
    if (error) return setError(error.message);
    if (!isLogin) return setMessage('Check your email to confirm signup!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#F2ECFF_0%,#FFFFFF_48%)] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-[#E8E0F5] p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#7C5CBF] rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-xl font-black text-[#1A1A2E]">CertGen</span>
        </div>

        <h2 className="text-2xl font-black text-[#1A1A2E] mb-1">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-[#1A1A2E]/50 mb-6">
          {isLogin ? 'Login to access your designs' : 'Start creating for free'}
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-[#E8E0F5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C5CBF] transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-[#E8E0F5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7C5CBF] transition-colors"
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
        {message && <p className="text-green-600 text-xs mt-3">{message}</p>}

        <button
          onClick={handle}
          disabled={loading}
          className="mt-6 w-full bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="text-center text-xs text-[#1A1A2E]/50 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#7C5CBF] font-bold">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}