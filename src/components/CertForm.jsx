const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

const labelClass = 'block text-xs text-gray-400 font-medium mb-1.5';

const CertForm = ({ formData, setFormData }) => {
  const handle = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Recipient Name</label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={handle('name')}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Course / Achievement</label>
        <input
          type="text"
          placeholder="e.g. Full-Stack Development"
          value={formData.course}
          onChange={handle('course')}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Issued By</label>
        <input
          type="text"
          placeholder="e.g. Coursera"
          value={formData.issuer}
          onChange={handle('issuer')}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Date</label>
        <input
          type="text"
          placeholder="e.g. May 26, 2025"
          value={formData.date}
          onChange={handle('date')}
          className={inputClass}
        />
      </div>
    </div>
  );
};

export default CertForm;