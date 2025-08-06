import { useState, useRef } from 'react';
import { Printer, Eye, Check, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface FormPreviewProps {
  formData: any;
  passportPreview: string | null;
}

export function FormPreview({ formData, passportPreview }: FormPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!previewRef.current) return;
    
    setIsGeneratingPDF(true);
    
    const element = previewRef.current;
    const opt = {
      margin: [5, 5], // Reduced margins
      filename: `MCAN_Form_${formData.referenceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Better page breaks
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!showPreview) {
    return (
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mb-4"
      >
        <Eye className="w-5 h-5 mr-2" />
        Preview Form
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-white z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 print:shadow-none print:max-w-none print:w-auto print:max-h-none print:overflow-visible">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h2 className="text-2xl font-bold text-green-700">Form Preview</h2>
          <div className="space-x-4">
            <button
              onClick={handleSavePDF}
              disabled={isGeneratingPDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Save as PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Form
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>

        <div ref={previewRef} className="space-y-4">
          {/* Header Section */}
          <div className="text-center border-b pb-2">
            <div className="flex justify-between items-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg" 
                alt="NYSC Logo"
                className="w-16 h-16 object-contain"
              />
              <div className="flex-1 px-4">
                <h1 className="text-2xl font-bold text-green-700 mb-1">
                  MUSLIM CORPERS' ASSOCIATION OF NIGERIA
                </h1>
                <h2 className="text-xl font-semibold text-green-600">FCT CHAPTER</h2>
              </div>
              <img
                src="/mcan-logo.png"
                alt="MCAN Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 italic">ACCOMMODATION FORM</p>
          </div>

          {/* Reference Number and Date */}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Reference Number: <strong className="text-green-700">{formData.referenceNumber}</strong></span>
            <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
          </div>

          {/* Personal Information Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* Passport Photo */}
            {passportPreview && (
              <div>
                <div className="w-24 h-32 border-2 border-green-500 rounded overflow-hidden">
                  <img src={passportPreview} alt="Passport" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Personal Details */}
            <div className="col-span-2">
              <h3 className="text-base font-semibold text-green-700 border-b pb-1 mb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <PreviewField label="Full Name" value={formData.fullName} />
                <PreviewField label="Email" value={formData.email} />
                <PreviewField label="Mobile Number" value={formData.mobileNumber} />
                <PreviewField label="Call-Up Number" value={formData.callUpNumber} />
                <PreviewField label="State of Origin" value={formData.stateOfOrigin} />
                <PreviewField label="LGA" value={formData.lga} />
                <PreviewField label="Gender" value={formData.gender} />
                <PreviewField label="Date of Birth" value={formData.dateOfBirth} />
                <PreviewField label="Marital Status" value={formData.maritalStatus} />
                <PreviewField label="MCAN Reg. No." value={formData.mcanRegNo} />
                <PreviewField label="Institution" value={formData.institution} />
                <PreviewField label="Blood Group" value={formData.bloodGroup} />
                <PreviewField label="Genotype" value={formData.genotype} />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="border-t pt-2">
            <h3 className="text-base font-semibold text-green-700 mb-2">Medical Information</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <PreviewField label="Allergies" value={formData.allergies || 'None'} />
              <PreviewField label="Disabilities" value={formData.disabilities || 'None'} />
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="border-t pt-2">
            <h3 className="text-base font-semibold text-green-700 mb-2">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <PreviewField label="Full Name" value={formData.emergencyName} />
              <PreviewField label="Address" value={formData.emergencyAddress} />
              <PreviewField label="Phone Number 1" value={formData.emergencyPhone1} />
              <PreviewField label="Phone Number 2" value={formData.emergencyPhone2} />
            </div>
          </div>

          {/* Next of Kin Section */}
          <div className="border-t pt-2">
            <h3 className="text-base font-semibold text-green-700 mb-2">Next of Kin</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <PreviewField label="Full Name" value={formData.nextOfKinName} />
              <PreviewField label="Address" value={formData.nextOfKinAddress} />
              <PreviewField label="Phone Number 1" value={formData.nextOfKinPhone1} />
              <PreviewField label="Phone Number 2" value={formData.nextOfKinPhone2} />
            </div>
          </div>

          {/* Declaration Section */}
          <div className="border-t pt-2">
            <h3 className="text-base font-semibold text-green-700 mb-2">Declaration</h3>
            <p className="text-sm">
              I hereby declare that all the information provided above is true and correct to the best of my knowledge.
              I understand that any false statement may result in the denial of accommodation or eviction if already admitted.
            </p>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <p className="text-sm font-medium mb-1">Applicant's Signature</p>
              <div className="border-b-2 border-gray-400 h-8"></div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Date</p>
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Official Use Section */}
          <div className="border-t pt-2 mt-4">
            <h3 className="text-base font-semibold text-green-700 mb-2">For Official Use Only</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium mb-1">Approved By</p>
                <div className="border-b-2 border-gray-400 h-8"></div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Date</p>
                <div className="border-b-2 border-gray-400 h-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}:</span>{' '}
      <span>{value || '-'}</span>
    </div>
  );
}