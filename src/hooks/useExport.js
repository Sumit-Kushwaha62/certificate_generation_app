import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    const el = document.getElementById('cert-preview');
    if (!el) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 560],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 800, 560);
      pdf.save('certificate.pdf');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return { exportPDF, exporting };
};

export default useExport;