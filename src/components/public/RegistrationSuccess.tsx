import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { applicationService } from '../../lib/database';
import { Application } from '../../lib/supabase';

export const RegistrationSuccess = () => {
  const { referenceNumber } = useParams<{ referenceNumber: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      if (!referenceNumber) {
        setError('No reference number provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await applicationService.getByReferenceNumber(referenceNumber);
        
        if (error) {
          setError('Application not found');
        } else if (data) {
          setApplication(data);
        }
      } catch (error) {
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [referenceNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit New Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img
                src="/mcan-logo.png"
                alt="MCAN Logo"
                className="h-16 w-auto"
              />
              <h1 className="text-xl font-bold text-white">MCAN Lodge Registration</h1>
            </div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg"
              alt="NYSC Logo"
              className="h-16 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="text-green-500 text-6xl mb-6">✅</div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-4">
            Thank you for submitting your lodge application. Your application has been received and is being reviewed.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-green-800 font-medium mb-2">🎉 Your account has been created!</p>
            <p className="text-green-700 text-sm">
              You can now access your dashboard to track your application status using the email and password you provided during registration.
            </p>
          </div>

          {/* Application Details */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="font-mono text-lg font-bold text-green-700">{application.reference_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Applicant Name</p>
                <p className="font-semibold text-gray-800">{application.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-800">{application.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  {application.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submission Date</p>
                <p className="text-gray-800">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Important Information</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Please save your reference number: <strong className="font-mono">{application.reference_number}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You will receive an email confirmation shortly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Your application will be reviewed within 3-5 business days</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You will be notified via email once your application is processed</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/user/login"
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Access Your Dashboard
            </Link>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print Confirmation
            </button>
            <Link
              to="/register"
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              Submit Another Application
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              For questions or assistance, please contact the MCAN Lodge administration.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Muslim Corpers' Association of Nigeria - FCT Chapter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
