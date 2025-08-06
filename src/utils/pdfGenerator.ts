import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Application } from '../lib/supabase';

// Helper function to load image as base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

export const generatePDF = async (application: Application, containerRef: React.RefObject<HTMLDivElement>) => {
  if (!containerRef.current) return;

  try {
    // Create a new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);

    // Colors
    const primaryColor = [34, 139, 34]; // Green
    const secondaryColor = [128, 128, 128]; // Gray
    const textColor = [0, 0, 0]; // Black

    // Header Section with Logos
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 30, 'F');

    // Add logos
    try {
      // MCAN Logo
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, 5, 20, 20, 'F');

      // Try to load MCAN logo
      try {
        const mcanLogo = await loadImageAsBase64('/mcan-logo.png');
        pdf.addImage(mcanLogo, 'PNG', margin + 2, 7, 16, 16);
      } catch {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(7);
        pdf.text('MCAN', margin + 10, 16, { align: 'center' });
      }

      // NYSC Logo
      pdf.setFillColor(255, 255, 255);
      pdf.rect(pageWidth - margin - 20, 5, 20, 20, 'F');

      // Try to load NYSC logo
      try {
        const nyscLogo = await loadImageAsBase64('https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg');
        pdf.addImage(nyscLogo, 'PNG', pageWidth - margin - 18, 7, 16, 16);
      } catch {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(7);
        pdf.text('NYSC', pageWidth - margin - 10, 16, { align: 'center' });
      }
    } catch (error) {
      // Fallback to text labels
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7);
      pdf.text('MCAN', margin + 10, 16, { align: 'center' });
      pdf.text('NYSC', pageWidth - margin - 10, 16, { align: 'center' });
    }

    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MUSLIM CORPERS\' ASSOCIATION OF NIGERIA', pageWidth / 2, 12, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('FCT CHAPTER - LODGE APPLICATION FORM', pageWidth / 2, 22, { align: 'center' });

    // Reference Number Box
    pdf.setFillColor(240, 248, 255);
    pdf.rect(margin, 35, contentWidth, 12, 'F');
    pdf.setTextColor(...textColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Reference Number:', margin + 3, 43);
    pdf.setFont('helvetica', 'normal');
    pdf.text(application.reference_number, margin + 50, 43);

    // Date
    pdf.setFont('helvetica', 'bold');
    pdf.text('Date:', pageWidth - margin - 35, 43);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date(application.created_at).toLocaleDateString(), pageWidth - margin - 20, 43);

    let yPos = 52;

    // Personal Information Section with Photo
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPos, contentWidth, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERSONAL INFORMATION', margin + 3, yPos + 4);

    yPos += 10;
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);

    // Passport Photo Area (right side)
    const photoX = pageWidth - margin - 25;
    const photoY = yPos;
    pdf.setDrawColor(...secondaryColor);
    pdf.rect(photoX, photoY, 20, 25, 'D');

    // Add passport photo if available
    if (application.passport_photo_url) {
      try {
        // If it's a base64 image, use it directly
        if (application.passport_photo_url.startsWith('data:image')) {
          pdf.addImage(application.passport_photo_url, 'JPEG', photoX + 1, photoY + 1, 18, 23);
        } else {
          // For URL images, we'll show placeholder text
          pdf.setFontSize(6);
          pdf.text('PHOTO', photoX + 10, photoY + 12, { align: 'center' });
          pdf.text('ATTACHED', photoX + 10, photoY + 15, { align: 'center' });
        }
      } catch (error) {
        // Fallback to placeholder text
        pdf.setFontSize(6);
        pdf.text('PASSPORT', photoX + 10, photoY + 12, { align: 'center' });
        pdf.text('PHOTO', photoX + 10, photoY + 15, { align: 'center' });
      }
    } else {
      pdf.setFontSize(6);
      pdf.text('PASSPORT', photoX + 10, photoY + 12, { align: 'center' });
      pdf.text('PHOTO', photoX + 10, photoY + 15, { align: 'center' });
    }

    // Three column layout for personal info (to accommodate photo)
    const leftCol = margin + 3;
    const midCol = margin + 65;
    const rightCol = margin + 125;

    const addField = (label: string, value: string, x: number, y: number) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label + ':', x, y);
      pdf.setFont('helvetica', 'normal');
      const maxWidth = 55;
      const lines = pdf.splitTextToSize(value || 'N/A', maxWidth);
      pdf.text(lines, x, y + 3);
      return y + (lines.length * 3) + 2;
    };

    let currentY = yPos + 3;
    currentY = addField('Full Name', application.full_name, leftCol, currentY);
    addField('Email', application.email, midCol, yPos + 3);

    currentY = addField('Mobile Number', application.mobile_number, leftCol, currentY);
    addField('Call-Up Number', application.call_up_number, midCol, yPos + 9);

    currentY = addField('State of Origin', application.state_of_origin, leftCol, currentY);
    addField('LGA', application.lga, midCol, yPos + 15);

    currentY = addField('Gender', application.gender, leftCol, currentY);
    addField('Date of Birth', new Date(application.date_of_birth).toLocaleDateString(), midCol, yPos + 21);

    currentY = addField('Marital Status', application.marital_status, leftCol, currentY);
    addField('MCAN Reg No', application.mcan_reg_no, midCol, yPos + 27);

    addField('Institution', application.institution, leftCol, currentY);

    yPos += 35;

    // Medical Information Section
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPos, contentWidth, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MEDICAL INFORMATION', margin + 3, yPos + 4);

    yPos += 10;
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);

    const addMedField = (label: string, value: string, x: number, y: number) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label + ':', x, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value || 'N/A', x + 25, y);
      return y + 5;
    };

    let medY = yPos + 3;
    medY = addMedField('Blood Group', application.blood_group, leftCol, medY);
    addMedField('Genotype', application.genotype, midCol, yPos + 3);

    medY = addMedField('Allergies', application.allergies || 'None', leftCol, medY);
    addMedField('Disabilities', application.disabilities || 'None', midCol, yPos + 8);

    yPos += 20;

    // Emergency Contact Section
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPos, contentWidth, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EMERGENCY CONTACT', margin + 3, yPos + 4);

    yPos += 10;
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);

    const addContactField = (label: string, value: string, x: number, y: number) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label + ':', x, y);
      pdf.setFont('helvetica', 'normal');
      const maxWidth = 50;
      const lines = pdf.splitTextToSize(value || 'N/A', maxWidth);
      pdf.text(lines, x, y + 3);
      return y + (lines.length * 3) + 2;
    };

    let emergY = yPos + 3;
    emergY = addContactField('Name', application.emergency_name, leftCol, emergY);
    addContactField('Phone 1', application.emergency_phone1, midCol, yPos + 3);

    emergY = addContactField('Address', application.emergency_address, leftCol, emergY);
    addContactField('Phone 2', application.emergency_phone2 || 'N/A', midCol, yPos + 9);

    yPos += 20;

    // Next of Kin Section
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPos, contentWidth, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NEXT OF KIN', margin + 3, yPos + 4);

    yPos += 10;
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);

    let kinY = yPos + 3;
    kinY = addContactField('Name', application.next_of_kin_name, leftCol, kinY);
    addContactField('Phone 1', application.next_of_kin_phone1, midCol, yPos + 3);

    kinY = addContactField('Address', application.next_of_kin_address, leftCol, kinY);
    addContactField('Phone 2', application.next_of_kin_phone2 || 'N/A', midCol, yPos + 9);

    // Declaration and Signature Section
    yPos += 25;

    // Declaration text
    pdf.setTextColor(...textColor);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    const declarationText = 'I hereby declare that all information provided in this application is true and accurate to the best of my knowledge.';
    const declarationLines = pdf.splitTextToSize(declarationText, contentWidth);
    pdf.text(declarationLines, margin, yPos);

    yPos += declarationLines.length * 3 + 8;

    // Signature lines
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.5);

    // Applicant signature line
    pdf.line(margin, yPos, margin + 70, yPos);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Applicant Signature', margin, yPos + 5);

    // Date line
    pdf.line(pageWidth - margin - 50, yPos, pageWidth - margin, yPos);
    pdf.text('Date', pageWidth - margin - 50, yPos + 5);

    // Current date for reference
    pdf.setFontSize(7);
    pdf.text(`(${new Date().toLocaleDateString()})`, pageWidth - margin - 45, yPos - 2);

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, footerY, pageWidth, 15, 'F');
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(7);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, footerY + 8);
    pdf.text(`MCAN FCT Chapter - Lodge Application Form`, pageWidth / 2, footerY + 8, { align: 'center' });
    pdf.text(`Ref: ${application.reference_number}`, pageWidth - margin, footerY + 8, { align: 'right' });

    // Save the PDF
    pdf.save(`MCAN_Application_${application.reference_number}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};