import { Task, TaskStatus } from '@/types/todo';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  getAssigneeBgColor: (name: string) => string;
  formatDateTime: (date: Date) => string;
}

export default function TaskCard({
  task,
  onDelete,
  onDragStart,
  getAssigneeBgColor,
  formatDateTime
}: TaskCardProps) {
  const isCompleted = task.status === 'done';

  return (
    <div 
      className="bg-gray-700 p-3 rounded-md shadow-sm border border-gray-600 group hover:bg-gray-650 transition-colors cursor-move"
      draggable
      onDragStart={() => onDragStart(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-white font-serif ${isCompleted ? 'line-through opacity-70' : ''}`}>
          {task.title}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-400 transition-colors"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <span className={`${getAssigneeBgColor(task.assignee)} px-2 py-1 rounded-full text-xs text-white ${isCompleted ? 'opacity-70' : ''}`}>
          {task.assignee}
        </span>
      </div>
      
      <div className="mb-3 text-xs text-gray-400">
        <div>Created: {formatDateTime(new Date(task.created_at))}</div>
        {task.started_at && (
          <div>Started: {formatDateTime(new Date(task.started_at))}</div>
        )}
        {task.completed_at && (
          <div>Completed: {formatDateTime(new Date(task.completed_at))}</div>
        )}
        {task.duration && (
          <div className="mt-1 font-semibold text-green-400">Duration: {task.duration}</div>
        )}
      </div>
    </div>
  );
} 