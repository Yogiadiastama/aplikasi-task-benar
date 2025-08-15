
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, Employee, TaskStatus } from '../types';

interface AppContextType {
  employees: Employee[];
  tasks: Task[];
  addEmployee: (name: string) => void;
  deleteEmployee: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'status' | 'rating'>) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Andi Wijaya', avatar: 'https://picsum.photos/seed/andi/100' },
  { id: 'emp-2', name: 'Bunga Citra', avatar: 'https://picsum.photos/seed/bunga/100' },
  { id: 'emp-3', name: 'Cahyo Dewanto', avatar: 'https://picsum.photos/seed/cahyo/100' },
];

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Prepare Q3 Report', description: 'Compile all sales data from the last quarter.', employeeId: 'emp-1', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: TaskStatus.InProgress, rating: 0 },
  { id: 'task-2', title: 'Design New Homepage', description: 'Create mockups for the new website homepage.', employeeId: 'emp-2', deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: TaskStatus.InProgress, rating: 0 },
  { id: 'task-3', title: 'Fix Login Bug', description: 'Resolve the authentication issue on the mobile app.', employeeId: 'emp-1', deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), status: TaskStatus.Pending, rating: 0 },
  { id: 'task-4', title: 'Finalize Marketing Campaign', description: 'Get final approval on all campaign materials.', employeeId: 'emp-2', deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: TaskStatus.Completed, rating: 5 },
  { id: 'task-5', title: 'Onboard New Client', description: 'Setup new client account and initial meeting.', employeeId: null, deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), status: TaskStatus.Pending, rating: 0 },
  { id: 'task-6', title: 'Update API Documentation', description: 'Add new endpoints to the public API documentation.', employeeId: 'emp-3', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: TaskStatus.Completed, rating: 4 },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', initialEmployees);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);

  const addEmployee = useCallback((name: string) => {
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name,
      avatar: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100`,
    };
    setEmployees(prev => [...prev, newEmployee]);
  }, [setEmployees]);

  const deleteEmployee = useCallback((id: string) => {
    // Unassign tasks from the deleted employee
    setTasks(prevTasks => prevTasks.map(task => 
      task.employeeId === id ? { ...task, employeeId: null } : task
    ));
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, [setEmployees, setTasks]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'status' | 'rating'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      status: TaskStatus.Pending,
      rating: 0,
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const contextValue = useMemo(() => ({
    employees,
    tasks,
    addEmployee,
    deleteEmployee,
    addTask,
    updateTask,
    deleteTask,
  }), [employees, tasks, addEmployee, deleteEmployee, addTask, updateTask, deleteTask]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
