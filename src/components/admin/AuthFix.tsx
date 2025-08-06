import { useState } from 'react';
import { fixAdminAuth, testAdminLogin } from '../../utils/fix-admin-auth';

export const AuthFix = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState('');
  const [testCredentials, setTestCredentials] = useState({
    email: 'amir2024@mcan.com',
    password: 'mcanamir2024'
  });

  const handleFixAuth = async () => {
    setIsFixing(true);
    setMessage('');
    
    try {
      const result = await fixAdminAuth();
      setMessage(result.message);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsFixing(false);
    }
  };

  const handleTestLogin = async () => {
    setIsTesting(true);
    setMessage('');
    
    try {
      const result = await testAdminLogin(testCredentials.email, testCredentials.password);
      setMessage(result.message);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-xl px-8 pt-8 pb-8 mb-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Authentication Fix</h1>
            <p className="text-gray-600">Fix admin authentication issues</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm whitespace-pre-line ${
              message.includes('Error') || message.includes('Failed') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleFixAuth}
              disabled={isFixing}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50"
            >
              {isFixing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fixing Authentication...
                </span>
              ) : (
                'Fix Admin Authentication'
              )}
            </button>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Login</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="test-email">
                    Email
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-500 transition-colors"
                    id="test-email"
                    type="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="test-password">
                    Password
                  </label>
                  <input
                    className="appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-red-500 transition-colors"
                    id="test-password"
                    type="password"
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>

                <button
                  onClick={handleTestLogin}
                  disabled={isTesting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50"
                >
                  {isTesting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </span>
                  ) : (
                    'Test Login'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-red-600 hover:text-red-800"
            >
              Back to Login
            </a>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>This tool helps fix authentication issues by recreating admin users in Supabase Auth.</p>
            <p className="mt-1">Default credentials: amir2024@mcan.com / mcanamir2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};
