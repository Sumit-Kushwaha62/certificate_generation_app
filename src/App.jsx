import { useState, useRef } from 'react';
import TemplateGrid from './components/TemplateGrid';
import CanvasEditor from './components/CanvasEditor';
import PropertiesPanel from './components/PropertiesPanel';
import { templates } from './data/templates';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

let elCounter = 100;
const newId = () => `el_${++elCounter}`;

const DEFAULT_ELEMENTS = [
  {
    id: newId(), type: 'text',
    content: 'Recipient Name',
    x: 200, y: 220,
    fontSize: 36, fontFamily: 'Playfair Display',
    color: '#1A1A2E', bold: true, italic: false, align: 'center', width: 400,
  },
  {
    id: newId(), type: 'text',
    content: 'Course / Achievement',
    x: 200, y: 290,
    fontSize: 20, fontFamily: 'DM Sans',
    color: '#555555', bold: false, italic: true, align: 'center', width: 400,
  },
  {
    id: newId(), type: 'text',
    content: 'Issued by Organization',
    x: 200, y: 400,
    fontSize: 13, fontFamily: 'DM Sans',
    color: '#888888', bold: false, italic: false, align: 'center', width: 400,
  },
];

function App() {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState(null);
  const [activePanel, setActivePanel] = useState('templates');
  const [query, setQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const stageContainerRef = useRef(null);

  const addTextElement = () => {
    const el = {
      id: newId(), type: 'text',
      content: 'New Text',
      x: 300, y: 280,
      fontSize: 20, fontFamily: 'DM Sans',
      color: '#1A1A2E', bold: false, italic: false, align: 'center', width: 200,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
    setActivePanel('text');
  };

  const handleTemplateSelect = (template) => {
    setActiveTemplate(template);
    setSelectedId(null);
  };

  const exportPDF = async () => {
    if (!stageContainerRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(stageContainerRef.current, {
        scale: 2, useCORS: true, backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 560] });
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 560);
      pdf.save('certificate.pdf');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const sideIcons = [
    {
      id: 'templates', label: 'Templates',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <rect x="3" y="3" width="8" height="8" rx="1.5"/>
          <rect x="13" y="3" width="8" height="8" rx="1.5"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5"/>
          <rect x="13" y="13" width="8" height="8" rx="1.5"/>
        </svg>
      ),
    },
    {
      id: 'text', label: 'Text',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <path d="M4 7V5h16v2M9 5v14m6-14v14M9 19h6"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen bg-[#F0F0F0] flex flex-col font-sans select-none overflow-hidden">

      {/* TOP NAVBAR */}
      <header className="h-14 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-5 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#7C5CBF] rounded-lg flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-[#1A1A2E] tracking-tight">CertGen</span>
          <span className="text-[10px] bg-[#EDE7F6] text-[#7C5CBF] px-2 py-0.5 rounded-full font-semibold">PRO</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#666]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          <span className="font-medium text-[#333]">{activeTemplate?.name ?? 'Select Template'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addTextElement}
            className="flex items-center gap-1.5 text-[12px] text-[#555] hover:text-[#7C5CBF] px-3 py-1.5 rounded-lg hover:bg-[#F3EFF9] transition font-medium border border-[#E8E8E8] hover:border-[#C4B0E8]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Text
          </button>
          <button
            onClick={exportPDF}
            disabled={exporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all
              ${exporting
                ? 'bg-[#C4B0E8] cursor-not-allowed text-white'
                : 'bg-[#7C5CBF] hover:bg-[#6A4DAD] active:scale-95 text-white shadow-md shadow-[#7C5CBF]/30'
              }`}
          >
            {exporting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* ICON SIDEBAR */}
        <nav className="w-[72px] bg-white border-r border-[#E8E8E8] flex flex-col items-center pt-4 gap-1 shrink-0">
          {sideIcons.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              className={`flex flex-col items-center gap-1 w-14 py-2.5 rounded-xl transition-all text-center
                ${activePanel === id
                  ? 'bg-[#EDE7F6] text-[#7C5CBF]'
                  : 'text-[#999] hover:bg-[#F5F5F5] hover:text-[#555]'
                }`}
            >
              {icon}
              <span className="text-[9px] font-semibold tracking-wide leading-tight">{label}</span>
            </button>
          ))}
        </nav>

        {/* BROWSE PANEL */}
        <aside className="w-[280px] bg-white border-r border-[#E8E8E8] flex flex-col shrink-0 overflow-hidden">
          <div className="px-4 pt-5 pb-3 border-b border-[#F0F0F0]">
            <h2 className="text-[13px] font-bold text-[#1A1A2E] mb-3">
              {activePanel === 'templates' ? 'Templates' : 'Text Elements'}
            </h2>
            {activePanel === 'templates' && (
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full bg-[#F7F7F7] border border-[#E8E8E8] rounded-lg pl-8 pr-3 py-2 text-[12px] text-[#333] placeholder-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30 focus:border-[#7C5CBF] transition"
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activePanel === 'templates' ? (
              <TemplateGrid
                query={query}
                activeTemplate={activeTemplate}
                setActiveTemplate={handleTemplateSelect}
              />
            ) : (
              <div className="p-4 flex flex-col gap-3">
                <button
                  onClick={addTextElement}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-[#C4B0E8] text-[#7C5CBF] text-[12px] font-semibold hover:bg-[#F3EFF9] transition-all flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Text Box
                </button>
                <p className="text-[10px] text-[#BBB] font-semibold uppercase tracking-wide mt-2">Current elements</p>
                {elements.map((el) => (
                  <button
                    key={el.id}
                    onClick={() => setSelectedId(el.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-[11px] transition-all
                      ${selectedId === el.id
                        ? 'border-[#7C5CBF] bg-[#EDE7F6] text-[#7C5CBF] font-semibold'
                        : 'border-[#E8E8E8] bg-[#F8F8F8] text-[#444] hover:border-[#C4B0E8]'
                      }`}
                  >
                    <span className="mr-1.5 font-bold">T</span>
                    <span className="truncate">{el.content}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CANVAS AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#EBEBEB]">
          <div className="h-11 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-5 shrink-0">
            <span className="flex items-center gap-1.5 text-[11px] text-[#888]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
              Click to select · Double-click to edit · Drag to move
            </span>
            {selectedId && (
              <button onClick={() => setSelectedId(null)} className="text-[11px] text-[#AAA] hover:text-[#555] transition">
                Deselect ✕
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-10 overflow-auto">
            <div>
              <div
                ref={stageContainerRef}
                className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#D8D8D8]"
                style={{ width: 800, height: 560 }}
              >
                <CanvasEditor
                  activeTemplate={activeTemplate}
                  elements={elements}
                  setElements={setElements}
                  selectedId={selectedId}
                  setSelectedId={(id) => {
                    setSelectedId(id);
                    if (id) setActivePanel('text');
                  }}
                />
              </div>
              <p className="text-center text-[10px] text-[#AAA] mt-3 tracking-wide">
                Certificate (Landscape) · 800 × 560
              </p>
            </div>
          </div>
        </main>

        {/* PROPERTIES PANEL */}
        <PropertiesPanel
          elements={elements}
          selectedId={selectedId}
          setElements={setElements}
        />
      </div>
    </div>
  );
}

export default App;


/* 

trivilio

*/