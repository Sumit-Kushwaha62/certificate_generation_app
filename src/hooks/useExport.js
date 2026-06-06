import { useState } from 'react';
import jsPDF from 'jspdf';

const EXPORT_PIXEL_RATIO = 4;

const useExport = (stageRef, closeShare = () => {}) => {
  const [exporting, setExporting] = useState(false);

  const getStage = () => {
    const stage = stageRef?.current;
    if (!stage) {
      throw new Error('Certificate canvas not found.');
    }
    return stage;
  };

  const getPNGDataURL = () =>
    getStage().toDataURL({
      mimeType: 'image/png',
      pixelRatio: EXPORT_PIXEL_RATIO,
    });

  const dataURLToBlob = async (dataURL) => {
    const response = await fetch(dataURL);
    return response.blob();
  };

  const downloadBlob = (blob, filename = 'certificate.png') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
    closeShare();

    try {
      const blob = await dataURLToBlob(getPNGDataURL());
      downloadBlob(blob);
    } catch (err) {
      console.error(err);
      alert('Unable to download certificate. Please try again.');
    }
  };

  const shareWhatsApp = async () => {
    closeShare();

    try {
      const blob = await dataURLToBlob(getPNGDataURL());
      downloadBlob(blob);

      window.open('https://web.whatsapp.com', '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      alert('PNG download failed. Please try again.');
    }
  };

  const shareEmail = async () => {
    closeShare();

    try {
      const blob = await dataURLToBlob(getPNGDataURL());
      downloadBlob(blob);

      const subject = encodeURIComponent('My Certificate');
      const body = encodeURIComponent(
        'I have downloaded the certificate PNG. Please attach certificate.png manually before sending this email.'
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (err) {
      console.error(err);
      alert('PNG download failed. Please try again.');
    }
  };

  const shareNative = async () => {
    closeShare();

    try {
      if (!navigator.share) {
        alert('Native share is not supported in this browser.');
        return;
      }

      const blob = await dataURLToBlob(getPNGDataURL());
      const file = new File([blob], 'certificate.png', { type: 'image/png' });

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        alert('File sharing is not supported in this browser.');
        return;
      }

      await navigator.share({
        title: 'My Certificate',
        text: 'Sharing my certificate.',
        files: [file],
      });
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error(err);
        alert('Unable to share certificate. Please try Download PNG instead.');
      }
    }
  };

  const copyToClipboard = async () => {
    closeShare();

    try {
      if (!navigator.clipboard || !window.ClipboardItem) {
        alert('Clipboard image copy is not supported in this browser.');
        return;
      }

      const blob = await dataURLToBlob(getPNGDataURL());

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);

      alert('Certificate PNG copied to clipboard.');
    } catch (err) {
      console.error(err);
      alert('Unable to copy PNG. Please try Download PNG instead.');
    }
  };

  const exportPDF = async () => {
    setExporting(true);

    try {
      const imgData = getPNGDataURL();
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('certificate.pdf');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Unable to export PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return {
    exportPDF,
    downloadPNG,
    shareWhatsApp,
    shareEmail,
    shareNative,
    copyToClipboard,
    exporting,
  };
};

export default useExport;
