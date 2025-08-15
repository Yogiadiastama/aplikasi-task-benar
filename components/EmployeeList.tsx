
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Employee } from '../types';
import { AddEmployeeModal } from './modals/AddEmployeeModal';
import { PlusIcon, TrashIcon, ClipboardDocumentCheckIcon } from './icons';

const EmployeeItem: React.FC<{ employee: Employee, onDelete: () => void }> = ({ employee, onDelete }) => {
  const { tasks } = useAppContext();
  const taskCount = tasks.filter(t => t.employeeId === employee.id).length;

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={employee.avatar} alt={employee.name} className="w-14 h-14 rounded-full" />
        <div>
          <h4 className="font-bold text-lg text-gray-800">{employee.name}</h4>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <ClipboardDocumentCheckIcon className="w-4 h-4 mr-1.5"/>
            <span>{taskCount} task{taskCount !== 1 ? 's' : ''} assigned</span>
          </div>
        </div>
      </div>
      <button 
        onClick={onDelete}
        className="text-gray-400 hover:text-red-600 p-2 rounded-full transition-colors"
        aria-label={`Delete ${employee.name}`}
      >
        <TrashIcon />
      </button>
    </div>
  );
};


const EmployeeList: React.FC = () => {
  const { employees, deleteEmployee } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}? All their assigned tasks will become unassigned.`)) {
        deleteEmployee(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Employee Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
        >
          <PlusIcon />
          <span className="font-semibold">Add Employee</span>
        </button>
      </div>

      {employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(employee => (
              <EmployeeItem 
                key={employee.id} 
                employee={employee} 
                onDelete={() => handleDelete(employee.id, employee.name)} 
              />
            ))}
          </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No Employees Found</h3>
            <p className="text-gray-500 mt-2">Click "Add Employee" to build your team.</p>
        </div>
      )}

      {isModalOpen && <AddEmployeeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default EmployeeList;