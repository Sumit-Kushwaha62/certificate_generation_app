import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TemplateGrid from '../components/TemplateGrid';
import CanvasEditor from '../components/CanvasEditor';
import PropertiesPanel from '../components/PropertiesPanel';
import { bookTemplates, BOOK_CANVAS_W, BOOK_CANVAS_H } from '../data/bookTemplates';
import useExport from '../hooks/useExport';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

let elCounter = 100;
const newId = () => `el_${++elCounter}`;
const MAX_HISTORY = 30;
const HISTORY_DEBOUNCE_MS = 300;

const cloneElementsSnapshot = (items) => items.map((el) => ({ ...el }));

const getSnapshotKey = (items) =>
  JSON.stringify(items.map((el) => {
    const snapshot = { ...el };
    delete snapshot.imageObj;
    return snapshot;
  }));

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
    shadowEnabled: f.shadowEnabled || false,
    shadowColor: f.shadowColor || 'rgba(0,0,0,0.35)',
    shadowBlur: f.shadowBlur || 4,
    shadowOffsetX: f.shadowOffsetX || 2,
    shadowOffsetY: f.shadowOffsetY || 2,
  }));

const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(value.trim());
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = '';
    } else {
      value += char;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells) =>
    headers.reduce((acc, header, index) => {
      acc[header] = cells[index] || '';
      return acc;
    }, {})
  );
};

