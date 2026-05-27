import { useState } from 'react';
import CertForm from './components/CertForm';
import CertPreview from './components/CertPreview';
import TemplateGrid from './components/TemplateGrid';
import ExportButton from './components/ExportButton';
import SearchBar from './components/SearchBar';
import { templates } from './data/templates';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    issuer: '',
    date: '',
  });
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top navbar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <h1 className="text-xl font-bold tracking-tight text-white">CertGen</h1>
          <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium">Beta</span>
        </div>
        <p className="text-gray-400 text-sm hidden md:block">Canva-style Certificate Generator</p>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL — 340px */}
        <aside className="w-[340px] shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-y-auto">

          {/* Search */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Templates</p>
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          {/* Template grid */}
          <div className="p-4 border-b border-gray-800">
            <TemplateGrid
              query={query}
              activeTemplate={activeTemplate}
              setActiveTemplate={setActiveTemplate}
            />
          </div>

          {/* Form */}
          <div className="p-4 flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Certificate Details</p>
            <CertForm formData={formData} setFormData={setFormData} />
          </div>
        </aside>

        {/* RIGHT PANEL — live preview */}
        <main className="flex-1 bg-gray-950 flex flex-col overflow-hidden">

          {/* Preview label bar */}
          <div className="px-6 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm text-gray-400">Live Preview — <span className="text-white font-medium">{activeTemplate?.name}</span></span>
            </div>
            <ExportButton />
          </div>

          {/* Certificate preview area */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="w-full max-w-3xl">
              <CertPreview formData={formData} activeTemplate={activeTemplate} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;