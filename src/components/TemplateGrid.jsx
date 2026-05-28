import { useMemo, useState } from 'react';
import { templates } from '../data/templates';

const CATEGORIES = ['All', 'education', 'tech', 'corporate'];

const categoryLabel = {
  education: 'Education',
  tech: 'Tech',
  corporate: 'Corporate',
};

const categoryColors = {
  education: 'bg-amber-50 text-amber-600 border border-amber-200',
  tech: 'bg-sky-50 text-sky-600 border border-sky-200',
  corporate: 'bg-violet-50 text-violet-600 border border-violet-200',
};

const TemplateGrid = ({ query, activeTemplate, setActiveTemplate }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = useMemo(() => {
    let list = templates;

    if (activeCategory !== 'All') {
      list = list.filter((t) => t.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [query, activeCategory]);

  return (
    <div className="flex flex-col">
      {/* Category Tabs */}
      <div className="px-4 py-3 flex gap-1.5 flex-wrap border-b border-[#F0F0F0]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all
              ${
                activeCategory === cat
                  ? 'bg-[#7C5CBF] text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-[#777] hover:bg-[#EEEEEE]'
              }`}
          >
            {cat === 'All' ? 'All' : categoryLabel[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
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
                  className={`rounded-xl overflow-hidden transition-all duration-200 bg-white
                    ${
                      isActive
                        ? 'ring-2 ring-[#7C5CBF] ring-offset-2 shadow-lg shadow-[#7C5CBF]/20'
                        : 'ring-1 ring-[#E5E5E5] hover:ring-[#C4B0E8] hover:shadow-md'
                    }`}
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[4/3] bg-[#F8F8F8] overflow-hidden">
                    {template.background ? (
                      <img
                        src={template.background}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-[#DDD]">
                        <span className="text-3xl mb-1">📄</span>
                        <span className="text-[11px] text-[#AAA] font-medium">Blank Canvas</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    {isHovered && !isActive && (
                      <div className="absolute inset-0 bg-[#7C5CBF]/10 flex items-center justify-center transition-all">
                        <span className="bg-[#7C5CBF] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
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
                  <div className="bg-white px-2.5 py-2 border-t border-[#F0F0F0]">
                    <p className="text-[11px] font-semibold text-[#333] truncate leading-tight">
                      {template.name}
                    </p>

                    <span
                      className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full font-medium mt-1 ${
                        categoryColors[template.category] ??
                        'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {categoryLabel[template.category] ??
                        template.category}
                    </span>
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