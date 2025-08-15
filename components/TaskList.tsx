import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Task, TaskStatus } from '../types';
import { AddTaskModal } from './modals/AddTaskModal';
import Rating from './Rating';
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from './icons';

const isOverdue = (task: Task) => new Date(task.deadline) < new Date() && task.status !== TaskStatus.Completed;

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { deleteTask, updateTask, employees } = useAppContext();
  const assignedEmployee = employees.find(e => e.id === task.employeeId);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask({ ...task, status: e.target.value as TaskStatus });
  };

  const handleRatingChange = (newRating: number) => {
    updateTask({ ...task, rating: newRating });
  };

  const statusColor = {
    [TaskStatus.Pending]: 'bg-amber-100 text-amber-800',
    [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800',
    [TaskStatus.Completed]: 'bg-emerald-100 text-emerald-800',
  };

  const overdue = isOverdue(task);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg text-gray-800">{task.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        </div>
        <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors">
          <TrashIcon />
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Assignee:</span>
            {assignedEmployee ? (
                <div className="flex items-center gap-2">
                    <img src={assignedEmployee.avatar} alt={assignedEmployee.name} className="w-6 h-6 rounded-full" />
                    <span className="text-gray-800">{assignedEmployee.name}</span>
                </div>
            ) : (
                <span className="text-gray-500 italic">Unassigned</span>
            )}
        </div>
        
        <div className={`flex items-center gap-2 ${overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          <span className="font-semibold">Deadline:</span>
          <span>{new Date(task.deadline).toLocaleDateString()}</span>
          {overdue && <span title="This task is overdue!"><ExclamationTriangleIcon /></span>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-4">
         <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Status:</span>
            <select
                value={task.status}
                onChange={handleStatusChange}
                className={`text-sm font-medium rounded-md border-0 focus:ring-2 focus:ring-primary py-1.5 ${statusColor[task.status]}`}
            >
                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
         </div>
        {task.status === TaskStatus.Completed && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Rating:</span>
            <Rating rating={task.rating} onRatingChange={handleRatingChange} />
          </div>
        )}
      </div>
    </div>
  );
};

const TaskList: React.FC = () => {
  const { tasks } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Task Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
        >
          <PlusIcon />
          <span className="font-semibold">Add Task</span>
        </button>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">No Tasks Yet</h3>
            <p className="text-gray-500 mt-2">Click "Add Task" to get started.</p>
        </div>
      )}

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default TaskList;