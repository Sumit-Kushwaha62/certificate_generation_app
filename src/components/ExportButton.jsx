import useExport from '../hooks/useExport';

const ExportButton = () => {
  const { exportPDF, exporting } = useExport();

  return (
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
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default ExportButton;