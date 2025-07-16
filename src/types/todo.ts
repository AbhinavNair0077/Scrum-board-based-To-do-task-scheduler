export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  duration?: string;
  board_id: string;
  user_id: string;
}

export interface Board {
  id: string;
  name: string;
  icon: string;
  tasks: Task[];
  color: string;
  user_id: string;
}

export interface BoardColor {
  name: string;
  class: string;
  hoverClass: string;
}

export interface BoardColorClasses {
  bgClass: string;
  hoverClass: string;
} 