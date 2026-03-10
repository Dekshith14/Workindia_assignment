// @ts-ignore
import html2pdf from 'html2pdf.js';

export async function downloadResumePdf(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
  };

  await html2pdf().set(opt).from(element).save();
}
