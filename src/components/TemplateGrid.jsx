import { useMemo } from 'react';
import { templates } from '../data/templates';

const categoryColors = {
  education: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  tech: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  corporate: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

const TemplateGrid = ({ query, activeTemplate, setActiveTemplate }) => {
  const filtered = useMemo(() => {
    if (!query.trim()) return templates;
    const q = query.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [query]);

  if (filtered.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">No templates found.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {filtered.map((template) => {
        const isActive = activeTemplate?.id === template.id;
        return (
          <button
            key={template.id}
            onClick={() => setActiveTemplate(template)}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border text-left transition-all
              ${isActive
                ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-750'
              }`}
          >
            {isActive && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400"></span>
            )}
            <span className="text-3xl">{template.thumbnail}</span>
            <span className="text-xs font-medium text-white text-center leading-tight">{template.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[template.category] || 'bg-gray-700 text-gray-400'}`}>
              {template.category}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TemplateGrid;