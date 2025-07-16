import { Task, TaskStatus } from '@/types/todo';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: string) => void;
  getAssigneeBgColor: (name: string) => string;
  formatDateTime: (date: Date) => string;
  bgColor: string;
}

export default function TaskColumn({
  title,
  tasks,
  status,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  getAssigneeBgColor,
  formatDateTime,
  bgColor
}: TaskColumnProps) {
  return (
    <div className="bg-gray-850 rounded-lg overflow-hidden border border-gray-700 shadow-md">
      <div className={`${bgColor} p-3`}>
        <h2 className="font-serif text-white font-bold">{title}</h2>
      </div>
      <div 
        className="p-3 min-h-64"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        {tasks.length === 0 ? (
          <div className="text-center p-4 text-gray-500 italic">No tasks {status === 'todo' ? 'to do' : status === 'inProgress' ? 'in progress' : 'completed'}</div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onDragStart={onDragStart}
                getAssigneeBgColor={getAssigneeBgColor}
                formatDateTime={formatDateTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 