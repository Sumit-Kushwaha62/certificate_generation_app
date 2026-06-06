import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error) setDesigns(data);
    setLoading(false);
  };

  const deleteDesign = async (id) => {
    await supabase.from('designs').delete().eq('id', id);
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF8FE]">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-[#E8E0F5] px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7C5CBF] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-black text-[#1A1A2E]">CertGen</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#1A1A2E]/50 hidden md:block">{user?.email}</span>
          <button onClick={handleLogout} className="text-xs font-bold text-[#7C5CBF] border border-[#7C5CBF] px-4 py-1.5 rounded-lg hover:bg-[#7C5CBF] hover:text-white transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-[#1A1A2E]">My Projects</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/editor')}
              className="bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              + Certificate
            </button>
            <button
              onClick={() => navigate('/book')}
              className="bg-white border border-[#7C5CBF] text-[#7C5CBF] hover:bg-[#7C5CBF] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              + Book Cover
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#1A1A2E]/40 font-medium">Loading...</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#1A1A2E]/40 font-medium mb-4">No designs yet</p>
            <button onClick={() => navigate('/editor')} className="bg-[#7C5CBF] text-white px-6 py-3 rounded-xl font-bold text-sm">
              Create your first design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {designs.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-[#E8E0F5] overflow-hidden group hover:shadow-lg transition-all">
                <div
                  className="h-36 bg-[#F2ECFF] flex items-center justify-center cursor-pointer"
                  onClick={() => navigate(d.type === 'book' ? `/book?id=${d.id}` : `/editor?id=${d.id}`)}
                >
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{d.type === 'book' ? '📖' : '🏅'}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-[#1A1A2E] truncate">{d.name}</p>
                  <p className="text-xs text-[#1A1A2E]/40 mt-0.5 capitalize">{d.type}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(d.type === 'book' ? `/book?id=${d.id}` : `/editor?id=${d.id}`)}
                      className="flex-1 text-xs font-bold text-[#7C5CBF] border border-[#7C5CBF] py-1.5 rounded-lg hover:bg-[#7C5CBF] hover:text-white transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDesign(d.id)}
                      className="text-xs font-bold text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                    >
                      ✕
                    </button>
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