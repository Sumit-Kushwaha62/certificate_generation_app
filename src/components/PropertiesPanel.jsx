const FONTS = [
  'DM Sans',
  'Playfair Display',
  'Crimson Text',
  'Georgia',
  'Arial',
  'Courier New',
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

const PRESET_COLORS = [
  '#1A1A2E', '#FFFFFF', '#7C5CBF', '#C9A84C',
  '#E53E3E', '#2B6CB0', '#276749', '#744210',
  '#553C9A', '#00B5D8', '#B7791F', '#9B2C2C',
];

const PropertiesPanel = ({ elements, selectedId, setElements }) => {
  const selected = elements.find((el) => el.id === selectedId);

  const update = (key, value) => {
    setElements((prev) =>
      prev.map((el) => el.id === selectedId ? { ...el, [key]: value } : el)
    );
  };

  const deleteSelected = () => {
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
  };

  if (!selected) {
    return (
      <div className="w-[220px] bg-white border-l border-[#E8E8E8] flex flex-col items-center justify-center p-6 shrink-0">
        <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1.5" className="w-5 h-5">
            <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"/>
          </svg>
        </div>
        <p className="text-[11px] text-[#BBB] text-center font-medium leading-relaxed">
          Select a text element on the canvas to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-[220px] bg-white border-l border-[#E8E8E8] flex flex-col shrink-0 overflow-y-auto">

      {/* Header */}
      <div className="px-4 py-4 border-b border-[#F0F0F0]">
        <p className="text-[12px] font-bold text-[#1A1A2E]">Properties</p>
        <p className="text-[10px] text-[#AAA] mt-0.5">Text element selected</p>
      </div>

      <div className="p-4 flex flex-col gap-5">

        {/* Font family */}
        <div>
          <label className="block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5">Font</label>
          <select
            value={selected.fontFamily || 'DM Sans'}
            onChange={(e) => update('fontFamily', e.target.value)}
            className="w-full bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg px-3 py-2 text-[12px] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition"
          >
            {FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Font size */}
        <div>
          <label className="block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5">
            Size — {selected.fontSize || 24}px
          </label>
          <input
            type="range"
            min={8} max={80} step={1}
            value={selected.fontSize || 24}
            onChange={(e) => update('fontSize', Number(e.target.value))}
            className="w-full accent-[#7C5CBF]"
          />
          <div className="flex justify-between text-[9px] text-[#CCC] mt-0.5">
            <span>8</span><span>80</span>
          </div>
        </div>

        {/* Bold / Italic / Align */}
        <div>
          <label className="block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5">Style</label>
          <div className="flex gap-1.5">
            {[
              { key: 'bold', label: 'B', title: 'Bold', style: 'font-bold' },
              { key: 'italic', label: 'I', title: 'Italic', style: 'italic' },
            ].map(({ key, label, title, style }) => (
              <button
                key={key}
                title={title}
                onClick={() => update(key, !selected[key])}
                className={`w-8 h-8 rounded-lg text-[12px] border transition-all ${style}
                  ${selected[key]
                    ? 'bg-[#7C5CBF] text-white border-[#7C5CBF]'
                    : 'bg-[#F8F8F8] text-[#555] border-[#E5E5E5] hover:border-[#7C5CBF]'
                  }`}
              >
                {label}
              </button>
            ))}

            {/* Align buttons */}
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                title={`Align ${align}`}
                onClick={() => update('align', align)}
                className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center
                  ${selected.align === align
                    ? 'bg-[#7C5CBF] text-white border-[#7C5CBF]'
                    : 'bg-[#F8F8F8] text-[#555] border-[#E5E5E5] hover:border-[#7C5CBF]'
                  }`}
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  {align === 'left' && <><rect x="1" y="3" width="14" height="1.5" rx="0.75"/><rect x="1" y="7" width="9" height="1.5" rx="0.75"/><rect x="1" y="11" width="11" height="1.5" rx="0.75"/></>}
                  {align === 'center' && <><rect x="1" y="3" width="14" height="1.5" rx="0.75"/><rect x="3.5" y="7" width="9" height="1.5" rx="0.75"/><rect x="2.5" y="11" width="11" height="1.5" rx="0.75"/></>}
                  {align === 'right' && <><rect x="1" y="3" width="14" height="1.5" rx="0.75"/><rect x="6" y="7" width="9" height="1.5" rx="0.75"/><rect x="4" y="11" width="11" height="1.5" rx="0.75"/></>}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5">Color</label>

          {/* Preset swatches */}
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update('color', c)}
                title={c}
                className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110
                  ${selected.color === c ? 'border-[#7C5CBF] scale-110' : 'border-transparent'}`}
                style={{ background: c }}
              />
            ))}
          </div>

          {/* Custom color input */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selected.color || '#1A1A2E'}
              onChange={(e) => update('color', e.target.value)}
              className="w-8 h-8 rounded-lg border border-[#E5E5E5] cursor-pointer p-0.5 bg-white"
            />
            <input
              type="text"
              value={selected.color || '#1A1A2E'}
              onChange={(e) => update('color', e.target.value)}
              className="flex-1 bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg px-2 py-1.5 text-[11px] text-[#333] font-mono focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Content edit */}
        <div>
          <label className="block text-[10px] font-bold text-[#888] uppercase tracking-wide mb-1.5">Content</label>
          <textarea
            value={selected.content}
            onChange={(e) => update('content', e.target.value)}
            rows={2}
            className="w-full bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg px-3 py-2 text-[12px] text-[#333] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition resize-none"
          />
        </div>

        {/* Delete */}
        <button
          onClick={deleteSelected}
          className="w-full py-2 rounded-xl text-[11px] font-semibold text-red-400 border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
          Delete element
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;