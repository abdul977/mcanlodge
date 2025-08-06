import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../lib/database';
import { Application } from '../../lib/supabase';
import { userAuth } from '../../utils/userAuth';

export const UserDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await userAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        // Load user's applications
        const { data, error } = await applicationService.getByUserEmail(currentUser.email);
        if (data) {
          setApplications(data);
        } else if (error) {
          console.error('Failed to load applications:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await userAuth.logout();
    navigate('/user/login', { replace: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return '✅';
      case 'Rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-green-700 to-green-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img
                src="/mcan-logo.png"
                alt="MCAN Logo"
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-white">MCAN Lodge Portal</h1>
                <p className="text-green-200 text-sm">Welcome, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg"
                alt="NYSC Logo"
                className="h-16 w-auto"
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg shadow-xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
            <p className="text-green-100">Track your MCAN Lodge application status and manage your account</p>
          </div>
        </div>

        {/* Applications Section */}
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Your Applications</h3>
            </div>
            
            {applications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No Applications Found</h4>
                <p className="text-gray-500 mb-6">You haven't submitted any lodge applications yet.</p>
                <a
                  href="/register"
                  className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit New Application
                </a>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <div key={application.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          Application #{application.reference_number}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Submitted on {new Date(application.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStatusIcon(application.status)}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Full Name:</span>
                        <p className="text-gray-800">{application.full_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Call-up Number:</span>
                        <p className="text-gray-800">{application.call_up_number}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Institution:</span>
                        <p className="text-gray-800">{application.institution}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">State of Origin:</span>
                        <p className="text-gray-800">{application.state_of_origin}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Mobile Number:</span>
                        <p className="text-gray-800">{application.mobile_number}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">MCAN Reg No:</span>
                        <p className="text-gray-800">{application.mcan_reg_no}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-0 mt-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/register"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-green-600 text-2xl mr-4">➕</div>
                <div>
                  <h4 className="font-medium text-gray-800">Submit New Application</h4>
                  <p className="text-sm text-gray-600">Apply for MCAN Lodge accommodation</p>
                </div>
              </a>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="text-blue-600 text-2xl mr-4">📞</div>
                <div>
                  <h4 className="font-medium text-gray-800">Contact Support</h4>
                  <p className="text-sm text-gray-600">Need help? Contact MCAN Lodge support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
