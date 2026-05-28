import { useState, useRef, useEffect } from 'react';
import TemplateGrid from '../components/TemplateGrid';
import CanvasEditor from '../components/CanvasEditor';
import PropertiesPanel from '../components/PropertiesPanel';
import { templates } from '../data/templates';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

let elCounter = 100;
const newId = () => `el_${++elCounter}`;

// Build elements from template fields
const buildElements = (template) =>
  template.fields.map((f) => ({
    id: f.id,
    type: 'text',
    content: f.defaultValue,
    x: f.x, y: f.y,
    fontSize: f.fontSize,
    fontFamily: f.fontFamily,
    color: f.color,
    bold: f.bold || false,
    italic: f.italic || false,
    align: f.align || 'center',
    width: f.width || 400,
  }));

function EditorPage() {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [elements, setElements] = useState(() => buildElements(templates[0]));
  const [selectedId, setSelectedId] = useState(null);
  const [activePanel, setActivePanel] = useState('form');
  const [query, setQuery] = useState('');
  const [exporting, setExporting] = useState(false);

  // Form state — linked to fixed fields
  const [formData, setFormData] = useState({
    name: '', course: '', issuer: '', date: '', title: '', subtitle: '', body: '',
  });

  const stageContainerRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Switch template → rebuild elements
  const handleTemplateSelect = (template) => {
    setActiveTemplate(template);
    setElements(buildElements(template));
    setSelectedId(null);
    setFormData({ name: '', course: '', issuer: '', date: '', title: '', subtitle: '', body: '' });
  };

  // Form change → update matching elements live
  useEffect(() => {
    setElements(prev => prev.map(el => {
      if (el.id === 'name' && formData.name) return { ...el, content: formData.name };
      if (el.id === 'course' && formData.course) return { ...el, content: formData.course };
      if (el.id === 'issuer' && formData.issuer) return { ...el, content: formData.issuer };
      if (el.id === 'date' && formData.date) return { ...el, content: formData.date };
      if (el.id === 'title' && formData.title) return { ...el, content: formData.title };
      if (el.id === 'subtitle' && formData.subtitle) return { ...el, content: formData.subtitle };
      if (el.id === 'body' && formData.body) return { ...el, content: formData.body };
      return el;
    }));
  }, [formData]);

  const addTextElement = () => {
    const el = {
      id: newId(), type: 'text', content: 'New Text',
      x: 300, y: 280, fontSize: 20, fontFamily: 'DM Sans',
      color: '#1A1A2E', bold: false, italic: false, align: 'center', width: 200,
    };
    setElements(prev => [...prev, el]);
    setSelectedId(el.id);
    setActivePanel('layers');
  };

  // Add image element from file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.src = ev.target.result;
      img.onload = () => {
        const maxW = 150;
        const ratio = img.height / img.width;
        const el = {
          id: newId(), type: 'image',
          imageObj: img,
          x: 50, y: 50,
          width: maxW,
          height: Math.round(maxW * ratio),
        };
        setElements(prev => [...prev, el]);
        setSelectedId(el.id);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Set background image on canvas
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setActiveTemplate(prev => ({ ...prev, background: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const [shareOpen, setShareOpen] = useState(false);

  const captureCanvas = async () => {
    if (!stageContainerRef.current) {
      throw new Error('Certificate canvas not found.');
    }

    const canvas = await html2canvas(stageContainerRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    return canvas;
  };

  const canvasToBlob = (canvas) =>
    new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Unable to create PNG file.'));
      }, 'image/png');
    });

  const downloadBlob = (blob, filename = 'certificate.png') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    setShareOpen(false);

    try {
      const canvas = await captureCanvas();
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob);
    } catch (err) {
      console.error(err);
      alert('Unable to download certificate. Please try again.');
    }
  };

  const shareWhatsApp = async () => {
    setShareOpen(false);

    try {
      const canvas = await captureCanvas();
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob);

      window.open('https://web.whatsapp.com', '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      alert('PNG download failed. Please try again.');
    }
  };

  const shareEmail = async () => {
    setShareOpen(false);

    try {
      const canvas = await captureCanvas();
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob);

      const subject = encodeURIComponent('My Certificate');
      const body = encodeURIComponent(
        'I have downloaded the certificate PNG. Please attach certificate.png manually before sending this email.'
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (err) {
      console.error(err);
      alert('PNG download failed. Please try again.');
    }
  };

  const shareNative = async () => {
    setShareOpen(false);

    try {
      if (!navigator.share) {
        alert('Native share is not supported in this browser.');
        return;
      }

      const canvas = await captureCanvas();
      const blob = await canvasToBlob(canvas);
      const file = new File([blob], 'certificate.png', { type: 'image/png' });

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        alert('File sharing is not supported in this browser.');
        return;
      }

      await navigator.share({
        title: 'My Certificate',
        text: 'Sharing my certificate.',
        files: [file],
      });
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error(err);
        alert('Unable to share certificate. Please try Download PNG instead.');
      }
    }
  };

  const copyToClipboard = async () => {
    setShareOpen(false);

    try {
      if (!navigator.clipboard || !window.ClipboardItem) {
        alert('Clipboard image copy is not supported in this browser.');
        return;
      }

      const canvas = await captureCanvas();
      const blob = await canvasToBlob(canvas);

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);

      alert('Certificate PNG copied to clipboard.');
    } catch (err) {
      console.error(err);
      alert('Unable to copy PNG. Please try Download PNG instead.');
    }
  };

  const exportPDF = async () => {
    if (!stageContainerRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(stageContainerRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 560] });
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 560);
      pdf.save('certificate.pdf');
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  };

  const sideIcons = [
    { id: 'templates', label: 'Templates', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg> },
    { id: 'form', label: 'Fill', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { id: 'layers', label: 'Layers', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 7V5h16v2M9 5v14m6-14v14M9 19h6"/></svg> },
    { id: 'insert', label: 'Insert', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  ];

  const inputClass = 'w-full bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-[12px] text-[#1A1A2E] placeholder-[#C0C0C0] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all';
  const labelClass = 'block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5';

  return (
    <div className="h-screen bg-[#F0F0F0] flex flex-col font-sans select-none overflow-hidden">

      {/* NAVBAR */}
      <header className="h-14 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-5 shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#7C5CBF] rounded-lg flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-[15px] font-bold text-[#1A1A2E]">CertGen</span>
          <span className="text-[10px] bg-[#EDE7F6] text-[#7C5CBF] px-2 py-0.5 rounded-full font-semibold">PRO</span>
        </div>

        <span className="text-[13px] font-medium text-[#555]">{activeTemplate?.name}</span>

        <div className="flex items-center gap-2 relative">

          {/* SHARE BUTTON */}
          <div className="relative" ref={shareRef}>
            <button
              onClick={() => setShareOpen(p => !p)}
              className="flex items-center gap-1.5 text-[12px] text-[#555] hover:text-[#7C5CBF] px-3 py-1.5 rounded-lg hover:bg-[#F3EFF9] transition font-medium border border-[#E8E8E8] hover:border-[#C4B0E8]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </button>

            {/* Dropdown */}
            {shareOpen && (
              <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-[#E8E8E8] z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F0F0F0]">
                  <p className="text-[11px] font-bold text-[#333]">Share Certificate</p>
                  <p className="text-[10px] text-[#AAA]">Download PNG, copy, or share</p>
                </div>

                {/* WhatsApp */}
                <button onClick={shareWhatsApp}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F5F5F5] transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#333]">WhatsApp</p>
                    <p className="text-[10px] text-[#AAA]">Download + open WhatsApp Web</p>
                  </div>
                </button>

                {/* Email */}
                <button onClick={shareEmail}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F5F5F5] transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2" className="w-4 h-4">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#333]">Email</p>
                    <p className="text-[10px] text-[#AAA]">Download + open email</p>
                  </div>
                </button>

                {/* Download PNG */}
                <button onClick={downloadPNG}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F5F5F5] transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#7B1FA2" strokeWidth="2" className="w-4 h-4">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#333]">Download PNG</p>
                    <p className="text-[10px] text-[#AAA]">Save as image</p>
                  </div>
                </button>

                {/* Copy to Clipboard */}
                <button onClick={copyToClipboard}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F5F5F5] transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F0FE] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2" className="w-4 h-4">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#333]">Copy to clipboard</p>
                    <p className="text-[10px] text-[#AAA]">Copy PNG image</p>
                  </div>
                </button>

                {/* Native Share */}
                <button onClick={shareNative}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#F5F5F5] transition text-left border-t border-[#F0F0F0]">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF8E1] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F57F17" strokeWidth="2" className="w-4 h-4">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#333]">Native share</p>
                    <p className="text-[10px] text-[#AAA]">Share as PNG file</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* DOWNLOAD PDF */}
          <button onClick={exportPDF} disabled={exporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${exporting ? 'bg-[#C4B0E8] cursor-not-allowed text-white' : 'bg-[#7C5CBF] hover:bg-[#6A4DAD] text-white shadow-md'}`}>
            {exporting ? 'Generating...' : <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </>}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ICON SIDEBAR */}
        <nav className="w-[72px] bg-white border-r border-[#E8E8E8] flex flex-col items-center pt-4 gap-1 shrink-0">
          {sideIcons.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActivePanel(id)}
              className={`flex flex-col items-center gap-1 w-14 py-2.5 rounded-xl transition-all ${activePanel === id ? 'bg-[#EDE7F6] text-[#7C5CBF]' : 'text-[#999] hover:bg-[#F5F5F5] hover:text-[#555]'}`}>
              {icon}
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          ))}
        </nav>

        {/* BROWSE PANEL */}
        <aside className="w-[280px] bg-white border-r border-[#E8E8E8] flex flex-col shrink-0 overflow-hidden">
          <div className="px-4 pt-5 pb-3 border-b border-[#F0F0F0]">
            <h2 className="text-[13px] font-bold text-[#1A1A2E] mb-3">
              {activePanel === 'templates' ? 'Templates' : activePanel === 'form' ? 'Fill Certificate' : activePanel === 'layers' ? 'Layers' : 'Insert Element'}
            </h2>
            {activePanel === 'templates' && (
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates..."
                  className="w-full bg-[#F7F7F7] border border-[#E8E8E8] rounded-lg pl-8 pr-3 py-2 text-[12px] placeholder-[#BBB] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30 focus:border-[#7C5CBF] transition"/>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* TEMPLATES */}
            {activePanel === 'templates' && (
              <TemplateGrid query={query} activeTemplate={activeTemplate} setActiveTemplate={handleTemplateSelect} />
            )}

            {/* FORM FILL */}
            {activePanel === 'form' && (
              <div className="p-4 flex flex-col gap-4">
                <div className="bg-gradient-to-br from-[#F3EFF9] to-[#EDE7F6] rounded-xl p-3.5 border border-[#E0D8F0]">
                  <p className="text-[11px] font-bold text-[#7C5CBF]">✏️ Fill Certificate</p>
                  <p className="text-[10px] text-[#9B8BBF] mt-0.5">Type below → updates live on certificate</p>
                </div>
                {[
                  { key: 'name', label: 'Recipient Name', placeholder: 'e.g. Aisha Sharma', icon: '👤' },
                  { key: 'course', label: 'Course / Achievement', placeholder: 'e.g. Full Stack Dev', icon: '📚' },
                  { key: 'issuer', label: 'Issued By', placeholder: 'e.g. Edwin INC', icon: '🏛️' },
                  { key: 'date', label: 'Date', placeholder: 'e.g. May 28, 2026', icon: '📅' },
                  { key: 'title', label: 'Certificate Title (optional)', placeholder: 'e.g. CERTIFICATE OF...', icon: '🏆' },
                  { key: 'body', label: 'Body Text (optional)', placeholder: 'has successfully...', icon: '📝' },
                ].map(({ key, label, placeholder, icon }) => (
                  <div key={key}>
                    <label className={labelClass}><span className="mr-1">{icon}</span>{label}</label>
                    <input type="text" placeholder={placeholder} value={formData[key]}
                      onChange={(e) => setFormData(p => ({ ...p, [key]: e.target.value }))}
                      className={inputClass} />
                  </div>
                ))}
                <button onClick={() => setFormData({ name:'',course:'',issuer:'',date:'',title:'',subtitle:'',body:'' })}
                  className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#AAA] border border-[#E8E8E8] hover:text-[#777] hover:border-[#CCC] transition bg-white">
                  Clear all
                </button>
              </div>
            )}

            {/* LAYERS */}
            {activePanel === 'layers' && (
              <div className="p-4 flex flex-col gap-3">
                <button onClick={addTextElement}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-[#C4B0E8] text-[#7C5CBF] text-[12px] font-semibold hover:bg-[#F3EFF9] transition flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Text Box
                </button>
                <p className="text-[10px] text-[#BBB] font-semibold uppercase tracking-wide mt-1">All elements</p>
                {elements.map((el) => (
                  <button key={el.id} onClick={() => setSelectedId(el.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-[11px] transition-all flex items-center gap-2
                      ${selectedId === el.id ? 'border-[#7C5CBF] bg-[#EDE7F6] text-[#7C5CBF] font-semibold' : 'border-[#E8E8E8] bg-[#F8F8F8] text-[#444] hover:border-[#C4B0E8]'}`}>
                    <span className="text-[10px] opacity-50">{el.type === 'image' ? '🖼' : 'T'}</span>
                    <span className="truncate">{el.type === 'image' ? 'Image' : el.content}</span>
                  </button>
                ))}
              </div>
            )}

            {/* INSERT */}
            {activePanel === 'insert' && (
              <div className="p-4 flex flex-col gap-3">
                <p className="text-[10px] text-[#AAA] font-semibold uppercase tracking-wide">Add to certificate</p>

                {/* Upload background */}
                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#C4B0E8] hover:bg-[#F9F6FF] transition cursor-pointer">
                  <div className="w-9 h-9 bg-[#F3EFF9] rounded-lg flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#333]">Background Image</p>
                    <p className="text-[10px] text-[#AAA]">Set full canvas background</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                </label>

                {activeTemplate?.background && (
                  <button
                    onClick={() => setActiveTemplate(prev => ({ ...prev, background: null }))}
                    className="w-full py-2 rounded-xl text-[11px] font-semibold text-red-400 border border-red-200 hover:bg-red-50 transition">
                    ✕ Remove Background
                  </button>
                )}

                {/* Add text */}
                <button onClick={() => { addTextElement(); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#C4B0E8] hover:bg-[#F9F6FF] transition text-left">
                  <div className="w-9 h-9 bg-[#EDE7F6] rounded-lg flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="2" className="w-4 h-4"><path d="M4 7V5h16v2M9 5v14m6-14v14M9 19h6"/></svg>
                  </div>
                  <div><p className="text-[12px] font-semibold text-[#333]">Text Box</p><p className="text-[10px] text-[#AAA]">Add editable text</p></div>
                </button>

                {/* Upload image/logo */}
                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#C4B0E8] hover:bg-[#F9F6FF] transition cursor-pointer">
                  <div className="w-9 h-9 bg-[#E8F5E9] rounded-lg flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <div><p className="text-[12px] font-semibold text-[#333]">Upload Logo / Image</p><p className="text-[10px] text-[#AAA]">PNG, JPG, SVG</p></div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>

                {/* Upload QR */}
                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#C4B0E8] hover:bg-[#F9F6FF] transition cursor-pointer">
                  <div className="w-9 h-9 bg-[#FFF3E0] rounded-lg flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#E65100" strokeWidth="2" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
                  </div>
                  <div><p className="text-[12px] font-semibold text-[#333]">Upload QR Code</p><p className="text-[10px] text-[#AAA]">PNG image of QR</p></div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>

                {/* Upload signature */}
                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#C4B0E8] hover:bg-[#F9F6FF] transition cursor-pointer">
                  <div className="w-9 h-9 bg-[#E3F2FD] rounded-lg flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2" className="w-4 h-4"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </div>
                  <div><p className="text-[12px] font-semibold text-[#333]">Upload Signature</p><p className="text-[10px] text-[#AAA]">PNG with transparent bg</p></div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            )}
          </div>
        </aside>

        {/* CANVAS */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#EBEBEB]">
          <div className="h-11 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-5 shrink-0">
            <span className="flex items-center gap-1.5 text-[11px] text-[#888]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
              Click to select · Double-click to edit · Drag to move
            </span>
            {selectedId && (
              <button onClick={() => setSelectedId(null)} className="text-[11px] text-[#AAA] hover:text-[#555]">Deselect ✕</button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div>
              <div ref={stageContainerRef}
                className="rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-[#D8D8D8]"
                style={{ width: 800, height: 560 }}>
                <CanvasEditor
                  activeTemplate={activeTemplate}
                  elements={elements}
                  setElements={setElements}
                  selectedId={selectedId}
                  setSelectedId={(id) => { setSelectedId(id); if (id) setActivePanel('layers'); }}
                />
              </div>
              <p className="text-center text-[10px] text-[#AAA] mt-3">Certificate (Landscape) · 800 × 566</p>
            </div>
          </div>
        </main>

        {/* PROPERTIES PANEL */}
        <PropertiesPanel elements={elements} selectedId={selectedId} setElements={setElements} />
      </div>
    </div>
  );
}

export default EditorPage;