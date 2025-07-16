'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getBoards, createBoard, deleteBoard, getTasks, createTask, updateTaskStatus, deleteTask as deleteTaskFromDb } from '@/lib/db';
import { Board, Task, TaskStatus, BoardColor } from '@/types/todo';
import BoardSelection from './BoardSelection';
import NewBoardForm from './NewBoardForm';
import TaskInput from './TaskInput';
import TaskColumn from './TaskColumn';

// Default boards if no boards exist
const defaultBoards: Board[] = [
  {
    id: 'personal',
    name: 'Personal',
    icon: '👤',
    tasks: [],
    color: 'amber',
    user_id: ''
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    tasks: [],
    color: 'blue',
    user_id: ''
  }
];

// Board colors for selection
const boardColors: BoardColor[] = [
  { name: 'amber', class: 'bg-amber-600', hoverClass: 'hover:bg-amber-700' },
  { name: 'blue', class: 'bg-blue-600', hoverClass: 'hover:bg-blue-700' },
  { name: 'green', class: 'bg-green-600', hoverClass: 'hover:bg-green-700' },
  { name: 'purple', class: 'bg-purple-600', hoverClass: 'hover:bg-purple-700' },
  { name: 'teal', class: 'bg-teal-600', hoverClass: 'hover:bg-teal-700' },
  { name: 'red', class: 'bg-red-600', hoverClass: 'hover:bg-red-700' },
  { name: 'pink', class: 'bg-pink-600', hoverClass: 'hover:bg-pink-700' },
  { name: 'indigo', class: 'bg-indigo-600', hoverClass: 'hover:bg-indigo-700' }
];

// Icons for selection
const boardIcons = ['📋', '📝', '📑', '📊', '🗂️', '🗓️', '💼', '👤', '👨‍💻', '🏠', '🌟', '🔍'];

