import { supabase } from './supabaseClient';

// Board operations
export async function getBoards() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user in getBoards:', userError);
      throw new Error('Authentication error');
    }

    if (!user?.id) {
      console.error('No user ID found in getBoards');
      throw new Error('User not authenticated');
    }

    console.log('Getting boards for user:', user.id);

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }

    console.log('Fetched boards:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getBoards:', error);
    throw error;
  }
}

interface CreateBoardParams {
  name: string;
  icon: string;
  color: string;
  user_id: string;
}

export async function createBoard({ name, icon, color, user_id }: CreateBoardParams) {
  try {
    console.log('Creating board with data:', { name, icon, color, user_id });

    if (!user_id) {
      throw new Error('User ID is required to create a board');
    }

    const { data, error } = await supabase
      .from('boards')
      .insert([
        { name, icon, color, user_id }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error in createBoard:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error('No data returned after creating board');
    }
    
    console.log('Board created successfully:', data);
    return {
      ...data,
      tasks: []
    };
  } catch (error) {
    console.error('Error in createBoard:', error);
    throw error;
  }
}

export async function deleteBoard(id: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user in deleteBoard:', userError);
      throw new Error('Authentication error');
    }

    if (!user?.id) {
      console.error('No user ID found in deleteBoard');
      throw new Error('User not authenticated');
    }

    // First verify the board belongs to the user
    const { data: boardData, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (boardError || !boardData) {
      throw new Error('Board not found or does not belong to user');
    }

    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteBoard:', error);
    throw error;
  }
}

// Task operations
export async function getTasks(boardId: string) {
  try {
    if (!boardId) {
      throw new Error('Board ID is required');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user in getTasks:', userError);
      throw new Error('Authentication error');
    }

    if (!user?.id) {
      console.error('No user ID found in getTasks');
      throw new Error('User not authenticated');
    }

    // For default boards (personal and work), return empty array
    if (boardId === 'personal' || boardId === 'work') {
      return [];
    }

    console.log('Getting tasks for board:', boardId, 'user:', user.id);

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('board_id', boardId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Supabase error in getTasks:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
    
    console.log('Fetched tasks:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getTasks:', error);
    throw error;
  }
}

export async function createTask(task: { 
  id?: string;
  title: string; 
  status: string; 
  assignee: string; 
  board_id: string;
  created_at: string;
  user_id: string;
  started_at?: string;
  completed_at?: string;
  duration?: string;
}) {
  try {
    console.log('Creating task with data:', task);
    
    if (!task.user_id) {
      throw new Error('User ID is required to create a task');
    }

    // Create a new task object without the id field (let Supabase generate it)
    const taskData = {
      title: task.title,
      status: task.status,
      assignee: task.assignee,
      board_id: task.board_id,
      created_at: task.created_at,
      user_id: task.user_id,
      started_at: task.started_at || null,
      completed_at: task.completed_at || null,
      duration: task.duration || null
    };
    
    // First, check if the board exists and belongs to the user
    const { data: boardData, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .eq('id', task.board_id)
      .eq('user_id', task.user_id)
      .single();
    
    if (boardError || !boardData) {
      console.error('Board not found or does not belong to user:', {
        boardId: task.board_id,
        userId: task.user_id,
        error: boardError
      });
      throw new Error('Board not found or does not belong to user');
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select('*')
      .single();
    
    if (error) {
      console.error('Supabase error in createTask:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Failed to create task: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned after creating task');
    }
    
    console.log('Task created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
}

type TaskStatus = 'todo' | 'inProgress' | 'done';

export async function updateTaskStatus(
  taskId: string, 
  status: TaskStatus, 
  startedAt?: string, 
  completedAt?: string,
  duration?: string
) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user in updateTaskStatus:', userError);
      throw new Error('Authentication error');
    }

    if (!user?.id) {
      console.error('No user ID found in updateTaskStatus');
      throw new Error('User not authenticated');
    }

    // First verify the task belongs to the user
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('id, started_at')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !taskData) {
      throw new Error('Task not found or does not belong to user');
    }

    const updates: any = { status };
    
    // Handle timing updates based on status
    if (status === 'inProgress' && !taskData.started_at) {
      updates.started_at = startedAt || new Date().toISOString();
    } else if (status === 'done') {
      updates.completed_at = completedAt || new Date().toISOString();
      if (taskData.started_at) {
        updates.duration = duration || calculateDuration(taskData.started_at, updates.completed_at);
      }
    }
    
    console.log('Updating task with data:', { taskId, updates });

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task status:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after updating task');
    }

    console.log('Task updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateTaskStatus:', error);
    throw error;
  }
}

// Helper function to calculate duration
function calculateDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const durationMs = end - start;
  
  // Convert to readable format
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
}

export async function deleteTask(taskId: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user in deleteTask:', userError);
      throw new Error('Authentication error');
    }

    if (!user?.id) {
      console.error('No user ID found in deleteTask');
      throw new Error('User not authenticated');
    }

    // First verify the task belongs to the user
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single();

    if (taskError || !taskData) {
      throw new Error('Task not found or does not belong to user');
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
} 