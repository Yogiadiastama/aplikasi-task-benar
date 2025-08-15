
export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id:string;
  title: string;
  description: string;
  employeeId: string | null;
  deadline: string; // ISO string
  status: TaskStatus;
  rating: number; // 0-5
}

export enum View {
  Dashboard = 'Dashboard',
  Tasks = 'Tasks',
  Employees = 'Employees',
}
