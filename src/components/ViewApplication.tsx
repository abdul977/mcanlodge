import { useRef } from 'react';
import { Application } from '../lib/supabase';
import { generatePDF } from '../utils/pdfGenerator';

interface ViewApplicationProps {
  application: Application | null;
  onClose: () => void;
  isOpen: boolean;
}

export const ViewApplication = ({ application, onClose, isOpen }: ViewApplicationProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !application) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = async () => {
    try {
      await generatePDF(application, contentRef);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div ref={contentRef} className="pdf-content">
          {/* Header with Logos and Title */}
          <div className="p-6 text-center border-b border-gray-200 bg-gradient-to-r from-green-700 to-green-800 text-white">
            <div className="flex justify-between items-center mb-4 px-8">
              {/* MCAN Logo on the left */}
              <img
                src="/mcan-logo.png"
                alt="MCAN Logo"
                className="h-16 w-auto"
              />
              {/* NYSC Logo on the right */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg"
                alt="NYSC Logo"
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">Muslim Corpers' Association of Nigeria</h1>
            <h2 className="text-xl mb-1">FCT Chapter</h2>
            <h3 className="text-lg">Lodge Application Form</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Header Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Reference Number</p>
                  <p className="font-mono font-bold text-green-700">{application.reference_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submission Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(application.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Passport Photo */}
            <div className="flex justify-center">
              {application.passport_photo_url ? (
                <div className="w-32 h-40 overflow-hidden rounded-lg border-2 border-gray-200">
                  <img
                    src={application.passport_photo_url}
                    alt="Passport"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Photo</span>
                </div>
              )}
            </div>

            {/* Application Status */}
            <div className="flex justify-center">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold
                ${application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                  application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}
              >
                {application.status}
              </span>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-green-200">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-800">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile Number</p>
                  <p className="font-semibold text-gray-800">{application.mobile_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Call-Up Number</p>
                  <p className="font-semibold text-gray-800">{application.call_up_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">State of Origin</p>
                  <p className="font-semibold text-gray-800">{application.state_of_origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">LGA</p>
                  <p className="font-semibold text-gray-800">{application.lga}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold text-gray-800">{application.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-semibold text-gray-800">{application.date_of_birth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Marital Status</p>
                  <p className="font-semibold text-gray-800">{application.marital_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">MCAN Registration Number</p>
                  <p className="font-semibold text-gray-800">{application.mcan_reg_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Institution</p>
                  <p className="font-semibold text-gray-800">{application.institution}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4 pdf-page-break">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-green-200">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <p className="font-semibold text-gray-800">{application.blood_group}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Genotype</p>
                  <p className="font-semibold text-gray-800">{application.genotype}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Allergies</p>
                  <p className="font-semibold text-gray-800">{application.allergies || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disabilities</p>
                  <p className="font-semibold text-gray-800">{application.disabilities || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4 pdf-page-break">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-green-200">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{application.emergency_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">{application.emergency_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Primary Phone</p>
                  <p className="font-semibold text-gray-800">{application.emergency_phone1}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Secondary Phone</p>
                  <p className="font-semibold text-gray-800">{application.emergency_phone2 || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Next of Kin */}
            <div className="space-y-4 pdf-page-break">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-green-200">Next of Kin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{application.next_of_kin_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">{application.next_of_kin_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Primary Phone</p>
                  <p className="font-semibold text-gray-800">{application.next_of_kin_phone1}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Secondary Phone</p>
                  <p className="font-semibold text-gray-800">{application.next_of_kin_phone2 || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};