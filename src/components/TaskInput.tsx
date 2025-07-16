import { BoardColorClasses } from '@/types/todo';

interface TaskInputProps {
  title: string;
  onTitleChange: (title: string) => void;
  assignee: string;
  onAssigneeChange: (assignee: string) => void;
  isPersonalBoard: boolean;
  onAddTask: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  boardColors: BoardColorClasses;
}

export default function TaskInput({
  title,
  onTitleChange,
  assignee,
  onAssigneeChange,
  isPersonalBoard,
  onAddTask,
  onKeyDown,
  boardColors
}: TaskInputProps) {
  return (
    <div className="mb-8 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a new task..."
          className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif placeholder-gray-400"
        />
        {!isPersonalBoard && (
          <input
            type="text"
            value={assignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
            placeholder="Assignee name..."
            className="w-1/3 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif placeholder-gray-400"
          />
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onAddTask}
          disabled={title.trim() === '' || (!isPersonalBoard && assignee.trim() === '')}
          className={`px-5 py-3 ${boardColors.bgClass} ${boardColors.hoverClass} text-white rounded-lg shadow-md transition-colors duration-300 font-serif ${
            (title.trim() === '' || (!isPersonalBoard && assignee.trim() === '')) 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }`}
        >
          Add Task
        </button>
      </div>
    </div>
  );
} 