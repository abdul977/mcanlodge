import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { PassportUpload } from './PassportUpload';
import { PersonalInfo } from './PersonalInfo';
import { EmergencyContact } from './EmergencyContact';
import { NextOfKin } from './NextOfKin';
import { RulesRegulations } from './RulesRegulations';
import { AcceptanceForm } from './AcceptanceForm';
import { FormPreview } from './FormPreview';
import { generateReferenceNumber } from '../utils/helpers';
import { saveSubmission } from '../utils/storage';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referenceNumber: generateReferenceNumber(),
    fullName: '',
    email: '',
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
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      alert('Please accept the rules and regulations before submitting the form.');
      return;
    }
    if (!passportPreview) {
      alert('Please upload a passport photograph.');
      return;
    }
    setIsLoading(true);
    
    try {
      saveSubmission(formData, passportPreview);
      
      setTimeout(() => {
        setIsLoading(false);
        alert('Form submitted successfully!');
        navigate('/home');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      alert('An error occurred while saving your submission. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <Header />
          
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Reference Number: <span className="font-mono font-bold text-green-700">{formData.referenceNumber}</span>
              </div>
              <div className="text-sm text-gray-600">
                Date: <span className="font-bold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <PassportUpload onImageUpload={setPassportPreview} />
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Application Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-700">Form Initiated</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-600 pl-4">
              <PersonalInfo formData={formData} onChange={handleInputChange} />
            </div>
            
            <div className="border-l-4 border-green-600 pl-4">
              <EmergencyContact formData={formData} onChange={handleInputChange} />
            </div>
            
            <div className="border-l-4 border-green-600 pl-4">
              <NextOfKin formData={formData} onChange={handleInputChange} />
            </div>
            
            <RulesRegulations />
            <AcceptanceForm accepted={accepted} onAcceptChange={setAccepted} />
            
            <div className="mt-8 flex justify-end space-x-4">
              <FormPreview formData={formData} passportPreview={passportPreview} />
              <button
                type="submit"
                disabled={!accepted || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Form'
                )}
              </button>
            </div>
          </div>
          
          <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-4 px-8 mt-8">
            <div className="text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Muslim Corpers' Association of Nigeria - FCT Chapter</p>
              <p className="text-green-200 text-xs mt-1">All rights reserved</p>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
