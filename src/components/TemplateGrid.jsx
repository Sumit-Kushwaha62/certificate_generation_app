import { useMemo, useState } from 'react';
import { templates } from '../data/templates';

const TemplateGrid = ({ query, activeTemplate, setActiveTemplate }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;

    return templates.filter((template) =>
      template.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col">
      {/* Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-[12px] text-[#BBB]">
            No templates found
          </div>
        ) : (
          filtered.map((template) => {
            const isActive = activeTemplate?.id === template.id;
            const isHovered = hoveredId === template.id;

            return (
              <div
                key={template.id}
                className="relative cursor-pointer group"
                onClick={() => setActiveTemplate(template)}
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`rounded-2xl overflow-hidden transition-all duration-300 bg-white border
                    ${
                      isActive
                        ? 'border-[#7C5CBF] ring-2 ring-[#7C5CBF]/20 shadow-lg shadow-[#7C5CBF]/20'
                        : 'border-[#E8E0F5] shadow-sm hover:border-[#C4B0E8] hover:shadow-lg hover:shadow-[#7C5CBF]/10 hover:-translate-y-1'
                    }`}
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[800/566] bg-[#FAF8FE] overflow-hidden">
                    {template.background ? (
                      <img
                        src={template.background}
                        alt={template.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-[#E8E0F5]">
                        <span className="text-3xl mb-1">📄</span>
                        <span className="text-[11px] text-[#7C5CBF]/60 font-medium">Blank Canvas</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    {isHovered && !isActive && (
                      <div className="absolute inset-0 bg-[#7C5CBF]/10 flex items-center justify-center transition-all">
                        <span className="bg-[#7C5CBF] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-[#7C5CBF]/25">
                          Use this
                        </span>
                      </div>
                    )}

                    {/* Active Check */}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#7C5CBF] rounded-full flex items-center justify-center shadow-md">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          className="w-3 h-3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-white px-2.5 py-2.5 border-t border-[#E8E0F5]">
                    <p className="text-center text-[11px] font-bold text-[#1A1A2E] truncate leading-tight">
                      {template.name}
                    </p>

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TemplateGrid;
