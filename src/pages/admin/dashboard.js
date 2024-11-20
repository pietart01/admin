import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bell, Menu, X, ChevronDown, Home, Users as UsersIcon, Dice5, CreditCard, Wallet, RefreshCw } from 'lucide-react';
import Users from '@/components/Users';
import Spins from '@/components/Spins';
import DashboardOverview from '@/components/Dashboard';
import Exchange from '@/components/Exchange';
import Rebate from '@/components/Rebate';
import Deposit from '@/components/Deposit';
import Withdraw from '@/components/Withdraw';
import Profile from '@/components/Profile';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: '홈', icon: Home },
    { id: 'users', label: '회원', icon: UsersIcon },
    { id: 'spins', label: '베팅', icon: Dice5 }, // Updated icon
    { id: 'rebate', label: '롤링', icon: RefreshCw },
    { id: 'deposit', label: '충전', icon: CreditCard },
    { id: 'withdraw', label: '환전', icon: Wallet },
  ];

  const actionButtons = [
    { id: 'deposit', label: '충전신청', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'withdraw', label: '환전신청', color: 'bg-red-500 hover:bg-red-600' },
    { id: 'exchange', label: '딜러비전환', color: 'bg-green-500 hover:bg-green-600' }
  ];

  const renderComponent = () => {
    switch (activeComponent) {
      case 'users':
        return <Users />;
      case 'profile':
        return <Profile />;
      case 'spins':
        return <Spins />;
      case 'exchange':
        return <Exchange />;
      case 'rebate':
        return <Rebate />;
      case 'deposit':
        return <Deposit />;
      case 'withdraw':
        return <Withdraw />;
      default:
        return <DashboardOverview />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}


            {/* Navigation Items - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveComponent(item.id)}
                    className={`
                      flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                      ${activeComponent === item.id 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}
                    `}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {actionButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => setActiveComponent(button.id)}
                    className={`${button.color} text-white px-3 py-1.5 text-sm font-medium rounded-md transition-colors shadow-sm`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>

              {/* Notification Bell */}
              <button className="relative p-1 rounded-full text-gray-600 hover:bg-gray-100">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">A</span>
                  </div>
                  <span className="text-sm font-medium">관리자</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={() => setActiveComponent('profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      내 프로필
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveComponent(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      flex items-center w-full px-3 py-2 text-base font-medium rounded-md
                      ${activeComponent === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-gray-200">
              {actionButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => {
                    setActiveComponent(button.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${button.color} w-full text-white px-4 py-2 text-sm font-medium rounded-md mb-2`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderComponent()}
      </main>
    </div>
  );
}