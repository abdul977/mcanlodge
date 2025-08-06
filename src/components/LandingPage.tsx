import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logos */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <img
                src="/mcan-logo.png"
                alt="MCAN Logo"
                className="h-20 w-auto"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/NYSC_LOGO.svg"
                alt="NYSC Logo"
                className="h-20 w-auto"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                MCAN Lodge
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Muslim Corpers' Association of Nigeria - FCT Chapter
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Your gateway to comfortable and affordable accommodation during your NYSC service year. 
              Join our community of Muslim corps members in the Federal Capital Territory.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <span className="relative z-10">Apply for Lodge</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/user/login"
                className="px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 text-lg"
              >
                Access Your Account
              </Link>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-green-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-100 rounded-full opacity-25 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MCAN Lodge?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience comfort, community, and convenience during your service year
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Comfortable Accommodation</h3>
              <p className="text-gray-600">
                Well-furnished rooms with modern amenities to make your stay comfortable and enjoyable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Islamic Community</h3>
              <p className="text-gray-600">
                Connect with fellow Muslim corps members and participate in Islamic activities and programs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Affordable Rates</h3>
              <p className="text-gray-600">
                Budget-friendly accommodation options designed specifically for corps members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join hundreds of corps members who have made MCAN Lodge their home away from home.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* New Application */}
            <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">New Application</h3>
              <p className="text-gray-600 mb-6">
                First time applying? Submit your lodge application and create your account.
              </p>
              <Link
                to="/register"
                className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>

            {/* Existing User */}
            <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing User</h3>
              <p className="text-gray-600 mb-6">
                Already have an account? Login to check your application status and manage your account.
              </p>
              <Link
                to="/user/login"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-50 via-white to-green-50 py-12 border-t border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <img
                src="/mcan-logo.png"
                alt="MCAN Logo"
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">MCAN Lodge Portal</h3>
                <p className="text-gray-600 text-sm">FCT Chapter</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Muslim Corpers' Association of Nigeria - Federal Capital Territory Chapter
            </p>

            <p className="text-gray-500 text-sm">
              © 2024 MCAN FCT Chapter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
