const FONTS = [
  'DM Sans',
  'Playfair Display',
  'Crimson Text',
  'Georgia',
  'Arial',
  'Courier New',
];

const PRESET_COLORS = [
  '#1A1A2E', '#FFFFFF', '#7C5CBF', '#C9A84C',
  '#E53E3E', '#2B6CB0', '#276749', '#744210',
  '#553C9A', '#00B5D8', '#B7791F', '#9B2C2C',
];

const SHADOW_DEFAULTS = {
  shadowColor: 'rgba(0,0,0,0.35)',
  shadowBlur: 4,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
};

const toColorInputValue = (color) => {
  if (/^#[0-9a-f]{6}$/i.test(color || '')) return color;
  return '#000000';
};

const PropertiesPanel = ({ elements, selectedId, setElements }) => {
  const selected = elements.find((el) => el.id === selectedId);

  const update = (key, value) => {
    setElements((prev) =>
      prev.map((el) => el.id === selectedId ? { ...el, [key]: value } : el)
    );
  };

  const toggleShadow = () => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? { ...SHADOW_DEFAULTS, ...el, shadowEnabled: !el.shadowEnabled }
          : el
      )
    );
  };

  const deleteSelected = () => {
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
  };

  if (!selected) {
    return (
      <div className="w-[220px] bg-white border-l border-[#E8E0F5] flex flex-col items-center justify-center p-6 shrink-0">
        <div className="w-11 h-11 bg-[#FAF8FE] rounded-2xl flex items-center justify-center mb-3 border border-[#E8E0F5]">
          <svg viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1.5" className="w-5 h-5">
            <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"/>
          </svg>
        </div>
        <p className="text-[11px] text-[#1A1A2E]/45 text-center font-medium leading-relaxed">
          Select a text element on the canvas to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-[220px] bg-white border-l border-[#E8E0F5] flex flex-col shrink-0 overflow-y-auto">

      {/* Header */}
      <div className="px-4 py-4 border-b border-[#E8E0F5] bg-[#FAF8FE]">
        <p className="text-[13px] font-black text-[#1A1A2E]">Properties</p>
        <p className="text-[10px] text-[#7C5CBF]/70 mt-0.5 font-semibold">Text element selected</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <p className="text-[10px] font-black text-[#1A1A2E]/50 uppercase tracking-widest">Typography</p>

        {/* Font family */}
        <div>
          <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">Font</label>
          <select
            value={selected.fontFamily || 'DM Sans'}
            onChange={(e) => update('fontFamily', e.target.value)}
            className="w-full bg-[#FAF8FE] border border-[#E8E0F5] rounded-xl px-3 py-2 text-[12px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all"
          >
            {FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Font size */}
        <div>
          <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">
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
          <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">Style</label>
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
                    ? 'bg-[#7C5CBF] text-white border-[#7C5CBF] shadow-sm shadow-[#7C5CBF]/20'
                    : 'bg-[#FAF8FE] text-[#1A1A2E]/70 border-[#E8E0F5] hover:border-[#7C5CBF] hover:text-[#7C5CBF]'
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
                    ? 'bg-[#7C5CBF] text-white border-[#7C5CBF] shadow-sm shadow-[#7C5CBF]/20'
                    : 'bg-[#FAF8FE] text-[#1A1A2E]/70 border-[#E8E0F5] hover:border-[#7C5CBF] hover:text-[#7C5CBF]'
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
        <div className="pt-2 border-t border-[#E8E0F5]">
          <p className="text-[10px] font-black text-[#1A1A2E]/50 uppercase tracking-widest mb-3">Appearance</p>
          <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">Color</label>

          {/* Preset swatches */}
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update('color', c)}
                title={c}
                className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 shadow-sm
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
              className="w-8 h-8 rounded-lg border border-[#E8E0F5] cursor-pointer p-0.5 bg-white"
            />
            <input
              type="text"
              value={selected.color || '#1A1A2E'}
              onChange={(e) => update('color', e.target.value)}
              className="flex-1 bg-[#FAF8FE] border border-[#E8E0F5] rounded-lg px-2 py-1.5 text-[11px] text-[#1A1A2E] font-mono focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Text shadow */}
        {selected.type === 'text' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide">Text Shadow</label>
              <button
                onClick={toggleShadow}
                className={`w-10 h-5 rounded-full p-0.5 transition-all ${selected.shadowEnabled ? 'bg-[#7C5CBF]' : 'bg-[#E8E0F5]'}`}
                aria-pressed={!!selected.shadowEnabled}
                type="button"
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${selected.shadowEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {selected.shadowEnabled && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">Shadow Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={toColorInputValue(selected.shadowColor || SHADOW_DEFAULTS.shadowColor)}
                      onChange={(e) => update('shadowColor', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-[#E8E0F5] cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={selected.shadowColor || SHADOW_DEFAULTS.shadowColor}
                      onChange={(e) => update('shadowColor', e.target.value)}
                      className="flex-1 bg-[#FAF8FE] border border-[#E8E0F5] rounded-lg px-2 py-1.5 text-[11px] text-[#1A1A2E] font-mono focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all"
                      placeholder="rgba(0,0,0,0.35)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'shadowBlur', label: 'Blur', value: selected.shadowBlur ?? SHADOW_DEFAULTS.shadowBlur },
                    { key: 'shadowOffsetX', label: 'X', value: selected.shadowOffsetX ?? SHADOW_DEFAULTS.shadowOffsetX },
                    { key: 'shadowOffsetY', label: 'Y', value: selected.shadowOffsetY ?? SHADOW_DEFAULTS.shadowOffsetY },
                  ].map(({ key, label, value }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">{label}</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => update(key, Number(e.target.value))}
                        className="w-full bg-[#FAF8FE] border border-[#E8E0F5] rounded-lg px-2 py-1.5 text-[11px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content edit */}
        <div className="pt-2 border-t border-[#E8E0F5]">
          <p className="text-[10px] font-black text-[#1A1A2E]/50 uppercase tracking-widest mb-3">Content</p>
          <label className="block text-[10px] font-bold text-[#1A1A2E]/55 uppercase tracking-wide mb-1.5">Content</label>
          <textarea
            value={selected.content}
            onChange={(e) => update('content', e.target.value)}
            rows={2}
            className="w-full bg-[#FAF8FE] border border-[#E8E0F5] rounded-xl px-3 py-2 text-[12px] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#7C5CBF]/25 focus:border-[#7C5CBF] transition-all resize-none"
          />
        </div>

        {/* Delete */}
        <button
          onClick={deleteSelected}
          className="w-full py-2 rounded-xl text-[11px] font-semibold text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
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
