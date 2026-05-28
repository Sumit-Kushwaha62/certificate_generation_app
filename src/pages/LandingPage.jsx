import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

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
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7C5CBF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#7C5CBF]/20">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-xl font-black tracking-tight">CertGen</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold text-gray-500 hover:text-[#7C5CBF] transition">Features</a>
          <a href="#about" className="text-sm font-bold text-gray-500 hover:text-[#7C5CBF] transition">About</a>
          <a href="#testimonials" className="text-sm font-bold text-gray-500 hover:text-[#7C5CBF] transition">Reviews</a>
          <button 
            onClick={() => navigate('/editor')}
            className="bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white px-6 py-2.5 rounded-2xl font-bold transition shadow-lg shadow-[#7C5CBF]/20"
          >
            Open Editor
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-[#F3EFF9] text-[#7C5CBF] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            ✨ Free Online Certificate Maker
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Create Professional <span className="text-[#7C5CBF]">Certificates</span> in Seconds
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Designing and issuing certificates has never been easier. Use our drag-and-drop editor to create beautiful awards for your team or students.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/editor')}
              className="w-full sm:w-auto bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-[#7C5CBF]/30 hover:scale-105"
            >
              Start Creating Free
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('features');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#F8F6FC] hover:bg-[#EFECF7] text-[#7C5CBF] px-10 py-5 rounded-[2rem] font-black text-lg transition border border-[#7C5CBF]/10"
            >
              Learn More
            </button>
          </div>
        </div>
      </header>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ title, desc }) => (
            <div key={title} className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition duration-500">
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
            <p className="mt-6 text-lg text-gray-600 font-medium leading-8">
              CertGen is a simple certificate generation platform built for schools, colleges, conferences, companies, training institutes, and event organizers. It helps teams create certificates faster with professional templates and easy editing tools.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              {['Fast Editing', 'PDF Export', 'Image Upload', 'Ready Templates'].map((item) => (
                <div key={item} className="bg-white rounded-full px-6 py-3 shadow-sm border border-purple-100 flex items-center gap-2">
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
            <div key={name} className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm hover:border-[#7C5CBF]/20 transition">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="#FFC107" className="w-5 h-5"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ))}
              </div>
              <p className="text-gray-600 font-medium text-lg leading-relaxed italic">“{review}”</p>
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
              onClick={() => navigate('/editor')}
              className="bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white px-12 py-5 rounded-[2rem] font-black text-lg transition shadow-2xl shadow-[#7C5CBF]/40"
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
          <div className="text-sm text-gray-400 font-bold">
            © 2026 CertGen. All rights reserved.
          </div>
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
