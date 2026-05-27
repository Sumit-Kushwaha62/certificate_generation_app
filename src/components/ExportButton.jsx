import useExport from '../hooks/useExport';

const ExportButton = () => {
  const { exportPDF, exporting } = useExport();

  return (
    <button
      onClick={exportPDF}
      disabled={exporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
        ${exporting
          ? 'bg-indigo-700 cursor-not-allowed opacity-70'
          : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
        } text-white shadow-lg shadow-indigo-500/20`}
    >
      {exporting ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Generating...
        </>
      ) : (
        <>
          ⬇ Export PDF
        </>
      )}
    </button>
  );
};

export default ExportButton;