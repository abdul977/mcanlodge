import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../lib/database';
import { Application } from '../../lib/supabase';
import { auth } from '../../utils/auth';
import { ViewApplication } from '../ViewApplication';

interface DataCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

export const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const isAuthenticated = await auth.isAuthenticated();
      if (!isAuthenticated) {
        navigate('/', { replace: true });
        return;
      }

      // Load data
      await loadData();
    };

    checkAuth();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const loadData = async () => {
    try {
      const [statsResult, applicationsResult] = await Promise.all([
        applicationService.getStats(),
        applicationService.getAll()
      ]);

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      if (applicationsResult.data) {
        setApplications(applicationsResult.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
    navigate('/', { replace: true });
  };

  const handleStatusChange = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const { error } = await applicationService.updateStatus(applicationId, newStatus);
      if (!error) {
        // Reload data to reflect changes
        await loadData();
      } else {
        console.error('Failed to update status:', error);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  const cards: DataCard[] = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: '📝',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: '✅',
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: '❌',
      color: 'from-red-500 to-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            <div className="flex items-center space-x-8 w-full">
              {/* MCAN Logo on the left */}
              <div className="flex items-center space-x-4">
                <img
                  src="/mcan-logo.png"
                  alt="MCAN Logo"
                  className="h-16 w-auto"
                />
                <h1 className="text-xl font-bold text-white">MCAN Lodge Portal</h1>
              </div>
              
              {/* Actions in the middle */}
              <div className="flex-grow flex justify-center">
                <a
                  href="/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white hover:text-green-200"
                >
                  Public Registration Link
                </a>
              </div>

              {/* NYSC Logo and Logout on the right */}
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg shadow-xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome to MCAN Lodge Portal</h2>
            <p className="text-green-100">Manage and track lodge applications efficiently</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${card.color} rounded-lg shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold mb-2">{card.title}</p>
                    <h3 className="text-3xl font-bold">{card.value}</h3>
                  </div>
                  <div className="text-4xl">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {application.reference_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.passport_photo_url ? (
                          <img
                            src={application.passport_photo_url}
                            alt="Passport"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No Photo</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-3">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application.id, e.target.value as Application['status'])}
                          className="text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approve</option>
                          <option value="Rejected">Reject</option>
                        </select>
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-green-600 hover:text-green-800 focus:outline-none"
                          title="View Application"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* View Application Modal */}
      <ViewApplication
        application={selectedApplication}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedApplication(null);
        }}
      />
    </div>
  );
};
