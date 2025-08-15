
import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { ExclamationTriangleIcon, CheckCircleIcon, ClockIcon, ClipboardDocumentIcon } from './icons';

const isOverdue = (task: import('../types').Task) => new Date(task.deadline) < new Date() && task.status !== TaskStatus.Completed;

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ActiveShapePieChart = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} Tasks`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const Dashboard: React.FC = () => {
  const { tasks, employees } = useAppContext();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed).length;
    const overdueTasks = tasks.filter(isOverdue).length;
    
    const taskStatusData = [
      { name: 'Pending', value: tasks.filter(t => t.status === TaskStatus.Pending).length },
      { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.InProgress).length },
      { name: 'Completed', value: tasks.filter(t => t.status === TaskStatus.Completed).length },
    ];
    
    const employeeWorkloadData = employees.map(emp => ({
      name: emp.name.split(' ')[0],
      tasks: tasks.filter(t => t.employeeId === emp.id).length,
    }));

    return { totalTasks, completedTasks, overdueTasks, taskStatusData, employeeWorkloadData };
  }, [tasks, employees]);

  const COLORS = {
      [TaskStatus.Pending]: '#f59e0b', // amber-500
      [TaskStatus.InProgress]: '#3b82f6', // blue-500
      [TaskStatus.Completed]: '#10b981', // emerald-500
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={<ClipboardDocumentIcon className="w-6 h-6 text-blue-800"/>} color="bg-blue-100" />
        <StatCard title="Tasks Completed" value={stats.completedTasks} icon={<CheckCircleIcon className="w-6 h-6 text-emerald-800"/>} color="bg-emerald-100" />
        <StatCard title="Tasks Overdue" value={stats.overdueTasks} icon={<ExclamationTriangleIcon className="w-6 h-6 text-red-800"/>} color="bg-red-100" />
        <StatCard title="Active Employees" value={employees.length} icon={<ClockIcon className="w-6 h-6 text-amber-800"/>} color="bg-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Employee Workload</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.employeeWorkloadData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4b5563' }}/>
              <YAxis allowDecimals={false} tick={{ fill: '#4b5563' }}/>
              <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Legend />
              <Bar dataKey="tasks" fill="#3b82f6" name="Assigned Tasks" barSize={40} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
           <h3 className="text-xl font-semibold text-gray-700 mb-4">Task Status Distribution</h3>
           <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={ActiveShapePieChart}
                data={stats.taskStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {stats.taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as TaskStatus] || '#cccccc'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
