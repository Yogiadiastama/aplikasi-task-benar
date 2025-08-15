
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { View } from './types';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import EmployeeList from './components/EmployeeList';
import { exportDataToCSV } from './utils/csv';
import { ChartBarIcon, ClipboardDocumentListIcon, UsersIcon, DownloadIcon } from './components/icons';

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

const MainApp: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const { tasks, employees } = useAppContext();

  const renderView = () => {
    switch (view) {
      case View.Tasks:
        return <TaskList />;
      case View.Employees:
        return <EmployeeList />;
      case View.Dashboard:
      default:
        return <Dashboard />;
    }
  };

  const NavButton = ({ targetView, icon, label }: { targetView: View; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        view === targetView
          ? 'bg-primary text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
      }`}
    >
      {icon}
      <span className="font-medium hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      <header className="md:w-64 bg-white shadow-lg p-4 flex flex-col justify-between md:min-h-screen border-r border-gray-200">
        <div>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2l4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Task Pro</h1>
          </div>
          <nav className="flex md:flex-col justify-around md:justify-start md:space-y-2">
            <NavButton targetView={View.Dashboard} icon={<ChartBarIcon />} label="Dashboard" />
            <NavButton targetView={View.Tasks} icon={<ClipboardDocumentListIcon />} label="Tasks" />
            <NavButton targetView={View.Employees} icon={<UsersIcon />} label="Employees" />
          </nav>
        </div>
        <div className="mt-8 md:mt-0">
          <button
            onClick={() => exportDataToCSV(tasks, employees)}
            className="w-full flex items-center justify-center space-x-2 bg-accent text-white px-4 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
          >
            <DownloadIcon />
            <span className="font-semibold">Export to CSV</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
