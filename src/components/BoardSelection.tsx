import { Board, BoardColor } from '@/types/todo';

interface BoardSelectionProps {
  boards: Board[];
  activeBoard: string | null;
  onBoardSelect: (boardId: string) => void;
  onBoardDelete: (boardId: string) => void;
  onAddBoardClick: () => void;
  boardColors: BoardColor[];
}

export default function BoardSelection({
  boards,
  activeBoard,
  onBoardSelect,
  onBoardDelete,
  onAddBoardClick,
  boardColors
}: BoardSelectionProps) {
  const getBoardColorClasses = (colorName: string) => {
    const color = boardColors.find(c => c.name === colorName);
    return color ? { bgClass: color.class, hoverClass: color.hoverClass } : { bgClass: 'bg-amber-600', hoverClass: 'hover:bg-amber-700' };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-serif font-bold text-amber-400">Scrum Boards</h1>
        <button
          onClick={onAddBoardClick}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          + New Board
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {boards.map(board => (
          <div
            key={board.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer ${
              activeBoard === board.id 
                ? `${getBoardColorClasses(board.color).bgClass} text-white` 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } transition-colors`}
            onClick={() => onBoardSelect(board.id)}
          >
            <span className="text-lg">{board.icon}</span>
            <span className="font-medium">{board.name}</span>
            {boards.length > 1 && board.id !== 'personal' && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onBoardDelete(board.id);
                }}
                className="ml-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Delete board"
                role="button"
                tabIndex={0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {board.id === 'personal' && (
              <span className="ml-2 text-amber-400" title="Personal board is permanent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 