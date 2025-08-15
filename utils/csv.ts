
import { Task, Employee } from '../types';

function convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
        Object.values(row).map(value => {
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    );
    return [header, ...rows].join('\n');
}

export function exportDataToCSV(tasks: Task[], employees: Employee[]) {
    const enrichedTasks = tasks.map(task => {
        const employee = employees.find(e => e.id === task.employeeId);
        const deadlineDate = new Date(task.deadline);
        const isOverdue = deadlineDate < new Date() && task.status !== 'Completed';

        return {
            taskId: task.id,
            taskTitle: task.title,
            taskDescription: task.description,
            assignedTo: employee ? employee.name : 'Unassigned',
            employeeId: task.employeeId,
            deadline: deadlineDate.toLocaleDateString(),
            status: task.status,
            isOverdue: isOverdue ? 'Yes' : 'No',
            rating: task.rating > 0 ? task.rating : 'Not Rated'
        };
    });

    const csvContent = convertToCSV(enrichedTasks);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = `task_data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
