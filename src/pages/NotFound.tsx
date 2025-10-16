import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-gray-50 dark:bg-[#0f172a] text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <header className="absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <LayoutDashboard className="text-blue-600 dark:text-blue-400" size={24} />
          <span>Organ Panel</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-lg mx-auto p-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-8xl font-black leading-none tracking-tighter">
                404
              </p>
              <p className="text-gray-800 dark:text-gray-100 text-2xl font-bold leading-tight">
                Page Not Found
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
              The page you are looking for does not exist or has been moved.
            </p>
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReturnToDashboard}
                className="flex items-center justify-center h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                <span className="truncate">Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Organ Panel. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default NotFoundPage;