export default function Todo() {
  // State for boards and current active board
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Task input state
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');

  const [selectedBoardColor, setSelectedBoardColor] = useState(boardColors[0].name);
  const [selectedBoardIcon, setSelectedBoardIcon] = useState('📋');

  // Initialize with default boards if empty
  useEffect(() => {
    if (boards.length === 0) {
      const initialBoards = defaultBoards.map(board => ({
        ...board,
        tasks: []
      }));
      setBoards(initialBoards);
      setActiveBoard(initialBoards[0].id);
    }
  }, [boards.length]);

  const formatDateTime = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
  };

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const durationMs = end - start;
    
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const addTask = async (boardId: string, title: string) => {
    try {
      setError(null);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        setError('Authentication error');
        return;
      }
      
      if (!user?.id) {
        console.error('No user ID found');
        setError('Please log in to add tasks');
        return;
      }

      const newTask = {
        title: title.trim(),
        status: 'todo' as TaskStatus,
        created_at: new Date().toISOString(),
        board_id: boardId,
        assignee: boardId === 'personal' ? 'Me' : assignee.trim(),
        user_id: user.id
      };

      if (boardId !== 'personal' && boardId !== 'work') {
        try {
          const createdTask = await createTask(newTask);
          
          setBoards(boards.map(board => {
            if (board.id === boardId) {
              return {
                ...board,
                tasks: [...(board.tasks || []), createdTask]
              };
            }
            return board;
          }));
        } catch (error) {
          console.error('Error creating task in database:', error);
          setError(error instanceof Error ? error.message : 'Failed to create task in database');
          return;
        }
      } else {
        const localTask = {
          ...newTask,
          id: crypto.randomUUID()
        };
        
        setBoards(boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              tasks: [...(board.tasks || []), localTask]
            };
          }
          return board;
        }));
      }

      setTitle('');
      if (!isPersonalBoard) {
        setAssignee('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error instanceof Error ? error.message : 'Failed to add task');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!activeBoard) return;

    try {
      setError(null);
      
      if (activeBoard !== 'personal' && activeBoard !== 'work') {
        await deleteTaskFromDb(taskId);
      }
      
      setBoards(boards.map(board => {
        if (board.id === activeBoard) {
          return {
            ...board,
            tasks: (board.tasks || []).filter(task => task.id !== taskId)
          };
        }
        return board;
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    if (!activeBoard) return;

    try {
      setError(null);
      
      const task = boards
        .find(b => b.id === activeBoard)
        ?.tasks.find(t => t.id === taskId);
      
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }

      if (activeBoard !== 'personal' && activeBoard !== 'work') {
        try {
          const updatedTask = await updateTaskStatus(taskId, newStatus);
          
          setBoards(boards.map(board => {
            if (board.id === activeBoard) {
              const updatedTasks = board.tasks.map(t => {
                if (t.id !== taskId) return t;
                return {
                  ...t,
                  ...updatedTask
                };
              });
              return { ...board, tasks: updatedTasks };
            }
            return board;
          }));
        } catch (error) {
          console.error('Error updating task status:', error);
          setError('Failed to update task status');
          return;
        }
      } else {
        const now = new Date().toISOString();
        const updatedTask = { ...task, status: newStatus };
        
        if (newStatus === 'inProgress' && !task.started_at) {
          updatedTask.started_at = now;
        } else if (newStatus === 'done') {
          updatedTask.completed_at = now;
          if (task.started_at) {
            updatedTask.duration = calculateDuration(task.started_at, now);
          }
        }
        
        setBoards(boards.map(board => {
          if (board.id === activeBoard) {
            const updatedTasks = board.tasks.map(t => {
              if (t.id !== taskId) return t;
              return updatedTask;
            });
            return { ...board, tasks: updatedTasks };
          }
          return board;
        }));
      }
    } catch (error) {
      console.error('Error moving task:', error);
      setError('Failed to move task');
    }
  };

  const addNewBoard = async () => {
    if (newBoardName.trim() === '') return;
    
    try {
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        setError('Please log in to create a board');
        return;
      }

      const newBoard = await createBoard({
        name: newBoardName.trim(),
        icon: selectedBoardIcon,
        color: selectedBoardColor,
        user_id: user.id
      });
      
      setBoards([...boards, newBoard]);
      setActiveBoard(newBoard.id);
      setNewBoardName('');
      setIsAddingBoard(false);
    } catch (error) {
      console.error('Error adding board:', error);
      setError('Failed to add board');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask(activeBoard || '', title);
    }
  };

  const getAssigneeBgColor = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-red-600', 'bg-purple-600', 
      'bg-teal-600', 'bg-indigo-600', 'bg-pink-600', 'bg-orange-600'
    ];
    return colors[hash % colors.length];
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      moveTask(draggedTask.id, status as TaskStatus);
      setDraggedTask(null);
    }
  };

  // Load boards and tasks on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError);
          setError('Authentication error');
          return;
        }
        
        if (!user?.id) {
          console.error('No user ID found');
          setError('Please log in to view your tasks');
          return;
        }
        
        const boardsData = await getBoards();
        
        if (boardsData.length === 0) {
          const personalBoard = await createBoard({
            name: 'Personal',
            icon: '👤',
            color: 'amber',
            user_id: user.id
          });
          
          const workBoard = await createBoard({
            name: 'Work',
            icon: '💼',
            color: 'blue',
            user_id: user.id
          });
          
          setBoards([personalBoard, workBoard]);
          setActiveBoard(personalBoard.id);
        } else {
          setBoards(boardsData);
          setActiveBoard(boardsData[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load boards and tasks');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Load tasks when active board changes
  useEffect(() => {
    const loadTasks = async () => {
      if (!activeBoard) return;
      
      try {
        setError(null);
        
        if (activeBoard === 'personal' || activeBoard === 'work') {
          setBoards(prevBoards => 
            prevBoards.map(board => 
              board.id === activeBoard 
                ? { ...board, tasks: board.tasks || [] } 
                : board
            )
          );
          return;
        }
        
        const tasksData = await getTasks(activeBoard);
        
        const validTasks = tasksData.map(task => ({
          ...task,
          status: task.status || 'todo',
          created_at: task.created_at || new Date().toISOString(),
          assignee: task.assignee || '',
          board_id: task.board_id || activeBoard
        }));
        
        setBoards(prevBoards => 
          prevBoards.map(board => 
            board.id === activeBoard 
              ? { ...board, tasks: validTasks } 
              : board
          )
        );
      } catch (error) {
        console.error('Error loading tasks:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load tasks';
        setError(errorMessage);
        
        setBoards(prevBoards => 
          prevBoards.map(board => 
            board.id === activeBoard 
              ? { ...board, tasks: [] } 
              : board
          )
        );
      }
    };
    
    loadTasks();
  }, [activeBoard]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  const currentBoard = boards.find(board => board.id === activeBoard);
  const isPersonalBoard = currentBoard?.id === 'personal';
  const todoTasks = currentBoard?.tasks?.filter(task => task.status === 'todo') || [];
  const inProgressTasks = currentBoard?.tasks?.filter(task => task.status === 'inProgress') || [];
  const doneTasks = currentBoard?.tasks?.filter(task => task.status === 'done') || [];
  const assignees = currentBoard?.tasks ? Array.from(new Set(currentBoard.tasks.map(task => task.assignee))) : [];

  const getBoardColorClasses = (colorName: string) => {
    const color = boardColors.find(c => c.name === colorName);
    return color ? { bgClass: color.class, hoverClass: color.hoverClass } : { bgClass: 'bg-amber-600', hoverClass: 'hover:bg-amber-700' };
  };

  const currentBoardColors = currentBoard ? getBoardColorClasses(currentBoard.color) : { bgClass: 'bg-amber-600', hoverClass: 'hover:bg-amber-700' };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <BoardSelection
        boards={boards}
        activeBoard={activeBoard}
        onBoardSelect={setActiveBoard}
        onBoardDelete={deleteBoard}
        onAddBoardClick={() => setIsAddingBoard(true)}
        boardColors={boardColors}
      />

      {isAddingBoard && (
        <NewBoardForm
          newBoardName={newBoardName}
          onNewBoardNameChange={setNewBoardName}
          selectedBoardIcon={selectedBoardIcon}
          onBoardIconSelect={setSelectedBoardIcon}
          selectedBoardColor={selectedBoardColor}
          onBoardColorSelect={setSelectedBoardColor}
          onCancel={() => setIsAddingBoard(false)}
          onSubmit={addNewBoard}
          boardIcons={boardIcons}
          boardColors={boardColors}
        />
      )}

      {currentBoard && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>{currentBoard.icon}</span>
              <span>{currentBoard.name} Board</span>
            </h2>
          </div>
          
          <TaskInput
            title={title}
            onTitleChange={setTitle}
            assignee={assignee}
            onAssigneeChange={setAssignee}
            isPersonalBoard={isPersonalBoard}
            onAddTask={() => addTask(activeBoard || '', title)}
            onKeyDown={handleKeyDown}
            boardColors={currentBoardColors}
          />

          {assignees.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Team Members:</div>
              <div className="flex flex-wrap gap-2">
                {assignees.map(name => (
                  <span 
                    key={name} 
                    className={`${getAssigneeBgColor(name)} px-2 py-1 rounded-full text-xs text-white`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumn
              title="To Do"
              tasks={todoTasks}
              status="todo"
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              getAssigneeBgColor={getAssigneeBgColor}
              formatDateTime={formatDateTime}
              bgColor={currentBoardColors.bgClass}
            />

            <TaskColumn
              title="In Progress"
              tasks={inProgressTasks}
              status="inProgress"
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              getAssigneeBgColor={getAssigneeBgColor}
              formatDateTime={formatDateTime}
              bgColor="bg-blue-700"
            />

            <TaskColumn
              title="Done"
              tasks={doneTasks}
              status="done"
              onDeleteTask={deleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              getAssigneeBgColor={getAssigneeBgColor}
              formatDateTime={formatDateTime}
              bgColor="bg-green-700"
            />
          </div>
        </>
      )}
    </div>
  );
} 