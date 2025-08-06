import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormSubmission } from './storage';

export const generatePDF = async (application: FormSubmission, containerRef: React.RefObject<HTMLDivElement>) => {
  if (!containerRef.current) return;

  try {
    const canvas = await html2canvas(containerRef.current, {
      scale: 2,
      logging: false,
      useCORS: true
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let firstPage = true;

    while (heightLeft >= 0) {
      if (!firstPage) {
        pdf.addPage();
      }

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
      position -= pageHeight;
      firstPage = false;
    }

    // Add footer with date and reference number
    const footer = `Generated on ${new Date().toLocaleString()} | Ref: ${application.referenceNumber}`;
    const footerSize = pdf.getTextDimensions(footer);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      footer,
      (imgWidth - footerSize.w) / 2,
      pageHeight - 10
    );

    // Save the PDF
    pdf.save(`MCAN_Application_${application.referenceNumber}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};