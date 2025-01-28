import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  Home,
  Users as UsersIcon,
  Dice5,
  CreditCard,
  Wallet,
  RefreshCw,
  Dices
} from 'lucide-react';
import Users from '@/components/Users';
import Spins from '@/components/Spins';
import Holdem from '@/components/Holdem';
import DashboardOverview from '@/components/Dashboard';
import Exchange from '@/components/Exchange';
import Rebate from '@/components/Rebate';
import Deposit from '@/components/Deposit';
import Withdraw from '@/components/Withdraw';
import Profile from '@/components/Profile';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('user');
    const t = userStr ? JSON.parse(userStr) : null;
    setMyUser(t);
    if (!token) {
      router.push('/admin/login');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.getElementById('profile-menu-container');
      if (profileMenu && !profileMenu.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: '홈', icon: Home },
    { id: 'users', label: '회원', icon: UsersIcon },
    { id: 'spins', label: '슬롯', icon: Dice5 },
    { id: 'holdem', label: '홀덤', icon: Dices },
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
        return <Users onOpenProfile={(userData) => {
          setUser(userData);
          setIsProfileModalOpen(true);
        }} />;
      case 'spins':
        return <Spins />;
      case 'holdem':
        return <Holdem />;
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
                  <span className="text-sm font-medium">{myUser?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileMenuOpen && (
                  <div id="profile-menu-container" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
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

      {/* Profile Modal */}
      <Profile 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={user}
      />
    </div>
  );
}