const safeFilename = (name) =>
  String(name || 'certificate')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_') || 'certificate';

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const FIELD_ALIASES = {
  name: ['name', 'participantName'],
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const createQRImage = async (value) => {
  const dataURL = await QRCode.toDataURL(`https://verify.cert/${value}`, {
    margin: 1,
    width: 256,
  });
  return loadImage(dataURL);
};

function BookEditorPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTemplate, setActiveTemplate] = useState(bookTemplates[0]);
  const [elements, setElements] = useState(() => buildElements(bookTemplates[0]));
  const [historyStack, setHistoryStack] = useState(() => [
    cloneElementsSnapshot(buildElements(bookTemplates[0])),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [activePanel, setActivePanel] = useState('form');
  const [query, setQuery] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkProgress, setBulkProgress] = useState('');
  const [bulkGenerating, setBulkGenerating] = useState(false);

  // Save state
  const [designId, setDesignId] = useState(null);
  const [designName, setDesignName] = useState('Untitled Book Cover');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Form state — dynamic, keyed by field id
  const [formData, setFormData] = useState({});

  const stageRef = useRef(null);
  const shareRef = useRef(null);
  const historyTimerRef = useRef(null);
  const isRestoringHistoryRef = useRef(false);
  const skipHistoryRef = useRef(false);
  const {
    exportPDF,
    downloadPNG,
    shareWhatsApp,
    shareEmail,
    shareNative,
    copyToClipboard,
    exporting,
  } = useExport(stageRef, () => setShareOpen(false));
  const regNumberValue = elements.find((el) => el.id === 'regNumber')?.content?.trim();
  const hasQRCode = elements.some((el) => el.qrCode);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  // Load existing design if ?id= present
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    supabase.from('designs').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) return;
      setDesignId(data.id);
      setDesignName(data.name);
      if (data.elements) setElements(data.elements);
    });
  }, []);

  useEffect(() => {
    if (isRestoringHistoryRef.current) {
      isRestoringHistoryRef.current = false;
      return;
    }
    if (skipHistoryRef.current) return;

    if (historyTimerRef.current) clearTimeout(historyTimerRef.current);

    historyTimerRef.current = setTimeout(() => {
      const nextSnapshot = cloneElementsSnapshot(elements);
      const nextKey = getSnapshotKey(nextSnapshot);

      setHistoryStack((prev) => {
        const currentSnapshot = prev[historyIndex];
        if (currentSnapshot && getSnapshotKey(currentSnapshot) === nextKey) return prev;

        const trimmed = prev.slice(0, historyIndex + 1);
        const nextStack = [...trimmed, nextSnapshot].slice(-MAX_HISTORY);
        setHistoryIndex(nextStack.length - 1);
        return nextStack;
      });
    }, HISTORY_DEBOUNCE_MS);

    return () => {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    };
  }, [elements, historyIndex]);

  const restoreHistorySnapshot = useCallback((nextIndex) => {
    const snapshot = historyStack[nextIndex];
    if (!snapshot) return;

    isRestoringHistoryRef.current = true;
    setElements(cloneElementsSnapshot(snapshot));
    setHistoryIndex(nextIndex);
    setSelectedId(null);
  }, [historyStack]);

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    restoreHistorySnapshot(historyIndex - 1);
  }, [canUndo, historyIndex, restoreHistorySnapshot]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    restoreHistorySnapshot(historyIndex + 1);
  }, [canRedo, historyIndex, restoreHistorySnapshot]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

      const key = e.key.toLowerCase();
      if (key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo]);
  // Delete selected element with Delete/Backspace key (when not typing in an input)
  useEffect(() => {
    const handler = (e) => {
      if (!selectedId) return;
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId]);


  useEffect(() => {
    const handler = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!hasQRCode || !regNumberValue) return;

    let cancelled = false;
    createQRImage(regNumberValue)
      .then((img) => {
        if (cancelled) return;
        setElements((prev) =>
          prev.map((el) =>
            el.qrCode
              ? {
                  ...el,
                  imageObj: img,
                  qrRegNumber: regNumberValue,
                  qrContent: `https://verify.cert/${regNumberValue}`,
                }
              : el
          )
        );
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [hasQRCode, regNumberValue]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg('');

    const serializableElements = elements.map(({ imageObj, ...rest }) => rest);

    const payload = {
      user_id: user.id,
      name: designName,
      type: 'book',
      elements: serializableElements,
      updated_at: new Date().toISOString(),
    };

    if (designId) {
      await supabase.from('designs').update(payload).eq('id', designId);
    } else {
      const { data } = await supabase.from('designs').insert(payload).select().single();
      if (data) setDesignId(data.id);
    }

    setSaving(false);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  // Switch template → rebuild elements
  const handleTemplateSelect = (template) => {
    const nextElements = buildElements(template);
    setActiveTemplate(template);
    setElements(nextElements);
    setHistoryStack([cloneElementsSnapshot(nextElements)]);
    setHistoryIndex(0);
    setSelectedId(null);
    setFormData({});
  };

  // Form change → update matching elements live (dynamic, works for all templates)
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;
    setElements(prev => prev.map(el => {
      const val = formData[el.id];
      return val !== undefined && val !== '' ? { ...el, content: val } : el;
    }));
  }, [formData]);

  const addTextElement = () => {
    const el = {
      id: newId(), type: 'text', content: 'New Text',
      x: 300, y: 280, fontSize: 20, fontFamily: 'DM Sans',
      color: '#1A1A2E', bold: false, italic: false, align: 'center', width: 200,
      shadowEnabled: false, shadowColor: 'rgba(0,0,0,0.35)',
      shadowBlur: 4, shadowOffsetX: 2, shadowOffsetY: 2,
    };
    setElements(prev => [...prev, el]);
    setSelectedId(el.id);
    setActivePanel('layers');
  };

  const addQRCode = async () => {
    const value = regNumberValue || String(Date.now());

    try {
      const img = await createQRImage(value);
      const el = {
        id: newId(),
        type: 'image',
        imageObj: img,
        x: 680,
        y: 460,
        width: 80,
        height: 80,
        qrCode: true,
        qrRegNumber: regNumberValue || '',
        qrContent: `https://verify.cert/${value}`,
      };

      setElements((prev) => [...prev, el]);
      setSelectedId(el.id);
      setActivePanel('layers');
    } catch (err) {
      console.error(err);
      alert('Unable to generate QR code. Please try again.');
    }
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

  const handleBulkCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result || '');
      setBulkRows(rows);
      setBulkFileName(file.name);
      setBulkProgress(rows.length ? `Ready: ${rows.length} certificates` : 'No valid CSV rows found.');
    };
    reader.readAsText(file);
  };

  const applyBulkRow = (row, qrImageObj = null, qrValue = '') => {
    setElements((prev) =>
      prev.map((el) => {
        const csvKey = Object.keys(row).find((key) => {
          const targets = FIELD_ALIASES[key] || [key];
          return targets.includes(el.id);
        });

        if (el.qrCode && qrImageObj) {
          return {
            ...el,
            imageObj: qrImageObj,
            qrRegNumber: row.regNumber || '',
            qrContent: `https://verify.cert/${qrValue}`,
          };
        }

        return csvKey ? { ...el, content: row[csvKey] } : el;
      })
    );
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const generateBulkCertificates = async () => {
    if (!stageRef.current || bulkRows.length === 0) return;

    const originalElements = elements;
    const zip = new JSZip();
    skipHistoryRef.current = true;
    setBulkGenerating(true);

    try {
      for (let index = 0; index < bulkRows.length; index += 1) {
        const row = bulkRows[index];
        setBulkProgress(`Generating ${index + 1}/${bulkRows.length}...`);
        const qrValue = row.regNumber || String(Date.now());
        const qrImageObj = hasQRCode ? await createQRImage(qrValue) : null;
        applyBulkRow(row, qrImageObj, qrValue);
        await nextFrame();

        const dataURL = stageRef.current.toDataURL({
          mimeType: 'image/png',
          pixelRatio: 4,
        });
        const base64 = dataURL.split(',')[1];
        zip.file(`certificate_${safeFilename(row.name)}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, 'certificates_bulk.zip');
      setBulkProgress(`Generated ${bulkRows.length}/${bulkRows.length}`);
    } catch (err) {
      console.error(err);
      setBulkProgress('Bulk generation failed. Please try again.');
    } finally {
      setElements(originalElements);
      setBulkGenerating(false);
      setTimeout(() => {
        skipHistoryRef.current = false;
      }, HISTORY_DEBOUNCE_MS);
    }
  };

  const sideIcons = [
    { id: 'templates', label: 'Templates', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg> },
    { id: 'form', label: 'Fill', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { id: 'layers', label: 'Layers', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 7V5h16v2M9 5v14m6-14v14M9 19h6"/></svg> },
    { id: 'insert', label: 'Insert', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  ];

  const inputClass = 'w-full bg-[#FAF8FE] border border-[#E8E0F5] rounded-xl px-3.5 py-2.5 text-[12px] text-[#1A1A2E] placeholder-[#1A1A2E]/35 focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all';
  const labelClass = 'block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5';

  return (
    <div className="h-screen bg-[#F7F4FB] flex flex-col font-sans select-none overflow-hidden text-[#1A1A2E]">

      {/* NAVBAR */}
      <header className="h-16 bg-white border-b border-[#E8E0F5] flex items-center justify-between px-5 shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#7C5CBF] rounded-lg flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-[15px] font-bold text-[#1A1A2E]">CertGen</span>
          <span className="text-[10px] bg-[#EDE7F6] text-[#7C5CBF] px-2 py-0.5 rounded-full font-semibold">BOOK</span>
          <span className="text-[10px] bg-[#EDE7F6] text-[#7C5CBF] px-2 py-0.5 rounded-full font-semibold">PRO</span>
        </div>

        <input
          type="text"
          value={designName}
          onChange={e => setDesignName(e.target.value)}
          className="text-[12px] font-bold text-[#7C5CBF] bg-[#FAF8FE] border border-[#E8E0F5] px-3 py-1.5 rounded-full text-center focus:outline-none focus:border-[#7C5CBF] w-48"
        />

        <div className="flex items-center gap-2.5 relative">

          <div className="flex items-center gap-1 rounded-2xl border border-[#E8E0F5] bg-[#FAF8FE] p-1 shadow-sm">
          {/* SHARE BUTTON */}
          <div className="relative" ref={shareRef}>
            <button
              onClick={() => setShareOpen(p => !p)}
              title="Share certificate"
              className="flex items-center gap-1.5 text-[12px] text-[#1A1A2E]/70 hover:text-[#7C5CBF] px-3 py-1.5 rounded-xl hover:bg-white transition-all font-bold"
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

          {/* ADD QR CODE */}
          <button
            onClick={addQRCode}
            title="Add QR code"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all bg-white text-[#7C5CBF] border border-[#E8E0F5] hover:border-[#C4B0E8] hover:shadow-sm active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><path d="M14 14h2v2h-2zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z"/>
            </svg>
            Add QR Code
          </button>
          </div>

          {/* UNDO / REDO */}
          <div className="flex items-center gap-1 rounded-2xl border border-[#E8E0F5] bg-[#FAF8FE] p-1 shadow-sm">
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className={`flex items-center justify-center w-9 h-9 rounded-xl text-[13px] font-bold transition-all border ${
              canUndo
                ? 'bg-white text-[#7C5CBF] border-[#E8E0F5] hover:border-[#C4B0E8] hover:shadow-sm active:scale-[0.98]'
                : 'bg-[#F5F3FA] text-[#B8AEC8] border-[#E8E0F5] cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>
            </svg>
            <span className="sr-only">Undo</span>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className={`flex items-center justify-center w-9 h-9 rounded-xl text-[13px] font-bold transition-all border ${
              canRedo
                ? 'bg-white text-[#7C5CBF] border-[#E8E0F5] hover:border-[#C4B0E8] hover:shadow-sm active:scale-[0.98]'
                : 'bg-[#F5F3FA] text-[#B8AEC8] border-[#E8E0F5] cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>
            </svg>
            <span className="sr-only">Redo</span>
          </button>
          </div>

          {/* BULK GENERATE */}
          <div className="flex items-center gap-1 rounded-2xl border border-[#E8E0F5] bg-[#FAF8FE] p-1 shadow-sm">
          <button
            onClick={() => setBulkOpen(true)}
            title="Bulk generate from CSV"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all bg-white text-[#7C5CBF] border border-[#E8E0F5] hover:border-[#C4B0E8] hover:shadow-sm active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
            Bulk Generate
          </button>

          {/* SAVE BUTTON */}
          {user && (
          <button
            onClick={handleSave}
            disabled={saving}
            title="Save design"
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white shadow-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : saveMsg ? '✓ Saved!' : <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save
            </>}
          </button>
          )}

          {/* DOWNLOAD PDF */}
          <button onClick={exportPDF} disabled={exporting}
            title="Download PDF"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all ${exporting ? 'bg-[#C4B0E8] cursor-not-allowed text-white' : 'bg-[#7C5CBF] hover:bg-[#6A4DAD] active:scale-[0.98] text-white shadow-md shadow-[#7C5CBF]/20'}`}>
            {exporting ? 'Generating...' : <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </>}
          </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ICON SIDEBAR */}
        <nav className="w-[72px] bg-white border-r border-[#E8E0F5] flex flex-col items-center pt-4 gap-1.5 shrink-0">
          {sideIcons.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActivePanel(id)}
              className={`flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl transition-all ${activePanel === id ? 'bg-[#EDE7F6] text-[#7C5CBF] shadow-sm' : 'text-[#1A1A2E]/45 hover:bg-[#FAF8FE] hover:text-[#7C5CBF]'}`}>
              {icon}
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          ))}
        </nav>

        {/* BROWSE PANEL */}
        <aside className="w-[280px] bg-white border-r border-[#E8E0F5] flex flex-col shrink-0 overflow-hidden">
          <div className="px-4 pt-5 pb-3 border-b border-[#E8E0F5] bg-white">
            <h2 className="text-[13px] font-bold text-[#1A1A2E] mb-3">
              {activePanel === 'templates' ? 'Templates' : activePanel === 'form' ? 'Fill Certificate' : activePanel === 'layers' ? 'Layers' : 'Insert Element'}
            </h2>
            {activePanel === 'templates' && (
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates..."
                  className="w-full bg-[#FAF8FE] border border-[#E8E0F5] rounded-xl pl-8 pr-3 py-2 text-[12px] text-[#1A1A2E] placeholder-[#1A1A2E]/35 focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/30 focus:border-[#7C5CBF] transition-all"/>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* TEMPLATES */}
            {activePanel === 'templates' && (
              <TemplateGrid query={query} activeTemplate={activeTemplate} setActiveTemplate={handleTemplateSelect} templates={bookTemplates} />
            )}

            {/* FORM FILL — dynamic, auto-detects fields from active template */}
            {activePanel === 'form' && (() => {
              const templateFields = activeTemplate?.fields || [];
              return (
                <div className="p-4 flex flex-col gap-4">
                  <div className="bg-gradient-to-br from-[#FAF8FE] to-[#EDE7F6] rounded-2xl p-3.5 border border-[#E8E0F5] shadow-sm">
                    <p className="text-[11px] font-bold text-[#7C5CBF]">✏️ Fill Certificate</p>
                    <p className="text-[10px] text-[#9B8BBF] mt-0.5">Type below → updates live on certificate</p>
                  </div>
                  {templateFields.map((field) => (
                    <div key={field.id}>
                      <label className={labelClass}>{field.label}</label>
                      {(field.defaultValue || '').includes('\n') ? (
                        <textarea
                          placeholder={field.defaultValue || field.label}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData(p => ({ ...p, [field.id]: e.target.value }))}
                          className={inputClass}
                          rows={2}
                          style={{ resize: 'vertical' }}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder={field.defaultValue || field.label}
                          value={formData[field.id] || ''}
                          onChange={(e) => setFormData(p => ({ ...p, [field.id]: e.target.value }))}
                          className={inputClass}
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => { setFormData({}); handleTemplateSelect(activeTemplate); }}
                    className="w-full py-2 rounded-xl text-[11px] font-semibold text-[#1A1A2E]/45 border border-[#E8E0F5] hover:text-[#7C5CBF] hover:border-[#C4B0E8] transition-all bg-white active:scale-[0.98]">
                    Reset to defaults
                  </button>
                </div>
              );
            })()}
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
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F7F4FB]">
          <div className="h-11 bg-white border-b border-[#E8E0F5] flex items-center justify-between px-5 shrink-0">
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
              <div
                className="rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(26,26,46,0.14)] border border-[#E8E0F5] bg-white"
                style={{ width: BOOK_CANVAS_W, height: BOOK_CANVAS_H }}>
                <CanvasEditor
                  stageRef={stageRef}
                  activeTemplate={activeTemplate}
                  elements={elements}
                  setElements={setElements}
                  selectedId={selectedId}
                  setSelectedId={(id) => { setSelectedId(id); if (id) setActivePanel('layers'); }}
                  canvasW={BOOK_CANVAS_W}
                  canvasH={BOOK_CANVAS_H}
                />
              </div>
              <p className="text-center text-[10px] text-[#AAA] mt-3">Book Cover (Portrait) · {BOOK_CANVAS_W} × {BOOK_CANVAS_H}</p>
            </div>
          </div>
        </main>

        {/* PROPERTIES PANEL */}
        <PropertiesPanel elements={elements} selectedId={selectedId} setElements={setElements} />
      </div>

      {bulkOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8E8E8] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-[#1A1A2E]">Bulk Generate</p>
                <p className="text-[11px] text-[#999] mt-0.5">Upload CSV and export all PNG certificates</p>
              </div>
              <button
                onClick={() => setBulkOpen(false)}
                disabled={bulkGenerating}
                className="w-8 h-8 rounded-lg text-[#999] hover:text-[#555] hover:bg-[#F5F5F5] disabled:opacity-50"
              >
                &times;
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-3">
                <p className="text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1">Expected CSV format</p>
                <code className="text-[12px] text-[#7C5CBF] font-mono">name, designation, regNumber, techSession</code>
              </div>

              <label className="block">
                <span className="block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5">CSV File</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleBulkCSVUpload}
                  disabled={bulkGenerating}
                  className="block w-full text-[12px] text-[#555] file:mr-3 file:rounded-lg file:border-0 file:bg-[#EDE7F6] file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-[#7C5CBF] hover:file:bg-[#E2D8F3] disabled:opacity-50"
                />
              </label>

              {bulkFileName && (
                <p className="text-[11px] text-[#777]">
                  Loaded <span className="font-semibold">{bulkFileName}</span> ({bulkRows.length} rows)
                </p>
              )}

              {bulkProgress && (
                <p className="text-[12px] font-semibold text-[#7C5CBF]">{bulkProgress}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setBulkOpen(false)}
                  disabled={bulkGenerating}
                  className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#777] border border-[#E5E5E5] hover:bg-[#F8F8F8] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={generateBulkCertificates}
                  disabled={bulkGenerating || bulkRows.length === 0}
                  className={`px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-all ${
                    bulkGenerating || bulkRows.length === 0
                      ? 'bg-[#C4B0E8] cursor-not-allowed'
                      : 'bg-[#7C5CBF] hover:bg-[#6A4DAD] shadow-md'
                  }`}
                >
                  {bulkGenerating ? 'Generating...' : 'Generate All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookEditorPage;








