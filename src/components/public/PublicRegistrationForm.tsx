import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../lib/database';
import { storageService } from '../../lib/storage';
import { generateReferenceNumber } from '../../utils/helpers';
import { userAuth } from '../../utils/userAuth';
import { PassportUpload } from '../PassportUpload';
import { PersonalInfo } from '../PersonalInfo';
import { EmergencyContact } from '../EmergencyContact';
import { NextOfKin } from '../NextOfKin';
import { RulesRegulations } from '../RulesRegulations';
import { AcceptanceForm } from '../AcceptanceForm';

export const PublicRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referenceNumber: generateReferenceNumber(),
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    callUpNumber: '',
    stateOfOrigin: '',
    lga: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    mcanRegNo: '',
    institution: '',
    bloodGroup: '',
    genotype: '',
    allergies: '',
    disabilities: '',
    emergencyName: '',
    emergencyAddress: '',
    emergencyPhone1: '',
    emergencyPhone2: '',
    nextOfKinName: '',
    nextOfKinAddress: '',
    nextOfKinPhone1: '',
    nextOfKinPhone2: '',
  });

  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePassportUpload = (preview: string | null, file: File | null) => {
    setPassportPreview(preview);
    setPassportFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accepted) {
      setError('Please accept the terms and conditions to proceed.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Handle passport photo upload
      let passportPhotoUrl = passportPreview;

      if (passportFile) {
        // For now, use base64 fallback to avoid storage issues
        // TODO: Re-enable storage upload once DNS issues are resolved
        console.log('Using base64 fallback for passport photo');
        passportPhotoUrl = await storageService.fileToBase64(passportFile);
      }

      // Prepare application data
      const applicationData = {
        reference_number: formData.referenceNumber,
        full_name: formData.fullName,
        email: formData.email,
        mobile_number: formData.mobileNumber,
        call_up_number: formData.callUpNumber,
        state_of_origin: formData.stateOfOrigin,
        lga: formData.lga,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        marital_status: formData.maritalStatus,
        mcan_reg_no: formData.mcanRegNo,
        institution: formData.institution,
        blood_group: formData.bloodGroup,
        genotype: formData.genotype,
        allergies: formData.allergies || null,
        disabilities: formData.disabilities || null,
        emergency_name: formData.emergencyName,
        emergency_address: formData.emergencyAddress,
        emergency_phone1: formData.emergencyPhone1,
        emergency_phone2: formData.emergencyPhone2 || null,
        next_of_kin_name: formData.nextOfKinName,
        next_of_kin_address: formData.nextOfKinAddress,
        next_of_kin_phone1: formData.nextOfKinPhone1,
        next_of_kin_phone2: formData.nextOfKinPhone2 || null,
        passport_photo_url: passportPhotoUrl,
      };

      // Create application
      const { data, error } = await applicationService.create(applicationData);

      if (error) {
        setError('Failed to submit application. Please try again.');
        console.error('Submission error:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        // Create user account
        const userResult = await userAuth.register(formData.email, formData.password);

        if (userResult.success) {
          // Auto-login the user and redirect to dashboard
          const loginResult = await userAuth.login(formData.email, formData.password);
          if (loginResult.success) {
            navigate('/user/dashboard');
          } else {
            // If auto-login fails, redirect to success page
            navigate(`/register/success/${data.reference_number}`);
          }
        } else {
          // If user creation fails, still show success but redirect to success page
          console.error('User creation failed:', userResult.error);
          navigate(`/register/success/${data.reference_number}`);
        }
      }
    } catch (error) {
      setError('Failed to submit application. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Lodge Application Form</h2>
            <p className="text-gray-600">Please fill out all required information</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Reference Number:</strong> {formData.referenceNumber}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Please save this reference number for tracking your application
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <PassportUpload onImageUpload={handlePassportUpload} />
            
            <PersonalInfo
              formData={formData}
              onChange={handleInputChange}
            />

            {/* Account Setup Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Setup</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a password to access your application dashboard after registration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter password (min. 6 characters)"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <EmergencyContact
              formData={formData}
              onChange={handleInputChange}
            />

            <NextOfKin
              formData={formData}
              onChange={handleInputChange}
            />
            
            <RulesRegulations />
            
            <AcceptanceForm
              accepted={accepted}
              onAcceptChange={setAccepted}
            />

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading || !accepted}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
