import { BoardColor } from '@/types/todo';

interface NewBoardFormProps {
  newBoardName: string;
  onNewBoardNameChange: (name: string) => void;
  selectedBoardIcon: string;
  onBoardIconSelect: (icon: string) => void;
  selectedBoardColor: string;
  onBoardColorSelect: (color: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  boardIcons: string[];
  boardColors: BoardColor[];
}

export default function NewBoardForm({
  newBoardName,
  onNewBoardNameChange,
  selectedBoardIcon,
  onBoardIconSelect,
  selectedBoardColor,
  onBoardColorSelect,
  onCancel,
  onSubmit,
  boardIcons,
  boardColors
}: NewBoardFormProps) {
  return (
    <div className="mb-8 p-4 bg-gray-750 rounded-lg border border-gray-600">
      <h2 className="text-xl font-serif font-bold text-white mb-4">Create New Board</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Board Name</label>
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => onNewBoardNameChange(e.target.value)}
            placeholder="Enter board name..."
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-serif placeholder-gray-400"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Board Icon</label>
          <div className="flex flex-wrap gap-2">
            {boardIcons.map(icon => (
              <button
                key={icon}
                onClick={() => onBoardIconSelect(icon)}
                className={`w-10 h-10 flex items-center justify-center text-lg rounded-md ${
                  selectedBoardIcon === icon 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Board Color</label>
          <div className="flex flex-wrap gap-2">
            {boardColors.map(color => (
              <button
                key={color.name}
                onClick={() => onBoardColorSelect(color.name)}
                className={`w-10 h-10 ${color.class} rounded-md ${
                  selectedBoardColor === color.name 
                    ? 'ring-2 ring-white' 
                    : ''
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={newBoardName.trim() === ''}
            className={`px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors ${
              newBoardName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Create Board
          </button>
        </div>
      </div>
    </div>
  );
} 