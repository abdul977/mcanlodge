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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-green-700 to-green-800 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Application Details</h2>
              <p className="text-green-100 text-sm">Reference: {application.reference_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div ref={contentRef} className="pdf-content bg-white">
            {/* Header with Logos and Title */}
            <div className="p-8 text-center bg-gradient-to-r from-green-700 to-green-800 text-white">
              <div className="flex justify-between items-center mb-6 px-8">
                <img src="/mcan-logo.png" alt="MCAN Logo" className="h-20 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg" alt="NYSC Logo" className="h-20 w-auto" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Muslim Corpers' Association of Nigeria</h1>
              <h2 className="text-xl mb-1">FCT Chapter</h2>
              <h3 className="text-lg font-light">Lodge Application Form</h3>
            </div>

            <div className="p-8 space-y-8">
              {/* Header Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">📋</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Reference Number</p>
                    <p className="font-mono font-bold text-green-700 text-lg">{application.reference_number}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">📅</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Submission Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(application.created_at)}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">
                        {application.status === 'Approved' ? '✅' :
                         application.status === 'Rejected' ? '❌' : '⏳'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">Status</p>
                    <p className={`font-bold text-lg ${
                      application.status === 'Approved' ? 'text-green-600' :
                      application.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>{application.status}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information with Photo */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      👤
                    </span>
                    Personal Information
                  </h3>
                </div>

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Passport Photo */}
                    <div className="flex-shrink-0">
                      {application.passport_photo_url ? (
                        <div className="text-center">
                          <div className="w-40 h-40 mx-auto mb-4 border-4 border-green-200 rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={application.passport_photo_url}
                              alt="Passport"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Passport Photograph</p>
                        </div>
                      ) : (
                        <div className="w-40 h-40 mx-auto mb-4 border-4 border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                          <span className="text-4xl text-gray-400">📷</span>
                        </div>
                      )}
                    </div>

                    {/* Personal Details */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</p>
                          <p className="text-lg font-semibold text-gray-900">{application.full_name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                          <p className="text-lg font-semibold text-gray-900">{application.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Mobile Number</p>
                          <p className="text-lg font-semibold text-gray-900">{application.mobile_number}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Call-Up Number</p>
                          <p className="text-lg font-semibold text-gray-900">{application.call_up_number}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">State of Origin</p>
                          <p className="text-lg font-semibold text-gray-900">{application.state_of_origin}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">LGA</p>
                          <p className="text-lg font-semibold text-gray-900">{application.lga}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</p>
                          <p className="text-lg font-semibold text-gray-900">{application.gender}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date of Birth</p>
                          <p className="text-lg font-semibold text-gray-900">{new Date(application.date_of_birth).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Marital Status</p>
                          <p className="text-lg font-semibold text-gray-900">{application.marital_status}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">MCAN Reg Number</p>
                          <p className="text-lg font-semibold text-gray-900">{application.mcan_reg_no}</p>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Institution</p>
                          <p className="text-lg font-semibold text-gray-900">{application.institution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      🏥
                    </span>
                    Medical Information
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Blood Group</p>
                      <p className="text-lg font-semibold text-gray-900">{application.blood_group}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Genotype</p>
                      <p className="text-lg font-semibold text-gray-900">{application.genotype}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Allergies</p>
                      <p className="text-lg font-semibold text-gray-900">{application.allergies || 'None'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Disabilities</p>
                      <p className="text-lg font-semibold text-gray-900">{application.disabilities || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      🚨
                    </span>
                    Emergency Contact
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{application.emergency_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Primary Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{application.emergency_phone1}</p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</p>
                      <p className="text-lg font-semibold text-gray-900">{application.emergency_address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Secondary Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{application.emergency_phone2 || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next of Kin */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      👨‍👩‍👧‍👦
                    </span>
                    Next of Kin
                  </h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</p>
                      <p className="text-lg font-semibold text-gray-900">{application.next_of_kin_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Primary Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{application.next_of_kin_phone1}</p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</p>
                      <p className="text-lg font-semibold text-gray-900">{application.next_of_kin_address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Secondary Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{application.next_of_kin_phone2 || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      ✍️
                    </span>
                    Declaration & Signature
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      I hereby declare that all information provided in this application is true and accurate to the best of my knowledge.
                      I understand that any false information may result in the rejection of my application or termination of my lodge accommodation.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                      <div className="space-y-2">
                        <div className="border-b-2 border-gray-300 pb-2 mb-2">
                          <div className="h-12"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 text-center">Applicant Signature</p>
                      </div>
                      <div className="space-y-2">
                        <div className="border-b-2 border-gray-300 pb-2 mb-2">
                          <div className="h-12 flex items-center">
                            <p className="text-gray-700">{new Date().toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600 text-center">Date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center py-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <p className="text-sm text-gray-500">
                  Generated on {formatDate(new Date().toISOString())} | MCAN FCT Chapter - Lodge Application
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};