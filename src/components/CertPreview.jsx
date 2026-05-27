const CertPreview = ({ formData, activeTemplate }) => {
  if (!activeTemplate) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 text-sm">
        Select a template to preview
      </div>
    );
  }

  const Component = activeTemplate.component;

  const props = {
    name: formData.name || 'Recipient Name',
    course: formData.course || 'Course Name',
    issuer: formData.issuer || 'Issuing Authority',
    date: formData.date || 'January 1, 2025',
  };

  return (
    <div
      id="cert-preview"
      className="w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
      style={{ aspectRatio: '800/560' }}
    >
      <Component {...props} />
    </div>
  );
};

export default CertPreview;