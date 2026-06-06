import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    { title: 'Modern Templates', desc: 'Choose from a variety of professionally designed certificates.' },
    { title: 'Live Editing', desc: 'See your changes instantly as you type and customize.' },
    { title: 'Fast Export', desc: 'Download high-quality PDF or PNG in just one click.' },
  ];

  const testimonials = [
    ['Dr. Emily Watson', 'The fastest way to generate certificates for my online course students.'],
    ['James Miller', 'Professional results every time. My team loves the ease of use.'],
    ['Sarah Chen', 'Perfect for our annual conference. Saved us hours of manual work.'],
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1A2E] font-sans selection:bg-[#7C5CBF]/10">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/85 backdrop-blur-xl z-50 border-b border-[#E8E0F5] px-6 md:px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7C5CBF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7C5CBF]/20">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-xl font-black tracking-tight text-[#1A1A2E]">CertGen</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold text-[#1A1A2E]/60 hover:text-[#7C5CBF] transition-colors">Features</a>
          <a href="#about" className="text-sm font-bold text-[#1A1A2E]/60 hover:text-[#7C5CBF] transition-colors">About</a>
          <a href="#testimonials" className="text-sm font-bold text-[#1A1A2E]/60 hover:text-[#7C5CBF] transition-colors">Reviews</a>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#7C5CBF] hover:bg-[#6A4DAD] active:scale-[0.98] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#7C5CBF]/20"
            >
              My Projects
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#7C5CBF] hover:bg-[#6A4DAD] active:scale-[0.98] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#7C5CBF]/20"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-24 px-6 text-center bg-[radial-gradient(circle_at_top,#F2ECFF_0%,#FFFFFF_48%,#FAF8FE_100%)]">
        <div className="max-w-5xl mx-auto">
          <span className="inline-flex items-center bg-white text-[#7C5CBF] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-[#E8E0F5] shadow-sm">
            ✨ Free Online Certificate Maker
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.04] tracking-tight text-[#1A1A2E]">
            Create Professional <span className="text-[#7C5CBF]">Certificates</span> in Seconds
          </h1>
          <p className="mt-7 text-lg md:text-xl text-[#1A1A2E]/65 font-medium max-w-2xl mx-auto leading-relaxed">
            Designing and issuing certificates has never been easier. Use our drag-and-drop editor to create beautiful awards for your team or students.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate(user ? '/editor' : '/auth')}
              className="w-full sm:w-auto bg-[#7C5CBF] hover:bg-[#6A4DAD] active:scale-[0.98] text-white px-9 py-4 rounded-2xl font-black text-base transition-all shadow-xl shadow-[#7C5CBF]/25 hover:-translate-y-0.5"
            >
              Start Creating Free
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-white hover:bg-[#FAF8FE] text-[#7C5CBF] px-9 py-4 rounded-2xl font-black text-base transition-all border border-[#E8E0F5] shadow-sm active:scale-[0.98]"
            >
              Learn More
            </button>
          </div>

          {/* TOOL SELECTION CARDS */}
          <div className="mt-16 flex flex-col sm:flex-row items-stretch justify-center gap-6 max-w-2xl mx-auto">
            
            <button
              onClick={() => navigate(user ? '/editor' : '/auth')}
              className="group flex-1 bg-white border border-[#E8E0F5] rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-[#7C5CBF]/15 hover:-translate-y-2 transition-all duration-300 text-left active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-[#EDE7F6] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.8" className="w-7 h-7">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M8 10h8M8 14h5"/>
                  <circle cx="17" cy="14" r="2.5"/>
                  <path d="M15.5 16l-1.5 2"/>
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#1A1A2E] mb-2">Certificate Maker</h3>
              <p className="text-sm text-[#1A1A2E]/55 font-medium leading-relaxed mb-5">
                Create professional certificates for courses, events, achievements and conferences.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#7C5CBF] text-sm font-black group-hover:gap-2.5 transition-all">
                Open Editor
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>

            <button
              onClick={() => navigate(user ? '/book' : '/auth')}
              className="group flex-1 bg-white border border-[#E8E0F5] rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-[#7C5CBF]/15 hover:-translate-y-2 transition-all duration-300 text-left active:scale-[0.98]"
            >
              <div className="w-14 h-14 bg-[#EDE7F6] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.8" className="w-7 h-7">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  <path d="M8 7h8M8 11h6"/>
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#1A1A2E] mb-2">Book Cover Maker</h3>
              <p className="text-sm text-[#1A1A2E]/55 font-medium leading-relaxed mb-5">
                Design stunning book covers for novels, textbooks, reports and self-published works.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[#7C5CBF] text-sm font-black group-hover:gap-2.5 transition-all">
                Open Editor
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>

          </div>
        </div>
      </header>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ title, desc }) => (
            <div key={title} className="group p-8 rounded-3xl bg-white border border-[#E8E0F5] shadow-sm hover:shadow-xl hover:shadow-[#7C5CBF]/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#F3EFF9] text-[#7C5CBF] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition">
                {title.charAt(0)}
              </div>
              <h3 className="mt-6 text-2xl font-black">{title}</h3>
              <p className="mt-3 text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#F8F6FC] py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Trusted by Educators and Professionals</h2>
            <p className="mt-6 text-lg text-[#1A1A2E]/65 font-medium leading-8">
              CertGen is a simple certificate generation platform built for schools, colleges, conferences, companies, training institutes, and event organizers.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              {['Fast Editing', 'PDF Export', 'Image Upload', 'Ready Templates'].map((item) => (
                <div key={item} className="bg-white rounded-full px-6 py-3 shadow-sm border border-[#E8E0F5] flex items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[#7C5CBF]" />
                  <span className="font-bold text-sm text-[#7C5CBF]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#7C5CBF] rounded-[3rem] rotate-3 opacity-10" />
            <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
               <div className="aspect-[4/3] bg-[#F8F6FC] rounded-[2rem] flex items-center justify-center text-[#7C5CBF]/30 font-black">
                  [ EDITOR PREVIEW ]
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">What Users Say</h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {testimonials.map(([name, review]) => (
            <div key={name} className="rounded-3xl border border-[#E8E0F5] bg-white p-10 shadow-sm hover:border-[#7C5CBF]/30 hover:shadow-xl hover:shadow-[#7C5CBF]/10 transition-all">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="#FFC107" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
              </div>
              <p className="text-gray-600 font-medium text-lg leading-relaxed italic">"{review}"</p>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F3EFF9] flex items-center justify-center text-[#7C5CBF] font-black text-xs">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="font-black text-[#1A1A2E]">{name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-[#1A1A2E] rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CBF] rounded-full blur-[120px] opacity-20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to Start?</h2>
            <p className="text-white/60 font-medium mb-12 text-lg">Create your first certificate in less than a minute. No credit card required.</p>
            <button 
              onClick={() => navigate(user ? '/editor' : '/auth')}
              className="bg-[#7C5CBF] hover:bg-[#6A4DAD] active:scale-[0.98] text-white px-10 py-4 rounded-2xl font-black text-base transition-all shadow-2xl shadow-[#7C5CBF]/40"
            >
              Get Started Now — It's Free
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition">
             <div className="w-8 h-8 bg-[#7C5CBF] rounded-xl flex items-center justify-center">
               <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
             </div>
             <span className="text-sm font-black tracking-tight">CertGen</span>
          </div>
          <div className="text-sm text-gray-400 font-bold">© 2026 CertGen. All rights reserved.</div>
          <div className="flex gap-6">
             {['Twitter', 'LinkedIn', 'Github'].map(s => (
               <a key={s} href="#" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#7C5CBF] transition">{s}</a>
             ))}
          </div>
        </div> 
      </footer>
    </div>
  );
};

export default LandingPage;